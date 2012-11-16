/*
 * Routing/Static Routing API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	fs = require('fs'),
	exec = require('child_process').exec,

/*
 * Load required models.
 */
	Routing_Rule = require('../../../../models/routing/rule.js'),
	Routing_Table = require('../../../../models/routing/table.js'),
	Routing_Route = require('../../../../models/routing/route.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'rule':
			/*
			 * Execute the changes in the system.
			 */
			/*
			 * Edit an object from the database.
			 */
			Routing_Rule.findOne({
				priority:req.body.id
			}, function (error, doc) {
				if (!error) {
					doc.description = req.body.description;

					// Save changes into database.
					doc.save(function (error) {
						if (!error) {
							response_from_server.id = req.body.id;
							response_from_server.message = 'Changed Successfully!';
							response_from_server.type = 'notification';
						}
						else {
							response_from_server.id = '';
							response_from_server.message = error.message;
							response_from_server.type = 'error';
						}

						// Return the gathered data.
						res.json(response_from_server);
					});
				}
				else {
					response_from_server.message = error.message;
					response_from_server.type = 'error';

					// Return the gathered data.
					res.json(response_from_server);
				}
			});

			break;
		case 'table':
			// Ensures the required tables 'local' and 'unspec' aren't modified.
			if (req.body.id != 0 && req.body.id != 255) {
				/*
				 * Check if the name is already taken.
				 */
				Routing_Table.find({
					name:req.body.name
				}, {}, {}, function (error, docs) {
					if (!error) {
						if (!docs.length) {
							/*
							 * Edit the route from the database.
							 */
							var rt_tables = fs.readFileSync('/etc/iproute2/rt_tables').toString().split('\n');

							for (line in rt_tables) {
								if (rt_tables[line].search(req.body.id) != '-1') {
									// Line that wanted to be edited.
									rt_tables[line] = req.body.id + ' ' + req.body.name;
								}
							}
							fs.writeFileSync('/etc/iproute2/rt_tables', rt_tables.join('\n'));

							/*
							 * Flush routing cache to make the changes effective.
							 */
							exec('ip route flush cache', function (error, stdout, stderr) {
								if (error === null) {
									/*
									 * Save changes to database.
									 */
									Routing_Table.findOne({
										id:req.body.id
									}, function (error, doc) {
										if (!error) {
											doc.name = req.body.name;
											doc.description = req.body.description;

											// Save changes into database.
											doc.save(function (error) {
												if (!error) {
													response_from_server.id = req.body.id;
													response_from_server.message = 'Applied Successfully!';
													response_from_server.type = 'notification';
												}
												else {
													response_from_server.id = '';
													response_from_server.message = error.message;
													response_from_server.type = 'error';
												}

												// Return the gathered data.
												res.json(response_from_server);
											});
										}
										else {
											response_from_server.message = error.message;
											response_from_server.type = 'error';

											// Return the gathered data.
											res.json(response_from_server);
										}
									});
								}
								else {
									response_from_server.id = '';
									response_from_server.message = stderr;
									response_from_server.type = 'error';

									// Return the gathered data.
									res.json(response_from_server);
								}
							});
						}
						else {
							// There is a already an item in database.
							response_from_server.id = '';
							response_from_server.message = 'Item already in database.';
							response_from_server.type = 'error';

							// Return the gathered data.
							res.json(response_from_server);
						}
					}
					else {
						response_from_server.message = error;
						response_from_server.type = 'error';

						// Return the gathered data.
						res.json(response_from_server);
					}
				});
			}
			else {
				response_from_server.message = 'This table is readonly and is reserved by the system.';
				response_from_server.type = 'error';

				// Return the gathered data.
				res.json(response_from_server);
			}

			break;
		case 'route':
			/*
			 * Execute the changes in the system.
			 */
			/*
			 * Edit an object from the database.
			 */
			Routing_Route.findOne({
				_id:req.body.id
			}, function (error, doc) {
				if (!error) {
					doc.via = req.body.via;
					doc.description = req.body.description;

					exec(Routing_Route.cl_change(doc), function (error, stdout, stderr) {
						if (error == null) {
							/*
							 * Save changes to database.
							 */
							// Save changes into database.
							doc.save(function (error) {
								if (!error) {
									response_from_server.id = req.body.id;
									response_from_server.message = 'Changed Successfully!';
									response_from_server.type = 'notification';
								}
								else {
									response_from_server.id = '';
									response_from_server.message = error.message;
									response_from_server.type = 'error';
								}

								// Return the gathered data.
								res.json(response_from_server);
							});
						}
						else {
							response_from_server.message = stderr;
							response_from_server.type = 'error';

							// Return the gathered data.
							res.json(response_from_server);
						}

					});
				}
				else {
					response_from_server.message = error.message;
					response_from_server.type = 'error';

					// Return the gathered data.
					res.json(response_from_server);
				}
			});

			break;
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
/*
 * Services/IP Sets API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	async = require('async'),
	exec = require('child_process').exec,

/*
 * Load required models.
 */
	Hash_Net = require('../../../../models/services/ipsets/hash_net.js'),
	Hash_IP = require('../../../../models/services/ipsets/hash_ip.js'),
	List_Set = require('../../../../models/services/ipsets/list_set.js'),
	IP_Set = require('../../../../models/services/ipsets/ipset.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'ipset':
			IP_Set.findOne({
				name:req.body.id
			}, function (error, doc) {
				if (!error) {
					/*
					 * Execute the changes in the system.
					 */
					if (req.body.name != req.body.id) {
						/*
						 * Involves a change in name.
						 */
						exec(doc.cl_rename(req.body.name), function (error, stdout, stderr) {
							if (error === null) {
								/*
								 * Save changes to database.
								 */
								doc.name = req.body.name;
								doc.description = req.body.description;

								doc.save(function (error) {
									if (!error) {
										response_from_server.id = req.body.name;
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
						/*
						 * Is just a description change.
						 */
						/*
						 * Save changes to database.
						 */
						doc.description = req.body.description;

						doc.save(function (error) {
							if (!error) {
								response_from_server.id = req.body.name;
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
				}
				else {
					response_from_server.message = error.message;
					response_from_server.type = 'error';

					// Return the gathered data.
					res.json(response_from_server);
				}
			});

			break;
		case 'hash:ip':
			/*
			 * Edit an Hash:IP from the database.
			 */
			Hash_IP.findOne({
				_id:req.body.id
			}, function (error, doc) {
				if (!error) {
					doc.description = req.body.description;

					// Save changes into database.
					doc.save(function (error) {
						if (!error) {
							response_from_server.id = req.body.id;
							response_from_server.message = 'Saved Successfully!';
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
		case 'hash:net':
			/*
			 * Edit an Hash:Net from the database.
			 */
			Hash_Net.findOne({
				_id:req.body.id
			}, function (error, doc) {
				if (!error) {
					doc.description = req.body.description;

					// Save changes into database.
					doc.save(function (error) {
						if (!error) {
							response_from_server.id = req.body.id;
							response_from_server.message = 'Saved Successfully!';
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
		case 'list:set':
			/*
			 * Edit an List:Set from the database.
			 */
			List_Set.findOne({
				_id:req.body.id
			}, function (error, doc) {
				if (!error) {
					doc.description = req.body.description;

					// Save changes into database.
					doc.save(function (error) {
						if (!error) {
							response_from_server.id = req.body.id;
							response_from_server.message = 'Saved Successfully!';
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
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
/*
 * POST System/Tuning API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	exec = require('child_process').exec,

/*
 * Load required models.
 */
	Routing_Rule = require('../../../../models/routing/rule.js'),
	Routing_Table = require('../../../../models/routing/table.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'rule':
			/*
			 * Check in case the object is already in database.
			 */
			Routing_Rule.find({
				priority:req.body.priority
			}, {}, {}, function (error, docs) {
				if (!error) {
					if (!docs.length) {
						/*
						 * Execute the changes in the system.
						 */
						var routing_rule = new Routing_Rule({
							type         :req.body.type,
							from         :req.body.from,
							from_net_mask:req.body.from_net_mask,
							to           :req.body.to,
							to_net_mask  :req.body.to_net_mask,
							iif          :req.body.iif,
							priority     :req.body.priority,
							table        :req.body.table,
							description  :req.body.description
						});

						exec(routing_rule.cl_add(), function (error, stdout, stderr) {
							if (error === null) {
								/*
								 * Save changes to database.
								 */
								// Save changes into database.
								routing_rule.save(function (error) {
									if (!error) {
										response_from_server.id = routing_rule.priority;
										response_from_server.message = 'Added Successfully!';
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

			break;
		case 'table':
			/*
			 * Check in case the object is already in database.
			 */
			Routing_Table.find({
				$or:[
					{
						id:req.body.table_id
					},
					{
						name:req.body.name
					}
				]
			}, {}, {}, function (error, docs) {
				if (!error) {
					if (!docs.length) {
						/*
						 * Execute the changes in the system.
						 */
						var routing_table = new Routing_Table({
							id         :req.body.table_id,
							name       :req.body.name,
							description:req.body.description
						});

						exec('echo ' + routing_table.cl_add_table() + ' >> /etc/iproute2/rt_tables', function (error, stdout, stderr) {
							if (error === null) {
								/*
								 * Save changes to database.
								 */
								// Save changes into database.
								routing_table.save(function (error) {
									if (!error) {
										/*
										 * Flush routing cache to make the changes effective.
										 */
										exec('ip route flush cache', function (error, stdout, stderr) {
												if (error === null) {
													response_from_server.id = routing_table.id;
													response_from_server.message = 'Added Successfully!';
													response_from_server.type = 'notification';
												}
												else {
													response_from_server.id = '';
													response_from_server.message = stderr;
													response_from_server.type = 'error';
												}

												// Return the gathered data.
												res.json(response_from_server);
											}
										);
									}
									else {
										response_from_server.id = '';
										response_from_server.message = error.message;
										response_from_server.type = 'error';

										// Return the gathered data.
										res.json(response_from_server);
									}
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

			break;
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
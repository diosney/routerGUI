/*
 * Services/NAT API.
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
	NAT_Chain = require('../../../../models/services/nat/chain.js'),
	NAT_Rule = require('../../../../models/services/nat/rule.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'chain':
			NAT_Chain.findOne({
				name:req.body.id
			}, function (error, doc) {
				if (!error) {
					if (req.body.id.split('-')[1] == 'local' || req.body.id.split('-')[1] == 'ifall') {
						/*
						 * Don't let the change of Local and Ifall chains.
						 */
						response_from_server.message = 'Read-only chain.';
						response_from_server.type = 'error';

						// Return the gathered data.
						res.json(response_from_server);
					}
					else {
						doc.description = req.body.description;

						/*
						 * Save changes to database.
						 */
						doc.save(function (error) {
							if (!error) {
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
		case 'rule':
			/*
			 * Add an object to database.
			 */
			NAT_Rule.findOne({
				_id:req.body.id
			}, function (error, doc) {
				if (!error) {
					doc.chain_name = req.body.chain_name;
					doc.order = req.body.order;
					doc.protocol = req.body.protocol;
					doc.destination_ports = req.body.destination_ports;
					doc.source = req.body.source;
					doc.source_netmask = req.body.source_netmask;
					doc.destination = req.body.destination;
					doc.destination_netmask = req.body.destination_netmask;
					doc.to_nat = req.body.to_nat;
					doc.description = req.body.description;

					exec(NAT_Rule.cl_replace(doc), function (error, stdout, stderr) {
						if (error === null) {
							/*
							 * Save changes to database.
							 */
							doc.save(function (error) {
								if (!error) {
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
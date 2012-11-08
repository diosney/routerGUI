/*
 * POST Services/IP Sets API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	exec = require('child_process').exec,
	async = require('async'),

/*
 * Load required models.
 */
	Device = require('../../../../models/interfaces/device.js'),
	Address = require('../../../../models/interfaces/address.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'device':
			/*
			 * Execute the changes in the system.
			 */
			/*
			 * Edit a Device from the database.
			 */
			var device = new Device({
				status     :req.body.status,
				identifier :req.body.id,
				MAC        :req.body.MAC,
				MTU        :req.body.MTU,
				description:req.body.description
			});

			exec(device.cl_link_set(), function (error, stdout, stderr) {
				if (error === null) {
					/*
					 * Save changes to database.
					 */
					Device.findOne({
						identifier:req.body.id
					}, function (error, doc) {
						if (!error) {
							doc.status = req.body.status;
							doc.MAC = req.body.MAC;
							doc.MTU = req.body.MTU;
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
					response_from_server.message = stderr;
					response_from_server.type = 'error';

					// Return the gathered data.
					res.json(response_from_server);
				}
			});

			break;
		case 'address':
			/*
			 * Save changes to database.
			 */
			Address.findOne({
				_id:req.body.id
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
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
/*
 * Interfaces/Devices API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),

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
			 * Delete a Tunable from the database in case its status is NOT PRESENT..
			 */
			Device.findOne({
				identifier:req.body.id
			}, function (error, doc) {
				if (!error) {
					if (doc.status == 'NOT PRESENT') {
						Device.remove({
							identifier:req.body.id
						}, function (error) {
							if (!error) {
								/*
								 * Remove Device related addresses.f
								 */
								Address.remove({
									parent_device:req.body.id
								}, function (error) {
									if (!error) {
										response_from_server.message = 'Unsynced device deleted successfully!';
										response_from_server.type = 'notification';
									}
									else {
										response_from_server.message = err.message;
										response_from_server.type = 'error';
									}

									// Return the gathered data.
									res.json(response_from_server);
								});
							}
							else {
								response_from_server.message = err.message;
								response_from_server.type = 'error';

								// Return the gathered data.
								res.json(response_from_server);
							}
						});
					}
					else {
						response_from_server.message = 'Only devices with status NOT PRESENT can be deleted from DB.';
						response_from_server.type = 'error';

						// Return the gathered data.
						res.json(response_from_server);
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
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
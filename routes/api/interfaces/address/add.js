/*
 * Interfaces/Addresses API.
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
	Address = require('../../../../models/interfaces/address.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'address':
			/*
			 * Execute the changes in the system.
			 */
			var parent_device_id = req.body.device_id;
			if (parent_device_id.split('-separator-').length > 1) {
				parent_device_id = parent_device_id.replace('-separator-', '.');
			}

			var address = new Address({
				parent_device:parent_device_id,
				scope        :req.body.scope,
				address      :req.body.address,
				net_mask     :req.body.net_mask,
				family       :req.body.family,
				description  :req.body.description
			});

			exec(address.cl_address_add(), function (error, stdout, stderr) {
				if (error === null) {
					// Save changes into database.
					address.save(function (error) {
						if (!error) {
							response_from_server.id = address._id;
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

			break;
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
/*
 * POST Interfaces/Devices API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	exec = require('child_process').exec,

/*
 * Load required models.
 */
	VLAN = require('../../../../models/interfaces/vlan.js'),
	Address = require('../../../../models/interfaces/address.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};
	switch (req.body.object) {
		case 'vlan':
			/*
			 * Search for VLAN in database to get related data in order to make the change effective in the system.
			 */
			if ((req.body.id).split('-separator-').length > 1) {
				parent_device = (req.body.id).split('-separator-')[0];
				tag = (req.body.id).split('-separator-')[1];
			}

			VLAN.findOne({
				parent_device:parent_device,
				tag          :tag
			}, function (error, doc) {
				if (!error) {
					exec(doc.cl_delete(), function (error, stdout, stderr) {
						if (error === null) {
							// Save changes into database.
							VLAN.remove({
								parent_device:doc.parent_device,
								tag          :doc.tag
							}, function (error) {
								if (!error) {
									/*
									 * Delete associated addresses in database.
									 */
									Address.remove({
										parent_device:doc.parent_device + '.' + doc.tag
									}, function (error) {
										if (!error) {
											response_from_server.message = 'Deleted Successfully!';
											response_from_server.type = 'notification';
										}
										else {
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
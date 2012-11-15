/*
 * Interfaces/VLANs API.
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
	VLAN = require('../../../../models/interfaces/vlan.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'vlan':
			/*
			 * Execute the changes in the system.
			 */
			var vlan = new VLAN({
				parent_device:req.body.parent_device,
				status       :req.body.status,
				tag          :req.body.tag,
				address      :req.body.address,
				net_mask     :req.body.net_mask,
				description  :req.body.description
			});

			exec(vlan.cl_set(), function (error, stdout, stderr) {
				if (error === null) {
					/*
					 * Save changes to database.
					 */
					VLAN.findOne({
						parent_device:req.body.parent_device,
						tag          :req.body.tag
					}, function (error, doc) {
						if (!error) {
							doc.status = req.body.status;
							doc.description = req.body.description;

							// Save changes into database.
							doc.save(function (error) {
								if (!error) {
									response_from_server.message = 'Applied Successfully!';
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

			break;
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
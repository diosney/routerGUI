/*
 * Interfaces/Addresses API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	exec = require('child_process').exec,

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
			 * Search for address in database to get related data in order to make the change effective in the system.
			 */
			Address.findOne({
				_id:req.body.id
			}, function (error, doc) {
				if (!error) {
					exec(doc.cl_address_delete(), function (error, stdout, stderr) {
						if (error === null) {
							// Save changes into database.
							Address.remove({
								_id:req.body.id
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
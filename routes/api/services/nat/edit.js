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
	NAT_Chain = require('../../../../models/services/nat/chain.js');

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
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
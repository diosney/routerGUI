/*
 * Services/NAT API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
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
			if (req.body.type == 'source') {
				/*
				 * Add an object to database.
				 */
				// Instantiate the model and fill it with the obtained data.
				var nat_chain = new NAT_Chain({
					name       :req.body.name,
					description:req.body.description,
					interface  :req.body.interface,
					type       :req.body.type
				});

				exec(nat_chain.cl_create(), function (error, stdout, stderr) {
					if (error === null) {
						/*
						 * Save changes to database.
						 */
						nat_chain.save(function (error) {
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
				response_from_server.message = 'Invalid API Request.';
				response_from_server.type = 'error';

				// Return the gathered data.
				res.json(response_from_server);
			}

			break;
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
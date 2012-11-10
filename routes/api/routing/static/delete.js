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
	Routing_Rule = require('../../../../models/routing/rule.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'rule':
			/*
			 * Delete an object from the database.
			 */
			Routing_Rule.findOne({
				priority:req.body.id
			}, function (error, doc) {
				if (!error) {
					exec(Routing_Rule.cl_delete(doc), function (error, stdout, stderr) {
						/*
						 * Save changes to database.
						 */
						Routing_Rule.remove({
							priority:req.body.id
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
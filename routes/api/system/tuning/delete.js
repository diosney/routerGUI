/*
 * System/Tuning API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),

/*
 * Load required models.
 */
	Tunable = require('../../../../models/system/tunable.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'tunable':
			/*
			 * Delete a Tunable from the database.
			 */
			Tunable.remove({
				_id:req.body.id
			}, function (error) {
				if (!error) {
					response_from_server.message = 'Deleted Successfully!';
					response_from_server.type = 'notification';
				}
				else {
					response_from_server.message = err.message;
					response_from_server.type = 'error';
				}

				// Return the gathered data.
				res.json(response_from_server);
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
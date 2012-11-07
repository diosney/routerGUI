/*
 * POST System/Tuning API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),

/*
 * Load required models.
 */
	Tunable = require('../../../../models/system/tuning/tunable.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	/*
	 * Edit a Tunable from the database.
	 */
	Tunable.findOne({
		_id:req.body.id
	}, function (error, doc) {
		if (!error) {
			doc.description = req.body.description;
			doc.value = req.body.value;

			// Save changes into database.
			doc.save(function (error) {
				if (!error) {
					response_from_server.id = req.body.id;
					response_from_server.message = 'Saved Successfully!';
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
};
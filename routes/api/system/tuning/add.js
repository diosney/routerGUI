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
	 * Check in case the tunable is already in database.
	 */
	Tunable.find({
		group:req.body.group,
		path: req.body.path
	}, {}, {}, function (error, docs) {
		if (!error) {
			if (!docs.length) {
				/*
				 * Add a Tunable to database.
				 */
				// Instantiate the model and fill it with the obtained data.
				var tunable = new Tunable({
					group      :req.body.group,
					description:req.body.description,
					path       :req.body.path,
					value      :req.body.value
				});

				// Save the object to database.
				tunable.save(function (error) {
					if (!error) {
						response_from_server.id = tunable.id;
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
				// There is a already an item in database.
				response_from_server.id = '';
				response_from_server.message = 'Item already in database.';
				response_from_server.type = 'error';

				// Return the gathered data.
				res.json(response_from_server);
			}
		}
		else {
			response_from_server.message = error;
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);
		}
	});
};
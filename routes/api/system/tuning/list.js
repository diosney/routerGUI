/*
 * System/Tuning API.
 */
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	async = require('async'),

/*
 * Load required models.
 */
	Tunable = require('../../../../models/system/tunable.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.query.object) {
		case 'tunable':
			/*
			 * Returns a list of Tunables from database.
			 */
			// TODO: Add sorting functionality.
			async.waterfall([
				function (callback_waterfall) {
					// Obtain the total count of object in database.
					Tunable.find({}, {}, {
					}, function (error, docs) {
						if (!error) {
							callback_waterfall(null, docs.length);
						}
						else {
							callback_waterfall(error);
						}
					});
				}
			], function (error, count) {
				Tunable.find({}, {}, {
					skip :req.query.page * req.query.rows - req.query.rows,
					limit:req.query.rows,
					sort :'group'
				}, function (error, docs) {
					if (!error) {
						response_from_server.records = count;
						response_from_server.page = req.query.page;
						response_from_server.total = Math.ceil(count / req.query.rows);
						response_from_server.rows = [];

						for (item in docs) {
							response_from_server.rows.push({
								id  :docs[item].id,
								cell:[
									docs[item].group,
									docs[item].description,
									docs[item].path,
									docs[item].value
								]
							});
						}

						// Return the gathered data.
						res.json(response_from_server);
					}
					else {
						// TODO: See how pass error message to grid list action and show it.
						console.log('// ERROR: TODO: See how pass error message to grid list action and show it.');
					}
				});
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
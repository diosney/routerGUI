/*
 * POST System/Tuning API.
 */
/**
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
	/*
	 * Returns a list of Tunables.
	 */

	// TODO: Add sorting functionality.
	Tunable.find({}, {}, {
		skip :req.query.page * req.query.rows - req.query.rows,
		limit:req.query.rows
	}, function (error, docs) {
		if (!error) {
			var count = docs.length;

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
			console.log('error')
			// TODO: See how pass error message to grid list action and show it.
			console.log('// TODO: See how pass error message to grid list action and show it.');
		}
	});
};
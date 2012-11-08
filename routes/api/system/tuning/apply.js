/*
 * POST System/Tuning API.
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
	Tunable = require('../../../../models/system/tunable.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	/*
	 * Apply a Tunable to the system.
	 */
	async.series({
			one:function (callback) {
				/*
				 * Create new Tunables into system.
				 */
				// TODO: This code works now but change it to async.forEach later.
				Tunable.find({},{}, {}, function (error, docs) {
					if (!error) {
						// Needed due to async nature of 'exec' function. Use execSync when available.
						var string_to_exec = '';
						for (i in docs) {
							var tunable = new Tunable(docs[i]);
							string_to_exec += tunable.cl_apply() + ((i == (docs.length - 1) ? '' : ' && '));
						}

						exec(string_to_exec, function (error, stdout, stderr) {
							if (error !== null) {
								callback(stderr, 1);
							}
							else {
								callback(null, 1);
							}
						});
					}
					else {
						callback(error, 1);
					}
				});
			}
		},
		function (error, results) {
			if (!error) {
				response_from_server.message = 'Applied Successfully!';
				response_from_server.type = 'notification';
			}
			else {
				response_from_server.message = error;
				response_from_server.type = 'error';
			}

			// Return the gathered data.
			res.json(response_from_server);
		});
};
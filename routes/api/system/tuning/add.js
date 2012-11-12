/*
 * System/Tuning API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	exec = require('child_process').exec,

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
			 * Check in case the tunable is already in database.
			 */
			Tunable.find({
				group:req.body.group,
				path :req.body.path
			}, {}, {}, function (error, docs) {
				if (!error) {
					if (!docs.length) {
						var tunable = new Tunable({
							group      :req.body.group,
							path       :req.body.path,
							value      :req.body.value,
							description:req.body.description
						});

						/*
						 * Execute the changes in the system.
						 */
						exec(tunable.cl_apply(), function (error, stdout, stderr) {
							if (error === null) {
								/*
								 * Save changes to database.
								 */
								tunable.save(function (error) {
									if (!error) {
										response_from_server.id = tunable._id;
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

			break;
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
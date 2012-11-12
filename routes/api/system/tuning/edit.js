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
					Tunable.findOne({
						_id:req.body.id
					}, function (error, doc) {
						if (!error) {
							doc.group = req.body.group; // This is a read-only property.
							doc.path = req.body.path;   // This is a read-only property.
							doc.value = req.body.value;
							doc.description = req.body.description;

							/*
							 * Save changes to database.
							 */
							doc.save(function (error) {
								if (!error) {
									response_from_server.id = req.body.id;
									response_from_server.message = 'Applied Successfully!';
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
				}
				else {
					response_from_server.message = stderr;
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
/*
 * Dashboard API.
 */
/*
 * Module dependencies.
 */
var os = require('os'),
	fs = require('fs'),
	exec = require('child_process').exec,
	async = require('async'),

/*
 * Load required models.
 */
	Settings = require('../../../models/system/settings.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'widget':
			/*
			 * Save settings.
			 */
			Settings.findOne({
				name:'widgets_refresh_interval'
			}, function (error, doc) {
				if (!error) {
					doc.value = req.body.widgets_refresh_interval;

					// Save changes into database.
					doc.save(function (error) {
						if (!error) {
							response_from_server.message = 'Saved Successfully!';
							response_from_server.type = 'notification';
							response_from_server.data = {
								widgets_refresh_interval:req.body.widgets_refresh_interval
							};
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

			break;
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
/*
 * POST System/Install API.
 */
/*
 * Module dependencies.
 */
var async = require('async'),
	fs = require('fs'),
	mongoose = require('mongoose');

/*
 * Load required models.
 */
Tunable = require('../../../../models/system/tuning/tunable.js');

// Load default files.
var default_file = require('../../../../default.json');

module.exports = function (req, res) {
	// Load configuration file.
	var config = require('../../../../config.json');

	// Initialize response. TODO: Make this a global function that prepares a response.
	var response_from_server = {};

	switch (req.body.submit) {
		case 'install':
			// Check if system is already installed.
			if (!config.database.installed) {
				/*
				 *  System is not installed yet.
				 */
				// Open DB connection to database.
				mongoose.connect(config.database.host, config.database.name);

				/*
				 * There was an error in the connection.
				 */
				mongoose.connection.on('error', function (error) {
					console.log(error);
				});

				/*
				 * Ensures that code is executed only if there was no error.
				 */
				mongoose.connection.on('open', function (ref) {
					/*
					 * Install system into database.
					 */
					async.forEach(default_file.system.tuning, function (item, callback) {
						/*
						 * Add a Tunable to database.
						 */
						// Instantiate the model and fill it with the default data.
						var tunable = new Tunable(item);

						// Save the object to database.
						tunable.save(function (error) {
							if (error) {
								callback(error);
							}
							else {
								callback(null);
							}
						});
					}, function (error) {
						if (error == null) {
							// Set installed flag to let know that the system is installed.
							config.database.installed = true;
							fs.writeFile('config.json', JSON.stringify(config, null, '\t'), function (error) {
								if (error) {
									console.log(error);
								}
							});

							response_from_server.message = 'Installed Successfully! Go to the <a href="/">Dashboard</a> to beginning the use of the system.';
							response_from_server.type = 'notification';
							response_from_server.data = {
								installed:true
							};
						}
						else {
							response_from_server.message = error.toString();
							response_from_server.type = 'error';
							response_from_server.data = {
								installed:false
							};
						}

						// Return the gathered data.
						res.json(response_from_server);

						// Close DB connection.
						mongoose.connection.close();
					});
				});
			}
			else {
				/*
				 * System is already installed.
				 */
				// Show message to user.
				response_from_server.message = 'System is already installed. Drop databases first if you want to <strong>re-install</strong> it.';
				response_from_server.type = 'error';
				response_from_server.data = {
					installed:true
				};

				// Return the gathered data.
				res.json(response_from_server);
			}

			break;
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
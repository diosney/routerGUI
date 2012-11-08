/*
 * POST System/Install API.
 */
/*
 * Module dependencies.
 */
var async = require('async'),
	exec = require('child_process').exec,
	fs = require('fs');

/*
 * Load required models.
 */
Tunable = require('../../../../models/system/tunable.js'),
	Device = require('../../../../models/interfaces/device.js'),
	Address = require('../../../../models/interfaces/address.js');

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
				/*
				 * Ensures that code is executed only if there was no error.
				 */
				/*
				 * Install system into database.
				 */
				async.parallel([
					function (callback_parallel) {
						/*
						 * System/Tuning.
						 */
						async.forEach(default_file.system.tuning, function (item, callback_forEach) {
							/*
							 * Add a Tunable to database.
							 */
							// Instantiate the model and fill it with the default data.
							var tunable = new Tunable(item);

							// Save the object to database.
							tunable.save(function (error) {
								if (error) {
									callback_forEach(error);
								}
								else {
									callback_forEach(null);
								}
							});
						}, function (error) {
							if (error) {
								callback_parallel(error);
							}
							else {
								callback_parallel(null);
							}
						});
					},
					function (callback_parallel) {
						/*
						 * Interfaces/Devices.
						 */
						async.waterfall([
							function (callback_waterfall) {
								/*
								 *  Get the data for the currently list of installed devices.
								 *
								 * Identifier
								 * MTU
								 * Status
								 * MAC
								 *
								 */
								exec(Device.cl_link_show(), function (error, stdout, stderr) {
									if (error === null) {
										var output = stdout.split('\n'),
											devices = [],
											d = 0;

										for (var line = 0; line < output.length - 1; line++) { // The last item is empty.
											if (line % 2 == 0) {
												devices.push({
													identifier:output[line].split(': ')[1],
													MTU       :output[line].split('mtu ')[1].split(' ')[0],
													status    :((output[line].split('state ')[1].split(' ')[0] == 'UNKNOWN') ? 'UP' : output[line].split('state ')[1].split(' ')[0])
												});

												d++;
											}
											else {
												devices[d - 1].MAC = (output[line].trim().split(' ')[0] != 'link/ppp') ? output[line].trim().split(' ')[1] : '';
											}
										}

										callback_waterfall(null, devices);
									}
									else {
										callback_waterfall(error);
									}
								});
							},
							function (devices, callback_waterfall) {
								/*
								 * Update the state of devices in DB taking care with the current status.
								 *
								 */
								async.forEach(devices, function (item, callback_forEach) {
									/*
									 * Update Devices.
									 */
									Device.findOne({
										identifier:item.identifier
									}, function (error, doc) {
										if (!error) {
											if (!doc) {
												/*
												 * The device isn't in database yet.
												 */
												// Instantiate the model and fill it with the obtained data.
												var device = new Device(item);

												// Save the object to database.
												device.save(function (error) {
													if (error) {
														callback_forEach(error);
													}
													else {
														callback_forEach(null);
													}
												});
											}
										}
										else {
											callback_forEach(error);
										}
									});

									/*
									 * Get Device Addresses.
									 */
									exec(Address.cl_address_show(item.identifier), function (error, stdout, stderr) {
										if (error === null) {
											var output = stdout.split('\n');

											for (var line = 2; line < output.length - 1; line++) { // The two first lines don't have addresses.
												var family = output[line].trim().split(' scope ')[0].split(' ')[0];

												if (family == 'inet' || family == 'inet6') {
													var address = new Address({
														parent_device:item.identifier,
														scope        :output[line].trim().split(' scope ')[1].split(' ')[0],
														address      :output[line].trim().split(' scope ')[0].split(' ')[1].split('/')[0],
														net_mask     :output[line].trim().split(' scope ')[0].split(' ')[1].split('/')[1],
														family       :family,
														description  :''
													});

													/*
													 * Save address to database.
													 */
													address.save(function (error) {
														if (!error) {
															callback_forEach(null);
														}
														else {
															callback_forEach(error);
														}
													});
												}
											}
										}
										else {
											callback_forEach(error);
										}
									});
								}, function (error) {
									if (error == null) {
										callback_waterfall(null, devices);
									}
									else {
										callback_waterfall(error);
									}
								});
							}
						], function (error, devices) {
							if (error == null) {
								callback_parallel(null);
							}
							else {
								callback_parallel(error);
							}
						});
					}
				],
					function (error, results) {
						/*
						 * Final parallel callback function.
						 */
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
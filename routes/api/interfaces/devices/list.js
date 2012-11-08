/*
 * POST Interfaces/Devices API.
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
	Device = require('../../../../models/interfaces/device.js'),
	Address = require('../../../../models/interfaces/address.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.query.object) {
		case 'device':
			async.waterfall([
				function (callback) {
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

							callback(null, devices);
						}
						else {
							callback(error);
						}
					});
				},
				function (devices, callback) {
					/*
					 * Update the state of devices in DB taking care with the current status.
					 *
					 */
					async.forEach(devices, function (item, callback_forEach) {
						Device.findOne({
							identifier:item.identifier
						}, function (error, doc) {
							if (!error) {
								if (doc) {
									/*
									 * The device is already in database.
									 */
									// Update device status in database.
									doc.status = item.status;

									// Add know field from database.
									item.MTU = doc.MTU;
									item.MAC = doc.MAC;
									item.description = doc.description;

									doc.save(function (error) {
										if (error) {
											callback_forEach(error);
										}
										else {
											callback_forEach(null);
										}
									});
								}
								else {
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
					}, function (error) {
						if (error == null) {
							callback(null, devices);
						}
						else {
							callback(error);
						}
					});
				}
			], function (error, devices) {
				if (error == null) {
					response_from_server.records = devices.length;
					response_from_server.page = 1;
					response_from_server.total = 1;
					response_from_server.rows = [];

					for (item in devices) {
						if (devices[item].identifier.search('@') == -1) {
							// Is a physical device (not a VLAN).
							response_from_server.rows.push({
								id  :devices[item].identifier,
								cell:[
									devices[item].status,
									devices[item].identifier,
									devices[item].MTU,
									devices[item].MAC,
									devices[item].description
								]
							});
						}
					}
				}
				else {
					response_from_server.message = error;
					response_from_server.type = 'error';
				}

				// Return the gathered data.
				res.json(response_from_server);
			});

			break;
		case 'address':
			/*
			 * Returns a list of device addresses.
			 */
			// TODO: Add sorting functionality.
			Address.find({
				parent_device:req.query.device_id
			}, {}, {
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
								docs[item].family,
								docs[item].scope,
								docs[item].address,
								docs[item].net_mask,
								docs[item].description
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

			break;
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
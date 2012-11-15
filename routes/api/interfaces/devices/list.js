/*
 * Interfaces/Devices API.
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
	Device = require('../../../../models/interfaces/device.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.query.object) {
		case 'device':
			if (req.query.return_type == 'select') {
				Device.find({
				}, {}, {
					sort :'identifier'
				}, function (error, docs) {
					if (!error) {
						var str_to_return = '<select>';
						for (item in docs) {
							str_to_return += '<option value="' + docs[item].identifier + '">';
							str_to_return += docs[item].identifier;
							str_to_return += '</option>';
						}

						str_to_return += '</select>';

						// Return the gathered data.
						res.send(str_to_return);
					}
					else {
						response_from_server.message = 'Unable to return the requested data.';
						response_from_server.type = 'error';

						// Return the gathered data.
						res.json(response_from_server);
					}
				});
			}
			else {
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
									devices_ids = [];

								for (var line = 0; line < output.length - 1; line += 2) { // The last item is empty.
									is_vlan = (typeof(output[line].split(': ')[1].split('@')[1]) == 'undefined') ? false : true;

									if (!is_vlan) {
										// Isn't a VLAN.
										devices.push({
											identifier:output[line].split(': ')[1],
											MTU       :output[line].split('mtu ')[1].split(' ')[0],
											status    :(output[line].split('state ')[1].split(' ')[0] == 'UNKNOWN') ? 'UP' : output[line].split('state ')[1].split(' ')[0],
											MAC       :(output[line + 1].trim().split(' ')[0] != 'link/ppp') ? output[line + 1].trim().split(' ')[1] : ''
										});

										/*
										 * Needed in the next step, this is to save processing time.
										 * Is needed in order to search for a device not present in the system.
										 */
										devices_ids.push(output[line].split(': ')[1]);
									}
								}

								callback_waterfall(null, devices, devices_ids);
							}
							else {
								callback_waterfall(stderr);
							}
						});
					},
					function (devices, devices_ids, callback_waterfall) {
						/*
						 * Update the state of devices in DB taking care with the current status.
						 * If present update data or add them to database.
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
								callback_waterfall(null, devices, devices_ids);
							}
							else {
								callback_waterfall(error);
							}
						});
					},
					function (devices, devices_ids, callback_waterfall) {
						/*
						 * If not present update status "NOT PRESENT".
						 */
						Device.find({}, function (error, docs) {
							if (!error) {
								async.forEach(docs, function (item, callback_forEach) {
									if (devices_ids.indexOf(item.identifier) == -1) {
										/*
										 * It is not present.
										 */
										Device.findOne({
											identifier:item.identifier
										}, function (error, doc) {
											if (error == null) {
												doc.status = 'NOT PRESENT';

												// Save the object to database.
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
												callback_forEach(error);
											}
										});
									}
									else {
										// Ensures good return.
										callback_forEach(null);
									}
								}, function (error) {
									if (error == null) {
										callback_waterfall(null, devices);
									}
									else {
										callback_waterfall(error);
									}
								});
							}
							else {
								callback_waterfall(error);
							}
						});
					}
				], function (error, devices) {
					if (error == null) {
						response_from_server.records = devices.length;
						response_from_server.page = 1;
						response_from_server.total = 1;
						response_from_server.rows = [];

						/*
						 * List Devices from database, which is now updated.
						 */
						Device.find({
						}, {}, {
							skip :req.query.page * req.query.rows - req.query.rows,
							limit:req.query.rows,
							sort :'identifier'
						}, function (error, docs) {
							if (!error) {
								var count = docs.length;

								response_from_server.records = count;
								response_from_server.page = req.query.page;
								response_from_server.total = Math.ceil(count / req.query.rows);
								response_from_server.rows = [];

								for (item in docs) {
									response_from_server.rows.push({
										id  :docs[item].identifier,
										cell:[
											docs[item].status,
											docs[item].identifier,
											docs[item].MTU,
											docs[item].MAC,
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
					}
					else {
						response_from_server.message = error;
						response_from_server.type = 'error';

						// Return the gathered data.
						res.json(response_from_server);
					}
				});
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
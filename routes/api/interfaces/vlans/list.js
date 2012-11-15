/*
 * Interfaces/VLANs API.
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
	VLAN = require('../../../../models/interfaces/vlan.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.query.object) {
		case 'vlan':
			async.waterfall([
				function (callback_waterfall) {
					/*
					 *  Get the data for the currently list of installed vlans.
					 */
					exec(Device.cl_link_show(), function (error, stdout, stderr) {
						if (error === null) {
							var output = stdout.split('\n'),
								vlans = [],
								vlans_ids = [];

							for (var line = 0; line < output.length - 1; line += 2) { // The last item is empty.
								is_vlan = (typeof(output[line].split(': ')[1].split('@')[1]) == 'undefined') ? false : true;

								if (is_vlan) {
									// Is a VLAN.
									var status = (output[line].split('state ')[1].split(' ')[0] == 'UNKNOWN') ? 'UP' : output[line].split('state ')[1].split(' ')[0];
									if (status == 'LOWERLAYERDOWN') {
										status = 'PARENT DOWN';
									}

									vlans.push({
										parent_device:output[line].split(': ')[1].split('@')[1],
										status       :status,
										tag          :output[line].split(': ')[1].split('@')[0].split('.')[1]
									});

									/*
									 * Needed in the next step, this is to save processing time.
									 * Is needed in order to search for a VLAN not present in the system.
									 */
									vlans_ids.push(output[line].split(': ')[1].split('@')[0]);
								}
							}

							callback_waterfall(null, vlans, vlans_ids);
						}
						else {
							callback_waterfall(stderr);
						}
					});
				},
				function (vlans, vlans_ids, callback_waterfall) {
					/*
					 * Update the state of VLANs in DB taking care with the current status.
					 * If present update data or add them to database.
					 */
					async.forEach(vlans, function (item, callback_forEach) {
						VLAN.findOne({
							parent_device:item.parent_device,
							tag          :item.tag
						}, function (error, doc) {
							if (!error) {
								if (doc) {
									/*
									 * The VLAN is already in database.
									 */
									// Update device status in database.
									doc.status = item.status;

									// Add know field from database.
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
									 * The VLAN isn't in database yet.
									 */
									// Instantiate the model and fill it with the obtained data.
									var vlan = new VLAN(item);

									// Save the object to database.
									vlan.save(function (error) {
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
							callback_waterfall(null, vlans, vlans_ids);
						}
						else {
							callback_waterfall(error);
						}
					});
				},
				function (vlans, vlans_ids, callback_waterfall) {
					/*
					 * If not present update status "NOT PRESENT".
					 */
					VLAN.find({}, function (error, docs) {
						if (!error) {
							async.forEach(docs, function (item, callback_forEach) {
								if (vlans_ids.indexOf(item.parent_device + '.' + item.tag) == -1) {
									/*
									 * It is not present.
									 */
									VLAN.findOne({
										parent_device:item.parent_device,
										tag          :item.tag
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
									callback_waterfall(null, vlans);
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
			], function (error, vlans) {
				if (error == null) {
					response_from_server.records = vlans.length;
					response_from_server.page = 1;
					response_from_server.total = 1;
					response_from_server.rows = [];

					/*
					 * List VLANs from database, which is now updated.
					 */
					VLAN.find({
					}, {}, {
						skip :req.query.page * req.query.rows - req.query.rows,
						limit:req.query.rows,
						sort :'parent_device'
					}, function (error, docs) {
						if (!error) {
							var count = docs.length;

							response_from_server.records = count;
							response_from_server.page = req.query.page;
							response_from_server.total = Math.ceil(count / req.query.rows);
							response_from_server.rows = [];

							for (item in docs) {
								response_from_server.rows.push({
									id  :docs[item].parent_device + '-separator-' + docs[item].tag,
									cell:[
										docs[item].parent_device,
										docs[item].status,
										docs[item].tag,
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

			break;
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
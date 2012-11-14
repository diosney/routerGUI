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
	Device = require('../../../../models/interfaces/device.js'),
	Address = require('../../../../models/interfaces/address.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'device':
			/*
			 * Execute the changes in the system.
			 */
			/*
			 * Edit a Device from the database.
			 */
			var device = new Device({
				status     :req.body.status,
				identifier :req.body.id,
				MAC        :req.body.MAC,
				MTU        :req.body.MTU,
				description:req.body.description
			});

			exec(device.cl_link_set(), function (error, stdout, stderr) {
				if (error === null) {
					/*
					 * Save changes to database.
					 */
					Device.findOne({
						identifier:req.body.id
					}, function (error, doc) {
						if (!error) {
							if (device.identifier != 'lo' || device.identifier.search('vboxnet') == -1) {
								doc.MAC = req.body.MAC;
								doc.MTU = req.body.MTU;
							}

							doc.status = req.body.status;
							doc.description = req.body.description;

							// Save changes into database.
							doc.save(function (error) {
								if (!error) {
									/*
									 * If status changed to UP updates and insert into system all addresses associated with the device.
									 */
									if (doc.status == 'UP') {
										/*
										 * Scans the system for the device addresses.
										 */
										exec(Address.cl_address_show(doc.identifier), function (error, stdout, stderr) {
											if (error === null) {
												// The two first lines don't have addresses.
												var output = stdout.split('\n');
												output = output.slice(2);

												async.waterfall([
													function(callback_waterfall){
														/*
														 * Flush addresses to keep system synced.
														 */
														exec(Address.cl_address_flush(doc.identifier), function (error, stdout, stderr) {
															if (error === null) {
																callback_waterfall(null);
															}
															else {
																callback_waterfall(stderr);
															}
														});
													},
													function(callback_waterfall){
														/*
														 * Update addresses database status.
														 */
														async.forEach(output, function (item, callback_forEach) {
															var family = item.trim().split(' scope ')[0].split(' ')[0];

															if (family == 'inet' || family == 'inet6') {
																var address = new Address({
																	parent_device:doc.identifier,
																	scope        :item.trim().split(' scope ')[1].split(' ')[0],
																	address      :item.trim().split(' scope ')[0].split(' ')[1].split('/')[0],
																	net_mask     :item.trim().split(' scope ')[0].split(' ')[1].split('/')[1],
																	family       :family,
																	description  :''
																});

																/*
																 * Search in database if address is already there.
																 */
																Address.findOne({
																	parent_device:doc.identifier,
																	address: item.trim().split(' scope ')[0].split(' ')[1].split('/')[0],
																	net_mask     :item.trim().split(' scope ')[0].split(' ')[1].split('/')[1]
																}, function (error, doc) {
																	if (!error) {
																		if (!doc) {
																			/*
																			 * Isn't in database yet.
																			 */
																			// Save changes into database.
																			address.save(function (error) {
																				if (!error) {
																					callback_forEach(null);
																				}
																				else {
																					callback_forEach(error);
																				}
																			});
																		}
																		else {
																			callback_forEach(null);
																		}
																	}
																	else {
																		callback_forEach(error);
																	}
																});
															}
															else {
																callback_forEach(null);
															}
														}, function (error) {
															if (error == null) {
																callback_waterfall(null);
															}
															else {
																callback_waterfall(error);
															}
														});
													},
													function(callback_waterfall){
														/*
														 * Make system live all device addresses in database.
														 */
														Address.find({
															parent_device:doc.identifier
														}, {}, {}, function (error, docs) {
															if (!error) {
																async.forEach(docs, function (item, callback_forEach) {
																	var address = new Address(item);

																	exec(address.cl_address_add(), function (error, stdout, stderr) {
																		if (error === null) {
																			callback_forEach(null);
																		}
																		else {
																			callback_forEach(stderr);
																		}
																	});
																}, function (error) {
																	if (error == null) {
																		callback_waterfall(null);
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
												], function (error, result) {
													if (error == null) {
														response_from_server.id = doc.identifier;
														response_from_server.message = 'Edited Successfully!';
														response_from_server.type = 'notification';
													}
													else {
														response_from_server.id = doc.identifier;
														response_from_server.message = error;
														response_from_server.type = 'error';
													}

													// Return the gathered data.
													res.json(response_from_server);
												});
											}
											else {
												response_from_server.id = doc.identifier;
												response_from_server.message = stderr;
												response_from_server.type = 'error';

												// Return the gathered data.
												res.json(response_from_server);
											}
										});
									}
									else {
										response_from_server.id = doc.identifier;
										response_from_server.message = 'Edited Successfully!';
										response_from_server.type = 'notification';

										// Return the gathered data.
										res.json(response_from_server);
									}
								}
								else {
									response_from_server.id = '';
									response_from_server.message = error.message;
									response_from_server.type = 'error';

									// Return the gathered data.
									res.json(response_from_server);
								}
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
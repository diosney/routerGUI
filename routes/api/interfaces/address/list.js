/*
 * Interfaces/Addresses API.
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
	Address = require('../../../../models/interfaces/address.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.query.object) {
		case 'address':
			/*
			 * Returns a list of device addresses.
			 */
			var parent_device_id = req.query.device_id;
			if (parent_device_id.split('-separator-').length > 1) {
				parent_device_id = parent_device_id.replace('-separator-', '.');
			}

			/*
			 * If parent device is 'UP' sync addresses.
			 */
			if (req.query.device_status == 'UP') {
				/*
				 * Get Device Addresses.
				 */
				exec(Address.cl_address_show(parent_device_id), function (error, stdout, stderr) {
					if (error === null) {
						// The two first lines don't have addresses.
						var output = stdout.split('\n');
						output = output.slice(2);

						/*
						 * Update addresses database status.
						 */
						async.forEach(output, function (item, callback_forEach) {
							var family = item.trim().split(' scope ')[0].split(' ')[0];

							if (family == 'inet' || family == 'inet6') {
								var address = new Address({
									parent_device:parent_device_id,
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
									parent_device:parent_device_id,
									address      :item.trim().split(' scope ')[0].split(' ')[1].split('/')[0],
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
								/*
								 * Then list the addresses from the updated database.
								 */
								// TODO: Add sorting functionality.
								Address.find({
									parent_device:parent_device_id
								}, {}, {
									skip :req.query.page * req.query.rows - req.query.rows,
									limit:req.query.rows,
									sort :'family'
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
							}
							else {
								response_from_server.message = error;
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
			}
			else {
				/*
				 * If parent device is 'DOWN' or 'NOT PRESENT' retrieve the list from database.
				 */
				// TODO: Add sorting functionality.
				Address.find({
					parent_device:parent_device_id
				}, {}, {
					skip :req.query.page * req.query.rows - req.query.rows,
					limit:req.query.rows,
					sort :'family'
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
/*
 * Interfaces API.
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
	Device = require('../../../models/interfaces/device.js'),
	VLAN = require('../../../models/interfaces/vlan.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.query.object) {
		case 'interfaces':
			if (req.query.return_type == 'select') {
				async.parallel([
					function (callback_parallel) {
						Device.find({}, {}, {
							sort:'identifier'
						}, function (error, docs) {
							if (!error) {
								var devices = [];
								for (i in docs) {
									devices.push(docs[i].identifier);
								}

								callback_parallel(null, devices);
							}
							else {
								callback_parallel(error.message);
							}
						});
					},
					function (callback_parallel) {
						VLAN.find({}, {}, {
							sort:'parent_device'
						}, function (error, docs) {
							if (!error) {
								var vlans = [];
								for (i in docs) {
									vlans.push(docs[i].parent_device + '.' + docs[i].tag);
								}

								callback_parallel(null, vlans);
							}
							else {
								callback_parallel(error.message);
							}
						});
					}
				],
					function (error, results) {
						if (!error) {
							var interfaces = results[0].concat(results[1]).sort();

							var str_to_return = '<select><option value="">All</option>';
							for (item in interfaces) {
								str_to_return += '<option value="' + interfaces[item] + '">';
								str_to_return += interfaces[item];
								str_to_return += '</option>';
							}

							str_to_return += '</select>';

							// Return the gathered data.
							res.send(str_to_return);
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
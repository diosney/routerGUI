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
			// TODO: Add sorting functionality.
			var parent_device_id = req.query.device_id;
			if (parent_device_id.split('-separator-').length > 1) {
				parent_device_id = parent_device_id.replace('-separator-','.');
			}

			Address.find({
				parent_device:parent_device_id
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
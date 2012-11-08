/*
 * POST Interfaces/VLANs API.
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
	VLAN = require('../../../../models/interfaces/vlan.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.query.object) {
		case 'vlan':
			/*
			 * Returns a list of VLANs.
			 */
			// TODO: Add sorting functionality.
			VLAN.find({
			}, {}, {
				skip :req.query.page * req.query.rows - req.query.rows,
				limit:req.query.rows,
				sort: 'parent_device'
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

			break;
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
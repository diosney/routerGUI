/*
 * POST System/Tuning API.
 */
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),

/*
 * Load required models.
 */
	Routing_Rule = require('../../../../models/routing/rule.js'),
	Routing_Table = require('../../../../models/routing/table.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.query.object) {
		case 'rule':
			/*
			 * Returns a list of Routing Rules.
			 */
			// TODO: Add sorting functionality.
			Routing_Rule.find({}, {}, {
				skip :req.query.page * req.query.rows - req.query.rows,
				limit:req.query.rows,
				sort :'priority'
			}, function (error, docs) {
				if (!error) {
					var count = docs.length;

					response_from_server.records = count;
					response_from_server.page = req.query.page;
					response_from_server.total = Math.ceil(count / req.query.rows);
					response_from_server.rows = [];

					for (item in docs) {
						response_from_server.rows.push({
							id  :docs[item].priority,
							cell:[
								docs[item].type,
								docs[item].priority,
								docs[item].table,
								docs[item].from,
								docs[item].from_net_mask,
								docs[item].to,
								docs[item].to_net_mask,
								docs[item].iif,
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
		case 'table':
			/*
			 * Returns a list of Routing Tables.
			 */
			// TODO: Add sorting functionality.
			Routing_Table.find({}, {}, {
				skip :req.query.page * req.query.rows - req.query.rows,
				limit:req.query.rows,
				sort :'id'
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
								docs[item].id,
								docs[item].name,
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
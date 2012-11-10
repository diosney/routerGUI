/*
 * POST System/Tuning API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	fs = require('fs'),
	exec = require('child_process').exec,

/*
 * Load required models.
 */
	Routing_Rule = require('../../../../models/routing/rule.js'),
	Routing_Table = require('../../../../models/routing/table.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'rule':
			/*
			 * Execute the changes in the system.
			 */
			/*
			 * Edit an object from the database.
			 */
			Routing_Rule.findOne({
				priority:req.body.id
			}, function (error, doc) {
				if (!error) {
					doc.description = req.body.description;

					// Save changes into database.
					doc.save(function (error) {
						if (!error) {
							response_from_server.id = req.body.id;
							response_from_server.message = 'Changed Successfully!';
							response_from_server.type = 'notification';
						}
						else {
							response_from_server.id = '';
							response_from_server.message = error.message;
							response_from_server.type = 'error';
						}

						// Return the gathered data.
						res.json(response_from_server);
					});
				}
				else {
					response_from_server.message = error.message;
					response_from_server.type = 'error';

					// Return the gathered data.
					res.json(response_from_server);
				}
			});

			break;
		case 'table':
			/*
			 * Delete an object from the database.
			 */
			var rt_tables = fs.readFileSync('/etc/iproute2/rt_tables').toString().split('\n');

			for (line in rt_tables) {
				if (rt_tables[line].search(req.body.id) != '-1') {
					// Line that wanted to be edited.
					rt_tables[line] = req.body.id + ' ' + req.body.name;
				}
			}
console.log(rt_tables)
			fs.writeFileSync('/etc/iproute2/rt_tables', rt_tables.join('\n'));

			/*
			 * Save changes to database.
			 */
			Routing_Table.findOne({
				id:req.body.id
			}, function (error, doc) {
				if (!error) {
					doc.name = req.body.name;
					doc.description = req.body.description;

					// Save changes into database.
					doc.save(function (error) {
						if (!error) {
							response_from_server.id = req.body.id;
							response_from_server.message = 'Applied Successfully!';
							response_from_server.type = 'notification';
						}
						else {
							response_from_server.id = '';
							response_from_server.message = error.message;
							response_from_server.type = 'error';
						}

						// Return the gathered data.
						res.json(response_from_server);
					});
				}
				else {
					response_from_server.message = error.message;
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
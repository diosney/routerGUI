/*
 * Services/NAT API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	async = require('async'),

/*
 * Load required models.
 */
	NAT_Chain = require('../../../../models/services/nat/chain.js'),
	NAT_Rule = require('../../../../models/services/nat/rule.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.query.object) {
		case 'chain':
			/*
			 * Returns a list of NAT Chains.
			 */
			NAT_Chain.find({
				type:((req.query.name_prefix == 'snat-') ? 'source' : 'destination')
			}, {}, {
				skip :req.query.page * req.query.rows - req.query.rows,
				limit:req.query.rows,
				sort :'name'
			}, function (error, docs) {
				if (!error) {
					var count = docs.length;

					response_from_server.records = count;
					response_from_server.page = req.query.page;
					response_from_server.total = Math.ceil(count / req.query.rows);
					response_from_server.rows = [];

					for (item in docs) {
						response_from_server.rows.push({
							id  :docs[item].name,
							cell:[
								docs[item].name.split('-')[1],
								(docs[item].interface) ? docs[item].interface : 'all',
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

		case 'rule':
			/*
			 * Returns a list of NAT Rules.
			 */
			async.waterfall([
				function (callback_waterfall) {
					// Obtain the total count of object in database.
					NAT_Rule.find({
						chain_name:req.query.chain_name
					}, {}, {
					}, function (error, docs) {
						if (!error) {
							callback_waterfall(null, docs.length);
						}
						else {
							callback_waterfall(error);
						}
					});
				}
			], function (error, count) {
				NAT_Rule.find({
					chain_name:req.query.chain_name
				}, {}, {
					skip :req.query.page * req.query.rows - req.query.rows,
					limit:req.query.rows,
					sort :'order'
				}, function (error, docs) {
					if (!error) {
						response_from_server.records = count;
						response_from_server.page = req.query.page;
						response_from_server.total = Math.ceil(count / req.query.rows);
						response_from_server.rows = [];

						for (item in docs) {
							response_from_server.rows.push({
								id  :docs[item]._id,
								cell:[
									docs[item].order,
									docs[item].protocol,
									docs[item].destination_ports,
									docs[item].source,
									docs[item].source_netmask,
									docs[item].destination,
									docs[item].destination_netmask,
									docs[item].to_nat,
									docs[item].description
								]
							});
						}

						// Return the gathered data.
						res.json(response_from_server);
					}
					else {
						console.log(error.message)
						// TODO: See how pass error message to grid list action and show it.
						console.log('// TODO: See how pass error message to grid list action and show it.');
					}
				});
			});

			break;
		case 'rule_order':
			if (req.query.return_type == 'select') {
				NAT_Rule.find({
					chain_name: req.query.chain_name
				}, {}, {}, function (error, docs) {
					if (!error) {
						var str_to_return = '<select><option value="' + (Number(docs.length) + 1) + '">Append</option>';

						for (item in docs) {
							str_to_return += '<option value="' + (Number(item) + 1) + '">';
							str_to_return += 'Insert at #' + (Number(item) + 1);
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
				response_from_server.message = 'Invalid API Request.';
				response_from_server.type = 'error';

				// Return the gathered data.
				res.json(response_from_server);
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
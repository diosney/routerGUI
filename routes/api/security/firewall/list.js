/*
 * Security/Firewall API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	async = require('async'),

/*
 * Load required models.
 */
	Firewall_Chain = require('../../../../models/security/firewall/chain.js'),
	Firewall_Rule = require('../../../../models/security/firewall/rule.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.query.object) {
		case 'chain':
			/*
			 * Returns a list of NAT Chains.
			 */
			async.waterfall([
				function (callback_waterfall) {
					// Obtain the total count of object in database.
					Firewall_Chain.find({}, {}, {
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
				Firewall_Chain.find({}, {}, {
					skip :req.query.page * req.query.rows - req.query.rows,
					limit:req.query.rows,
					sort :'name'
				}, function (error, docs) {
					if (!error) {

						response_from_server.records = count;
						response_from_server.page = req.query.page;
						response_from_server.total = Math.ceil(count / req.query.rows);
						response_from_server.rows = [];

						for (item in docs) {
							response_from_server.rows.push({
								id  :docs[item].name,
								cell:[
									docs[item].name,
									docs[item].in_interface,
									docs[item].out_interface,
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
			});

			break;
		case 'rule':
			/*
			 * Returns a list of Rules.
			 */
			async.waterfall([
				function (callback_waterfall) {
					// Obtain the total count of object in database.
					Firewall_Rule.find({
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
				Firewall_Rule.find({
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
									docs[item].target,
									docs[item].order,
									docs[item].protocol,
									docs[item].destination_ports,
									docs[item].source,
									docs[item].source_netmask,
									docs[item].destination,
									docs[item].destination_netmask,
									docs[item].state,
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
				Firewall_Rule.find({
					chain_name:req.query.chain_name
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
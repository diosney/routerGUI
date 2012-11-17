/*
 * Services/IP Sets API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),

/*
 * Load required models.
 */
	Hash_Net = require('../../../../models/services/ipsets/hash_net.js'),
	Hash_IP = require('../../../../models/services/ipsets/hash_ip.js'),
	List_Set = require('../../../../models/services/ipsets/list_set.js'),
	IP_Set = require('../../../../models/services/ipsets/ipset.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.query.object) {
		case 'ipset':
			if (req.query.return_type == 'select') {
				IP_Set.find({
				}, {}, {
					sort :'type'
				}, function (error, docs) {
					if (!error) {
						var str_to_return = '<select>';
						for (item in docs) {
							/*
							 * Don't list Mixed ipsets because it can be nested.
							 */
							if (docs[item].type != 'list:set') {
								str_to_return += '<option value="' + docs[item].name + '">';
								str_to_return += docs[item].name;
								str_to_return += '</option>';
							}
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
				/*
				 * Returns a list of IP Sets.
				 */
				// TODO: Add sorting functionality.
				IP_Set.find({}, {}, {
					skip :req.query.page * req.query.rows - req.query.rows,
					limit:req.query.rows,
					sort :'type'
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
									docs[item].type,
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
			}

			break;
		case 'hash:ip':
			/*
			 * Returns a list of Hash:IP.
			 */
			// TODO: Add sorting functionality.
			Hash_IP.find({
				ipset:req.query.ipset
			}, {}, {
				skip :req.query.page * req.query.rows - req.query.rows,
				limit:req.query.rows,
				sort :'address'
			}, function (error, docs) {
				if (!error) {
					var count = docs.length;

					response_from_server.records = count;
					response_from_server.page = req.query.page;
					response_from_server.total = Math.ceil(count / req.query.rows);
					response_from_server.rows = [];

					for (item in docs) {
						response_from_server.rows.push({
							id  :docs[item]._id,
							cell:[
								docs[item].family,
								docs[item].address,
								docs[item].description
							]
						});
					}

					// Return the gathered data.
					res.json(response_from_server);
				}
				else {
					// TODO: See how pass error message to grid list action and show it.
					console.log('// TODO: See how pass error message to grid list action and show it.');
				}
			});

			break;
		case 'hash:net':
			/*
			 * Returns a list of Hash:Net.
			 */
			// TODO: Add sorting functionality.
			Hash_Net.find({
				ipset:req.query.ipset
			}, {}, {
				skip :req.query.page * req.query.rows - req.query.rows,
				limit:req.query.rows,
				sort :'address'
			}, function (error, docs) {
				if (!error) {
					var count = docs.length;

					response_from_server.records = count;
					response_from_server.page = req.query.page;
					response_from_server.total = Math.ceil(count / req.query.rows);
					response_from_server.rows = [];

					for (item in docs) {
						response_from_server.rows.push({
							id  :docs[item]._id,
							cell:[
								docs[item].family,
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
					// TODO: See how pass error message to grid list action and show it.
					console.log('// TODO: See how pass error message to grid list action and show it.');
				}
			});

			break;
		case 'list:set':
			/*
			 * Returns a list of List:Set.
			 */
			// TODO: Add sorting functionality.
			List_Set.find({
				ipset:req.query.ipset
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
							id  :docs[item]._id,
							cell:[
								docs[item].name,
								docs[item].description
							]
						});
					}

					// Return the gathered data.
					res.json(response_from_server);
				}
				else {
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
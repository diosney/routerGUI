/*
 * Services/NAT API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),

/*
 * Load required models.
 */
	NAT_Chain = require('../../../../models/services/nat/chain.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.query.object) {
		case 'chain':
			if (req.query.type == 'source') {
				/*
				 * Returns a list of NAT Chains.
				 */
				NAT_Chain.find({
					type:req.query.type
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
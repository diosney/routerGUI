/*
 * Services/NAT API.
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
	NAT_Chain = require('../../../../models/services/nat/chain.js'),
	NAT_Rule = require('../../../../models/services/nat/rule.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'chain':
			/*
			 * Add an object to database.
			 */
			// Instantiate the model and fill it with the obtained data.
			var nat_chain = new NAT_Chain({
				name       :req.body.name_prefix + req.body.name,
				description:req.body.description,
				interface  :req.body.interface,
				type       :((req.body.name_prefix == 'snat-') ? 'source' : 'destination')
			});

			exec(nat_chain.cl_create(), function (error, stdout, stderr) {
				if (error === null) {
					/*
					 * Save changes to database.
					 */
					nat_chain.save(function (error) {
						if (!error) {
							response_from_server.message = 'Added Successfully!';
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
					response_from_server.message = stderr;
					response_from_server.type = 'error';

					// Return the gathered data.
					res.json(response_from_server);
				}
			});

			break;
		case 'rule':
			/*
			 * Add an object to database.
			 */
			// Instantiate the model and fill it with the obtained data.
			var nat_rule = new NAT_Rule({
				chain_name         :req.body.chain_name,
				order              :req.body.order,
				protocol           :req.body.protocol,
				destination_ports  :req.body.destination_ports,
				source             :req.body.source,
				source_netmask     :req.body.source_netmask,
				destination        :req.body.destination,
				destination_netmask:req.body.destination_netmask,
				to_nat             :req.body.to_nat,
				description        :req.body.description
			});

			exec(NAT_Rule.cl_add(nat_rule), function (error, stdout, stderr) {
				if (error === null) {
					/*
					 * Save changes to database.
					 */
					NAT_Rule.find({
						order:{
							$gte:req.body.order
						}
					}, {}, {
						sort:'order'
					}, function (error, docs) {
						if (!error) {
							/*
							 * Checks if there is a rule above the inserted one to shift it order by 1.
							 */
							if (docs.length > 0) {
								async.forEach(docs, function (item, callback_forEach) {
									NAT_Rule.findOne({
										order:item.order
									}, function (error, doc) {

										if (!error) {
											doc.order += 1;

											doc.save(function (error) {
												if (!error) {
													callback_forEach(null);
												}
												else {
													callback_forEach(error);
												}
											});
										}
										else {
											callback_forEach(error);
										}
									});
								}, function (error) {
									if (error) {
										response_from_server.id = '';
										response_from_server.message = error.message;
										response_from_server.type = 'error';
									}
									else {
										nat_rule.save(function (error) {
											if (!error) {
												response_from_server.message = 'Added Successfully!';
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
								});
							}
							else {
								/*
								 * This is the last rule so just save it.
								 */
								nat_rule.save(function (error) {
									if (!error) {
										response_from_server.message = 'Added Successfully!';
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
						}
						else {
							response_from_server.message = error.message;
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

			break;
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
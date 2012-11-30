/*
 * Security/Firewall API.
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
	Firewall_Chain = require('../../../../models/security/firewall/chain.js'),
	Firewall_Rule = require('../../../../models/security/firewall/rule.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'chain':
			/*
			 * Delete an object from the database.
			 */
			Firewall_Chain.findOne({
				name:req.body.id
			}, function (error, doc) {
				if (!error) {
					if (req.body.id == 'local' || req.body.id == 'ifall') {
						/*
						 * Don't let the removal of Local and Ifall chains.
						 */
						response_from_server.message = 'Read-only chain.';
						response_from_server.type = 'error';

						// Return the gathered data.
						res.json(response_from_server);
					}
					else {
						exec(Firewall_Chain.cl_del(doc), function (error, stdout, stderr) {
							if (error === null) {
								/*
								 * Save changes to database.
								 */
								Firewall_Chain.remove({
									name:req.body.id
								}, function (error) {
									if (!error) {
										/*
										 * Removes also all related NAT Rules from db.
										 */
										Firewall_Rule.remove({
											chain_name:req.body.id
										}, function (error) {
											if (!error) {
												response_from_server.message = 'Deleted Successfully!';
												response_from_server.type = 'notification';
											}
											else {
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
							}
							else {
								response_from_server.message = stderr;
								response_from_server.type = 'error';

								// Return the gathered data.
								res.json(response_from_server);
							}
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

			break;
		case 'rule':
			/*
			 * Delete an object from the database.
			 */
			Firewall_Rule.findOne({
				_id:req.body.id
			}, function (error, doc) {
				if (!error) {
					exec(Firewall_Rule.cl_del(doc), function (error, stdout, stderr) {
						if (error === null) {
							/*
							 * Save changes to database.
							 */
							Firewall_Rule.find({
								order:{
									$gte:doc.order
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
											Firewall_Rule.findOne({
												order:item.order
											}, function (error, doc) {

												if (!error) {
													doc.order -= 1;
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
												Firewall_Rule.remove({
													_id:req.body.id
												}, function (error) {
													if (!error) {
														response_from_server.message = 'Deleted Successfully!';
														response_from_server.type = 'notification';
													}
													else {
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
										Firewall_Rule.remove({
											_id:req.body.id
										}, function (error) {
											if (!error) {
												response_from_server.message = 'Deleted Successfully!';
												response_from_server.type = 'notification';
											}
											else {
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
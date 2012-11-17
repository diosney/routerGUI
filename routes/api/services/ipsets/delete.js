/*
 * Services/IP Sets API.
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
	Hash_Net = require('../../../../models/services/ipsets/hash_net.js'),
	Hash_IP = require('../../../../models/services/ipsets/hash_ip.js'),
	List_Set = require('../../../../models/services/ipsets/list_set.js'),
	IP_Set = require('../../../../models/services/ipsets/ipset.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'ipset':
			/*
			 * Delete an IP Set from the database.
			 */
			IP_Set.findOne({
				name:req.body.id
			}, function (error, doc) {
				if (!error) {
					exec(IP_Set.cl_destroy(doc), function (error, stdout, stderr) {
						if (error == null) {
							/*
							 * Save changes to database.
							 */
							IP_Set.remove({
								name:req.body.id
							}, function (error) {
								if (!error) {
									/*
									 * Delete related data to this IP Set.
									 */
									async.parallel([
										function (callback_parallel) {
											/*
											 * Related Hash:IPs
											 */
											Hash_IP.remove({
												ipset:req.body.id
											}, function (error) {
												if (!error) {
													callback_parallel(null);
												}
												else {
													callback_parallel(error);
												}
											});
										},
										function (callback_parallel) {
											/*
											 * Related Hash:Nets
											 */
											Hash_Net.remove({
												ipset:req.body.id
											}, function (error) {
												if (!error) {
													callback_parallel(null);
												}
												else {
													callback_parallel(error);
												}
											});
										},
										function (callback_parallel) {
											/*
											 * Related List:Sets
											 */
											List_Set.remove({
												ipset:req.body.id
											}, function (error) {
												if (!error) {
													callback_parallel(null);
												}
												else {
													callback_parallel(error);
												}
											});
										}
									],
										function (error, results) {
											if (error == null) {
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
									response_from_server.message = error;
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
		case 'hash:ip':
			/*
			 * Delete an Hash:IP from the database.
			 */
			Hash_IP.findOne({
				_id:req.body.id
			}, function (error, doc) {
				if (!error) {
					exec(Hash_IP.cl_del(doc), function (error, stdout, stderr) {
						if (error === null) {
							/*
							 * Save changes to database.
							 */
							Hash_IP.remove({
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
						else {
							response_from_server.message = stderr;
							response_from_server.type = 'error';

							// Return the gathered data.
							res.json(response_from_server);
						}
					});
				}
				else {
					response_from_server.message = error;
					response_from_server.type = 'error';

					// Return the gathered data.
					res.json(response_from_server);
				}
			});

			break;
		case 'hash:net':
			/*
			 * Delete an Hash:IP from the database.
			 */
			Hash_Net.findOne({
				_id:req.body.id
			}, function (error, doc) {
				if (!error) {
					exec(Hash_Net.cl_del(doc), function (error, stdout, stderr) {
						if (error === null) {
							/*
							 * Save changes to database.
							 */
							Hash_Net.remove({
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
						else {
							response_from_server.message = stderr;
							response_from_server.type = 'error';

							// Return the gathered data.
							res.json(response_from_server);
						}
					});
				}
				else {
					response_from_server.message = error;
					response_from_server.type = 'error';

					// Return the gathered data.
					res.json(response_from_server);
				}
			});

			break;
		case 'list:set':
			/*
			 * Delete an List:Set from the database.
			 */
			List_Set.findOne({
				_id:req.body.id
			}, function (error, doc) {
				if (!error) {
					exec(List_Set.cl_del(doc), function (error, stdout, stderr) {
						if (error === null) {
							/*
							 * Save changes to database.
							 */
							List_Set.remove({
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
						else {
							response_from_server.message = stderr;
							response_from_server.type = 'error';

							// Return the gathered data.
							res.json(response_from_server);
						}
					});
				}
				else {
					response_from_server.message = error;
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
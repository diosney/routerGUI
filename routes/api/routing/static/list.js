/*
 * Routing/Static Routing API.
 */
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	async = require('async'),

/*
 * Load required models.
 */
	Routing_Rule = require('../../../../models/routing/rule.js'),
	Routing_Table = require('../../../../models/routing/table.js'),
	Routing_Route = require('../../../../models/routing/route.js');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.query.object) {
		case 'rule':
			/*
			 * Returns a list of Routing Rules.
			 */
			async.waterfall([
				function (callback_waterfall) {
					// Obtain the total count of object in database.
					Routing_Rule.find({}, {}, {
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
				Routing_Rule.find({}, {}, {
					skip :req.query.page * req.query.rows - req.query.rows,
					limit:req.query.rows,
					sort :'priority'
				}, function (error, docs) {
					if (!error) {
						response_from_server.records = count-1;
						response_from_server.page = req.query.page;
						response_from_server.total = Math.ceil(count / req.query.rows);
						response_from_server.rows = [];

						for (item in docs) {
							/*
							 * Don't show local related rule, It just confuse the user.
							 */
							if (docs[item].priority != 0) {
								response_from_server.rows.push({
									id  :docs[item].priority,
									cell:[
										docs[item].type,
										docs[item].priority,
										docs[item].from,
										docs[item].from_net_mask,
										docs[item].to,
										docs[item].to_net_mask,
										docs[item].iif,
										docs[item].table,
										docs[item].description
									]
								});
							}
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
		case 'table':
			if (req.query.return_type == 'select') {
				Routing_Table.find({
				}, {}, {
					sort:'id'
				}, function (error, docs) {
					if (!error) {
						var str_to_return = '<select>';
						for (item in docs) {
							/*
							 * Don't list system tables to no confuse the user.
							 */
							if (docs[item].id != 0 && docs[item].id != 255) {
								str_to_return += '<option value="' + docs[item].id + '">';
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
				 * Returns a list of Routing Tables.
				 */
				async.waterfall([
					function (callback_waterfall) {
						// Obtain the total count of object in database.
						Routing_Table.find({}, {}, {
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
					Routing_Table.find({}, {}, {
						skip :req.query.page * req.query.rows - req.query.rows,
						limit:req.query.rows,
						sort :'id'
					}, function (error, docs) {
						if (!error) {
							var count = docs.length;

							response_from_server.records = count-2;
							response_from_server.page = req.query.page;
							response_from_server.total = Math.ceil(count / req.query.rows);
							response_from_server.rows = [];

							for (item in docs) {
								/*
								 * Don't list system tables to no confuse the user.
								 */
								if (docs[item].id != 0 && docs[item].id != 255) {
									response_from_server.rows.push({
										id  :docs[item].id,
										cell:[
											docs[item].id,
											docs[item].name,
											docs[item].description
										]
									});
								}
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
			}

			break;

		case 'route':
			/*
			 * Returns a list of Routing Routes.
			 */
			async.waterfall([
				function (callback_waterfall) {
					// Obtain the total count of object in database.
					Routing_Route.find({}, {}, {
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
				Routing_Route.find({
					table:req.query.table
				}, {}, {
					skip :req.query.page * req.query.rows - req.query.rows,
					limit:req.query.rows,
					sort :'to'
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
									docs[item].type,
									docs[item].to,
									docs[item].to_net_mask,
									docs[item].via,
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
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
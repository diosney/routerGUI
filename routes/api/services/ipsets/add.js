/*
 * Services/IP Sets API.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	exec = require('child_process').exec,

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
			 * Add an IP Set to database.
			 */
			// Instantiate the model and fill it with the obtained data.
			var ipset = new IP_Set({
				name       :req.body.name,
				description:req.body.description,
				type       :req.body.type
			});

			exec(ipset.cl_create(), function (error, stdout, stderr) {
				if (error === null) {
					/*
					 * Save changes to database.
					 */
					ipset.save(function (error) {
						if (!error) {
							response_from_server.id = ipset._id;
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
		case 'hash:ip':
			/*
			 * Add an Hash:IP to database.
			 */
			// Instantiate the Model and fill it with the obtained data.
			var hash_ip = new Hash_IP({
				ipset      :req.body.ipset,
				address    :req.body.address,
				family     :req.body.family,
				description:req.body.description
			});

			exec(hash_ip.cl_add(), function (error, stdout, stderr) {
				if (error === null) {
					/*
					 * Save changes to database.
					 */
					// Save the object to database.
					hash_ip.save(function (error) {
						if (!error) {
							response_from_server.id = hash_ip._id;
							response_from_server.message = 'Saved Successfully!';
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
		case 'hash:net':
			/*
			 * Add an Hash:Net to database.
			 */
			// Instantiate the Model and fill it with the obtained data.
			var hash_net = new Hash_Net({
				ipset      :req.body.ipset,
				address    :req.body.address,
				net_mask   :req.body.net_mask,
				family     :req.body.family,
				description:req.body.description
			});

			exec(hash_net.cl_add(), function (error, stdout, stderr) {
				if (error === null) {
					/*
					 * Save changes to database.
					 */
					// Save the object to database.
					hash_net.save(function (error) {
						if (!error) {
							response_from_server.id = hash_net._id;
							response_from_server.message = 'Saved Successfully!';
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
		case 'list:set':
			/*
			 * Add an Hash:Net to database.
			 */
			// Instantiate the Model and fill it with the obtained data.
			var list_set = new List_Set({
				ipset      :req.body.ipset,
				name       :req.body.name,
				description:req.body.description
			});

			exec(list_set.cl_add(), function (error, stdout, stderr) {
				if (error === null) {
					/*
					 * Save changes to database.
					 */
					// Save the object to database.
					list_set.save(function (error) {
						if (!error) {
							response_from_server.id = list_set._id;
							response_from_server.message = 'Saved Successfully!';
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
		default:
			response_from_server.message = 'Invalid API Request.';
			response_from_server.type = 'error';

			// Return the gathered data.
			res.json(response_from_server);

			break;
	}
};
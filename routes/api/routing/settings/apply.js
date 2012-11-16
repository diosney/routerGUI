/*
 * Routing/Global Settings API.
 */
/*
 * Module dependencies.
 */
var async = require('async'),
	exec = require('child_process').exec,
	fs = require('fs');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	async.parallel([
		function (callback_parallel) {
			/*
			 * ip_forwarding_v4
			 */
			exec('sysctl -w net.ipv4.ip_forward=' + ((req.body.ip_forwarding_v4) ? '1' : '0'), function (error, stdout, stderr) {
				if (error === null) {
					/*
					 * Save setting to database.
					 */
					Settings.findOne({
						name:'ip_forwarding_v4'
					}, function (error, doc) {
						if (!error) {
							doc.value = (req.body.ip_forwarding_v4) ? '1' : '0';

							doc.save(function (error) {
								if (!error) {
									callback_parallel(null);
								}
								else {
									callback_parallel(error);
								}
							});
						}
						else {
							callback_parallel(error);
						}
					});
				}
				else {
					callback_parallel(stderr);
				}
			});
		},
		function (callback_parallel) {
			/*
			 * ip_forwarding_v6
			 */
			exec('sysctl -w net.ipv6.conf.all.forwarding=' + ((req.body.ip_forwarding_v6) ? '1' : '0'), function (error, stdout, stderr) {
				if (error === null) {
					/*
					 * Save setting to database.
					 */
					Settings.findOne({
						name:'ip_forwarding_v6'
					}, function (error, doc) {

						if (!error) {
							doc.value = (req.body.ip_forwarding_v6) ? '1' : '0';

							doc.save(function (error) {
								if (!error) {
									callback_parallel(null);
								}
								else {
									callback_parallel(error);
								}
							});
						}
						else {
							callback_parallel(error);
						}
					});
				}
				else {
					callback_parallel(stderr);
				}
			});
		}
	],
		function (error, results) {
			if (error === null) {
				response_from_server.message = 'Succefully applied.';
				response_from_server.type = 'notification';
			}
			else {
				response_from_server.message = error;
				response_from_server.type = 'error';
			}

			// Return the gathered data.
			res.json(response_from_server);
		});
};
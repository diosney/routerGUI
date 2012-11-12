/*
 * System/Settings API.
 */
/*
 * Module dependencies.
 */
var async = require('async'),
	fs = require('fs');

module.exports = function (req, res) {
	// Initialize response.
	var response_from_server = {};

	switch (req.body.object) {
		case 'settings':
			async.parallel({
					hostname          :function (callback_parallel) {
						/*
						 * Get original hostname before gets updated.
						 */
						var original_hostname = fs.readFileSync('/etc/hostname').toString();

						/*
						 * Update hostname in all needed system files.
						 */
						Settings.findOne({
							name:'hostname'
						}, function (error, doc) {
							if (!error) {
								doc.value = req.body.hostname;

								/*
								 * Update system befores saves to database in case of error.
								 */
								// Update hostname in /etc/hostname.
								fs.writeFile('/etc/hostname', req.body.hostname, function (error) {
									if (error) {
										callback_parallel(error);
									}
								});

								// Update hostname in /proc/sys/kernel/hostname.
								fs.writeFile('/proc/sys/kernel/hostname', req.body.hostname, function (error) {
									if (error) {
										callback_parallel(error);
									}
								});

								// Update hostname in /etc/hosts.
								var hosts = fs.readFileSync('/etc/hosts').toString().split('\n');
								for (line in hosts) {
									var buffer = hosts[line].replace(original_hostname, req.body.hostname);
									hosts[line] = buffer;
								}
								fs.writeFileSync('/etc/hosts', hosts.join('\n'));

								doc.save(function (error) {
									if (error) {
										callback_parallel(error);
									}
									else {
										callback_parallel(null);
									}
								});
							}
							else {
								callback_parallel(error);
							}
						});
					},
					domain_nameservers:function (callback_parallel) {
						/*
						 * Update domain and nameservers in all needed system files.
						 */
						// Update domain in /etc/resolv.conf.
						var resolv_conf_content = '';
						if (req.body.domain != '') {
							resolv_conf_content += 'search ' + req.body.domain + '\n';
						}

						// Update nameservers in /etc/resolv.conf.
						if (req.body.nameserver_primary != '') {
							resolv_conf_content += 'nameserver ' + req.body.nameserver_primary + '\n';
						}

						// Update nameservers in /etc/resolv.conf.
						if (req.body.nameserver_secondary != '') {
							resolv_conf_content += 'nameserver ' + req.body.nameserver_secondary + '\n';
						}

						// Make effective the changes by rewriting the /etc/resolv.conf file.
						fs.writeFile('/etc/resolv.conf', resolv_conf_content, function (error) {
							if (error) {
								callback_parallel(error);
							}
							else {
								/*
								 * Update settings in database.
								 */
								// Domain.
								Settings.findOne({
									name:'domain'
								}, function (error, doc) {
									if (!error) {
										doc.value = req.body.domain;

										doc.save(function (error) {
											if (error) {
												callback_parallel(error);
											}
											else {
												callback_parallel(null);
											}
										});
									}
									else {
										callback_parallel(error);
									}
								});

								// Primary nameserver.
								Settings.findOne({
									name:'nameserver_primary'
								}, function (error, doc) {
									if (!error) {
										doc.value = req.body.nameserver_primary;

										doc.save(function (error) {
											if (error) {
												callback_parallel(error);
											}
											else {
												callback_parallel(null);
											}
										});
									}
									else {
										callback_parallel(error);
									}
								});

								// Secondary nameserver.
								Settings.findOne({
									name:'nameserver_secondary'
								}, function (error, doc) {
									if (!error) {
										doc.value = req.body.nameserver_secondary;

										doc.save(function (error) {
											if (error) {
												callback_parallel(error);
											}
											else {
												callback_parallel(null);
											}
										});
									}
									else {
										callback_parallel(error);
									}
								});
							}
						});
					}
				},
				function (error, results) {
					if (error == null) {
						response_from_server.message = 'Applied Successfully!';
						response_from_server.type = 'notification';
					}
					else {
						response_from_server.message = error;
						response_from_server.type = 'error';
					}

					// Return the gathered data.
					res.json(response_from_server);
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
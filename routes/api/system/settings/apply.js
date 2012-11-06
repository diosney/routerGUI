/*
 * POST System/Settings API.
 */
/*
 * Module dependencies.
 */
var async = require('async'),
	fs = require('fs');

module.exports = function (req, res) {
	// Initialize response. TODO: Make this a global function that prepares a response.
	var response_from_server = {};

	async.parallel({
			one:function (callback) {
				/*
				 * Get original hostname before gets updated.
				 */
				var original_hostname = fs.readFileSync('/etc/hostname').toString();

				/*
				 * Update hostname in all needed system files.
				 */
				// Update hostname in /etc/hostname.
				fs.writeFile('/etc/hostname', req.body.hostname, function (error) {
					if (error) {
						callback(error, 1);
					}
				});

				// Update hostname in /proc/sys/kernel/hostname.
				fs.writeFile('/proc/sys/kernel/hostname', req.body.hostname, function (error) {
					if (error) {
						callback(error, 1);
					}
				});

				// Update hostname in /etc/hosts.
				var hosts = fs.readFileSync('/etc/hosts').toString().split('\n');
				for (line in hosts) {
					var buffer = hosts[line].replace(original_hostname, req.body.hostname);
					hosts[line] = buffer;
				}
				fs.writeFileSync('/etc/hosts', hosts.join('\n'));

				callback(null, 1);
			},
			two:function (callback) {
				/*
				 * Update domain and nameservers in all needed system files.
				 */
				// Update domain in /etc/resolv.conf.
				var resolv_conf_content = '';
				if (req.body.domain) {
					resolv_conf_content += 'search ' + req.body.domain + '\n';
				}

				// Update nameservers in /etc/resolv.conf.
				for (server in req.body.nameservers) {
					if (req.body.nameservers[server]) {
						resolv_conf_content += 'nameserver ' + req.body.nameservers[server] + '\n';
					}
				}

				// Make effective the changes by rewriting the /etc/resolv.conf file.
				fs.writeFile('/etc/resolv.conf', resolv_conf_content, function (error) {
					if (error) {
						callback(error, 2);
					}
				});

				callback(null, 2);
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
			res.contentType('application/json');
			res.send(JSON.stringify(response_from_server));
		});
};
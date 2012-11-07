/*
 * GET System/Settings page.
 */
/*
 * Module dependencies.
 */
var os = require('os'),
	fs = require('fs'),
// Load configuration file.
	config = require('../../../config.json');

exports.index = function (req, res) {
	/*
	 * Check if system is installed in order to redirect to the installation page.
	 */
	if (config.database.installed == false) {
		// System is not installed.
		res.redirect('/system/install');
	}

	/*
	 * Gets system fields to be shown.
	 */
	// Hostname.
	var hostname = os.hostname(),
		resolv_conf = fs.readFileSync('/etc/resolv.conf').toString().split('\n'),
		domain = '',
		nameservers = [];

	// Domain and nameservers
	// Parse lines in resolv.conf file to obtain domain and nameservers.
	for (line in resolv_conf) {
		// Search for system domain.
		if (resolv_conf[line].search(/search/g) != '-1') {
			domain = resolv_conf[line].split('search ')[1];
		}

		// Search for nameservers
		if (resolv_conf[line].search(/nameserver/g) != '-1') {
			nameservers.push(resolv_conf[line].split('nameserver ')[1]);
		}
	}

	// If there is no nameservers configured build and empty array for compatibility.
	for (var i in [0, 1]) {
		if (!nameservers[i]) {
			nameservers.push('');
		}
	}

	res.render('system/settings/index', {
		title :'routerGUI · Settings',
		header:'Settings',
		lead  :'Tell something interesting about the settings screen.',
		menu: 'system/settings',

		hostname   :hostname,
		domain     :domain,
		nameservers:nameservers
	});
};
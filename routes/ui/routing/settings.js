/*
 * GET System/Settings page.
 */
/*
 * Module dependencies.
 */
var os = require('os'),
	async = require('async'),
	fs = require('fs');

/*
 * Load required models.
 */
Settings = require('../../../models/system/settings.js');

// Load configuration file.
var config = require('../../../config.json'),
	default_file = require('../../../default.json');

exports.index = function (req, res) {
	/*
	 * Check if system is installed in order to redirect to the installation page.
	 */
	if (config.database.installed == false) {
		// System is not installed.
		res.redirect('/system/install');
	}

	/*
	 * Get Settings from database.
	 */
	var settings = {};

	async.parallel([
		function (callback_parallel) {
			Settings.findOne({
				name:'ip_forwarding_v4'
			}, function (error, doc) {
				if (!error) {
					settings.ip_forwarding_v4 = doc.value;

					callback_parallel(null);
				}
				else {
					callback_parallel(error);
				}
			});
		},
		function (callback_parallel) {
			Settings.findOne({
				name:'ip_forwarding_v6'
			}, function (error, doc) {
				if (!error) {
					settings.ip_forwarding_v6 = doc.value;

					callback_parallel(null);
				}
				else {
					callback_parallel(error);
				}
			});
		}
	],
		// optional callback
		function (error, results) {
			res.render('routing/settings/index', {
				title :'routerGUI · Routing · Global Settings',
				header:'Global Settings',
				lead  :'Tell something interesting about the Routing Settings screen.',
				menu  :'routing/settings',

				settings:{
					ip_forwarding_v4:settings.ip_forwarding_v4,
					ip_forwarding_v6:settings.ip_forwarding_v6
				}
			});
		});
};
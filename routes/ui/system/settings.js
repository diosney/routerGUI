/*
 * System/Settings page.
 */
/*
 * Module dependencies.
 */
var async = require('async'),
	fs = require('fs'),

/*
 * Load required models.
 */
	Settings = require('../../../models/system/settings.js'),
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
	var settings = {}

	async.parallel({
			hostname            :function (callback_parallel) {
				Settings.findOne({
					name:'hostname'
				}, function (error, doc) {
					if (!error) {
						if (doc) {
							settings.hostname = doc.value;
						}
						else {
							settings.hostname = '';
						}

						callback_parallel(null, settings.hostname);
					}
					else {
						callback_parallel(error);
					}
				});
			},
			domain              :function (callback_parallel) {
				Settings.findOne({
					name:'domain'
				}, function (error, doc) {
					if (!error) {
						if (doc) {
							settings.domain = doc.value;
						}
						else {
							settings.domain = '';
						}

						callback_parallel(null, settings.domain);
					}
					else {
						callback_parallel(error);
					}
				});
			},
			nameserver_primary  :function (callback_parallel) {
				Settings.findOne({
					name:'nameserver_primary'
				}, function (error, doc) {
					if (!error) {
						if (doc) {
							settings.nameserver_primary = doc.value;
						}
						else {
							settings.nameserver_primary = '';
						}

						callback_parallel(null, settings.nameserver_primary);
					}
					else {
						callback_parallel(error);
					}
				});
			},
			nameserver_secondary:function (callback_parallel) {
				Settings.findOne({
					name:'nameserver_secondary'
				}, function (error, doc) {
					if (!error) {
						if (doc) {
							settings.nameserver_secondary = doc.value;
						}
						else {
							settings.nameserver_secondary = '';
						}

						callback_parallel(null, settings.nameserver_secondary);
					}
					else {
						callback_parallel(error);
					}
				});
			}
		},
		function (error, results) {
			/*
			 * Build error messages container.
			 */
			if (error === null) {
				/*
				 * Gets final results data from the async processing.
				 */
			}
			else {
				/*
				 * Show error message if any.
				 */
				var msg = {
					message:error,
					type   :'error'
				};
			}

			res.render('system/settings/index', {
				// General Vars.
				title   :'routerGUI · Settings',
				menu    :'system/settings',
				msg     :msg,

				// Settings.
				settings:settings
			});
		});
};
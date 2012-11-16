/*
 * Routing/Static Routing page.
 */
/*
 * Module dependencies.
 */
var async = require('async'),
	fs = require('fs');

/*
 * Load required models.
 */
Settings = require('../../../models/system/settings.js');

// Load configuration file.
var config = require('../../../config.json');

exports.index = function (req, res) {
	/*
	 * Check if system is installed in order to redirect to the installation page.
	 */
	if (config.database.installed == false) {
		// System is not installed.
		res.redirect('/system/install');
	}

	res.render('routing/static/index', {
		title :'routerGUI · Routing · Static Routing',
		header:'Static Routing',
		lead  :'Tell something interesting about the Static Routing screen.',
		menu  :'routing/static'
	});
};
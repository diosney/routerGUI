/*
 * GET System/Tuning page.
 *
 * TODO: If first_run, when accessing / then redirect to system/install.
 */
// Load configuration file.
var config = require('../../../config.json');

exports.index = function (req, res) {
	res.render('system/install/index', {
		title :'routerGUI · System · Install',
		header:'System Install',
		lead  :'Tell something interesting about the Install screen.',

		installed: config.database.installed
	});
};
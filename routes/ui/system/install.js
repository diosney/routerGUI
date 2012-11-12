/*
 * GET System/Tuning page.
 */
// Load configuration file.
var config = require('../../../config.json');

exports.index = function (req, res) {
	res.render('system/install/index', {
		title :'routerGUI · System · Install',
		header:'System Install',
		lead  :'Tell something interesting about the Install screen.',
		menu: 'system/install',

		installed: config.database.installed
	});
};
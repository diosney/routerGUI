/*
 * Security/Firewall page.
 */
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
	else {
		res.render('security/firewall/index', {
			title:'routerGUI · Security · Firewall',
			menu :'security/firewall'
		});
	}
};
/*
 * Services/NAT page.
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

	res.render('services/nat/index', {
		title:'routerGUI · Services · NAT',
		menu :'services/nat'
	});
};
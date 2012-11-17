/*
 * Services/IP Sets page.
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

	res.render('services/ipsets/index', {
		title:'routerGUI · Services · IP Sets',
		menu :'services/ipsets'
	});
};
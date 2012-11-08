/*
 * GET Interfaces/Devices page.
 */
exports.index = function (req, res) {
	/*
	 * Check if system is installed in order to redirect to the installation page.
	 */
	if (config.database.installed == false) {
		// System is not installed.
		res.redirect('/system/install');
	}

	res.render('interfaces/devices', {
		title :'routerGUI · Devices',
		header:'Devices',
		lead  :'Tell something interesting about the devices screen.',
		menu  :'interfaces/devices'
	});
};
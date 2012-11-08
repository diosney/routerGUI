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

	res.render('interfaces/vlans', {
		title :'routerGUI · VLANs',
		header:'VLANs',
		lead  :'Tell something interesting about the VLANs screen.',
		menu  :'interfaces/vlans'
	});
};
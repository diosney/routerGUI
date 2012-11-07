/*
 * GET System/Tuning page.
 */
exports.index = function (req, res) {
	res.render('system/tuning/index', {
		title :'routerGUI · System · Tuning',
		header:'System Tuning',
		lead  :'Tell something interesting about the Tuning screen.'
	});
};
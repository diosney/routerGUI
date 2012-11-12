/*
 * Dashboard page.
 */
/*
 * Module dependencies.
 */
var os = require('os'),
	fs = require('fs'),
	exec = require('child_process').exec,
	async = require('async'),

/*
 * Load required models.
 */
	Settings = require('../../../models/system/settings.js'),

// Load application files.
	package = require('../../../package.json'),
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
	 * Get Settings.
	 */
	var settings = {}

	Settings.findOne({
		name:'widgets_refresh_interval'
	}, function (error, doc) {
		if (!error) {
			if (doc) {
				settings.widgets_refresh_interval = doc.value;
			}
			else {
				settings.widgets_refresh_interval = 3;
			}
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
	});

	/*
	 * Initializing widgets container.
	 */
	var widgets = {
	};

	/*
	 * Widget: System Information.
	 */
	// Initialitation and simple fields.
	widgets.sys_info = {
		router_GUI_version:package.version,
		hostname          :os.hostname(),
		domain            :'',
		nameservers       :[],
		datetime          :'',
		os_type           :os.type(),
		os_arch           :os.arch(),
		os_release        :os.release(),
		installed_memory  :(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)
	};

	/*
	 * Nameservers and domain name.
	 */
// Parse lines in resolv.conf file to obtain domain and nameservers.
	var resolv_conf = fs.readFileSync('/etc/resolv.conf').toString().split('\n');

	for (line in resolv_conf) {
		// Search for system domain.
		if (resolv_conf[line].search(/search/g) != '-1') {
			widgets.sys_info.domain = resolv_conf[line].split('search ')[1];
		}
		// Search for nameservers
		if (resolv_conf[line].search(/nameserver/g) != '-1') {
			widgets.sys_info.nameservers.push(resolv_conf[line].split('nameserver ')[1]);
		}
	}

	/*
	 * Uptime.
	 */
	var current_uptime = os.uptime(),
		days = Math.floor(current_uptime / 86400),
		hours = Math.floor((current_uptime % 86400) / 3600),
		minutes = Math.floor(((current_uptime % 86400) % 3600) / 60),
		seconds = Math.floor(((current_uptime % 86400) % 3600) % 60);
	widgets.sys_info.uptime = ((days) ? days + ' days, ' : '') + ((hours) ? hours + ' hours, ' : '') + ((minutes) ? minutes + ' minutes, ' : '') + seconds + ' seconds';

	/*
	 * CPU Models and Qty.
	 */
	widgets.sys_info.cpus = [];

// Build object with usable CPU data.
	for (core in os.cpus()) {
		if (widgets.sys_info.cpus.length) {
			for (cpu in widgets.sys_info.cpus) {
				if (widgets.sys_info.cpus[cpu].model == os.cpus()[core].model) {
					widgets.sys_info.cpus[cpu].qty++;
				}
				else {
					widgets.sys_info.cpus.push({
						model:os.cpus()[core].model,
						qty  :1
					});
				}
			}
		}
		else {
			widgets.sys_info.cpus.push({
				model:os.cpus()[core].model,
				qty  :1
			});
		}
	}

	/*
	 * Widget: Resources Usage.
	 */
	widgets.res_usage = {};

	/*
	 * CPU Load.
	 */
	widgets.res_usage.cpus = [];

// Build object with usable CPU data.
	for (core in os.cpus()) {
		var total_load = os.cpus()[core].times.user + os.cpus()[core].times.nice + os.cpus()[core].times.sys + os.cpus()[core].times.idle + os.cpus()[core].times.irq;
		var cpu_usage = Math.floor(((total_load - os.cpus()[core].times.idle) / total_load) * 100);

		if (cpu_usage < 20) {
			cpu_status = 'info';
		}
		else if (cpu_usage >= 20 && cpu_usage < 40) {
			cpu_status = 'success';
		}
		else if (cpu_usage >= 40 && cpu_usage < 60) {
			cpu_status = 'warning';
		}
		else {
			cpu_status = 'danger';
		}

		widgets.res_usage.cpus.push({
			usage :cpu_usage,
			status:cpu_status
		});
	}

	/*
	 * Load average.
	 */
	widgets.res_usage.load_average = [];
	for (var i = 0; i < 3; i++) {
		widgets.res_usage.load_average.push((os.loadavg()[i]).toFixed(2));
	}

	/*
	 * Memory Load.
	 */
	widgets.res_usage.memory = {};
	var usage = Math.floor(((os.totalmem() - os.freemem()) / os.totalmem()) * 100);
	if (usage < 20) {
		widgets.res_usage.memory.status = 'info';
	}
	else if (usage >= 20 && usage < 40) {
		widgets.res_usage.memory.status = 'success';
	}
	else if (usage >= 40 && usage < 60) {
		widgets.res_usage.memory.status = 'warning';
	}
	else {
		widgets.res_usage.memory.status = 'danger';
	}
	widgets.res_usage.memory.usage = usage;

	/*
	 * SWAP.
	 */
	var proc_swap = fs.readFileSync('/proc/swaps').toString().split('\n')[1].split('\t');
	widgets.res_usage.swap = Math.floor((proc_swap[2] / proc_swap[1]) * 100);

	async.parallel({
			datetime:function (callback) {
				exec('date', function (error, stdout, stderr) {
					if (error === null) {
						callback(null, stdout.replace('\n', ''));
					}
					else {
						callback(stderr);
					}
				});
			},
			disk    :function (callback) {
				/*
				 * Disk Usage.
				 */
				widgets.res_usage.disks = [];

				exec("df -h|awk '{print  $1\"\t\"$5\"\t\"$6}'", function (error, stdout, stderr) {
					if (error === null) {
						var disks = stdout.split('\n');
						// Build object with usable Disks data.
						for (line in disks) {
							if (disks[line].split('\t')[0].search('/dev/') != '-1') {
								/*
								 * Is a valid disk device.
								 */
								var disk_usage = disks[line].split('\t')[1].split('%')[0],
									device = disks[line].split('\t')[0],
									path = disks[line].split('\t')[2];

								if (disk_usage < 20) {
									disk_status = 'info';
								}
								else if (disk_usage >= 20 && disk_usage < 60) {
									disk_status = 'success';
								}
								else if (disk_usage >= 60 && disk_usage < 80) {
									disk_status = 'warning';
								}
								else {
									disk_status = 'danger';
								}

								widgets.res_usage.disks.push({
									usage :disk_usage,
									device:device,
									status:disk_status,
									path  :path
								});
							}
						}

						callback(null, disks);
					}
					else {
						callback(stderr);
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
				widgets.sys_info.datetime = results.datetime;
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

			res.render('dashboard/index', {
				// General Vars.
				title   :'routerGUI · Dashboard',
				menu    :'dashboard',
				msg     :msg,

				/*
				 * Settings.
				 */
				settings:settings,

				// Widgets.
				widgets :widgets
			});
		});
};
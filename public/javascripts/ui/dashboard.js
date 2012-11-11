/*
 * Scripts for Dashboard elements behaviour.
 */
// Prevent name collisions wrapping the code in an anonymous function.
jQuery(function ($) {
	/*
	 * Tooltips.
	 */
	$('[rel="tooltip"]').tooltip();

	/*
	 * Auto-update on intervals the data shown.
	 */
	setInterval(function () {
		$.ajax({
			cache   :false,
			data    :{
				object:'widget'
			},
			dataType:'json',
			error   :function (a, b, c) {
				/*
				 * Show message to user.
				 */
				// Clear message dashboard.
				$('#message-dashboard').html('');

				$('.alert-error .msg-mark', '#templates-container').html(c);
				$('.alert-error', '#templates-container').clone().appendTo('#message-dashboard');
			},
			success :function (response_from_server) {
				/*
				 * Show message to user.
				 */
				// Clear message dashboard.
				$('#message-dashboard').html('');

				if (response_from_server.type === 'notification') {
					/*
					 * Update Widget: System Info.
					 */
					$('#uptime').text(response_from_server.data.widgets.sys_info.uptime);
					$('#datetime').text(response_from_server.data.widgets.sys_info.datetime);

					/*
					 * Update Widget: Resources Usage.
					 */
					// Memory load.
					$('#memory').css('width', response_from_server.data.widgets.res_usage.memory.usage + '%');
					$('#memory').closest('.progress').removeClass('progress-info progress-success progress-warning progress-danger').addClass('progress-' + response_from_server.data.widgets.res_usage.memory.status);
					$('#memory-number').text(response_from_server.data.widgets.res_usage.memory.usage + '%');

					// SWAP.
					$('#swap').css('width', response_from_server.data.widgets.res_usage.swap + '%');
					$('#swap-number').text(response_from_server.data.widgets.res_usage.swap + '%');

					// CPU load.
					for (var i = 0; i < response_from_server.data.widgets.res_usage.cpus.length; i++) {
						$('#cpu-' + i).css('width', response_from_server.data.widgets.res_usage.cpus[i].usage + '%');
						$('#cpu-' + i).closest('.progress').removeClass('progress-info progress-success progress-warning progress-danger').addClass('progress-' + response_from_server.data.widgets.res_usage.cpus[i].status);
						$('#cpu-number-' + i).text(response_from_server.data.widgets.res_usage.cpus[i].usage + '%');
					}

					// Load average.
					for (var i = 0; i < 3; i++) {
						$('#load_average-' + i).text(response_from_server.data.widgets.res_usage.load_average[i]);
					}

					// Disks usage.
					for (var i = 0; i < response_from_server.data.widgets.res_usage.cpus.length; i++) {
						$('#disk-' + i).css('width', response_from_server.data.widgets.res_usage.disks[i].usage + '%');
						$('#disk-' + i).closest('.progress').removeClass('progress-info progress-success progress-warning progress-danger').addClass('progress-' + response_from_server.data.widgets.res_usage.disks[i].status);
						$('#disk-number-' + i).text(response_from_server.data.widgets.res_usage.disks[i].usage + '%');
					}
				}
				else if (response_from_server.type == 'error') {
					/*
					 * Show message to user.
					 */
					$('.alert-error .msg-mark', '#templates-container').html(c);
					$('.alert-error', '#templates-container').clone().appendTo('#message-dashboard');
				}
			},
			type    :'GET',
			url     :'api/dashboard'
		});
	}, $('[name="widgets_refresh_interval"]').val() || 3000);
});
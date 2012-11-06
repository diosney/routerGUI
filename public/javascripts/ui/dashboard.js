/*
 * Scripts for Dashboard elements behaviour.
 */
// Prevent name collisions wrapping the code in an anonymous function.
jQuery(function ($) {
	/*
	 * Auto-update on intervals the data shown.
	 */
	setInterval(function () {
		$.ajax({
			cache   :false,
			dataType:'json',
			error   :function (a, b, c) {
				/*
				 * Show message to user.
				 */
				// Clear message dashboard.
				$('#message-dashboard').html('');

				$('.alert .msg-mark', '#templates-container').html(c);
				$('.alert', '#templates-container').clone().appendTo('#message-dashboard');
			},
			success :function (response_from_server) {
				/*
				 * Show message to user.
				 */
				// Clear message dashboard.
				$('#message-dashboard').html('');

				if (response_from_server.type === 'notification') {
					/*
					 * Update Widget: System Info..
					 */
					$('#uptime').text(response_from_server.data.widgets.sys_info.uptime);
					$('#datetime').text(response_from_server.data.widgets.sys_info.datetime);

					/*
					 * Update Widget: Resources Usage.
					 */
					// Memory load.
					$('#memory').css('width', response_from_server.data.widgets.res_usage.memory.usage + '%');
					$('#memory').closest('.progress').removeClass('progress-info progress-success progress-warning progress-danger').addClass('progress-' + response_from_server.data.widgets.res_usage.memory.status);

					$('#swap').css('width', response_from_server.data.widgets.res_usage.swap + '%');

					// CPU load.
					for (var i = 0; i < response_from_server.data.widgets.res_usage.cpus.length; i++) {
						$('#cpu-' + i).css('width', response_from_server.data.widgets.res_usage.cpus[i].usage + '%');
					}

					// Load average.
					for (var i = 0; i < 3; i++) {
						$('#load_average-' + i).text(response_from_server.data.widgets.res_usage.load_average[i]);
					}
				}
				else if (response_from_server.type == 'error') {
					/*
					 * Show message to user.
					 */
					$('.alert .msg-mark', '#templates-container').html(c);
					$('.alert', '#templates-container').clone().appendTo('#message-dashboard');
				}
			},
			type    :'GET',
			url     :'api/dashboard'
		});
	}, 3000); // TODO: Let the user configure the aut-update interval.
});
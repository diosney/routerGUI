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
	 * Function that gather the data from server.
	 */
	function gather_data() {
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

					/*
					 * Calls recursively this function to update the interval.
					 */
					setTimeout(function () {
						gather_data();
					}, 1000 * $('[name="widgets_refresh_interval"]').val());
				}
				else if (response_from_server.type == 'error') {
					/*
					 * Show message to user.
					 */
					// Clear message dashboard.
					$('#message-dashboard').html('');

					$('.alert-error .msg-mark', '#templates-container').html(c);
					$('.alert-error', '#templates-container').clone().appendTo('#message-dashboard');
				}
			},
			type    :'GET',
			url     :'api/dashboard'
		});
	}

	/*
	 * Auto-update on intervals the data shown.
	 */
	setTimeout(function () {
		gather_data();
	}, 1000 * $('[name="widgets_refresh_interval"]').val());

	/*
	 * Ajax Form. Apply Changes.
	 */
	$('.ajax-form').ajaxForm({
		beforeSubmit:function (form_data_arr, form$) {
			/*
			 * Used to disable the button and show the loader.
			 */
			$('.ajax-loader', form$).show();
			$('button[type="submit"]', form$).button('disable');
		},
		data        :{
			object:'widget'
		},
		dataType    :'json',
		error       :function (a, b, c) {
			/*
			 * Remove ajax loader and disable button.
			 */
			$('.ajax-loader').hide();
			$('button[type="submit"]').button('enable');

			/*
			 * Show message to user.
			 */
			// Clear message dashboard.
			$('#message-dashboard').html('');

			/*
			 * Close the modal dialog.
			 */
			$('#dashboard-settings').modal('hide');

			$('.alert-error .msg-mark', '#templates-container').html(c);
			$('.alert-error', '#templates-container').clone().appendTo('#message-dashboard');
		},
		success     :function (response_from_server, statusText, xhr, form$) {
			/*
			 * Remove ajax loader and show button.
			 */
			$('.ajax-loader', form$).hide();
			$('button[type="submit"]', form$).button('enable');

			/*
			 * Show message to user.
			 */
			// Clear message dashboard.
			$('#message-dashboard').html('');

			/*
			 * Close the modal dialog.
			 */
			$('#dashboard-settings').modal('hide');

			if (response_from_server.type == 'notification') {
				/*
				 * Update data.
				 */
				$('[name="widgets_refresh_interval"]').val(response_from_server.data.widgets_refresh_interval);

				/*
				 * Show server message to user.
				 */
				$('.alert-success .msg-mark', '#templates-container').html(response_from_server.message);
				$('.alert-success', '#templates-container').clone().appendTo('#message-dashboard');
			}
			else if (response_from_server.type == 'error') {
				/*
				 * Show server message to user.
				 */
				$('.alert-error .msg-mark', '#templates-container').html(response_from_server.message);
				$('.alert-error', '#templates-container').clone().appendTo('#message-dashboard');
			}
		},
		type        :'POST'
	});
});
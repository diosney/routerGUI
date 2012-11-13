// Prevent name collisions wrapping the code in an anonymous function.
jQuery(function ($) {
	/*
	 * Ajax Form.
	 */
	$('.ajax-form').ajaxForm({
		beforeSubmit:function (form_data_arr, form$) {
			/*
			 * Used to disable the button and show the loader.
			 */
			$('.ajax-loader', form$).show();
			$('button[type="submit"]', form$).button('disable');
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

			if (response_from_server.type == 'notification') {
				/*
				 * Show server message to user.
				 */
				$('.alert-success .msg-mark', '#templates-container').html(response_from_server.message);
				$('.alert-success', '#templates-container').clone().appendTo('#message-dashboard');

				/*
				 * Hides the install button to prevent issues.
				 */
				$('button[value="install"]').hide();
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
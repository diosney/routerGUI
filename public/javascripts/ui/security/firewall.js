// Prevent name collisions wrapping the code in an anonymous function.
jQuery(function ($) {
	/*
	 * Grid. Firewall Rules.
	 */
	var firewall_list_grid = $('#firewall-list-grid').jqGrid({
		altRows           :false,
		autowidth         :true,
		caption           :'Firewall Chains List',
		colModel          :[
			{
				align    :'center',
				classes  :'column_name',
				editable :true,
				editrules:{
					required:true
				},
				edittype :'text',
				index    :'name',
				name     :'name',
				search   :true,
				stype    :'text',
				sortable :false,
				width    :20
			},
			{
				align      :'center',
				classes    :'column_in_interface',
				editable   :true,
				edittype   :'select',
				editoptions:{
					dataUrl:'/api/interfaces?object=interfaces&return_type=select'
				},
				index      :'in_interface',
				name       :'in_interface',
				search     :true,
				stype      :'text',
				sortable   :false,
				width      :10
			},
			{
				align      :'center',
				classes    :'column_out_interface',
				editable   :true,
				edittype   :'select',
				editoptions:{
					dataUrl:'/api/interfaces?object=interfaces&return_type=select'
				},
				index      :'out_interface',
				name       :'out_interface',
				search     :true,
				stype      :'text',
				sortable   :false,
				width      :10
			},
			{
				align         :'left',
				classes       :'column_description',
				editable      :true,
				edittype      :'textarea',
				firstsortorder:'asc',
				index         :'description',
				name          :'description',
				search        :true,
				sortable      :false,
				stype         :'text',
				width         :40
			}
		],
		colNames          :['Name <span class="color-red">*</span>', 'In Interface', 'Out Interface', 'Description'],
		datatype          :'json',
		deselectAfterSort :false,
		emptyrecords      :'No <strong>Chains</strong> found.',
		forceFit          :true,
		gridview          :true,
		height            :'auto',
		hoverrows         :true,
		ignoreCase        :true,
		loadui            :'block',
		mtype             :'GET',
		pager             :'#firewall-list-pager',
		postData          :{
			object:'chain'
		},
		prmNames          :{
			sort :'orderby',
			order:'orderdir'
		},
		rowList           :[10, 20, 30],
		rowNum            :10,
		rownumbers        :true,
		subGrid           :true,
		subGridRowExpanded:function (subgrid_id, row_id) {
			/*
			 * Call the function that will render the grid as subgrid.
			 */
			render_subgrid(subgrid_id, row_id);
		},
		sortname          :'name',
		url               :'/api/security/firewall',
		viewrecords       :true
	}).jqGrid('navGrid', '#firewall-list-pager', {
			/*
			 * General navigation parameters.
			 */
			edit         :true,
			edittext     :'<strong>Edit</strong>',
			add          :true,
			addtext      :'<strong>Add</strong>',
			del          :true,
			deltext      :'<strong>Delete</strong>',
			search       :false,
			refresh      :true,
			refreshtext  :'<strong>Refresh</strong>',
			view         :false,
			closeOnEscape:true,
			refreshstate :'current'
		}, {
			/*
			 * EDIT Settings.
			 */
			// Handler the response from server.
			afterSubmit   :function (response, postdata) {
				// Parse the XMLHttpRequest response.
				var data = $.parseJSON(response.responseText);

				// It is a notification.
				if (data.type == 'notification') {
					return [true, data.message]; 		// [success,message,new_id]
				} else if (data.type == 'error') {
					return [false, data.message]; 		// [success,message,new_id]
				}
			},
			beforeShowForm:function () {
				$('#tr_name,#tr_in_interface,#tr_out_interface').hide();
			},
			bSubmit       :'Done',
			checkOnSubmit :false,
			closeAfterEdit:true,
			closeOnEscape :true,
			editCaption   :'Edit Chain',
			editData      :{
				object:'chain'
			},
			modal         :true,
			mtype         :'PUT',
			recreateForm  :true,
			url           :'/api/security/firewall',
			width         :'auto'
		}, {
			// ADD Settings.
			addCaption   :'Add Chain',
			addedrow     :'last',
			// Handler the response from server.
			afterSubmit  :function (response, postdata) {
				// Parse the XMLHttpRequest response.
				var data = $.parseJSON(response.responseText);

				// It is a notification.
				if (data.type == 'notification') {
					return [true, data.message]; 		// [success,message,new_id]
				} else if (data.type == 'error') {
					return [false, data.message]; 		// [success,message,new_id]
				}
			},
			bSubmit      :'Add',
			closeAfterAdd:true,
			closeOnEscape:true,
			editData     :{
				id    :'', // Replace the id added automaticaly by jqGrid.
				object:'chain'
			},
			modal        :false,
			mtype        :'POST',
			recreateForm :true,
			url          :'/api/security/firewall',
			width        :'auto'
		}, {
			// DELETE Settings.
			addCaption :'Delete Chain',
			// Handler the response from server.
			afterSubmit:function (response, postdata) {
				// Parse the XMLHttpRequest response.
				var data = $.parseJSON(response.responseText);

				// It is a notification.
				if (data.type == 'notification') {
					return [true, data.message]; 		// [success,message,new_id]
				} else if (data.type == 'error') {
					return [false, data.message]; 		// [success,message,new_id]
				}
			},
			bSubmit    :'Delete',
			delData    :{
				object:'chain'
			},
			modal      :false,
			mtype      :'DELETE',
			url        :'/api/security/firewall'
		}, {}, {}, {});

	/*
	 * Function to render the rules subgrid.
	 */
	function render_subgrid(subgrid_id, row_id) {
		/*
		 * Required data for initializing the subgrid.
		 */
		var subgrid_table_id, pager_id;
		subgrid_table_id = subgrid_id + '_t';
		pager_id = 'p_' + subgrid_table_id;

		$('#' + subgrid_id).html('<table id="' + subgrid_table_id + '" class="scroll"></table><div id="' + pager_id + '" class="scroll"></div>');

		var address_subgrid = $('#' + subgrid_table_id).jqGrid({
			altRows          :false,
			autowidth        :true,
			caption          :'',
			colModel         :[
				{
					align         :'center',
					classes       :'column_target',
					editable      :true,
					edittype      :'select',
					editoptions   :{
						value:{
							'ACCEPT':'ACCEPT',
							'DROP'  :'DROP',
							'REJECT':'REJECT',
							'RETURN':'RETURN'
						}
					},
					firstsortorder:'asc',
					index         :'target',
					name          :'target',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :10
				},
				{
					align         :'center',
					classes       :'column_order',
					editable      :true,
					edittype      :'select',
					editoptions   :{
						dataUrl:'/api/security/firewall?object=rule_order&return_type=select&chain_name=' + row_id
					},
					hidden        :true,
					firstsortorder:'asc',
					index         :'order',
					name          :'order',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :10
				},
				{
					align         :'center',
					classes       :'column_protocol',
					editable      :true,
					edittype      :'select',
					editoptions   :{
						value:{
							'all':'All',
							'tcp':'TCP',
							'udp':'UDP'
						}
					},
					firstsortorder:'asc',
					index         :'protocol',
					name          :'protocol',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :10
				},
				{
					align         :'center',
					classes       :'column_destination_ports',
					editable      :true,
					edittype      :'text',
					firstsortorder:'asc',
					index         :'destination_ports',
					name          :'destination_ports',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :15
				},
				{
					align         :'center',
					classes       :'column_source',
					editable      :true,
					edittype      :'text',
					firstsortorder:'asc',
					index         :'source',
					name          :'source',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :6
				},
				{
					align         :'center',
					classes       :'column_source_netmask',
					editable      :true,
					edittype      :'text',
					firstsortorder:'asc',
					index         :'source_netmask',
					name          :'source_netmask',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :6
				},
				{
					align         :'center',
					classes       :'column_destination',
					editable      :true,
					edittype      :'text',
					firstsortorder:'asc',
					index         :'destination',
					name          :'destination',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :10
				},
				{
					align         :'center',
					classes       :'column_destination_netmask',
					editable      :true,
					editrules     :{
						required:true
					},
					edittype      :'text',
					firstsortorder:'asc',
					index         :'destination_netmask',
					name          :'destination_netmask',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :6
				},
				{
					align         :'center',
					classes       :'column_state',
					editable      :true,
					edittype: 'select',
					editoptions: {
						dataInit: function(element) {
							if (is_edit) {
								var row_selected = $('#' + subgrid_table_id).jqGrid('getGridParam','selrow');
								var capabilities = $('#' + subgrid_table_id).jqGrid('getCell', row_selected, 'capabilities');

								if (capabilities) {
									for (capability_item in capabilities.split(',')) {
										$('option:contains(' + capabilities.split(',')[capability_item] + ')', element).attr('selected', 'selected');
									}
								}
							}
						},
						value:{
							'INVALID':'INVALID',
							'NEW':'NEW',
							'ESTABLISHED':'ESTABLISHED',
							'RELATED':'RELATED',
							'UNTRACKED':'UNTRACKED'
						},
						multiple: true
					},
					firstsortorder:'asc',
					index         :'state',
					name          :'state',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :10
				},
				{
					align         :'left',
					classes       :'column_description',
					editable      :true,
					edittype      :'textarea',
					firstsortorder:'asc',
					index         :'description',
					name          :'description',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :30
				}
			],
			colNames         :['Action', 'Rule Order', 'Protocol', 'Destination Port(s)', 'Source', 'Netmask', 'Destination', 'Netmask', 'State', 'Description'],
			datatype         :'json',
			deselectAfterSort:false,
			emptyrecords     :'There is no <strong>Firewall Rule</strong> yet.',
			forceFit         :true,
			gridview         :false,
			height           :'auto',
			hoverrows        :true,
			ignoreCase       :true,
			loadComplete     :function () {
				$('.column_target').each(function (index, element) {
					if ($(this).text() == 'ACCEPT') {
						$(this).addClass('status-positive');
					}
					else if ($(this).text() == 'RETURN') {
						$(this).addClass('status-danger');
					}
					else {
						$(this).addClass('status-negative');
					}
				});
			},
			loadui           :'block',
			mtype            :'GET',
			multiselect      :false,
			pager            :'#' + pager_id,
			postData         :{
				chain_name:row_id,
				object    :'rule'
			},
			prmNames         :{
				sort :'orderby',
				order:'orderdir'
			},
			rowList          :[10, 50, 100],
			rowNum           :10,
			rownumbers       :true,
			sortname         :'order',
			url              :'/api/security/firewall',
			viewrecords      :true
		}).jqGrid('navGrid', '#' + pager_id, {
				/*
				 * General navigation parameters.
				 */
				edit         :true,
				edittext     :'<strong>Edit</strong>',
				add          :true,
				addtext      :'<strong>Add</strong>',
				del          :true,
				deltext      :'<strong>Delete</strong>',
				search       :false,
				refresh      :true,
				refreshtext  :'<strong>Refresh</strong>',
				view         :false,
				closeOnEscape:true,
				refreshstate :'current'
			}, {
				/*
				 * EDIT Settings.
				 */
				// Handler the response from server.
				afterSubmit   :function (response, postdata) {
					// Parse the XMLHttpRequest response.
					var data = $.parseJSON(response.responseText);

					// It is a notification.
					if (data.type == 'notification') {
						return [true, data.message]; 		// [success,message,new_id]
					} else if (data.type == 'error') {
						return [false, data.message]; 		// [success,message,new_id]
					}
				},
				beforeInitData: function() {
					is_edit = true;
				},
				beforeShowForm:function (formid) {
					$('#tr_order').hide();

					$('#state').chosen();

					/*
					 * Grid fields behaviour.
					 */
					$('.FormGrid #protocol').live('change',function () {
						if ($(this).val() == 'tcp' || $(this).val() == 'udp') {
							$('#tr_destination_ports').show().removeAttr('disabled');
						}
						else {
							$('#tr_destination_ports').hide().attr('disabled', 'disabled');
						}
					}).trigger('change');

					/*
					 * Addresses fields rearrangement.
					 */
					$('#tr_source_netmask,#tr_destination_netmask').hide();
					$('#source,#destination').before('<select class="family_dropdown"><option value="inet4">IPv4</option><option value="inet6">IPv6</option></select>');

					$('.family_dropdown').live('change',function () {
						// Remove previous net_mask dropdowns.
						$(this).closest('tr').find('.net_mask_dropdown').remove();

						if ($(this).val() == 'inet6') {
							var net_mask_dropdown_dropdown = '<select class="net_mask_dropdown">'
							for (var i = 128; i > 0; i--) {
								net_mask_dropdown_dropdown += '<option value="' + i + '">' + i + '</option>';
							}
							net_mask_dropdown_dropdown += '</select>';
							$(this).next('.FormElement').after(net_mask_dropdown_dropdown);
							$(this).closest('tr').next('tr').find('.FormElement').val('128');
						}
						else {
							var net_mask_dropdown_dropdown = '<select class="net_mask_dropdown">'
							for (var i = 32; i > 0; i--) {
								net_mask_dropdown_dropdown += '<option value="' + i + '">' + i + '</option>';
							}
							net_mask_dropdown_dropdown += '</select>';
							$(this).next('.FormElement').after(net_mask_dropdown_dropdown);
							$(this).closest('tr').next('tr').find('.FormElement').val('32');
						}
					}).trigger('change');

					$('#tr_source,#tr_destination').find('.family_dropdown').attr('disabled', 'disabled');

					$('.net_mask_dropdown').live('change',function () {
						$(this).closest('tr').next('tr').find('.FormElement').val($(this).val());
					}).trigger('change');

					/*
					 * Destination Ports fields rearrangement.
					 */
					$('#destination_ports').hide();

					// Global variable.
					max_port_identifiers = 13;

					var ports_arr = $('#destination_ports').val().split(',');

					for (i in ports_arr) {
						if (ports_arr[i].search(':') == -1) {
							// Single Port.
							$('.port_selection_container', '#templates-container').clone().appendTo($('#tr_destination_ports .DataTD'));
							$('#tr_destination_ports .DataTD .port_selection_container:last').find('input[type="text"]').val(ports_arr[i]);

							$('#tr_destination_ports .DataTD .port_selection_container:last').find('select').attr('disabled', 'disabled');

							max_port_identifiers++;
						}
						else {
							// Port range.
							$('.port_selection_container', '#templates-container').clone().appendTo($('#tr_destination_ports .DataTD'));
							$('#tr_destination_ports .DataTD .port_selection_container:last').children('.range,.single').toggleClass('hidden');

							$('#tr_destination_ports .DataTD .port_selection_container:last').find('.port_range_from').val(ports_arr[i].split(':')[0]);
							$('#tr_destination_ports .DataTD .port_selection_container:last').find('.port_range_to').val(ports_arr[i].split(':')[1]);

							$('#tr_destination_ports .DataTD .port_selection_container:last').find('.port_type option[value=range]').attr('selected', 'selected');

							$('#tr_destination_ports .DataTD .port_selection_container:last').find('select').attr('disabled', 'disabled');

							max_port_identifiers += 2;
						}
					}

					$('#tr_destination_ports .DataTD .port_selection_container .btn').toggleClass('destination_port_add destination_port_del');
					$('#tr_destination_ports .DataTD .port_selection_container .btn').find('i').toggleClass('icon-plus icon-minus');
				},
				bSubmit       :'Done',
				checkOnSubmit :false,
				closeAfterEdit:true,
				closeOnEscape :true,
				// dataheight: 220,
				editCaption   :'Edit Rule',
				editData      :{
					chain_name:row_id,
					object    :'rule'                     // The id is added automaticaly by jqGrid.
				},
				modal         :true,
				mtype         :'PUT',
				recreateForm  :true,
				url           :'/api/security/firewall',
				width         :'auto'
			}, {
				/*
				 * ADD Settings.
				 */
				addCaption    :'Add Rule',
				addedrow      :'last',
				// Handler the response from server.
				afterSubmit   :function (response, postdata) {
					// Parse the XMLHttpRequest response.
					var data = $.parseJSON(response.responseText);

					// It is a notification.
					if (data.type == 'notification') {
						return [true, data.message] 		// [success,message,new_id]
					} else if (data.type == 'error') {
						return [false, data.message] 		// [success,message,new_id]
					}
				},
				beforeInitData: function() {
					is_edit = false;
				},
				beforeShowForm:function (formid) {
					$('#tr_order').show();

					$('#state').chosen();

					/*
					 * Grid fields behaviour.
					 */
					$('.FormGrid #protocol').live('change',function () {
						if ($(this).val() == 'tcp' || $(this).val() == 'udp') {
							$('#tr_destination_ports').show().removeAttr('disabled');
						}
						else {
							$('#tr_destination_ports').hide().attr('disabled', 'disabled');
						}
					}).trigger('change');

					/*
					 * Addresses fields rearrangement.
					 */
					$('#tr_source_netmask,#tr_destination_netmask').hide();
					$('#source,#destination').before('<select class="family_dropdown"><option value="inet4">IPv4</option><option value="inet6">IPv6</option></select>');

					$('.family_dropdown').live('change',function () {
						// Remove previous net_mask dropdowns.
						$(this).closest('tr').find('.net_mask_dropdown').remove();

						if ($(this).val() == 'inet6') {
							var net_mask_dropdown_dropdown = '<select class="net_mask_dropdown">'
							for (var i = 128; i > 0; i--) {
								net_mask_dropdown_dropdown += '<option value="' + i + '">' + i + '</option>';
							}
							net_mask_dropdown_dropdown += '</select>';
							$(this).next('.FormElement').after(net_mask_dropdown_dropdown);
							$(this).closest('tr').next('tr').find('.FormElement').val('128');
						}
						else {
							var net_mask_dropdown_dropdown = '<select class="net_mask_dropdown">'
							for (var i = 32; i > 0; i--) {
								net_mask_dropdown_dropdown += '<option value="' + i + '">' + i + '</option>';
							}
							net_mask_dropdown_dropdown += '</select>';
							$(this).next('.FormElement').after(net_mask_dropdown_dropdown);
							$(this).closest('tr').next('tr').find('.FormElement').val('32');
						}
					}).trigger('change');

					$('.net_mask_dropdown').live('change',function () {
						$(this).closest('tr').next('tr').find('.FormElement').val($(this).val());
					}).trigger('change');

					/*
					 * Destination Ports fields rearrangement.
					 */
					$('#destination_ports').hide();

					// Global variable.
					max_port_identifiers = 13;
					$('.port_selection_container', '#templates-container').clone().insertAfter('#destination_ports');
				},
				bSubmit       :'Add',
				closeAfterAdd :true,
				closeOnEscape :true,
				editData      :{
					object    :'rule',
					id        :'', // Replace the id added automaticaly by jqGrid.
					chain_name:row_id
				},
				modal         :false,
				mtype         :'POST',
				recreateForm  :true,
				url           :'/api/security/firewall',
				width         :'auto'
			}, {
				/*
				 * DELETE Settings.
				 */
				addCaption :'Delete Rule',
				// Handler the response from server.
				afterSubmit:function (response, postdata) {
					// Parse the XMLHttpRequest response.
					var data = $.parseJSON(response.responseText);

					// It is a notification.
					if (data.type == 'notification') {
						return [true, data.message];		// [success,message,new_id]
					} else if (data.type == 'error') {
						return [false, data.message]; 		// [success,message,new_id]
					}
				},
				bSubmit    :'Delete',
				modal      :false,
				mtype      :'DELETE',
				delData    :{
					chain_name:row_id,
					object    :'rule'
				},
				url        :'/api/security/firewall'
			}, {
			}, {}, {});
	}

	/*
	 * Firewall Rules subgrid components behaviour.
	 */
	/*
	 * Destination Ports.
	 */
	$('.port_selection_container .port_type', '#tr_destination_ports').live('change', function () {
		$('.single,.range', $(this).closest('.port_selection_container')).toggleClass('hidden');
	});

	/*
	 * Add New Port.
	 */
	$('.port_selection_container .destination_port_add', '#tr_destination_ports').live('click', function () {
		if ($(this).closest('span').hasClass('single')) {
			/*
			 * Is a Single port operation.
			 */
			if (!$(this).closest('span').find('input').val()) {
				alert('You have to fill the field to add a Port.');
			}
			else {
				$('#destination_ports').val($('#destination_ports').val() + (($('#destination_ports').val()) ? ',' : '') + $(this).closest('span').find('input').val());

				$(this).toggleClass('destination_port_add destination_port_del');
				$(this).find('i').toggleClass('icon-plus icon-minus');

				if (max_port_identifiers > 0) {
					$('.port_selection_container', '#templates-container').clone().insertAfter($(this).closest('.port_selection_container'));

					$(this).closest('.port_selection_container').find('select').attr('disabled', 'disabled');

					max_port_identifiers--;
				}
			}
		}
		else {
			/*
			 * Is a Port range operation.
			 */
			// One of the ports is empty.
			if (!$(this).closest('span').find('.port_range_from').val() || !$(this).closest('span').find('.port_range_from').val()) {
				alert('You have to fill both fields to add a Port Range.');
			}
			else {
				$('#destination_ports').val($('#destination_ports').val() + (($('#destination_ports').val()) ? ',' : '') + $(this).closest('span').find('.port_range_from').val() + ':' + $(this).closest('span').find('.port_range_to').val());

				$(this).toggleClass('destination_port_add destination_port_del');
				$(this).find('i').toggleClass('icon-plus icon-minus');

				if (max_port_identifiers > 0) {
					$('.port_selection_container', '#templates-container').clone().insertAfter($(this).closest('.port_selection_container'));
					$(this).closest('.port_selection_container').next('.port_selection_container').children('.range,.single').toggleClass('hidden');
					$(this).closest('.port_selection_container').next('.port_selection_container').find('.port_type option[value=range]').attr('selected', 'selected');

					$(this).closest('.port_selection_container').find('select').attr('disabled', 'disabled');

					max_port_identifiers -= 2;
				}
			}
		}
	});

	/*
	 * Remove Port.
	 */
	$('.port_selection_container .destination_port_del', '#tr_destination_ports').live('click', function () {
		var ports_arr = $('#destination_ports').val().split(','),
			new_ports_arr = [],
			port_to_remove = '';

		if ($(this).closest('span').hasClass('single')) {
			/*
			 * Is a Single port operation.
			 */
			port_to_remove = $(this).closest('span').find('input').val();
			max_port_identifiers++;
		}
		else {
			/*
			 * Is a Port range operation.
			 */
			port_to_remove = $(this).closest('span').find('.port_range_from').val() + ':' + $(this).closest('span').find('.port_range_to').val();
			max_port_identifiers += 2;
		}

		for (i in ports_arr) {
			if (ports_arr[i] != port_to_remove) {
				new_ports_arr.push(ports_arr[i]);
			}
		}

		$('#destination_ports').val(new_ports_arr.join(','));

		$(this).closest('.port_selection_container').remove();
	});
});
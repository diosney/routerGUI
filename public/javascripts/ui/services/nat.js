// Prevent name collisions wrapping the code in an anonymous function.
jQuery(function ($) {
	/*
	 * Grid. Source NAT.
	 */
	var nat_source_list_grid = $('#nat-source-list-grid').jqGrid({
		altRows           :false,
		autowidth         :true,
		caption           :'Source NAT Chains List',
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
				classes    :'column_interface',
				editable   :true,
				editrules  :{
					required:true
				},
				edittype   :'select',
				editoptions:{
					dataUrl:'/api/interfaces?object=interfaces&return_type=select'
				},
				index      :'interface',
				name       :'interface',
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
		colNames          :['Name <span class="color-red">*</span>', 'Out Interface <span class="color-red">*</span>', 'Description'],
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
		pager             :'#nat-source-list-pager',
		postData          :{
			object     :'chain',
			name_prefix:'snat-'
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
		url               :'/api/services/nat',
		viewrecords       :true
	}).jqGrid('navGrid', '#nat-source-list-pager', {
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
				$('#tr_name,#tr_interface').hide();
			},
			bSubmit       :'Done',
			checkOnSubmit :false,
			closeAfterEdit:true,
			closeOnEscape :true,
			editCaption   :'Edit Chain',
			editData      :{
				object     :'chain',
				name_prefix:'snat-'
			},
			modal         :true,
			mtype         :'PUT',
			recreateForm  :true,
			url           :'/api/services/nat',
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
				id         :'', // Replace the id added automaticaly by jqGrid.
				object     :'chain',
				name_prefix:'snat-'
			},
			modal        :false,
			mtype        :'POST',
			recreateForm :true,
			url          :'/api/services/nat',
			width        :'auto'
		}, {
			// DELETE Settings.
			addCaption :'Delete Table',
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
				object     :'chain',
				name_prefix:'snat-'
			},
			modal      :false,
			mtype      :'DELETE',
			url        :'/api/services/nat'
		}, {}, {}, {});

	/*
	 * Grid. Destination NAT.
	 */
	// Fix hidden grid width.
	var tab_width = $('.tab-pane').width() - 2;
	var nat_destination_list_grid = $('#nat-destination-list-grid').jqGrid({
		altRows           :false,
		autowidth         :false,
		caption           :'Destination NAT Chains List',
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
				classes    :'column_interface',
				editable   :true,
				editrules  :{
					required:true
				},
				edittype   :'select',
				editoptions:{
					dataUrl:'/api/interfaces?object=interfaces&return_type=select'
				},
				index      :'interface',
				name       :'interface',
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
		colNames          :['Name <span class="color-red">*</span>', 'In Interface <span class="color-red">*</span>', 'Description'],
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
		pager             :'#nat-destination-list-pager',
		postData          :{
			object     :'chain',
			name_prefix:'dnat-'
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
		url               :'/api/services/nat',
		viewrecords       :true,
		width             :tab_width
	}).jqGrid('navGrid', '#nat-destination-list-pager', {
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
				$('#tr_name,#tr_interface').hide();
			},
			bSubmit       :'Done',
			checkOnSubmit :false,
			closeAfterEdit:true,
			closeOnEscape :true,
			editCaption   :'Edit Chain',
			editData      :{
				object     :'chain',
				name_prefix:'dnat-'
			},
			modal         :true,
			mtype         :'PUT',
			recreateForm  :true,
			url           :'/api/services/nat',
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
				id         :'', // Replace the id added automaticaly by jqGrid.
				object     :'chain',
				name_prefix:'dnat-'
			},
			modal        :false,
			mtype        :'POST',
			recreateForm :true,
			url          :'/api/services/nat',
			width        :'auto'
		}, {
			// DELETE Settings.
			addCaption :'Delete Table',
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
				object     :'chain',
				name_prefix:'dnat-'
			},
			modal      :false,
			mtype      :'DELETE',
			url        :'/api/services/nat'
		}, {}, {}, {});

	/*
	 * Function to render the NAT rules subgrid.
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
					classes       :'column_order',
					editable      :true,
					edittype      :'select',
					editoptions   :{
						dataUrl:'/api/services/nat?object=rule_order&return_type=select&chain_name=' + row_id
					},
					firstsortorder:'asc',
					hidden        :true,
					index         :'order',
					name          :'order',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :6
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
					width         :6
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
					width         :12
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
					width         :8
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
					width         :5
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
					width         :5
				},
				{
					align         :'center',
					classes       :'column_to_nat',
					editable      :true,
					edittype      :'text',
					firstsortorder:'asc',
					index         :'to_nat',
					name          :'to_nat',
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
					width         :20
				}
			],
			colNames         :['Order', 'Protocol', 'Destination Port(s)', 'Source', 'Netmask', 'Destination', 'Netmask', 'To NAT', 'Description'],
			datatype         :'json',
			deselectAfterSort:false,
			emptyrecords     :'There is no <strong>NAT Rule</strong> yet.',
			forceFit         :true,
			gridview         :false,
			height           :'auto',
			hoverrows        :true,
			ignoreCase       :true,
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
			url              :'/api/services/nat',
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
				beforeShowForm:function (formid) {
					$('#tr_order').hide();

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

					/*
					 * To NAT field building.
					 */
					$('.to_nat_selection_container', '#templates-container').clone().insertAfter('#to_nat');

					var str_to_parse = $('#to_nat').val();

					if (str_to_parse.search(':') != -1) {
						// Has ports added.
						var ips = str_to_parse.split(':')[0],
							ports = str_to_parse.split(':')[1];

						if (ips.search('-') != -1) {
							// Is an IP range.
							$('#tr_to_nat .to_nat_selection_container').find('.ip_range_from').val(ips.split('-')[0]);
							$('#tr_to_nat .to_nat_selection_container').find('.ip_range_to').val(ips.split('-')[1]);

							$('#tr_to_nat .to_nat_selection_container').find('.ip_type option[value="ip_range"]').attr('selected', 'selected').trigger('change');
						}
						else {
							// Is a single IP.
							$('#tr_to_nat .to_nat_selection_container').find('.ip_single input').val(ips);

							$('#tr_to_nat .to_nat_selection_container').find('.ip_type option[value="ip_single"]').attr('selected', 'selected').trigger('change');
						}

						if (ports.search('-') != -1) {
							// Is a Port range.
							$('#tr_to_nat .to_nat_selection_container').find('.port_range_from').val(ports.split('-')[0]);
							$('#tr_to_nat .to_nat_selection_container').find('.port_range_to').val(ports.split('-')[1]);

							$('#tr_to_nat .to_nat_selection_container').find('.port_type option[value="port_range"]').attr('selected', 'selected').trigger('change');
						}
						else {
							// Is a single Port.
							$('#tr_to_nat .to_nat_selection_container').find('.port_single input').val(ports);

							$('#tr_to_nat .to_nat_selection_container').find('.port_type option[value="port_single"]').attr('selected', 'selected').trigger('change');
						}
					}
					else {
						// Only have IPs.
						if (str_to_parse.search('-') != -1) {
							// Is an IP range.
							$('#tr_to_nat .to_nat_selection_container').find('.ip_range_from').val(str_to_parse.split('-')[0]);
							$('#tr_to_nat .to_nat_selection_container').find('.ip_range_to').val(str_to_parse.split('-')[1]);

							$('#tr_to_nat .to_nat_selection_container').find('.ip_type option[value="ip_range"]').attr('selected', 'selected').trigger('change');
						}
						else {
							// Is a single IP.
							$('#tr_to_nat .to_nat_selection_container').find('.ip_single input').val(str_to_parse);

							$('#tr_to_nat .to_nat_selection_container').find('.ip_type option[value="ip_single"]').attr('selected', 'selected').trigger('change');
						}
					}

					$('#to_nat').hide();
				},
				beforeSubmit  :function () {
					if ($('#tr_to_nat .to_nat_selection_container').find('.ip_type').val() == 'ip_single' && !$('#tr_to_nat .to_nat_selection_container').find('.ip_single input').val()) {
						return[false, 'You have to fill the field to add an IP.'];
					}

					if ($('#tr_to_nat .to_nat_selection_container').find('.ip_type').val() == 'ip_range' && (!$('#tr_to_nat .to_nat_selection_container').find('.ip_range_from').val() || !$('#tr_to_nat .to_nat_selection_container').find('.ip_range_from').val())) {
						return[false, 'You have to fill both fields to add an IP Range.'];
					}

					if ($('#tr_to_nat .to_nat_selection_container').find('.port_type').val() == 'port_single' && !$('#tr_to_nat .to_nat_selection_container').find('.port_single input').val()) {
						return[false, 'You have to fill the field to add a Port.'];
					}

					if ($('#tr_to_nat .to_nat_selection_container').find('.port_type').val() == 'port_range' && (!$('#tr_to_nat .to_nat_selection_container').find('.port_range_from').val() || !$('#tr_to_nat .to_nat_selection_container').find('.port_range_from').val())) {
						return[false, 'You have to fill both fields to add a Port Range.'];
					}

					return [true, ''];
				},
				onclickSubmit :function (params, posdata) {
					/*
					 * To NAT field building.
					 */
					var str_to_ins = '';

					/*
					 * IP checking.
					 */
					if ($('#tr_to_nat .to_nat_selection_container').find('.ip_type').val() == 'ip_single') {
						/*
						 * Is a Single port operation.
						 */
						str_to_ins += $('#tr_to_nat .to_nat_selection_container').find('.ip_single input').val();
					}
					else if ($('#tr_to_nat .to_nat_selection_container').find('.ip_type').val() == 'ip_range') {
						/*
						 * Is a Port range operation.
						 */
						str_to_ins += $('#tr_to_nat .to_nat_selection_container').find('.ip_range_from').val() + '-' + $('#tr_to_nat .to_nat_selection_container').find('.ip_range_to').val();
					}

					/*
					 * Port checking.
					 */
					if ($('#tr_to_nat .to_nat_selection_container').find('.port_type').val() == 'port_single') {
						/*
						 * Is a Single port operation.
						 */
						str_to_ins += ':' + $('#tr_to_nat .to_nat_selection_container').find('.port_single input').val();
					}
					else if ($('#tr_to_nat .to_nat_selection_container').find('.port_type').val() == 'port_range') {
						/*
						 * Is a Port range operation.
						 */
						str_to_ins += ':' + $('#tr_to_nat .to_nat_selection_container').find('.port_range_from').val() + '-' + $('#tr_to_nat .to_nat_selection_container').find('.port_range_to').val();
					}

					$('#to_nat').val(str_to_ins);

					return {
						to_nat:str_to_ins
					};
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
				url           :'/api/services/nat',
				width         :410
			}, {
				/*
				 * ADD Settings.
				 */
				addCaption    :'Add NAT Rule',
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
				beforeShowForm:function (formid) {
					$('#tr_order').show();

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

					$('.to_nat_selection_container', '#templates-container').clone().insertAfter('#to_nat');

					$('#to_nat').hide();
				},
				beforeSubmit  :function () {
					if ($('#tr_to_nat .to_nat_selection_container').find('.ip_type').val() == 'ip_single' && !$('#tr_to_nat .to_nat_selection_container').find('.ip_single input').val()) {
						return[false, 'You have to fill the field to add an IP.'];
					}

					if ($('#tr_to_nat .to_nat_selection_container').find('.ip_type').val() == 'ip_range' && (!$('#tr_to_nat .to_nat_selection_container').find('.ip_range_from').val() || !$('#tr_to_nat .to_nat_selection_container').find('.ip_range_from').val())) {
						return[false, 'You have to fill both fields to add an IP Range.'];
					}

					if ($('#tr_to_nat .to_nat_selection_container').find('.port_type').val() == 'port_single' && !$('#tr_to_nat .to_nat_selection_container').find('.port_single input').val()) {
						return[false, 'You have to fill the field to add a Port.'];
					}

					if ($('#tr_to_nat .to_nat_selection_container').find('.port_type').val() == 'port_range' && (!$('#tr_to_nat .to_nat_selection_container').find('.port_range_from').val() || !$('#tr_to_nat .to_nat_selection_container').find('.port_range_from').val())) {
						return[false, 'You have to fill both fields to add a Port Range.'];
					}

					return [true, ''];
				},
				onclickSubmit :function (params, posdata) {
					/*
					 * To NAT field building.
					 */
					var str_to_ins = '';

					/*
					 * IP checking.
					 */
					if ($('#tr_to_nat .to_nat_selection_container').find('.ip_type').val() == 'ip_single') {
						/*
						 * Is a Single port operation.
						 */
						str_to_ins += $('#tr_to_nat .to_nat_selection_container').find('.ip_single input').val();
					}
					else if ($('#tr_to_nat .to_nat_selection_container').find('.ip_type').val() == 'ip_range') {
						/*
						 * Is a Port range operation.
						 */
						str_to_ins += $('#tr_to_nat .to_nat_selection_container').find('.ip_range_from').val() + '-' + $('#tr_to_nat .to_nat_selection_container').find('.ip_range_to').val();
					}

					/*
					 * Port checking.
					 */
					if ($('#tr_to_nat .to_nat_selection_container').find('.port_type').val() == 'port_single') {
						/*
						 * Is a Single port operation.
						 */
						str_to_ins += ':' + $('#tr_to_nat .to_nat_selection_container').find('.port_single input').val();
					}
					else if ($('#tr_to_nat .to_nat_selection_container').find('.port_type').val() == 'port_range') {
						/*
						 * Is a Port range operation.
						 */
						str_to_ins += ':' + $('#tr_to_nat .to_nat_selection_container').find('.port_range_from').val() + '-' + $('#tr_to_nat .to_nat_selection_container').find('.port_range_to').val();
					}

					$('#to_nat').val(str_to_ins);

					return {
						to_nat:str_to_ins
					};
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
				url           :'/api/services/nat',
				width         :410
			}, {
				/*
				 * DELETE Settings.
				 */
				addCaption :'Delete NAT Rule',
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
				url        :'/api/services/nat'
			}, {
			}, {}, {});
	}

	/*
	 * NAT Rules subgrid components behaviour.
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

	/*
	 * To NAT.
	 */
	$('.to_nat_selection_container select', '#tr_to_nat').live('change', function () {
		if ($(this).val() == 'ip_single') {
			$('.ip_range', $(this).closest('.to_nat_selection_container')).addClass('hidden');
			$('.ip_single', $(this).closest('.to_nat_selection_container')).removeClass('hidden');
		}
		else if ($(this).val() == 'ip_range') {
			$('.ip_single', $(this).closest('.to_nat_selection_container')).addClass('hidden');
			$('.ip_range', $(this).closest('.to_nat_selection_container')).removeClass('hidden');
		}

		if ($(this).val() == 'port_all') {
			$('.port_single,.port_range', $(this).closest('.to_nat_selection_container')).addClass('hidden');
		}
		else if ($(this).val() == 'port_single') {
			$('.port_range', $(this).closest('.to_nat_selection_container')).addClass('hidden');
			$('.port_single', $(this).closest('.to_nat_selection_container')).removeClass('hidden');
		}
		else if ($(this).val() == 'port_range') {
			$('.port_single', $(this).closest('.to_nat_selection_container')).addClass('hidden');
			$('.port_range', $(this).closest('.to_nat_selection_container')).removeClass('hidden');
		}
	});
});
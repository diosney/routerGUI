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
					dataUrl:'/api/interfaces/devices?object=device&return_type=select'
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
					dataUrl:'/api/interfaces/devices?object=device&return_type=select'
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
					classes       :'column_destination_port',
					editable      :true,
					edittype      :'text',
					firstsortorder:'asc',
					formoptions   :{
						elmsuffix:'<br><span class="field-description">Syntax: port[,port|,port:port] <br>Ex: 80,443,1000:4500,5000,6000:7000 <br>Enter up to 15 identifiers.</span>'
					},
					index         :'destination_port',
					name          :'destination_port',
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
					index         :'net_mask',
					name          :'net_mask',
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
					classes       :'column_source_netmask',
					editable      :true,
					editrules     :{
						required:true
					},
					edittype      :'text',
					firstsortorder:'asc',
					index         :'net_mask',
					name          :'net_mask',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :6
				},
				{
					align         :'center',
					classes       :'column_state',
					editable      :true,
					edittype      :'text',
					firstsortorder:'asc',
					formoptions   :{
						elmsuffix:'<br><span class="field-description">Comma separated values of any of:<br>INVALID<br>ESTABLISHED<br>NEW<br>RELATED<br>UNTRACKED.</span>'
					},
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
				beforeShowForm:function (formid) {
					$('#tr_order').hide();

					/*
					 * Grid fields behaviour.
					 */
					$('.FormGrid #protocol').live('change',function () {
						if ($(this).val() == 'tcp' || $(this).val() == 'udp') {
							$('#tr_destination_port').show().removeAttr('disabled');
						}
						else {
							$('#tr_destination_port').hide().attr('disabled', 'disabled');
						}
					}).trigger('change');
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
				beforeShowForm:function (formid) {
					/*
					 * Grid fields behaviour.
					 */
					$('.FormGrid #protocol').live('change',function () {
						if ($(this).val() == 'tcp' || $(this).val() == 'udp') {
							$('#tr_destination_port').show().removeAttr('disabled');
						}
						else {
							$('#tr_destination_port').hide().attr('disabled', 'disabled');
						}
					}).trigger('change');
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
});
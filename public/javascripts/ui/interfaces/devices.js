/*
 * Scripts for Interfaces/Devices elements behaviour.
 */
// Prevent name collisions wrapping the code in an anonymous function.
jQuery(function ($) {
	/*
	 * Grid. Devices.
	 */
	var devices_list_grid = $('#devices-list-grid').jqGrid({
		afterInsertRow    :function (rowid, rowdata) {
			if (rowdata.status == 'UP') {
				$('#devices-list-grid').jqGrid('setCell', rowid, 'status', '', 'status-positive');
			}
			else {
				$('#devices-list-grid').jqGrid('setCell', rowid, 'status', '', 'status-negative');
			}
		},
		altRows           :false,
		autowidth         :true,
		caption           :'Devices List',
		colModel          :[
			{
				align         :'center',
				classes       :'column_status',
				editable      :true,
				edittype      :'select',
				editoptions   :{
					value:{
						'DOWN':'DOWN',
						'UP'  :'UP'
					}
				},
				firstsortorder:'asc',
				index         :'status',
				name          :'status',
				search        :true,
				sortable      :true,
				stype         :'text',
				width         :10
			},
			{
				align   :'center',
				classes :'column_identifier',
				editable:false,
				index   :'identifier',
				name    :'identifier',
				search  :true,
				stype   :'text',
				sortable:true,
				width   :10
			},
			{
				align         :'center',
				classes       :'column_MTU',
				editable      :true,
				edittype      :'text',
				firstsortorder:'asc',
				index         :'MTU',
				name          :'MTU',
				search        :true,
				sortable      :true,
				stype         :'text',
				width         :10
			},
			{
				align         :'center',
				classes       :'column_MAC',
				editable      :true,
				edittype      :'text',
				firstsortorder:'asc',
				index         :'MAC',
				name          :'MAC',
				search        :true,
				sortable      :true,
				stype         :'text',
				width         :20
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
				sortable      :true,
				stype         :'text',
				width         :30
			}
		],
		colNames          :['Status', 'Identifier', 'MTU', 'MAC', 'Description'],
		datatype          :'json',
		deselectAfterSort :false,
		emptyrecords      :'No <strong>Devices</strong> found.',
		forceFit          :true,
		gridview          :false,
		height            :'auto',
		hoverrows         :true,
		ignoreCase        :true,
		loadui            :'block',
		mtype             :'GET',
		pager             :'#devices-list-pager',
		postData          :{
			object:'device'
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
		sortname          :'identifier',
		url               :'/api/interfaces/devices',
		viewrecords       :true
	}).jqGrid('navGrid', '#devices-list-pager', {
			/*
			 * General navigation parameters.
			 */
			edit         :true,
			edittext     :'<strong>Edit</strong>',
			add          :false,
			del          :false,
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
			bSubmit       :'Done',
			checkOnSubmit :false,
			closeAfterEdit:true,
			closeOnEscape :true,
			dataheight    :180,
			editCaption   :'Edit Device',
			editData      :{
				object:'device'
			},
			modal         :true,
			mtype         :'PUT',
			recreateForm  :true,
			url           :'/api/interfaces/devices',
			width         :400
		}, {
			// ADD Settings.
			addCaption   :'Add Device',
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
			dataheight   :180,
			editData     :{
				id    :'', // Replace the id added automaticaly by jqGrid.
				object:'device'
			},
			modal        :false,
			mtype        :'POST',
			recreateForm :true,
			url          :'/api/interfaces/devices',
			width        :400
		}, {}, {}, {}, {});

	/*
	 * Function to render the Address subgrid.
	 */
	function render_subgrid(subgrid_id, row_id) {
		/*
		 * Required data for initializing the subgrid.
		 */
		var subgrid_table_id, pager_id;
		subgrid_table_id = subgrid_id + '_t';
		pager_id = 'p_' + subgrid_table_id;

		$('#' + subgrid_id).html('<table id="' + subgrid_table_id + '" class="scroll"></table><div id="' + pager_id + '" class="scroll"></div>');

		// For detecting is the form viewed is for Add or Edit.
		var in_edit;
		var vlans_subgrid = $('#' + subgrid_table_id).jqGrid({
			altRows          :false,
			autowidth        :true,
			caption          :'Address list for device ' + row_id,
			colModel         :[
				{
					align         :'center',
					classes       :'column_family',
					editable      :true,
					edittype      :'select',
					editoptions   :{
						value:{
							'inet' :'Inet',
							'inet6':'Inet6'
						}
					},
					firstsortorder:'asc',
					index         :'family',
					name          :'family',
					search        :true,
					sortable      :true,
					stype         :'text',
					width         :10
				},
				{
					align         :'center',
					classes       :'column_scope',
					editable      :true,
					edittype      :'select',
					editoptions   :{
						value:{
							'global':'Global',
							'site'  :'Site',
							'link'  :'Link',
							'host'  :'Host'
						}
					},
					firstsortorder:'asc',
					index         :'scope',
					name          :'scope',
					search        :true,
					sortable      :true,
					stype         :'text',
					width         :20
				},
				{
					align         :'center',
					classes       :'column_address',
					editable      :true,
					edittype      :'text',
					firstsortorder:'asc',
					index         :'address',
					name          :'address',
					search        :true,
					sortable      :true,
					stype         :'text',
					width         :20
				},
				{
					align         :'center',
					classes       :'column_net_mask',
					editable      :true,
					edittype      :'text',
					firstsortorder:'asc',
					index         :'net_mask',
					name          :'net_mask',
					search        :true,
					sortable      :true,
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
					sortable      :true,
					stype         :'text',
					width         :30
				}
			],
			colNames         :['Family', 'Scope', 'Address', 'Netmask', 'Description'],
			datatype         :'json',
			deselectAfterSort:false,
			emptyrecords     :'There is no Address yet.',
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
				device_id:row_id,
				object   :'address'
			},
			prmNames         :{
				sort :'orderby',
				order:'orderdir'
			},
			rowList          :[10, 50, 100],
			rowNum           :10,
			rownumbers       :true,
			sortname         :'tag',
			url              :'/api/interfaces/devices',
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
				beforeShowForm:function () {
					$('#tr_family, #tr_scope, #tr_address, #tr_net_mask').hide();
				},
				bSubmit       :'Done',
				checkOnSubmit :false,
				closeAfterEdit:true,
				closeOnEscape :true,
				// dataheight: 220,
				editCaption   :'Edit Address',
				editData      :{
					device_id:row_id,
					object   :'address'                     // The id is added automaticaly by jqGrid.
				},
				modal         :true,
				mtype         :'PUT',
				recreateForm  :true,
				url           :'/api/interfaces/devices',
				width         :'auto'
			}, {
				/*
				 * ADD Settings.
				 */
				addCaption   :'Add Address',
				addedrow     :'last',
				// Handler the response from server.
				afterSubmit  :function (response, postdata) {
					// Parse the XMLHttpRequest response.
					var data = $.parseJSON(response.responseText);

					// It is a notification.
					if (data.type == 'notification') {
						return [true, data.message] 		// [success,message,new_id]
					} else if (data.type == 'error') {
						return [false, data.message] 		// [success,message,new_id]
					}
				},
				bSubmit      :'Add',
				closeAfterAdd:true,
				closeOnEscape:true,
				// dataheight: 220,
				editData     :{
					object   :'address',
					id       :'', // Replace the id added automaticaly by jqGrid.
					device_id:row_id
				},
				modal        :false,
				mtype        :'POST',
				recreateForm :true,
				url          :'/api/interfaces/devices',
				width        :'auto'
			}, {
				/*
				 * DELETE Settings.
				 */
				addCaption :'Delete Address',
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
				mtype      :'POST',
				delData    :{
					device_id:row_id,
					object   :'address'
				},
				url        :'/api/interfaces/devices'
			}, {
			}, {}, {});
	}
});
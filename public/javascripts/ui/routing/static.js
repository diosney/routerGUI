// Prevent name collisions wrapping the code in an anonymous function.
jQuery(function ($) {
	/*
	 * Grid. Routing Rules.
	 */
	var rules_list_grid = $('#rules-list-grid').jqGrid({
		altRows          :false,
		autowidth        :true,
		caption          :'Rules List',
		colModel         :[
			{
				align         :'center',
				classes       :'column_type',
				editable      :false,
				edittype      :'select',
				editoptions   :{
					value:{
						'unicast':'Unicast'
					}
				},
				firstsortorder:'asc',
				hidden        :true,
				index         :'type',
				name          :'type',
				search        :true,
				sortable      :false,
				stype         :'text',
				width         :8
			},
			{
				align         :'center',
				classes       :'column_priority',
				editable      :true,
				editrules     :{
					required:true
				},
				edittype      :'text',
				firstsortorder:'asc',
				index         :'priority',
				name          :'priority',
				search        :true,
				sortable      :false,
				stype         :'text',
				width         :8
			},
			{
				align   :'center',
				classes :'column_from',
				editable:true,
				index   :'from',
				name    :'from',
				search  :true,
				stype   :'text',
				sortable:false,
				width   :10
			},
			{
				align         :'center',
				classes       :'column_from_net_mask',
				editable      :true,
				edittype      :'text',
				firstsortorder:'asc',
				index         :'from_net_mask',
				name          :'from_net_mask',
				search        :true,
				sortable      :false,
				stype         :'text',
				width         :10
			},
			{
				align   :'center',
				classes :'column_to',
				editable:true,
				index   :'to',
				name    :'to',
				search  :true,
				stype   :'text',
				sortable:false,
				width   :10
			},
			{
				align         :'center',
				classes       :'column_to_net_mask',
				editable      :true,
				edittype      :'text',
				firstsortorder:'asc',
				index         :'to_net_mask',
				name          :'to_net_mask',
				search        :true,
				sortable      :false,
				stype         :'text',
				width         :10
			},
			{
				align         :'center',
				classes       :'column_iif',
				editable      :true,
				editoptions   :{
					dataUrl:'/api/interfaces/devices?object=device&return_type=select'
				},
				edittype      :'select',
				firstsortorder:'asc',
				index         :'iif',
				name          :'iif',
				search        :true,
				sortable      :false,
				stype         :'text',
				width         :10
			},
			{
				align         :'center',
				classes       :'column_table',
				editable      :true,
				editrules     :{
					required:true
				},
				edittype      :'select',
				editoptions   :{
					dataUrl:'/api/routing/static?object=table&return_type=select'
				},
				firstsortorder:'asc',
				index         :'table',
				name          :'table',
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
		colNames         :['Type', 'Priority <span class="color-red">*</span>', 'From', 'From Netmask', 'To', 'To Netmask', 'In Interface', 'Table <span class="color-red">*</span>', 'Description'],
		datatype         :'json',
		deselectAfterSort:false,
		emptyrecords     :'No <strong>Devices</strong> found.',
		forceFit         :true,
		gridview         :true,
		height           :'auto',
		hoverrows        :true,
		ignoreCase       :true,
		loadui           :'block',
		mtype            :'GET',
		pager            :'#rules-list-pager',
		postData         :{
			object:'rule'
		},
		prmNames         :{
			sort :'orderby',
			order:'orderdir'
		},
		rowList          :[10, 20, 30],
		rowNum           :10,
		rownumbers       :true,
		sortname         :'priority',
		url              :'/api/routing/static',
		viewrecords      :true
	}).jqGrid('navGrid', '#rules-list-pager', {
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
			bSubmit       :'Done',
			beforeShowForm:function () {
				$('#tr_priority, #tr_table, #tr_from, #tr_from_net_mask, #tr_to, #tr_to_net_mask, #tr_iif').hide();
			},
			checkOnSubmit :false,
			closeAfterEdit:true,
			closeOnEscape :true,
			editCaption   :'Edit Rule',
			editData      :{
				object:'rule'
			},
			modal         :true,
			mtype         :'PUT',
			recreateForm  :true,
			url           :'/api/routing/static',
			width         :'auto'
		}, {
			// ADD Settings.
			addCaption   :'Add Rule',
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
				object:'rule'
			},
			modal        :false,
			mtype        :'POST',
			recreateForm :true,
			url          :'/api/routing/static',
			width        :'auto'
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
				object:'rule'
			},
			url        :'/api/routing/static'
		}, {}, {}, {});

	// Fix hidden grid width.
	var tab_width = $('.tab-pane').width() - 2;
	var tables_list_grid = $('#tables-list-grid').jqGrid({
		altRows           :false,
		autowidth         :false,
		caption           :'Tables List',
		colModel          :[
			{
				align         :'center',
				classes       :'column_table_id',
				editable      :true,
				edittype      :'text',
				editrules     :{
					required:true
				},
				firstsortorder:'asc',
				hidden        :true,
				index         :'table_id',
				name          :'table_id',
				search        :true,
				sortable      :false,
				stype         :'text',
				width         :5
			},
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
				width    :10
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
		colNames          :['Id <span class="color-red">*</span>', 'Name <span class="color-red">*</span>', 'Description'],
		datatype          :'json',
		deselectAfterSort :false,
		emptyrecords      :'No <strong>Tables</strong> found.',
		forceFit          :true,
		gridview          :true,
		height            :'auto',
		hoverrows         :true,
		ignoreCase        :true,
		loadui            :'block',
		mtype             :'GET',
		pager             :'#tables-list-pager',
		postData          :{
			object:'table'
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
		url               :'/api/routing/static',
		viewrecords       :true,
		width             :tab_width
	}).jqGrid('navGrid', '#tables-list-pager', {
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
				$('#tr_table_id').hide();
			},
			bSubmit       :'Done',
			checkOnSubmit :false,
			closeAfterEdit:true,
			closeOnEscape :true,
			editCaption   :'Edit Table',
			editData      :{
				object:'table'
			},
			modal         :true,
			mtype         :'PUT',
			recreateForm  :true,
			url           :'/api/routing/static',
			width         :'auto'
		}, {
			// ADD Settings.
			addCaption    :'Add Table',
			addedrow      :'last',
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
				$('#tr_table_id').show();
			},
			bSubmit       :'Add',
			closeAfterAdd :true,
			closeOnEscape :true,
			editData      :{
				id    :'', // Replace the id added automaticaly by jqGrid.
				object:'table'
			},
			modal         :false,
			mtype         :'POST',
			recreateForm  :true,
			url           :'/api/routing/static',
			width         :'auto'
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
				object:'table'
			},
			modal      :false,
			mtype      :'DELETE',
			url        :'/api/routing/static'
		}, {}, {}, {});

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

		var address_subgrid = $('#' + subgrid_table_id).jqGrid({
			altRows          :false,
			autowidth        :true,
			caption          :'',
			colModel         :[
				{
					align         :'center',
					classes       :'column_type',
					editable      :true,
					edittype      :'select',
					editoptions   :{
						value:{
							'unicast':'Unicast'
						}
					},
					firstsortorder:'asc',
					hidden        :true,
					index         :'type',
					name          :'type',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :10
				},
				{
					align         :'center',
					classes       :'column_to',
					editable      :true,
					edittype      :'text',
					editrules     :{
						required:true
					},
					firstsortorder:'asc',
					index         :'to',
					name          :'to',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :11
				},
				{
					align         :'center',
					classes       :'column_to_net_mask',
					editable      :true,
					editrules     :{
						required:true
					},
					edittype      :'text',
					firstsortorder:'asc',
					index         :'to_net_mask',
					name          :'to_net_mask',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :7
				},
				{
					align         :'center',
					classes       :'column_via',
					editable      :true,
					editrules     :{
						required:true
					},
					edittype      :'text',
					firstsortorder:'asc',
					index         :'via',
					name          :'via',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :11
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
			colNames         :['Type', 'To <span class="color-red">*</span>', 'To Netmask <span class="color-red">*</span>', 'Via <span class="color-red">*</span>', 'Description'],
			datatype         :'json',
			deselectAfterSort:false,
			emptyrecords     :'There is no <strong>Route</strong> yet.',
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
				table :row_id,
				object:'route'
			},
			prmNames         :{
				sort :'orderby',
				order:'orderdir'
			},
			rowList          :[10, 50, 100],
			rowNum           :10,
			rownumbers       :true,
			sortname         :'to',
			url              :'/api/routing/static',
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
				bSubmit       :'Done',
				checkOnSubmit :false,
				closeAfterEdit:true,
				closeOnEscape :true,
				editCaption   :'Edit Route',
				editData      :{
					table :row_id,
					object:'route'                     // The id is added automaticaly by jqGrid.
				},
				modal         :true,
				mtype         :'PUT',
				recreateForm  :true,
				url           :'/api/routing/static',
				width         :'auto'
			}, {
				/*
				 * ADD Settings.
				 */
				addCaption   :'Add Route',
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
				editData     :{
					object:'route',
					id    :'', // Replace the id added automaticaly by jqGrid.
					table :row_id
				},
				modal        :false,
				mtype        :'POST',
				recreateForm :true,
				url          :'/api/routing/static',
				width        :'auto'
			}, {
				/*
				 * DELETE Settings.
				 */
				addCaption :'Delete Route',
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
					table :row_id,
					object:'route'
				},
				url        :'/api/routing/static'
			}, {
			}, {}, {});
	}
});
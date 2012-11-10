/*
 * Scripts for Services/IPSets elements behaviour.
 */
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
				sortable      :true,
				stype         :'text',
				width         :8
			},
			{
				align         :'center',
				classes       :'column_priority',
				editable      :true,
				edittype      :'text',
				firstsortorder:'asc',
				index         :'priority',
				name          :'priority',
				search        :true,
				sortable      :true,
				stype         :'text',
				width         :8
			},
			{
				align         :'center',
				classes       :'column_table',
				editable      :true,
				edittype      :'text',
				firstsortorder:'asc',
				index         :'table',
				name          :'table',
				search        :true,
				sortable      :true,
				stype         :'text',
				width         :10
			},
			{
				align   :'center',
				classes :'column_from',
				editable:true,
				index   :'from',
				name    :'from',
				search  :true,
				stype   :'text',
				sortable:true,
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
				sortable      :true,
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
				sortable:true,
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
				sortable      :true,
				stype         :'text',
				width         :10
			},
			{
				align         :'center',
				classes       :'column_iif',
				editable      :true,
				edittype      :'text',
				firstsortorder:'asc',
				index         :'iif',
				name          :'iif',
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
		colNames         :['Type', 'Priority', 'Table', 'From', 'From Netmask', 'To', 'To Netmask', 'In Interface', 'Description'],
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
			dataheight    :180,
			editCaption   :'Edit Rule',
			editData      :{
				object:'rule'
			},
			modal         :true,
			mtype         :'PUT',
			recreateForm  :true,
			url           :'/api/routing/static',
			width         :400
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
			dataheight   :180,
			editData     :{
				id    :'', // Replace the id added automaticaly by jqGrid.
				object:'rule'
			},
			modal        :false,
			mtype        :'POST',
			recreateForm :true,
			url          :'/api/routing/static',
			width        :400
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
});
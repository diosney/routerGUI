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
					dataUrl:'/api/interfaces/devices?object=device&return_type=select'
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
			object:'chain',
			type  :'source'
		},
		prmNames          :{
			sort :'orderby',
			order:'orderdir'
		},
		rowList           :[10, 20, 30],
		rowNum            :10,
		rownumbers        :true,
		subGrid           :false,
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
				object:'chain',
				type  :'source'
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
				id    :'', // Replace the id added automaticaly by jqGrid.
				object:'chain',
				type  :'source'
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
				object:'chain',
				type  :'source'
			},
			modal      :false,
			mtype      :'DELETE',
			url        :'/api/services/nat'
		}, {}, {}, {});
});
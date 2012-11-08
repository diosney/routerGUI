/*
 * Scripts for System/Tuning elements behaviour.
 */
// Prevent name collisions wrapping the code in an anonymous function.
jQuery(function ($) {
	/*
	 * Grid. Tunables.
	 */
	var tunable_list_grid = $('#tunable-list-grid').jqGrid({
		altRows          :false,
		autowidth        :true,
		caption          :'Tunables List',
		colModel         :[
			{
				align      :'center',
				classes    :'column_group',
				editable   :true,
				edittype   :'select',
				editoptions:{
					value:{
						'net'   :'Net',
						'kernel':'Kernel'
					}
				},
				hidden     :true,
				index      :'group',
				name       :'group',
				sortable   :false,
				width      :5
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
				width         :40
			},
			{
				align   :'center',
				classes :'column_path',
				editable:true,
				edittype:'text',
				index   :'path',
				name    :'path',
				stype   :'select',
				sortable:true,
				width   :20
			},
			{
				align         :'center',
				classes       :'column_value',
				editable      :true,
				edittype      :'text',
				firstsortorder:'asc',
				index         :'value',
				name          :'value',
				search        :true,
				sortable      :true,
				stype         :'text',
				width         :5
			}
		],
		colNames         :['Group', 'Description', 'Path', 'Value'],
		datatype         :'json',
		deselectAfterSort:false,
		emptyrecords     :'No <strong>Tunables</strong> were added yet.',
		forceFit         :true,
		grouping         :true,
		groupingView     :{
			groupField     :['group'],
			groupColumnShow:[true]
		},
		height           :'auto',
		hoverrows        :true,
		ignoreCase       :true,
		loadui           :'block',
		mtype            :'GET',
		pager            :'#tunable-list-pager',
		prmNames         :{
			sort :'orderby',
			order:'orderdir'
		},
		rowList          :[10, 20, 30],
		rowNum           :10,
		rownumbers       :true,
		sortname         :'path',
		url              :'/api/system/tuning',
		viewrecords      :true
	}).jqGrid('navGrid', '#tunable-list-pager', {
			/*
			 * General navigation parameters.
			 */
			edit         :true,
			edittext     :'<strong>Edit</strong>',
			add          :true,
			addtext      :'<strong>Add</strong>',
			del          :true,
			deltext      :'<strong>Delete from DB</strong>',
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
				$('#tr_group,#tr_path').hide();
			},
			bSubmit       :'Done',
			checkOnSubmit :false,
			closeAfterEdit:true,
			closeOnEscape :true,
			dataheight    :180,

			editCaption :'Edit Tunable',
			modal       :true,
			mtype       :'PUT',
			recreateForm:true,
			url         :'/api/system/tuning',
			width       :320
		}, {
			// ADD Settings.
			addCaption   :'Add Tunable',
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
				id:''                                 // Replace the id added automaticaly by jqGrid.
			},
			modal        :false,
			mtype        :'POST',
			recreateForm :true,
			url          :'/api/system/tuning',
			width        :320
		}, {
			// DELETE Settings.
			addCaption :'Delete Tunable',
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
			modal      :false,
			mtype      :'DELETE',
			url        :'/api/system/tuning'
		}, {
		}, {}, {});
});
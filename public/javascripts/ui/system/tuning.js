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
						'kernel':'Kernel',
						'fs'    :'Fs'
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
				sortable      :false,
				width         :40
			},
			{
				align    :'center',
				classes  :'column_path',
				editable :true,
				editrules:{
					required:true
				},
				edittype :'text',
				index    :'path',
				name     :'path',
				sortable :false,
				width    :20
			},
			{
				align         :'center',
				classes       :'column_value',
				editable      :true,
				editrules     :{
					required:true
				},
				edittype      :'text',
				firstsortorder:'asc',
				index         :'value',
				name          :'value',
				search        :true,
				sortable      :false,
				width         :5
			}
		],
		colNames         :['Group', 'Description', 'Path <span class="color-red">*</span>', 'Value <span class="color-red">*</span>'],
		datatype         :'json',
		deselectAfterSort:false,
		emptyrecords     :'No <strong>Tunables</strong> were added yet.',
		forceFit         :true,
		grouping         :true,
		groupingView     :{
			groupField     :['group'],
			groupColumnShow:[false]
		},
		height           :'auto',
		hoverrows        :true,
		ignoreCase       :true,
		loadui           :'block',
		mtype            :'GET',
		pager            :'#tunable-list-pager',
		postData         :{
			object:'tunable'
		},
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
				$('#tr_path').hide();
			},
			bSubmit       :'Done',
			checkOnSubmit :false,
			closeAfterEdit:true,
			closeOnEscape :true,
			editCaption   :'Edit Tunable',
			editData      :{
				object:'tunable'
			},
			modal         :true,
			mtype         :'PUT',
			recreateForm  :true,
			url           :'/api/system/tuning',
			width         :'350'
		}, {
			// ADD Settings.
			addCaption    :'Add Tunable',
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
				$('#tr_group').show();

				/*
				 * jsTree widget applied to path field.
				 */
				$('#path').hide().after('<div id="path-tree-container"></div>');

				$('#group').live('change',function () {
					$('#path-tree-container').jstree({
						core     :{},
						plugins  :['themes', 'json_data', 'ui'],
						themes   :{
							theme:'classic',
							dots :true,
							icons:true
						},
						ui       :{
							select_limit:1
						},
						json_data:{
							ajax:{
								data :function (n) {
									return {
										list_dir:true,
										path    :(n.attr ? n.attr('id') : '/'),
										group   :$('#group option:selected').val()
									};
								},
								url  :'/api/system/tuning',
								mtype:'GET'
							}
						}
					}).bind('select_node.jstree',function (event, data) {
							// If is directory invalidate the path field.
							if (data.rslt.obj.closest('li').attr('rel') == 'folder') {
								// A directory was clicked.
								// Clean previous values.
								$('#path,#value').val('');
							}
							else {
								// A file was clicked.
								$('#path').val(data.rslt.obj.attr('id').replace(/\//g, '.').slice(1));

								// Show current value of file accordingly.
								$('#value').val(data.rslt.obj.closest('li').attr('data-content'));
							}
						}).delegate('a', 'click', function (event, data) {
							event.preventDefault();
						})
				}).trigger('change');
			},
			bSubmit       :'Add',
			closeAfterAdd :true,
			closeOnEscape :true,
			editData      :{
				id    :'', // Replace the id added automaticaly by jqGrid.
				object:'tunable'
			},
			modal         :false,
			mtype         :'POST',
			recreateForm  :true,
			url           :'/api/system/tuning',
			width         :'350'
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
			delData    :{
				object:'tunable'
			},
			modal      :false,
			mtype      :'DELETE',
			url        :'/api/system/tuning'
		}, {
		}, {}, {});
});
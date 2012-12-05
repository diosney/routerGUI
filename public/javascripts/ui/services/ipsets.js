// Prevent name collisions wrapping the code in an anonymous function.
jQuery(function ($) {
	/*
	 * Grid. IP Sets.
	 */
	var ipset_list_grid = $('#ipsets-list-grid').jqGrid({
		altRows           :false,
		autowidth         :true,
		caption           :'IP Sets List',
		colModel          :[
			{
				align      :'center',
				classes    :'column_type',
				editable   :true,
				editrules  :{
					required:true
				},
				edittype   :'select',
				editoptions:{
					value:{
						'hash:net':'Networks',
						'hash:ip' :'Hosts',
						'list:set':'Mixed'
					}
				},
				hidden     :true,
				index      :'type',
				name       :'type',
				sortable   :false,
				width      :10
			},
			{
				align         :'left',
				classes       :'column_name',
				editable      :true,
				editrules     :{
					required:true
				},
				edittype      :'text',
				firstsortorder:'asc',
				index         :'name',
				name          :'name',
				sortable      :false,
				width         :30
			},
			{
				align         :'left',
				classes       :'column_description',
				editable      :true,
				edittype      :'textarea',
				firstsortorder:'asc',
				index         :'description',
				name          :'description',
				sortable      :false,
				width         :70
			}
		],
		colNames          :['Type', 'Name <span class="color-red">*</span>', 'Description'],
		datatype          :'json',
		deselectAfterSort :false,
		emptyrecords      :'There is no <strong>IP Sets</strong> yet.',
		forceFit          :true,
		gridview          :false,
		grouping          :true,
		groupingView      :{
			groupField     :['type'],
			groupColumnShow:[false]
		},
		height            :'auto',
		hoverrows         :true,
		ignoreCase        :true,
		loadui            :'block',
		mtype             :'GET',
		pager             :'#ipsets-list-pager',
		postData          :{
			object:'ipset'
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
			render_subgrid(subgrid_id, row_id, $('#ipsets-list-grid').jqGrid('getCell', row_id, 'type'));
		},
		sortname          :'name',
		url               :'/api/services/ipsets',
		viewrecords       :true
	}).jqGrid('navGrid', '#ipsets-list-pager', {
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
			beforeInitData:function (formid) {
				$('#ipsets-list-grid').jqGrid('setColProp', 'type', {
					editable:false
				});
			},
			bSubmit       :'Done',
			checkOnSubmit :false,
			closeAfterEdit:true,
			closeOnEscape :true,
			editCaption   :'Edit IP Set',
			editData      :{
				object:'ipset'
			},
			modal         :true,
			mtype         :'PUT',
			recreateForm  :true,
			url           :'/api/services/ipsets',
			width         :'auto'
		}, {
			// ADD Settings.
			addCaption    :'Add IP Set',
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
			beforeInitData:function (formid) {
				$('#ipsets-list-grid').jqGrid('setColProp', 'type', {
					editable:true
				});
			},
			beforeShowForm:function () {
				$('#tr_type').show();
			},
			bSubmit       :'Add',
			closeAfterAdd :true,
			closeOnEscape :true,
			editData      :{
				id    :'', // Replace the id added automaticaly by jqGrid.
				object:'ipset'
			},
			modal         :false,
			mtype         :'POST',
			recreateForm  :true,
			url           :'/api/services/ipsets',
			width         :'auto'
		}, {
			// DELETE Settings.
			addCaption :'Delete IP Set',
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
				object:'ipset'
			},
			modal      :false,
			mtype      :'DELETE',
			url        :'/api/services/ipsets'
		}, {
		}, {}, {});

	/*
	 * Function to render the IP Set type subgrid.
	 */
	function render_subgrid(subgrid_id, row_id, ipset_type) {
		/*
		 * General Subgrid options.
		 */
		var subgrid_options = {};

		/*
		 * Specific Subgrid options.
		 */
		switch (ipset_type) {
			case 'hash:ip':
				/*
				 * Hash:IP Subgrid specific options.
				 */
				subgrid_options.default_sorting = 'address';
				subgrid_options.ipset_type = 'Host';
				subgrid_options.colmodel = [
					{
						align         :'center',
						classes       :'column_family',
						editable      :true,
						edittype      :'select',
						editoptions   :{
							value:{
								'inet' :'IPv4',
								'inet6':'IPv6'
							}
						},
						firstsortorder:'asc',
						index         :'family',
						name          :'family',
						sortable      :false,
						width         :10
					},
					{
						align         :'center',
						classes       :'column_address',
						editable      :true,
						editrules     :{
							required:true
						},
						edittype      :'text',
						firstsortorder:'asc',
						index         :'address',
						name          :'address',
						sortable      :false,
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
						sortable      :false,
						width         :30
					}
				];
				subgrid_options.colnames = [
					'Family',
					'IP Address <span class="color-red">*</span>',
					'Description'
				];

				break;
			case 'hash:net':
				/*
				 * Hash:Net Subgrid specific options.
				 */
				subgrid_options.default_sorting = 'address';
				subgrid_options.ipset_type = 'Network';
				subgrid_options.colmodel = [
					{
						align         :'center',
						classes       :'column_family',
						editable      :true,
						edittype      :'select',
						editoptions   :{
							value:{
								'inet' :'IPv4',
								'inet6':'IPv6'
							}
						},
						firstsortorder:'asc',
						index         :'family',
						name          :'family',
						sortable      :false,
						width         :10
					},
					{
						align         :'center',
						classes       :'column_address',
						editable      :true,
						edittype      :'text',
						editrules     :{
							required:true
						},
						firstsortorder:'asc',
						index         :'address',
						name          :'address',
						sortable      :false,
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
						sortable      :false,
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
						sortable      :false,
						width         :40
					}
				];
				subgrid_options.colnames = [
					'Family',
					'Net Address <span class="color-red">*</span>',
					'Netmask',
					'Description'
				];

				break;
			case 'list:set':
				/*
				 * List:Set Subgrid specific options.
				 */
				subgrid_options.default_sorting = 'name';
				subgrid_options.ipset_type = 'Mixed';
				subgrid_options.colmodel = [
					{
						align         :'center',
						classes       :'column_name',
						editable      :true,
						editoptions   :{
							dataUrl:'/api/services/ipsets?object=ipset&return_type=select'
						},
						edittype      :'select',
						edirules      :{
							required:true
						},
						firstsortorder:'asc',
						index         :'name',
						name          :'name',
						sortable      :false,
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
						sortable      :false,
						width         :30
					}
				];
				subgrid_options.colnames = [
					'Name <span class="color-red">*</span>',
					'Description'
				];

				break;
			default:
				alert('TODO: See code.');

				break;
		}

		/*
		 * Required data for initializing the subgrid.
		 */
		var subgrid_table_id, pager_id;
		subgrid_table_id = subgrid_id + '_t';
		pager_id = 'p_' + subgrid_table_id;

		$('#' + subgrid_id).html('<table id="' + subgrid_table_id + '" class="scroll"></table><div id="' + pager_id + '" class="scroll"></div>');

		var ipset_type_subgrid = $('#' + subgrid_table_id).jqGrid({
			altRows          :false,
			autowidth        :true,
			caption          :'',
			colModel         :subgrid_options.colmodel,
			colNames         :subgrid_options.colnames,
			datatype         :'json',
			deselectAfterSort:false,
			emptyrecords     :'There is no <strong>' + subgrid_options.ipset_type + '</strong> yet.',
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
				ipset :row_id,
				object:ipset_type
			},
			prmNames         :{
				sort :'orderby',
				order:'orderdir'
			},
			rowList          :[10, 50, 100],
			rowNum           :10,
			rownumbers       :true,
			sortname         :subgrid_options.default_sorting,
			url              :'/api/services/ipsets',
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
					if (ipset_type == 'hash:ip') {
						$('#tr_family,#tr_address').hide();
					}
					else if (ipset_type == 'hash:net') {
						$('#tr_family,#tr_address,#tr_net_mask').hide();
					}
					else if (ipset_type == 'list:set') {
						$('#tr_name').hide();
					}
				},
				bSubmit       :'Done',
				checkOnSubmit :false,
				closeAfterEdit:true,
				closeOnEscape :true,
				editCaption   :'Edit ' + subgrid_options.ipset_type,
				editData      :{
					ipset :row_id,
					object:ipset_type                     // The id is added automaticaly by jqGrid.
				},
				modal         :true,
				mtype         :'PUT',
				recreateForm  :true,
				url           :'/api/services/ipsets',
				width         :'auto'
			}, {
				/*
				 * ADD Settings.
				 */
				addCaption    :'Add ' + subgrid_options.ipset_type,
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
					if (ipset_type == 'hash:net') {
						/*
						 * Addresses fields rearrangement.
						 */
						$('#tr_net_mask').hide();
						$('#family').live('change',function () {
							// Remove previous net_mask dropdowns.
							$('.net_mask_dropdown').remove();

							if ($(this).val() == 'inet6') {
								var net_mask_dropdown_dropdown = '<select class="net_mask_dropdown">';
								for (var i = 128; i > 0; i--) {
									net_mask_dropdown_dropdown += '<option value="' + i + '">' + i + '</option>';
								}
								net_mask_dropdown_dropdown += '</select>';
								$('#address').after(net_mask_dropdown_dropdown);

								$('#net_mask').val('128');
							}
							else {
								var net_mask_dropdown_dropdown = '<select class="net_mask_dropdown">';
								for (var i = 32; i > 0; i--) {
									net_mask_dropdown_dropdown += '<option value="' + i + '">' + i + '</option>';
								}
								net_mask_dropdown_dropdown += '</select>';
								$('#address').after(net_mask_dropdown_dropdown);

								$('#net_mask').val('32');
							}
						}).trigger('change');

						$('.net_mask_dropdown').live('change',function () {
							$('#net_mask').val($(this).val());
						}).trigger('change');
					}
				},
				bSubmit       :'Add',
				closeAfterAdd :true,
				closeOnEscape :true,
				editData      :{
					object:ipset_type,
					id    :'', // Replace the id added automaticaly by jqGrid.
					ipset :row_id
				},
				modal         :false,
				mtype         :'POST',
				recreateForm  :true,
				url           :'/api/services/ipsets',
				width         :'auto'
			}, {
				/*
				 * DELETE Settings.
				 */
				addCaption :'Delete ' + subgrid_options.ipset_type,
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
					ipset :row_id,
					object:ipset_type
				},
				url        :'/api/services/ipsets'
			}, {
			}, {}, {});

	}
});
// Prevent name collisions wrapping the code in an anonymous function.
jQuery(function ($) {
	/*
	 * Grid. VLANs.
	 */
	var vlan_list_grid = $('#vlan-list-grid').jqGrid({
		altRows           :false,
		autowidth         :true,
		caption           :'VLAN List',
		colModel          :[
			{
				align      :'center',
				classes    :'column_parent_device',
				editable   :true,
				editrules  :{
					required:true
				},
				edittype   :'select',
				editoptions:{
					dataUrl:'/api/interfaces/devices?object=device&return_type=select'
				},
				hidden     :true,
				index      :'parent_device',
				name       :'parent_device',
				sortable   :false,
				width      :15
			},
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
				width         :5
			},
			{
				align         :'center',
				classes       :'column_tag',
				editable      :true,
				editrules     :{
					required:true,
					integer: true,
					minValue: 0,
					maxValue: 4096
				},
				edittype      :'text',
				firstsortorder:'asc',
				index         :'tag',
				name          :'tag',
				search        :true,
				sortable      :true,
				stype         :'text',
				width         :5
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
			}
		],
		colNames          :['Parent Device <span class="color-red">*</span>', 'Status', 'Tag <span class="color-red">*</span>', 'Description'],
		datatype          :'json',
		deselectAfterSort :false,
		emptyrecords      :'No <strong>VLANs</strong> were added yet.',
		forceFit          :true,
		grouping          :true,
		groupingView      :{
			groupField     :['parent_device'],
			groupColumnShow:[false]
		},
		height            :'auto',
		hoverrows         :true,
		ignoreCase        :true,
		loadComplete      :function () {
			$('.column_status').each(function (index, element) {
				if ($(this).text() == 'UP') {
					$(this).addClass('status-positive');
				}
				else if ($(this).text() == 'NOT PRESENT') {
					$(this).addClass('status-danger');
				}
				else {
					$(this).addClass('status-negative');
				}
			});
		},
		loadui            :'block',
		mtype             :'GET',
		pager             :'#vlan-list-pager',
		postData          :{
			object:'vlan'
		},
		prmNames          :{
			sort :'orderby',
			order:'orderdir'
		},
		rowList           :[10, 20, 30],
		rowNum            :10,
		rownumbers        :true,
		sortname          :'parent_device',
		subGrid           :true,
		subGridRowExpanded:function (subgrid_id, row_id) {
			/*
			 * Call the function that will render the grid as subgrid.
			 */
			render_subgrid(subgrid_id, row_id);
		},
		url               :'/api/interfaces/vlans',
		viewrecords       :true
	}).jqGrid('navGrid', '#vlan-list-pager', {
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
				$('#tr_parent_device').after($('#tr_tag'));

				$('#parent_device,#tag').attr('readonly', 'readonly');
			},
			checkOnSubmit :false,
			closeAfterEdit:true,
			closeOnEscape :true,
			editCaption   :'Edit VLAN',
			modal         :true,
			mtype         :'PUT',
			editData      :{
				object:'vlan'
			},
			recreateForm  :true,
			url           :'/api/interfaces/vlans',
			width         :'auto'
		}, {
			// ADD Settings.
			addCaption       :'Add VLAN',
			addedrow         :'last',
			// Handler the response from server.
			afterSubmit      :function (response, postdata) {
				// Parse the XMLHttpRequest response.
				var data = $.parseJSON(response.responseText);

				// It is a notification.
				if (data.type == 'notification') {
					return [true, data.message]; 		// [success,message,new_id]
				} else if (data.type == 'error') {
					return [false, data.message]; 		// [success,message,new_id]
				}
			},
			beforeShowForm   :function () {
				$('#tr_parent_device').show();
			},
			bSubmit          :'Add',
			closeAfterAdd    :true,
			closeOnEscape    :true,
			editData         :{
				id    :'', // Replace the id added automaticaly by jqGrid.
				object:'vlan'
			},
			modal            :false,
			mtype            :'POST',
			recreateForm     :true,
			reloadAfterSubmit:true,
			url              :'/api/interfaces/vlans',
			width            :'auto'
		}, {
			// DELETE Settings.
			addCaption :'Delete VLAN',
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
				object:'vlan'
			},
			modal      :false,
			mtype      :'DELETE',
			url        :'/api/interfaces/vlans'
		}, {
		}, {}, {});

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
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :6
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
					formoptions: {
						elmsuffix: '&nbsp;<a rel="tooltip" data-html="true" data-placement="bottom" title="<div class=align-left>' +
							'<strong>Global</strong> - The address is globally valid.<br />' +
							'<strong>Site</strong> - (IPv6 only) the address is site local, i.e. it is valid inside this site.<br />' +
							'<strong>Link</strong> - The address is link local, i.e. it is valid  only on this device.<br />' +
							'<strong>Host</strong> - The address is valid only inside this host.' +
							'"><img class="icon-help no-margin-left" src="/images/icons/help.png" /></div></a>' +
							'<br /><span class="field-description">"Global" is the option yo normally will need.</span>'
					},
					index         :'scope',
					name          :'scope',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :6
				},
				{
					align         :'center',
					classes       :'column_address',
					editable      :true,
					editrules     :{
						required   :true
					},
					edittype      :'text',
					firstsortorder:'asc',
					index         :'address',
					name          :'address',
					search        :true,
					sortable      :false,
					stype         :'text',
					width         :10
				},
				{
					align         :'center',
					classes       :'column_net_mask',
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
			colNames         :['Family', 'Scope', 'Address <span class="color-red">*</span>', 'Netmask <span class="color-red">*</span>', 'Description'],
			datatype         :'json',
			deselectAfterSort:false,
			emptyrecords     :'There is no <strong>Address</strong> yet.',
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
				device_id    :row_id,
				object       :'address',
				device_status:$('.column_status', '#' + row_id).text()
			},
			prmNames         :{
				sort :'orderby',
				order:'orderdir'
			},
			rowList          :[10, 50, 100],
			rowNum           :10,
			rownumbers       :true,
			sortname         :'family',
			url              :'/api/interfaces/addresses',
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
				url           :'/api/interfaces/addresses',
				width         :'auto'
			}, {
				/*
				 * ADD Settings.
				 */
				addCaption   :'Add Address',
				addedrow     :'last',
				afterShowForm: function(formid) {
					$('[rel="tooltip"]').tooltip();
				},
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
				beforeShowForm:function () {
					$('#tr_net_mask').hide();

					$('#family').live('change',function () {
						// Remove previous net_mask dropdowns.
						$('#net_mask_dropdown').remove();

						if ($(this).val() == 'inet6') {
							$('#scope option[value="site"]').show();

							var net_mask_dropdown_dropdown = '<select id="net_mask_dropdown">'
							for (var i = 128;i > 0 ; i--) {
								net_mask_dropdown_dropdown += '<option value="' + i + '">' + i + '</option>';
							}
							net_mask_dropdown_dropdown += '</select>';
							$('#address').after(net_mask_dropdown_dropdown);
							$('#net_mask').val('128');
						}
						else {
							$('#scope option[value="site"]').hide();

							var net_mask_dropdown_dropdown = '<select id="net_mask_dropdown">'
							for (var i = 32;i > 0 ; i--) {
								net_mask_dropdown_dropdown += '<option value="' + i + '">' + i + '</option>';
							}
							net_mask_dropdown_dropdown += '</select>';
							$('#address').after(net_mask_dropdown_dropdown);
							$('#net_mask').val('32');
						}
					}).trigger('change');

					$('#net_mask_dropdown').live('change',function () {
						$('#net_mask').val($(this).val());
					}).trigger('change');
				},
				bSubmit      :'Add',
				closeAfterAdd:true,
				closeOnEscape:true,
				dataheight: 220,
				editData     :{
					object   :'address',
					id       :'', // Replace the id added automaticaly by jqGrid.
					device_id:row_id
				},
				modal        :false,
				mtype        :'POST',
				recreateForm :true,
				url          :'/api/interfaces/addresses',
				width        :360
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
				mtype      :'DELETE',
				delData    :{
					device_id:row_id,
					object   :'address'
				},
				url        :'/api/interfaces/addresses'
			}, {
			}, {}, {});
	}
});
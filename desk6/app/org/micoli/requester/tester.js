Ext.define('Ext.org.micoli.requester.tester', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.requester.tester',

	requires: [
		'Ext.tree.Panel',
		'Ext.grid.plugin.CellEditing',
		'Ext.tree.plugin.TreeViewDragDrop',
		'Ext.grid.column.Action',
		'Ext.org.micoli.lib.tree',
		'Ext.grid.filters.Filters',
	],

	initComponent: function(){
		var that = this;
		that.bodyCardId = Ext.id();
		that.reload = function(){
		};
		var methodsStore = Ext.create('Ext.data.Store', {
			fields	: ['value'],
			data	: [{
				value	: 'GET'
			},{
				value	: 'POST'
			},{
				value	: 'PUT'
			},{
				value	: 'DELETE'
			},{
				value	: 'PATCH'
			}]
		});

		Ext.define('KeyValue', {
			extend: 'Ext.data.Model',
			fields: ['active','key','value','type']
		});

		var xFormParameterStore = Ext.create('Ext.data.Store', {
			model	: 'KeyValue',
			data	: []
		});
		var formParameterStore = Ext.create('Ext.data.Store', {
			model	: 'KeyValue',
			data	: []
		});

		var headersStore = Ext.create('Ext.data.Store', {
			model	: 'KeyValue',
			data	: []
		});

		Ext.apply(this,{
			layout		: 'border',
			items		: [{
				region		: 'center',
				layout		: 'border',
				border		: false,
				tbar		: [{
					xtype		: 'combo',
					fieldLabel	: 'Method',
					store		: methodsStore,
					queryMode	: 'local',
					displayField: 'value',
					valueField	: 'value',
				},{
					xtype		: 'textfield',
					fieldLabel	: 'URL',
					width		: 200
				},{
					xtype		: 'button',
					text		: 'Send',
					handler		: function(){
						var generateRequest = function(){
							var parameters = {
								method	: $scope.request.method,
								url		: $scope.request.url,
								headers	: _.reduce(_.filter($scope.request.headers,function(v){
									return v.active && v.key;
								}), function(acc, item) {
									acc[item['key']] = item['value'];
									return acc;
								}, {})
							};
							return parameters;
						}

						$http({
							method	: 'POST',
							url		: 'http://localhost:3000/',
							data	: generateRequest()
						})
						.then(function successCallback(response) {
							$scope.response=response.data;
							console.log($scope.response);
							$scope.response.responseHeaders=response.headers();
						}, function errorCallback(response) {

						});
					}
				}],
				items		: [{
					region		: 'north',
					xtype		: 'tabpanel',
					height		: 250,
					border		: false,
					items			: [{
						title			: 'Body',
						layout			: 'card',
						flex			: 1,
						id				: that.bodyCardId,
						tbar			: ['Type:',{
							xtype			: 'radiogroup',
							defaultType		: 'radiofield',
							layout			: 'hbox',
							listeners		: {
								change		: function ( radio , newValue , oldValue , eOpts ){
									switch (newValue.type){
										case 'x-www-form':
											Ext.getCmp(that.bodyCardId).getLayout().setActiveItem(0);
										break;
										case 'form':
											Ext.getCmp(that.bodyCardId).getLayout().setActiveItem(1);
										break;
										case 'plain':
											Ext.getCmp(that.bodyCardId).getLayout().setActiveItem(2);
										break;
									}
									console.log(newValue);
								}
							},
							defaults	: {
								flex		: 1,
							},
							items		: [{
								boxLabel	: 'x-www-form',
								name		: 'type',
								inputValue	: 'x-www-form',
								checked		: true
							}, {
								boxLabel	: 'Form',
								name		: 'type',
								inputValue	: 'form'
							}, {
								boxLabel	: 'Plain',
								name		: 'type',
								inputValue	: 'plain'
							}]
						}],
						items		: [{
							xtype		: 'grid',
							border		: false,
							store		: xFormParameterStore,
							plugins		: [Ext.create('Ext.grid.plugin.CellEditing', {
								clicksToEdit	: 1
							})],
							tbar		: [{
								xtype		: 'button',
								text		: 'Add',
								handler		: function(){
									xFormParameterStore.add(new KeyValue({
										active	: true,
										key		: '',
										value	: '',
										type	: ''
									}));
								}
							}],
							columns		: [{
								text		: 'Active',
								dataIndex	: 'active',
								xtype		: 'checkcolumn',
								editor		: {
									xtype		: 'checkbox',
									cls			: 'x-grid-checkheader-editor'
								}
							},{
								text		: 'Key',
								dataIndex	: 'key',
								flex		: 1,
								editor		: {
									xtype		: 'textfield'
								}
							},{
								text		: 'Value',
								dataIndex	: 'value',
								flex		: 1,
								editor		: {
									xtype		: 'textfield'
								}
							},{
								menuDisabled: true,
								sortable	: false,
								xtype		: 'actioncolumn',
								width		: 50,
								items		: [{
									tooltip		: 'delete',
									handler		: function(grid, rowIndex, colIndex) {
										var rec = grid.store.removeAt(rowIndex);
									}
								}]
							}]
						},{
							//formParameters
							xtype		: 'grid',
							border		: false,
							store		: formParameterStore,
							plugins		: [Ext.create('Ext.grid.plugin.CellEditing', {
								clicksToEdit	: 1
							})],
							tbar		: [{
								xtype		: 'button',
								text		: 'Add',
								handler		: function(){
									formParameterStore.add(new KeyValue({
										active	: true,
										key		: '',
										value	: '',
										type	: ''
									}));
								}
							}],
							columns		: [{
								text		: 'Active',
								dataIndex	: 'active',
								xtype		: 'checkcolumn',
								editor		: {
									xtype		: 'checkbox',
									cls			: 'x-grid-checkheader-editor'
								}
							},{
								text		: 'Key',
								dataIndex	: 'key',
								flex		: 1,
								editor		: {
									xtype		: 'textfield'
								}
							},{
								text		: 'Value',
								dataIndex	: 'value',
								flex		: 1,
								editor		: {
									xtype		: 'textfield'
								}
							},{
								text		: 'Type',
								dataIndex	: 'Type',
								flex		: 1,
								editor		: {
									xtype		: 'textfield'
								}
							},{
								menuDisabled: true,
								sortable	: false,
								xtype		: 'actioncolumn',
								width		: 50,
								items		: [{
									tooltip		: 'delete',
									handler		: function(grid, rowIndex, colIndex) {
										var rec = grid.store.removeAt(rowIndex);
									}
								}]
							}]
						},{
							html : 'editor'
						}]
					},{
						title		: 'Headers',
						xtype		: 'grid',
						border		: false,
						store		: headersStore,
						plugins		: [Ext.create('Ext.grid.plugin.CellEditing', {
							clicksToEdit: 1
						})],
						tbar		: [{
							xtype		: 'button',
							text		: 'Add',
							handler		: function(){
								headersStore.add(new KeyValue({
									active	: true,
									key		: '',
									value	: '',
								}));
							}
						}],
						columns		: [{
							text		: 'Active',
							dataIndex	: 'active',
							xtype		: 'checkcolumn',
							editor		: {
								xtype		: 'checkbox',
								cls			: 'x-grid-checkheader-editor'
							}
						},{
							text		: 'Key',
							dataIndex	: 'key',
							flex		: 1,
							editor		: {
								xtype		: 'textfield'
							}
						},{
							text		: 'Value',
							dataIndex	: 'value',
							flex		: 1,
							editor		: {
								xtype		: 'textfield'
							}
						},{
							menuDisabled: true,
							sortable	: false,
							xtype		: 'actioncolumn',
							width		: 50,
							items		: [{
								tooltip		: 'delete',
								handler		: function(grid, rowIndex, colIndex) {
									var rec = grid.store.removeAt(rowIndex);
								}
							}]
						}]
					},{
						title			: 'Tests'
					},{
						title			: 'Authorization'
					}]
				}]
			}]
		});
		that.callParent(arguments);
	}
});
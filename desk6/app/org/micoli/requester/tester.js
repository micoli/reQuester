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
		'Ext.org.micoli.requester.responseViewer'
	],

	initComponent: function(){
		var that = this;
		that.bodyCardId			= Ext.id();
		that.methodsComboId		= Ext.id();
		that.URLTextId			= Ext.id();
		that.responseViewerId	= Ext.id();
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
		ggggg = headersStore;

		Ext.apply(this,{
			layout		: 'border',
			items		: [{
				region		: 'center',
				layout		: 'border',
				border		: false,
				tbar		: [{
					xtype		: 'combo',
					id			: that.methodsComboId,
					fieldLabel	: 'Method',
					store		: methodsStore,
					queryMode	: 'local',
					displayField: 'value',
					valueField	: 'value',
					value		: 'GET'
				},{
					xtype		: 'textfield',
					id			: that.URLTextId,
					fieldLabel	: 'URL',
					width		: 200,
					value		: 'https://jsonplaceholder.typicode.com/users'
				},{
					xtype		: 'button',
					text		: 'Send',
					handler		: function(){
						var generateRequest = function(){
							var parameters = {
								method	: Ext.getCmp(that.methodsComboId	).getValue(),
								url		: Ext.getCmp(that.URLTextId			).getValue(),
								headers	: _.reduce(_.filter(headersStore.getData().items,function(v){
									return v.data.active && v.data.key;
								}), function(acc, item) {
									acc[item.data.key] = item.data.value;
									return acc;
								}, {})
							};
							return parameters;
						}

						Ext.Ajax.request({
							url		: '',
							jsonData: generateRequest(),
							scope	: this,
							success	: function(response) {
								Ext.getCmp(that.responseViewerId).setResponse(JSON.parse(response.responseText))
							},
							failure: function() {
								console.log('error');
							}
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
				},{
					region	: 'center',
					id		: that.responseViewerId,
					xtype	: 'requester.responseViewer'
				}]
			}]
		});
		that.callParent(arguments);
	}
});
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
		'Ext.org.micoli.requester.responseViewer',
		'Ext.org.micoli.lib.CodeMirror'
	],

	initComponent: function(){
		var that = this;
		that.bodyCardId					= Ext.id();
		that.methodsComboId				= Ext.id();
		that.URLTextId					= Ext.id();
		that.requestBodyEditorId		= Ext.id();
		that.requestTestEditorId		= Ext.id();
		that.responseViewerId			= Ext.id();
		that.headersGridId				= Ext.id();
		that.radioGroupRequestBodyTypeId= Ext.id();
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

		that.mapLabelBodyToLayoutNumber = function(type){
			switch (type){
				case 'x-www-form':
					return 0;
				break;
				case 'form':
					return 1;
				break;
				case 'plain':
					return 2;
				break;
			}
		}

		that.request={
			"method" : "GET",
			"url" : ""
		}


		var importRequest = function(obj){
			that.request = obj;
			setTimeout(function(){
				Ext.getCmp(that.headersGridId).initialConfig.importData(that.request)
				console.log(that.request.serialize.request.type);
				Ext.getCmp(that.radioGroupRequestBodyTypeId).setValue({type:that.request.serialize.request.type});
				var number = that.mapLabelBodyToLayoutNumber(that.request.serialize.request.type);
				Ext.getCmp(that.bodyCardId).getLayout().setActiveItem(number);
				var panel = Ext.getCmp(that.bodyCardId).getLayout().getActiveItem();
				panel.initialConfig.importData(that.request);
				Ext.getCmp(that.requestTestEditorId).setValue(that.request.serialize.testsSource);
			},100)
		}

		importRequest({
			"method" : "GET",
			"url" : "https://jsonplaceholder.typicode.com/users",
			"serialize" : {
				"headers" : {
					"data" : [ {
						"active" : false,
						"key" : "h1",
						"value" : "12"
					}, {
						"active" : true,
						"key" : "h2",
						"value" : "11"
					} ]
				},
				"request" : {
					"type" : "form",
					"data" : [ {
						"active" : true,
						"key" : "b1",
						"value" : "1"
					}, {
						"active" : false,
						"key" : "b2",
						"value" : "2"
					} ]
				},
				"testsSource":"var i"
			},
			"headers" : {
				"h2" : "11"
			},
			"form" : []
		});

		var exportRequest = function(){
			var parameters = {
				method	: Ext.getCmp(that.methodsComboId	).getValue(),
				url		: Ext.getCmp(that.URLTextId			).getValue(),
				serialize:{}
			};
			Ext.getCmp(that.headersGridId).initialConfig.exportData(parameters);
			var panel = Ext.getCmp(that.bodyCardId).getLayout().getActiveItem();
			panel.initialConfig.exportData(parameters);
			that.request.serialize.testsSource = Ext.getCmp(that.requestTestEditorId).getValue();
			console.log(JSON.stringify(parameters));
			return parameters;
		}

		Ext.apply(this,{
			layout		: 'border',
			items		: [{
				region		: 'center',
				layout		: 'border',
				border		: false,
				tbar		: ['Method : ',{
					xtype		: 'combo',
					id			: that.methodsComboId,
					store		: methodsStore,
					queryMode	: 'local',
					displayField: 'value',
					valueField	: 'value',
					value		: that.request.method
				},' URL : ',{
					xtype		: 'textfield',
					id			: that.URLTextId,
					width		: 250,
					value		: that.request.url
				},{
					xtype		: 'button',
					text		: 'Send',
					handler		: function(){
						Ext.Ajax.request({
							url		: '',
							jsonData: exportRequest(),
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
					split		: true,
					height		: 250,
					border		: false,
					items			: [{
						title			: 'Body',
						layout			: 'card',
						flex			: 1,
						id				: that.bodyCardId,
						tbar			: ['Type:',{
							xtype			: 'radiogroup',
							id				: that.radioGroupRequestBodyTypeId,
							defaultType		: 'radiofield',
							layout			: 'hbox',
							listeners		: {
								change		: function ( radio , newValue , oldValue , eOpts ){
									var number = that.mapLabelBodyToLayoutNumber(newValue.type);
									Ext.getCmp(that.bodyCardId).getLayout().setActiveItem(number);
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
							importData	: function(parameters){
								xFormParameterStore.removeAll();
								Ext.each(parameters.serialize.request.data,function(v){
									xFormParameterStore.add(new KeyValue(v));
								});
							},
							exportData	: function(parameters){
								parameters.form=[];
								var data=[]
								xFormParameterStore.each(function(v){
									var key = v.get('key');
									var value = v.get('value');
									if(v.get('active')){
										parameters.form[key]=value;
									}
									data.push({
										active	: v.get('active'),
										key		: v.get('key'),
										value	: v.get('value'),
									});
								});
								parameters.serialize.request={
									type	: 'x-www-form',
									data	: data
								};
							},
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
							importData	: function(parameters){
								formParameterStore.removeAll();
								Ext.each(parameters.serialize.request.data,function(v){
									formParameterStore.add(new KeyValue(v));
								});
							},
							exportData	: function(parameters){
								parameters.formData=[];
								var data=[];
								formParameterStore.each(function(v){
									var key = v.get('key');
									var value = v.get('value');
									if(v.get('active')){
										parameters.formData[key]=value;
									}
									data.push({
										active	: v.get('active'),
										key		: v.get('key'),
										value	: v.get('value'),
										type	: v.get('type')
									});
								});
								parameters.serialize.request={
									type	: 'form',
									data	: data
								}
							},
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
							xtype		: 'CodeMirror',
							id			: that.requestBodyEditorId,
							importData	: function(parameters){
								Ext.getCmp(that.requestBodyEditorId).setValue(parameters.serialize.request.data);
							},
							exportData	: function(parameters){
								parameters.multipart= [{
									'content-type': 'application/json',
									body: Ext.getCmp(that.requestBodyEditorId).getValue()
								}];
								parameters.serialize.request={
									type : 'plain',
									data : parameters.multipart
								};

							},
						}]
					},{
						title		: 'Headers',
						xtype		: 'grid',
						border		: false,
						id			: that.headersGridId,
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
						importData	: function(parameters){
							headersStore.removeAll();
							Ext.each(parameters.serialize.headers.data,function(v){
								console.log(v);
								headersStore.add(new KeyValue(v));
							});
						},
						exportData	: function(parameters){
							var data = [];
							parameters.headers={};
							headersStore.each(function(v){
								var key = v.get('key');
								var value = v.get('value');
								if(v.get('active')){
									parameters.headers[key]=value;
								}
								data.push({
									active	: v.get('active'),
									key		: v.get('key'),
									value	: v.get('value'),
								});
							});
							parameters.serialize.headers={
								data	: data
							}
						},
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
						title			: 'Tests',
						xtype			: 'CodeMirror',
						id				: that.requestTestEditorId,

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
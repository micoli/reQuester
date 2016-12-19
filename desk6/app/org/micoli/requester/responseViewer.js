Ext.define('Ext.org.micoli.requester.responseViewer', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.requester.responseViewer',

	requires: [
		'Ext.grid.column.Action',
		'Ext.org.micoli.lib.tree',
		'Ext.grid.filters.Filters',
	],

	initComponent: function(){
		var that = this;
		that.responseBodyId = Ext.id();
		that.setResponse = function(response){
			console.log(response);
			requestHeaders.removeAll();
			responseHeaders.removeAll();
			response.body
			_.forOwn(response.headers,function(v,k){
				responseHeaders.add(new KeyValue({
					key		: k,
					value	: v,
				}));
			});
			_.forOwn(response.request.headers,function(v,k){
				requestHeaders.add(new KeyValue({
					key		: k,
					value	: v,
				}));
			});
			Ext.getCmp(that.responseBodyId).setHtml(response.body)
		}
		Ext.define('KeyValueResponse', {
			extend: 'Ext.data.Model',
			fields: ['key','value']
		});

		var requestHeaders = Ext.create('Ext.data.Store', {
			model	: 'KeyValue',
			data	: []
		});
		var responseHeaders = Ext.create('Ext.data.Store', {
			model	: 'KeyValue',
			data	: []
		});


		Ext.apply(this,{
			layout		: 'border',
			items		: [{
				region		: 'center',
				xtype		: 'tabpanel',
				border		: false,
				items		: [{
					xtype		: 'textarea',
					id			: that.responseBodyId,
				},{
					title		: 'request Headers',
					xtype		: 'grid',
					border		: false,
					store		: requestHeaders,
					columns		: [{
						text		: 'Key',
						dataIndex	: 'key',
						flex		: 1,
					},{
						text		: 'Value',
						dataIndex	: 'value',
						flex		: 1,
					}]
				},{
					title		: 'request Headers',
					xtype		: 'grid',
					border		: false,
					store		: responseHeaders,
					columns		: [{
						text		: 'Key',
						dataIndex	: 'key',
						flex		: 1,
					},{
						text		: 'Value',
						dataIndex	: 'value',
						flex		: 1,
					}]
				}]
			}]
		});
		that.callParent(arguments);
	}
});
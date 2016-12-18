
Ext.define('Ext.org.micoli.lib.JsonStore', {
	extend		: 'Ext.data.JsonStore',
	requires	: ['Ext.org.micoli.lib.Http','Ext.org.micoli.lib.tools'],
	constructor	: function(config) {
		var that = this;
		config = Ext.Object.merge({
			proxy: {
				type  : 'ajax',
				reader: 'json',
				writer: 'json'
			}
		},config);

		config = Ext.org.micoli.lib.security.override(config);
		config.proxy.urlTpl = config.proxy.url;

		that.callParent([config]);

		that.on('beforeload',function(store,operation, eOpts){
			Ext.org.micoli.lib.Http.encodeParams(store.getProxy(),true);
		})
	}
});
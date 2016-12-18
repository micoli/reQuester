Ext.define('Ext.org.micoli.lib.jsonMemoryStore', {
	extend		: 'Ext.data.Store',
	requires	: ['Ext.org.micoli.lib.Http','Ext.org.micoli.lib.tools'],
	constructor	: function(config) {
		var that = this;

		config = Ext.Object.merge({
			proxy		: {
				type		: 'memory',
				reader		: {
					type		: 'json'
				}
			},
			autoLoad	: true
		},config);

		that.callParent([config]);
	}
});
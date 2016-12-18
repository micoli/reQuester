Ext.define('Ext.org.micoli.lib.form.SimpleCombo', {
	extend: 'Ext.form.field.ComboBox',
	alias: 'widget.simpleCombo',

	constructor: function(config){
		var that = this
		that.callParent([Ext.apply({
			store: Ext.create('Ext.data.ArrayStore', {
				fields	: ['code', 'name'],
				data	: config.data || []
			}),
			valueField		: 'code',
			displayField	: 'name',
			mode			: 'local',
			queryMode		: 'local',
			triggerAction	: 'all',
			typeAhead		: true,
			editable		: true
		}, config)]);
	}
});

Ext.define('Ext.org.micoli.requester.tester', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.requester.tester',

	requires: [
		'Ext.tree.Panel',
		'Ext.grid.plugin.CellEditing',
		'Ext.tree.plugin.TreeViewDragDrop',
		'Ext.grid.column.Action',
		'Ext.org.micoli.lib.tree',
		'Ext.grid.filters.Filters'

	],

	initComponent: function(){
		var that = this;
		that.AUTFormId	= Ext.id();

		that.reload = function(){
		};

		Ext.apply(this,{
			layout		: 'border',
			items		: [{
				region			: 'center',
				id				: that.AUTFormId
			}]
		});
		that.callParent(arguments);
	}
});
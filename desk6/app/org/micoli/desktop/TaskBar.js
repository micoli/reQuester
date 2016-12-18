
Ext.define('Ext.org.micoli.desktop.TaskBar', {
	extend: 'Ext.ux.desktop.TaskBar',

	onQuickStartClick: function (btn) {
		var that = this;
		that.app.launchModule(btn.module);
	}
});


Ext.define('Ext.ux.desktop.TrayDebug', {
	extend: 'Ext.button.Button',

	alias: 'widget.traydebug',

	cls: 'ux-desktop-traydebug',

	html: '&#160;0',

	require:[
		'Ext.grid.filters.Filters',
		'Ext.data.ArrayStore',
	],

	initComponent: function () {
		var that = this;
		that.displayId	= Ext.id();
		that.securityId	= Ext.id();

		Ext.rootApp.on('netActivity',function(v){
			that.setText(Ext.org.micoli.lib.Http.queriesStore.count());
			Ext.getCmp(that.securityId).setValue(Ext.org.micoli.lib.security.display());
		});

		that.win = new Ext.Window({
			title			: 'Queries',
			closeAction		: 'hide',
			layout			: 'border',
			width			: 1100,
			height			: 480,
			items			: [{
				region			: 'north',
				xtype			: 'textfield',
				anchor			: '100%',
				height			: 30,
				id				: that.securityId
			},{
				region			: 'center',
				xtype 			: 'grid',
				plugins			: 'gridfilters',
				store			: Ext.org.micoli.lib.Http.queriesStore,
				columns			: [{
					header: 'date'	, width:  150,	dataIndex: 'date',flex:0
				},{
					header: 'URL'	, width:  50,	dataIndex: 'url' ,flex:1
				}],
				listeners		: {
					rowclick : function (grid,record){
						Ext.getCmp(that.displayId).setHtml(
							'<b>Url:</b>'		+ record.get('url'		)+'<br>'+
							'<b>Params:</b>'	+ '<pre>'+JSON.stringify( record.get('params'	))+'<pre>'+
							'<b>JsonData:</b>'	+ '<pre>'+JSON.stringify( record.get('jsonData'	))+'<pre>'+
							'<b>Filter:</b>'	+ '<pre>'+JSON.stringify( record.get('filter'	))+'<pre>'
						);
					}
				}
			},{
				region	: 'south',
				split	: true,
				height	: 200,
				xtype	: 'panel',
				html	: '',
				id		: that.displayId
			}],
			buttons			: [{
				text			: 'Ok',
				handler			: function(){
					that.win.hide();
				}
			}]
		});
		that.on('click',function(){
			that.win[(that.win.isVisible())?'hide':'show']();
		});
		that.callParent();
	}
});
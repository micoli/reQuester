Ext.define('Ext.org.micoli.desktop.Desktop', {
	extend : 'Ext.ux.desktop.Desktop',

	uses : [ 'Ext.org.micoli.desktop.TaskBar' ],

	initComponent : function() {
		var me = this;

		me.windowMenu = new Ext.menu.Menu(me.createWindowMenu());

		me.bbar = me.taskbar = new Ext.org.micoli.desktop.TaskBar(me.taskbarConfig);
		me.taskbar.windowMenu = me.windowMenu;

		me.windows = new Ext.util.MixedCollection();

		me.contextMenu = new Ext.menu.Menu(me.createDesktopMenu());

		me.items = [ {
			xtype : 'wallpaper',
			id : me.id + '_wallpaper'
		}, me.createDataView() ];

		Ext.panel.Panel.prototype.initComponent.call(this);//me.callParent();

		me.shortcutsView = me.items.getAt(1);
		me.shortcutsView.on('itemclick', me.onShortcutItemClick, me);

		var wallpaper = me.wallpaper;
		me.wallpaper = me.items.getAt(0);
		if (wallpaper) {
			me.setWallpaper(wallpaper, me.wallpaperStretch);
		}
	},

	onShortcutItemClick : function(dataView, record) {
		var that = this;
		that.app.launchModule(record.data.module);
	}
});
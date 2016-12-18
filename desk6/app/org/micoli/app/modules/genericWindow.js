Ext.define('Ext.org.micoli.app.modules.genericWindow', {
	extend: 'Ext.ux.desktop.Module',

	createWindow : function(cfg){
		var that = this;
		that.id = 'id-'+cfg.module.replace(/[\.@]/g,'-');
		that.cmpid='cmp'+that.id;
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(that.id);
		if(!win){
			win = desktop.createWindow({
				id				: that.id,
				title			: cfg.name,
				width			: 1240,
				height			: 480 ,
				iconCls			: cfg.iconCls,
				maximized		: true,
				animCollapse	: false,
				border			: false,
				constrainHeader	: true,
				layout			: 'fit',
				listeners		: {
					show : function (win, eOpts){
						var cmp = Ext.getCmp(that.cmpid);
						if(cmp.reload){
							cmp.reload();
						}
					}
				},
				items			: [{
					xtype		: cfg.subtype,
					id			: that.cmpid
				}]
			});
		}
		return win;
	}
});

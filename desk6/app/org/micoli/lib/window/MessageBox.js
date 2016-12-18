Ext.define('Ext.org.micoli.lib.window.MessageBox', {
	statics:{
		getDialogForm: function(cfg){
			var that = this;
			var okButtonId		= Ext.id();
			var cancelButtonId	= Ext.id();
			var formId			= Ext.id();

			var win = new Ext.Window(Ext.apply({
				title			: 'Edit',
				layout			: 'fit',
				width			: 900,
				height			: 480,
				closeAction		: 'hide',
				plain			: true,
				modal			: cfg.modal ||false,
				items			: [{
					xtype			: 'form',
					frame			: false,
					border			: false,
					id				: formId,
					items			: cfg.formItems
				}],
				ok				: Ext.emptyFn,
				cancel			: Ext.emptyFn,
				buttons			: [{
					text			: 'Ok',
					id				: okButtonId,
					handler			: function(){
						var res = win.ok(Ext.getCmp(formId).getForm().getValues(),Ext.getCmp(formId));
						if(res===false){
							return;
						}
						win.destroy();
					}
				},{
					text			: 'Cancel',
					id				: cancelButtonId,
					handler			: function(){
						win.cancel();
						win.destroy();
					}
				}]
			},cfg));
			win.show();
		}
	}
});
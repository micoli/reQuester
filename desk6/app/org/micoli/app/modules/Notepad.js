/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Ext.org.micoli.app.modules.Notepad', {
	extend: 'Ext.ux.desktop.Module',

	requires: [
		'Ext.org.micoli.app.modules.NotepadItem'
		//'Ext.form.field.TextArea'
	],

	id:'notepad',

	init : function(){
		this.launcher = {
			text: 'Notepad',
			iconCls:'notepad'
		}
	},

	createWindow : function(){
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('notepad');
		if(!win){
			win = desktop.createWindow({
				id: 'notepad',
				title:'Notepad',
				width:600,
				height:400,
				iconCls: 'notepad',
				animCollapse:false,
				border: false,
				//defaultFocus: 'notepad-editor', EXTJSIV-1300

				// IE has a bug where it will keep the iframe's background visible when the window
				// is set to visibility:hidden. Hiding the window via position offsets instead gets
				// around this bug.
				hideMode: 'offsets',

				layout: 'fit',
				items: [
					{
						xtype: 'NotepadItem',
						//xtype: 'textarea',
						id: 'notepad-editor'
					}
				]
			});
		}
		return win;
	}
});

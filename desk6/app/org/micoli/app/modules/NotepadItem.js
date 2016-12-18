/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Ext.org.micoli.app.modules.NotepadItem', {
	extend: 'Ext.form.field.HtmlEditor',
	alias: 'widget.NotepadItem',
	alternateClassName: 'Ext.form.NotepadItem',
	requires: [
		'Ext.form.field.HtmlEditor'
		//'Ext.form.field.TextArea'
	],
	value: [
		'Some <b>rich</b> dqs dqsdqsdqdq<span style="color: rgb(255, 0, 0)">text</span> goes <u>here</u><br>',
		'Give it a try!'
	].join(''),
	initComponent: function(){
		var me = this;
		me.callParent(arguments);
	}
});

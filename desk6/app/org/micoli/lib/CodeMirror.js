Ext.define('Ext.org.micoli.lib.CodeMirror.CodeMirror', {
	extend: 'Ext.form.field.Base',
	alias: 'widget.CodeMirror',

	fieldBodyCls: 'extCodeMirror',

	fieldSubTpl: [
		'',
		{
			compiled: true,
			disableFormats: true
		}
	],

	config: {
		codeMirrorConfig: {}
	},
	listeners: {
		render: 'onRenderField',
		scope: 'this'
	},

	focusable: false,
	minHeight: 300,
	codeMirror: null,
	suspendCodeChange: 0,

	destroy: function() {
		var me = this;

		if (me.codeMirror && me.codeMirror.clear) {
			me.codeMirror.clear();
		}
		me.codeMirror = null;

		me.callParent(arguments);
	},

	onRenderField: function() {
		var me = this;

		var codeMirror = new CodeMirror(me.bodyEl.dom, Ext.apply({
			value: (me.getValue() || ''),
			readOnly: !!me.readOnly,
			lineNumbers: true,
			tabSize: 4,
			indentUnit: 4
		}, me.getCodeMirrorConfig()));

		// hack to use the extjs eventhandler ;-)
		codeMirror.un = codeMirror.off;
		codeMirror.doAddListener = codeMirror.on;

		me.mon(codeMirror, 'change', function() {
			me.suspendCodeChange++;
			me.setValue(codeMirror.getValue());
			me.suspendCodeChange--;
		});

		me.codeMirror = (codeMirror || null);
	},

	getValue: function() {
		var me = this;

		return me.value;
	},

	setValue: function(value) {
		var me = this;

		me.value = value;
		me.checkChange();

		return me;
	},

	onChange: function(value) {
		var me = this;

		if (me.rendered && !me.suspendCodeChange && me.codeMirror) {
			me.codeMirror.setValue((value || ''));
			me.codeMirror.clearHistory();
		}

		me.callParent(arguments);
	},

	setReadOnly: function(readOnly) {
		var me = this;

		readOnly = !!readOnly;
		me[readOnly ? 'addCls' : 'removeCls'](me.readOnlyCls);
		me.readOnly = readOnly;
		if (me.codeMirror) {
			me.codeMirror.setReadOnly(readOnly);
		}
		me.fireEvent('writeablechange', me, readOnly);
	},

	onResize: function(width, height) {
		var me = this;

		if (me.codeMirror) {
			me.codeMirror.setSize("100%", height);
		}
	}
});
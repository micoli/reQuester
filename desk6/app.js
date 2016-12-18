Ext.onReady(function(){
	Ext.Loader.setConfig({
		enabled			: true,
		disableCaching	: true,
		paths			: {
			'Ext.org'	: 'app/org',
			'Ext.ux'	: 'resources/js/ux/classic/src/',
			'Ext.chart'	: 'resources/js/charts/src/chart/',
			'Ext.draw'	: 'resources/js/charts/src/draw/'
		}
	});

	Ext.require([
		'Ext.grid.*',
		'Ext.data.*',
		'Ext.util.*',
		'Ext.Action',
		'Ext.tab.*',
		'Ext.button.*',
		'Ext.form.*',
		'Ext.layout.*'
	]);

	Ext.application({
		name: 'Desktop',
		requires: [
			'Ext.org.micoli.desktop.App'
		],
		init: function() {
			Ext.proxyUrl = '';
			Ext.rootApp = new Ext.org.micoli.desktop.App();
		}
	});

});
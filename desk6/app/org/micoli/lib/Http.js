Ext.define('Ext.org.micoli.lib.Http', {
	singleton	: true,
	constructor	: function () {
		var that = this;
		that.queriesStore = new Ext.data.ArrayStore({
			fields: [
				'url',
				'params',
				'filter',
				'jsonData',{
					name: 'date', type: 'date'
				}
			],
			data: []
		});
	},
	encodeParams : function(cfg,isProxy){
		var that = this;
		var hist={};
		var disableCache = false;
		var paramVarName = isProxy?'extraParams':'params';
		var filter = cfg[paramVarName].hasOwnProperty('filter')?JSON.parse(cfg[paramVarName].filter):{};

		if(disableCache && isProxy){
			cfg.noCache=false;
		}
		if(cfg.hasOwnProperty('urlTpl') && /\{\{/.test(cfg.urlTpl)){
			cfg.url = cfg.urlTpl.replace(/\{\{(.*?)\}\}/g,function(tag,name,idx,str){
				if (cfg[paramVarName] && cfg[paramVarName].hasOwnProperty(name)){
					return cfg[paramVarName][name];
				}else if (cfg.jsonData && cfg.jsonData.hasOwnProperty(name)){
					return cfg.jsonData[name];
				}else if (filter.hasOwnProperty(name)){
					return filter[name];
				}else{
					return tag;
				}
			});
		}
		hist = {
			date	: Ext.Date.format(new Date(),'Y-m-d H:i:s'),
			url		: cfg.url,
			params	: cfg[paramVarName],
			jsonData: cfg.jsonData||{},
			filter	: filter
		};
		if(disableCache && !isProxy){
			cfg.disableCaching=false;
		}
		that.queriesStore.add(new Ext.data.Record(hist));
		Ext.rootApp.fireEvent('netActivity',hist);
	}
});
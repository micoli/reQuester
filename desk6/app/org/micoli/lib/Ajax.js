
Ext.define('Ext.org.micoli.lib.Ajax', {
	defaultUrl:'',
	requires: ['Ext.org.micoli.lib.Http'],
	statics:{
		request : function(cfg){
			var defaultCfg = {
				url	: Ext.org.micoli.lib.Ajax.defaultUrl,
				success : function(response,options ){
					try {
						options.successJSON.call(options.scope,JSON.parse(response.responseText),response,options);
					}catch(e){
						console.error(e);
						defaultCfg.failure.call(options.scope,response,options)
					}
				},
				failure : function(response,options){
					options.failureJSON.call(options.scope,response,options);
				},
				successJSON : Ext.EmptyFn,
				failureJSON : Ext.EmptyFn
			};

			defaultCfg = Ext.org.micoli.lib.security.override(Ext.apply(defaultCfg,cfg))
			defaultCfg.urlTpl = defaultCfg.url;
			Ext.org.micoli.lib.Http.encodeParams(defaultCfg);

			return Ext.Ajax.request(defaultCfg);
		}
	}
});



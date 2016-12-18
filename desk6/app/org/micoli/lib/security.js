
Ext.define('Ext.org.micoli.lib.security', {
	statics: {
		user : '',
		setUser: function (user){
			Ext.org.micoli.lib.security.user=user;
			localStorage.setItem('user',user);
		},
		setToken: function (token){
			localStorage.setItem('jwtoken',token);
		},
		getUser: function (){
			return localStorage.getItem('user');
		},
		getToken: function (){
			return localStorage.getItem('jwtoken');
		},
		remove	: function (){
			localStorage.removeItem('user');
			return localStorage.removeItem('jwtoken');
		},
		override : function(cfg){
			var object = cfg.hasOwnProperty('proxy')?cfg.proxy:cfg;
			object.headers = Ext.apply(object.headers||{});
			object.headers['X-Access-Token'] = 'Bearer'+Ext.org.micoli.lib.security.getToken();
			object.params = object.params||{};
			//object.params['X-Access-Token'] = object.headers['X-Access-Token'];
			if(cfg.route){
				object.url = Ext.org.micoli.lib.Ajax.defaultUrl+cfg.route;
			}
			return cfg;
		},
		display:function(){
			return 'X-Access-Token='+'Bearer'+Ext.org.micoli.lib.security.getToken();
		}
	}
});



Ext.define('Ext.org.micoli.desktop.App', {
	extend: 'Ext.ux.desktop.App',

	requires: [
		'Ext.org.micoli.lib.Http',
		'Ext.window.MessageBox',
		'Ext.ux.desktop.ShortcutModel',
		'Ext.org.micoli.desktop.SystemStatus',
		'Ext.org.micoli.desktop.Settings',
		'Ext.org.micoli.desktop.Desktop',
		'Ext.org.micoli.lib.security',
		'Ext.org.micoli.lib.Ajax'
	],

	instantiedModules:{},

	constructor: function (config) {
		var that = this;
		that.mixins.observable.constructor.call(this, config);

		that.resetModules();

		if (Ext.isReady) {
			Ext.Function.defer(that.startup, 10, that);
		} else {
			Ext.onReady(that.startup, that);
		}
	},

	startup: function() {
		var that = this;
		Ext.org.micoli.lib.Ajax.defaultUrl = Ext.proxyUrl;

		Ext.org.micoli.lib.Ajax.request({
			scope		: this,
			method		:'GET',
			route		:'/api/user/status',
			successJSON	: function(data,response,options){
				if(data.status){
					that.initUserEnv();
				}else{
					that.login();
				}
			},
			failureJSON	: function(response,options) {
				console.log(response.status,response.statusText);
				that.login();
			}
		});
	},

	init: function() {
		var me = this;

		if (me.useQuickTips) {
			Ext.QuickTips.init();
		}

		me.desktop = new Ext.org.micoli.desktop.Desktop(me.getDesktopConfig());

		me.viewport = new Ext.container.Viewport({
			layout	: 'fit',
			items	: [ me.desktop ]
		});

		Ext.getWin().on('beforeunload', me.onUnload, me);

		me.isReady = true;
		me.fireEvent('ready', me);
	},

	resetModules : function(){
		var that = this;
		that._modules=[];
	},

	getModules : function(){
		var that = this;
		return that._modules;
	},

	addModule : function(module){
		var that = this;
		that._modules.push(module);
	},

	getModule : function(name) {
		var ms = this._modules;
		for (var i = 0, len = ms.length; i < len; i++) {
			var m = ms[i];
			if (m.module == name || m.appType == name) {
				var aSplit = m.module.split('@');
				return Ext.apply(m,{
					xtype	: aSplit[0],
					subtype	: aSplit.length==0?null:aSplit[1]
				});
			}
		}
		return null;
	},

	initModules : function(){
		var that = this;
		that._modules = [{
			name			: 'TESTER',
			menuIconCls		: 'icon-grid',
			gridIconCls		: 'accordion-shortcut',
			module 			: 'Ext.org.micoli.app.modules.genericWindow@requester.tester',
			require			: ['Ext.org.micoli.requester.tester'],
			isOnQuickStart	: true
		}];
	},

	getDesktopConfig : function () {
		var that = this;
		var ret = that.callParent();

		return Ext.apply(ret, {
			contextMenuItems: [{
				text	: 'Change Settings',
				handler	: that.onSettings,
				scope	: that
			}],

			shortcuts: Ext.create('Ext.data.Store', {
				model: 'Ext.ux.desktop.ShortcutModel',
				data: that.getModules().filter(function(moduleConf){
					return moduleConf.gridIconCls;
				}).map(function (moduleConf) {
					return {
						name	: moduleConf.name,
						iconCls : moduleConf.gridIconCls,
						module	: moduleConf.module
					};
				})
			}),

			wallpaper: 'resources/images/wallpapers/Dark-Sencha.jpg',
			wallpaperStretch: false
		});
	},

	launchModule : function(module){
		var that = this;
		var moduleCfg=that.getModule(module);
		Ext.require([moduleCfg.xtype].concat(moduleCfg.require||[]),function(){
			if(!that.instantiedModules.hasOwnProperty(module)){
				that.instantiedModules[module] = Ext.create(moduleCfg.xtype);
				that.instantiedModules[module].app=that;
			}
			var win = that.instantiedModules[module].createWindow(moduleCfg);
			if (win) {
				that.desktop.restoreWindow(win);
			}
		});
	},

	/**
	 * This method returns the configuration object for the Start Button. A derived
	 * class can override this method, call the base version to build the config and
	 * then modify the returned object before returning it.
	 */
	getStartConfig: function () {
		var that = this;
		var cfg = {
			app: that,
			menu: that.getModules().filter(function(moduleConf){
				return moduleConf.menuIconCls;
			}).map(function (moduleConf) {
				return {
					text	: moduleConf.name,
					iconCls : moduleConf.menuIconCls,
					handler	: function(){
						that.launchModule(this.module)
					},
					module	: moduleConf.module
				};
			})
		};
		Ext.apply(cfg, that.startConfig);

		return Ext.apply(cfg, {
			title		: Ext.org.micoli.lib.security.getUser(),
			iconCls		: 'icon-user',
			height		: 300,
			toolConfig	: {
				width		: 100,
				items		: [{
					text	:'Settings',
					iconCls	:'icon-settings',
					handler	: that.onSettings,
					scope	: that
				},'-',{
					text	:'Logout',
					iconCls	:'icon-logout',
					handler	: that.onLogout,
					scope	: that
				}]
			}
		});
	},

	getTaskbarConfig: function () {
		var that = this;
		var ret = this.callParent();

		return Ext.apply(ret, {
			quickStart: that.getModules().filter(function(moduleConf){
				return moduleConf.menuIconCls && moduleConf.hasOwnProperty('isOnQuickStart') && moduleConf.isOnQuickStart;
			}).map(function (moduleConf) {
				return {
					name	: moduleConf.name,
					iconCls : moduleConf.menuIconCls,
					module	: moduleConf.module
				};
			}),
			trayItems: [{
				xtype: 'trayclock', flex: 1
			},{
				xtype: 'traydebug', flex: 1
			}]
		});
	},

	login : function (){
		var that = this;
		that.loginFieldId		= Ext.id();
		that.passwordFieldId	= Ext.id();

		that.LoginAjax			= function() {
			Ext.org.micoli.lib.Ajax.request({
				scope		: this,
				method		: 'POST',
				route		: '/auth/validate',
				params		: {
					username	: Ext.getCmp(that.loginFieldId).getValue(),
					password	: Ext.getCmp(that.passwordFieldId).getValue()
				},
				successJSON	: function(data,response,options){
					if (data.status){
						Ext.org.micoli.lib.security.setToken(data.info.token);
						Ext.org.micoli.lib.security.setUser(data.info.user);
						winLogin.close();
						that.initUserEnv();
					}else{
						Ext.MessageBox.alert('Erreur','mauvaise Identification');
					}
				},
				failureJSON : function(response,options) {
					Ext.toast('Attention','Login failed','top');
				}
			});
		};

		var winLogin = new Ext.Window({
			layout		: 'fit',
			title		: 'Authentification',
			closable	: false,
			width		: 300,
			height		: 150,
			closeAction	: 'close',
			modal		: true,
			listeners	: {
				render		: function(){
					Ext.getCmp(that.loginFieldId).focus(true,300);
				}
			},
			items	: [{
				xtype		: 'form',
				border		: false,
				defaults	: {
					enableKeyEvents	: true,
					xtype			: 'textfield',
					listeners		: {
						keyup	:  function(cf,ev){
							if (ev.getCharCode() == ev.ENTER){
								that.LoginAjax();
							}
						}
					}
				},
				items	: [{
					id				: that.loginFieldId,
					name			: 'login',
					fieldLabel		: 'User Name'
				},{
					id				: that.passwordFieldId,
					name			: 'password',
					fieldLabel		: 'Password',
					inputType		: 'password'
				}]
			}],
			buttons: [{
				text		: 'login',
				handler		: function(){
					that.LoginAjax();
				}
			}]
		});
		winLogin.show();
	},

	onLogout: function () {
		var that = this;
		Ext.Msg.confirm('Logout', 'Are you sure you want to logout?',function(text){
			if(text=='yes'){
				Ext.org.micoli.lib.security.remove();
				window.onbeforeunload=null;
				location.reload(true);
			}
		});
	},

	onSettings: function () {
		var dlg = new Ext.org.micoli.desktop.Settings({
			desktop: this.desktop
		});
		dlg.show();
	},

	initUserEnv : function(){
		var that = this;
		Ext.org.micoli.lib.Ajax.request({
			scope	: that,
			route	: '/api/user/initEnv',
			successJSON : function(data,response,options){
				if (data.user){
					Ext.org.micoli.lib.security.setUser(data.user);
					that.resetModules();
					try{
						that.initModules();
					}catch(e){
						console.log(e);
					}
					that.startConfig = that.startConfig || that.getStartConfig();
					that.init();
					data.autoexec=['Ext.org.micoli.app.modules.genericWindow@requester.tester'];
					that.autoExec(data.autoexec||[]);
				}else{
					that.login();
					Ext.MessageBox.alert('Error','Echec initUserEnv');
				}
			},
			failureJSON : function(res, req) {
				Ext.toast('Attention','Init User Env Failed','top');
			}
		});
	},

	autoExec : function(autoExecArray){
		var that = this;
		Ext.each(autoExecArray,function(module){
			that.launchModule(module);
		});
	}
});
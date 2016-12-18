(function(){
	'use strict';

	var dwnApp = angular.module('reQuesterApp', [
		'ngMaterial',
		'md.data.table',
		'ui.router',
		'ui.codemirror',
	]);

	dwnApp.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider) {
		$urlRouterProvider.otherwise("/editor");

		$stateProvider
		.state('reQuester', {
			url			: '/',
			templateUrl	: '/partials/home.html'
		})
		.state('reQuester.editor', {
			url			: 'editor',
			templateUrl	: '/partials/editor.html',
			controller	: 'reQuesterEditorCtrl'
		});
	}]);
})();

(function(){
	'use strict';

	var dwnApp = angular.module('reQuesterApp', [
		'ui.bootstrap',
		'ui.router'
	]);

	dwnApp.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider) {
		$urlRouterProvider.otherwise("/list");

		$stateProvider
		.state('reQuester', {
			url			: '/',
			templateUrl	: '/partials/home.html'
		})
		.state('reQuester.list', {
			url			: 'list',
			templateUrl	: '/partials/list.html',
			controller	: 'reQuesterListCtrl'
		});
	}]);
})();

(function(){
	'use strict';
	angular
	.module('reQuesterApp')
	.factory('reQuester', function($http) {
		var app={};
		return app;
	})
	.directive('requesterResponse',function(){
		return {
			scope		: {
				response	: '='
			},
			templateUrl	:'partials/response.directive.html',
			controller	:function($scope){
				$scope.responseTab='responseBody';
				$scope.changeTab = function(newTab){
					$scope.responseTab = newTab;
				}
			}
		};
	})
	.controller('reQuesterListCtrl',function($scope,$uibModal,$http,reQuester){
		$scope.request={};
		$scope.request.method = 'GET';
		$scope.request.url = 'https://jsonplaceholder.typicode.com/users';
		$scope.request.tab = 'body';
		$scope.request.headers = [];
		$scope.request.parameterType='wwwFormDataParameter';
		$scope.request.formDataParameters = [];
		$scope.request.wwwformDataParameters = [];
		$scope.response= {};
		$scope.addHeader=function(){
			$scope.request.headers.push({
				active	: true,
				key		: '',
				value		: '',
			});
		}
		$scope.addFormDataParameter=function(){
			$scope.request.formDataParameters.push({
				active	: true,
				key		: '',
				value	: '',
				type	: 'text',
			});
		}
		$scope.addWwwFormDataParameter=function(){
			$scope.request.wwwformDataParameters.push({
				active	: true,
				key		: '',
				value	: '',
			});
		}
		$scope.changeMethod = function(newMethod){
			$scope.request.method = newMethod;
		}
		$scope.changeTab = function(newTab){
			$scope.request.tab = newTab;
		}

		$scope.addHeader();
		$scope.addFormDataParameter();
		$scope.addWwwFormDataParameter();
		$scope.sendRequest = function(){
			$http({
				method	: 'POST',
				url		: 'http://localhost:3000/',
				data	: {
					method	: $scope.request.method,
					url		: $scope.request.url,
					headers	: _.reduce(_.filter($scope.request.headers,function(v){
						return v.active && v.key;
					}), function(acc, item) {
						acc[item['key']] = item['value'];
						return acc;
					}, {})
				}
			}).then(function successCallback(response) {
				$scope.response=response.data;
				$scope.response.body = JSON.parse($scope.response.body);
				console.log($scope.response);
				$scope.response.responseHeaders=response.headers();
			}, function errorCallback(response) {

			});
		}
	})
	.controller('reQuesterGlobalCtrl',function($scope,$http,minidns){
	});
})()

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
	.controller('mainReQuesterCtrl',function($scope,$timeout, $mdSidenav, $log) {
		$scope.close = function () {
			// Component lookup should always be available since we are not using `ng-if`
			$mdSidenav('left')
			.close()
			.then(function () {
				$log.debug("close LEFT is done");
			});
		};
	})
	.controller('reQuesterEditorCtrl',function($scope,$http,reQuester,$mdEditDialog) {
		$scope.request={};
		$scope.selectedHeaders=[];
		$scope.selectedFormDataParameters=[];
		$scope.selectedWwwFormDataParameters=[];
		$scope.selectedBodyTypeIndex=0;
		$scope.request.method = 'GET';
		$scope.request.url = 'https://jsonplaceholder.typicode.com/users';
		$scope.request.tab = 'body';
		$scope.request.headers = [];
		$scope.request.parameterType='wwwFormDataParameter';
		$scope.request.formDataParameters = [];
		$scope.request.wwwFormDataParameters = [];
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
			$scope.request.wwwFormDataParameters.push({
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

		$scope.editField = function (event, fieldName, row) {
			event.stopPropagation(); // in case autoselect is enabled

			var editDialog = {
				modelValue	: row[fieldName],
				title		: 'Add a '+fieldName,
				placeholder	: 'Add a '+fieldName,
				targetEvent	: event,
				validators	: {
					'md-maxlength': 30
				},
				save		: function (input) {
					if(input.$modelValue === '') {
						input.$invalid = true;
						return $q.reject();
					}
					row[fieldName] = input.$modelValue;
				},
			};

			$mdEditDialog
			.small(editDialog)
			.then(function (ctrl) {
				var input = ctrl.getInput();

				input.$viewChangeListeners.push(function () {
					input.$setValidity('test', input.$modelValue !== 'test');
				});
			});
		};

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
				//$scope.response.body = JSON.parse($scope.response.body);
				console.log($scope.response);
				$scope.response.responseHeaders=response.headers();
			}, function errorCallback(response) {

			});
		}
	})
	.controller('reQuesterGlobalCtrl',function($scope,$http,minidns){
	});
})()

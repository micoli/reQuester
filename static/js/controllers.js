(function(){
	'use strict';
	angular
	.module('reQuesterApp')
	.factory('reQuester', function($http) {
		var app={};
		return app;
	})
	.directive('requesterResponseViewer',function(){
		return {
			scope		: {
				response	: '='
			},
			templateUrl	:'partials/requester-response-viewer.directive.html',
			controller	:function($scope){
				$scope.responseTab='responseBody';
				$scope.changeTab = function(newTab){
					$scope.responseTab = newTab;
				}
			}
		};
	})
	.directive('requesterRequestTestsSourceCodeEditor',function(){
		return {
			scope		: {
				sourceCode	: '='
			},
			templateUrl	:'partials/requester-request-tests-source-code-editor.directive.html',
		};
	})
	.directive('requesterRequestEditor',function(){
		return {
			scope		: {
				request	: '='
			},
			templateUrl	:'partials/requester-request-editor.directive.html',
			controller : function($scope,$http,reQuester,$mdEditDialog){
				$scope.selectedBodyTypeIndex=0;
				$scope.response= {};

				$scope.addHeader=function(){
					$scope.request.headers.push({
						active	: true,
						key		: '',
						value	: '',
					});
				}

				$scope.addFormDataParameter=function(){
					$scope.request.formData.push({
						active	: true,
						key		: '',
						value	: '',
						type	: 'text',
					});
				}
				$scope.addFormParameter=function(){
					$scope.request.form.push({
						active	: true,
						key		: '',
						value	: '',
					});
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
				$scope.addFormParameter();

				var generateRequest = function(){
					var parameters = {
						method	: $scope.request.method,
						url		: $scope.request.url,
					};

					parameters.headers = _.reduce(_.filter($scope.request.headers,function(v){
						return v.active && v.key;
					}), function(acc, item) {
						acc[item['key']] = item['value'];
						return acc;
					}, {});

					return parameters;
				}

				$scope.sendRequest = function(){
					$http({
						method	: 'POST',
						url		: 'http://127.0.0.1:3000/',
						data	: generateRequest()
					})
					.then(function successCallback(response) {
						$scope.response=response.data;
						$scope.response.responseHeaders=response.headers();
					}, function errorCallback(response) {

					});
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
	.controller('reQuesterEditorCtrl',function($rootScope,$scope) {
		$scope.request = {
			method					: 'GET',
			url						: 'https://jsonplaceholder.typicode.com/users',
			headers					: [],
			formData				: [],
			form					: [],
			testsSourceCode			: '',
			bodySource				: ''
		};
		$rootScope.request = $scope.request;
	})
	.controller('reQuesterGlobalCtrl',function($scope,$http,minidns){
	});
})()

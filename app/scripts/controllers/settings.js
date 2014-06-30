'use strict';

angular.module('apiManApp')
	.controller('SettingsCtrl', function($scope, $http, $route, $location, ConfigService) {

		//--------------------------------
		// 初始化变量
		//--------------------------------
		$scope.token = "";
		$scope.configData = "";

		//--------------------------------
		// 加载配置文件
		//--------------------------------
		ConfigService.get(function(data) {
			$scope.configData = angular.toJson(data, true);
		});

		//--------------------------------
		// 保存配置文件
		//--------------------------------
		$scope.save = function() {
			$http({
				url: '/conf/save',
				method: 'POST',
				data: {
					token: $scope.token,
					data: $scope.configData
				}
			}).success(function(data, status) {
				$scope.message = data.message;
				$scope.$emit('menuChange', {});
			}).error(function(data, status) {
				$scope.message = data.message;
			});
		};
	});
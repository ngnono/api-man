'use strict';

angular.module('apiManApp')
	.controller('ResourceCtrl', function($scope, $routeParams, md5, $cookieStore, $http, ConfigService) {

		$scope.path = "/" + $routeParams.path;
		$scope.httpMethod = $routeParams.httpMethod;
		$scope.showData = $scope.httpMethod === "POST" || $scope.httpMethod === "PUT";
		$scope.showResult = false;
		$scope.token = $cookieStore.get('token') || {};

		// 获取方法列表
		ConfigService.get(function(data) {

			// 获取环境的名称列表,并设置环境列表名称
			$scope.envs = data.envs;

			// 根据地址和method查找配置
			var metadatas = data.apis;

			var metadata = {};
			for (var i = 0; i < metadatas.length; i++) {
				var item = metadatas[i];

				var resource = item.resources[$scope.path];
				if (resource && resource[$scope.httpMethod]) {
					metadata = resource[$scope.httpMethod];
				}
			}

			$scope.metadata = metadata;
			$scope.url = metadata.url || $scope.path;
			$scope.requestData = JSON.stringify($scope.metadata.data);
		});

		// 获取数据
		$scope.getData = function(envname) {

			var env = $scope.envs[envname];

			// 设置当前的环境的名称
			$scope.currentEnv = envname;

			// 服务的地址
			var url = '/proxy' + $scope.url;

			// 请求数据
			var data = $scope.requestData;

			//请求方法
			var method = $scope.httpMethod;

			console.log(method);

			// 消费者Key
			var consumerKey = env.consumerKey;

			// 消费者密钥
			var consumerSecure = env.consumerSecure;

			// -------------------------------------------
			// 签名计算
			// -------------------------------------------
			var buffer = [];

			buffer.push(method);
			buffer.push($scope.url);

			if (method === 'GET') {
				buffer.push('{}');
			} else {
				buffer.push(data);
			}

			buffer.push(consumerKey);
			buffer.push(consumerSecure);

			var sign = md5(buffer.join('').toUpperCase());

			console.log(buffer.join('').toUpperCase());

			$scope.result = {};

			$http({
				url: url,
				method: method,
				data: data,
				headers: {
					'X-ConsumerKey': consumerKey,
					'X-Token': $scope.token.access_token,
					"X-Host": env.host,
					"X-Port": env.port,
					'Content-Type': 'application/json',
					'X-Sign': sign
				}
			}).success(function(data, status, headers, config, statusText) {

				$scope.result = {
					'data': angular.toJson(data, true),
					'status': status
				};

				$scope.showResult = true;

				//如果是授权接口进行设置Token
				if ($scope.path === '/api/account/token') {
					//把Token数据写入缓存
					data.env = envname;
					$cookieStore.put('token', data);

					$scope.token = $cookieStore.get('token');
					console.log(data);
				}

			}).error(function(data, status) {
				$scope.result = {
					'data': angular.toJson(data, true),
					'status': status
				};
				$scope.showResult = true;

			});
		}
	});
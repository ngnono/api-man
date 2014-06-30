'use strict';

angular.module('apiManApp')
	.factory('ConfigService', function($resource) {
		return $resource('/conf/config.json', {}, {
			method: 'GET',
			isArray: false
		});
	});
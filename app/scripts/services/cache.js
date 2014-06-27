'use strict';

angular.module('apiManApp')
   .factory('cacheService', ['$cacheFactory', function($cacheFactory) {
     return $cacheFactory('apiManApp');
}]);

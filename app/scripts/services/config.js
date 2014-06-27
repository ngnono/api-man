'use strict';

angular.module('apiManApp')
  .factory('ConfigService', function ($resource) {
    
    // Public API here
    return $resource('/conf/config.json',{},{method:'GET',isArray:false});
  });

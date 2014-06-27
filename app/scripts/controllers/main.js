'use strict';


angular.module('apiManApp')
  .controller('MainCtrl', function($scope, ConfigService) {

    // 获取方法列表
    var load = function(){
        ConfigService.get(function(data) {
          $scope.apis = data.apis;
        });
    };

    load();

    $scope.$on('changeConfig',function (event,args) {
      // body...
      load();
    });

});
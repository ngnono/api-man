'use strict';


angular.module('apiManApp')
  .controller('MainCtrl', function($scope, ConfigService) {

    // 获取方法列表
    var loadMenu = function(){
        ConfigService.get(function(data) {
          $scope.apis = data.apis;
        });
    };

    $scope.$on('menuChange',function (event,args) {
      loadMenu();
    });

    loadMenu();
});
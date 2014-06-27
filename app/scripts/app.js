'use strict';

angular
  .module('apiManApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'angular-md5',
    'angular-loading-bar',
    'hljs'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/res/:httpMethod/:path*',{
        templateUrl: 'views/resource.html',
        controller: 'ResourceCtrl'
      })
      .when('/settings',{
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .otherwise({
        redirectTo: '/notfound'
      });
  });

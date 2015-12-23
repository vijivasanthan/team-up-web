'use strict';

define(
  [
    'angular',
    'controllers/controllers',
    'services/services',
    'filters/filters',
    'directives/directives',
    'angular-resource',
    'angular-route',
    'angular-animate',
    'angular-messages',
    'angular-md5',
    'angular-strap',
    'angular-dynamic-locale',
    'angular-sortable-view',
    'angular-cookie',
    'angular-websocket'
  ],
  function (angular)
  {
    return angular.module(
      'TeamUp',
      [
        'controllers',
        'services',
        'filters',
        'directives',
        //'ngAnimate',
        'ngResource',
        'ngRoute',
        'ngMessages',
        'ngMd5',
        'mgcrea.ngStrap',
        'ui.mask',
        'angular-sortable-view',
        'ipCookie',
        'tmh.dynamicLocale',
        'ngWebSocket'
      ]);
  }
);
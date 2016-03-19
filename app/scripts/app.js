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
    'angular-sanitize',
    'angular-strap',
    'angular-dynamic-locale',
    'angular-sortable-view',
    'angular-cookie'
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
        'ngAnimate',
        'ngResource',
        'ngRoute',
        'ngMessages',
        'ngMd5',
        'ngSanitize',
        'mgcrea.ngStrap',
        'ui.mask',
        'angular-sortable-view',
        'ipCookie',
        'tmh.dynamicLocale'
      ]);
  }
);
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
    'angular-md5',
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
        'ngResource',
        'ngRoute',
        'ngMd5',
        'mgcrea.ngStrap',
        'ui.mask',
        'angular-sortable-view',
        'ipCookie',
        'tmh.dynamicLocale'
      ]);
  }
);
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
    'angular-strap'
  ],
  function (angular)
  {
    return angular.module('TeamUp',
      [
        'controllers',
        'services',
        'filters',
        'directives',
        'ngResource',
        'ngRoute',
        'mgcrea.ngStrap'
      ]);
  }
);
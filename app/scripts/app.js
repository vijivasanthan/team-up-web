'use strict';

// TODO: 'ui.bootstrap.modal', '$strap.directives',

define(
  [
    'angular',
    'controllers/controllers',
    'services/services',
    'filters/filters',
    'directives/directives',
    'angular-resource',
    'angular-route',
    'angular-strap',
    'ui-bootstrap',
    'ng-vis'
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
        // 'mgcrea.ngStrap'
        '$strap.directives',
        'ui.bootstrap.modal',
        'NgVis'
      ]);
  }
);
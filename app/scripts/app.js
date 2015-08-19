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
    //'ui-sortable',
    'ng-sortable',
    'angular-cookie',
    //'ui-bootstrap',
    // 'ng-vis',
    // 'angular-google-maps',
    // 'angular-dragdrop',
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
        //'ui.sortable',
        //'ui.bootstrap.pagination',
        'ui.mask',

        'ng-sortable',
        'ipCookie',
        'tmh.dynamicLocale'
        //'$strap.directives',
        //'ui.bootstrap.modal',
        // 'NgVis',
        // 'google-maps',
        // 'ngDragDrop',
        // 'collapse',
      ]);
  }
);
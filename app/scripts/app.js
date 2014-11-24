'use strict';

// TODO: 'ui.bootstrap.modal', 'mgcrea.ngStrap.modals',
//http://plnkr.co/edit/?p=preview, http://plnkr.co/edit/xevoqZ4QOZC9T1Tx0LB1?p=preview

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
    'ui-bootstrap',
    // 'ng-vis',

    // 'angular-google-maps',

    // 'angular-dragdrop',
    // 'ui-sortable',
    'ui.bootstrap.pagination'
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
        'ui.bootstrap.modal',
        'mgcrea.ngStrap',
        //'$strap.directives',

        // 'NgVis',

        // 'google-maps',

        // 'ngDragDrop',
        // 'ui.sortable',
        // 'collapse',

        'ui.bootstrap.pagination'
      ]);
  }
);
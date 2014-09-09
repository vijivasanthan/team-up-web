define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'uploadCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        'Clients',
        '$route',
        '$routeParams',
        'Store',
        'Dater',
        '$filter',
        '$modal',
        'TeamUp',
        '$timeout',
        function ($rootScope, $scope, $location, Clients, $route, $routeParams, Store, Dater,
                  $filter, $modal, TeamUp, $timeout)
        {
          console.log("Clients -> ",Clients);
        }
      ]
    );
  }
);

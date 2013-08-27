/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Manage', [])

/**
 * Groups controller
 */
.controller('manageCtrl',[
    '$rootScope', '$scope', '$location', 'Clients','data', '$route', '$routeParams', 'Storage','Teams',
    function ($rootScope, $scope, $location, Clients, data, $route, $routeParams, Storage , Teams){


      /**
       * View setter
       */
      function setView (hash)
      {
        $scope.views = {
          teamClients:  false,
          teams:        false,
          clients:      false
        };

        $scope.views[hash] = true;
      }


      /**
       * Switch between the views and set hash accordingly
       */
      $scope.setViewTo = function (hash)
      {
        $scope.$watch(hash, function ()
        {
          $location.hash(hash);

          setView(hash);
        });
      };

      $scope.setViewTo('teamClients');
        
    }
    
]);
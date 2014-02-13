/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Manage', [])

/**
 * Groups controller
 */
.controller('manageCtrl',[
    '$rootScope', '$scope', '$location', 'Clients', '$route', '$routeParams', 'Storage', 'Teams', '$window',
    function ($rootScope, $scope, $location, Clients, $route, $routeParams, Storage , Teams, $window){

      /**
       * Define data sources
       * These sources should be populated from modals
       */
      var data = {

        /**
         * Members
         */
        members: [
          {
            _id:   1,
            name: 'Cengiz Ulusoy'
          },
          {
            _id:   2,
            name: 'Leonie van Dinten'
          },
          {
            _id:   3,
            name: 'Michael Jan Kun'
          }
        ],

        /**
         * Teams
         */
        teams: [
          {
            _id:   1,
            name: 'Verpleegkundigen Rotterdam'
          },
          {
            _id:   2,
            name: 'Thuiszorgers'
          },
          {
            _id:   3,
            name: 'Groep Schiedam'
          }],

        /**
         * Clients
         */
        clients: [
          {
            _id:   1,
            name: 'Gerda Bloom'
          },
          {
            _id:   2,
            name: 'Arjan Smit'
          },
          {
            _id:   3,
            name: 'Johan Pieters'
          }
        ],

        /**
         * Groups
         */
        groups: [
          {
            _id:   1,
            name: 'Erasmus Ziekenhuis'
          },
          {
            _id:   2,
            name: 'Delfshaven Bejaardenhuis'
          },
          {
            _id:   3,
            name: 'Schiedam Senioren'
          }
        ]
      };


      /**
       * Make empty data cells
       */
      $scope.data = {
        left: [],
        right: []
      };


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

          $scope.manage(hash);
        });
      };


      /**
       * Default startup
       */
      $scope.setViewTo('teamClients');


      /**
       * Manage TreeGrids
       */
      $scope.manage = function (grid)
      {
        switch (grid)
        {
          case 'teamClients':
            $rootScope.$broadcast('TreeGridManager', grid, '1:1', {
              left:   data.groups,
              right:  data.teams
            });
            break;

          case 'teams':
            $rootScope.$broadcast('TreeGridManager', grid, '1:n', {
              left:   data.members,
              right:  data.teams
            });
            break;

          case 'clients':
            $rootScope.$broadcast('TreeGridManager', grid, '1:n', {
              left:   data.clients,
              right:  data.groups
            });
            break;
        }
      };

    }
]);
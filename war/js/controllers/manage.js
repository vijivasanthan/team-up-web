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
            id:   'm1',
            name: 'Cengiz Ulusoy'
          },
          {
            id:   'm2',
            name: 'Leonie van Dinten'
          },
          {
            id:   'm3',
            name: 'Michael Jan Kun'
          }
        ],

        /**
         * Teams
         */
        teams: [
          {
            id:   't1',
            name: 'Verpleegkundigen Rotterdam'
          },
          {
            id:   't2',
            name: 'Thuiszorgers'
          },
          {
            id:   't3',
            name: 'Groep Schiedam'
          }],

        /**
         * Clients
         */
        clients: [
          {
            id:   'c1',
            name: 'Gerda Bloom'
          },
          {
            id:   'c2',
            name: 'Arjan Smit'
          },
          {
            id:   'c3',
            name: 'Johan Pieters'
          }
        ],

        /**
         * Groups
         */
        groups: [
          {
            id:   'g1',
            name: 'Erasmus Ziekenhuis'
          },
          {
            id:   'g2',
            name: 'Delfshaven Bejaardenhuis'
          },
          {
            id:   'g3',
            name: 'Schiedam Senioren'
          }
        ],

        /**
         * Connections
         */
        connections: {
          teamClients: {
            t1: 'g1',
//            t2: 'g2',
//            t3: 'g3'
          },
          teams: {},
          clients: {}
        }
      };


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


      $scope.setViewTo('teamClients');


      $scope.connector = {

        connections: {
          teamClients:  [],
          teams:        [],
          clients:      []
        },

        teamClients: function ()
        {
          this.connections.teamClients = [];

          var _this = this;

          angular.forEach(data.connections.teamClients, function (gid, tid)
          {
            var connection = {
              sourceItems:  [],
              targetItem:   {}
            };

            angular.forEach(data.teams, function (team)
            {
              if (team.id == tid)
              {
                connection.targetItem = team;
              }
            });

            var _group;

            for (var i = 0; i < data.groups.length; i++)
            {
              if (data.groups[i].id == gid)
              {
                _group = data.groups[i];

                connection.sourceItems.push(_group);
              }
            }

            _this.connections.teamClients.push(connection);
          });

          return this.connections;
        }
      };


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
            },
            $scope.connector.teamClients());
            break;

          case 'teams':
            $rootScope.$broadcast('TreeGridManager', grid, '1:n', {
              left:   data.members,
              right:  data.teams
            },
            data.connections);
            break;

          case 'clients':
            $rootScope.$broadcast('TreeGridManager', grid, '1:n', {
              left:   data.clients,
              right:  data.groups
            },
            data.connections);
            break;
        }
      };

    }
    
]);

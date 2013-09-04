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
        ]
      };


      /**
       * Connections
       */
      var connections = {
        teamClients: {
          t1: 'g1',
//          t2: 'g2',
//          t3: 'g3'
        },
        teams: {
          t1: [
            'm1',
            'm2'
          ],
          t2: [
            'm3'
          ]
        },
        clients: {
          g1: [
            'c1',
            'c2'
          ],
          g2: [
            'c3'
          ]
        }
      };


//      //if(data.local){
//      // data from local storage
//      var teams = angular.fromJson(Storage.get("Teams"));
//
//      console.log('teams ->', teams);
//
//      data.teams = teams;
//      var groups = angular.fromJson(Storage.get("ClientGroups"));
//      data.groups = groups;
//
//      var members = [];
//      var memberKeys = [];
//      angular.forEach(teams,function(team,index){
//        var mems = angular.fromJson(Storage.get(team.uuid));
//        angular.forEach(mems,function(mem,index){
//          if(memberKeys.indexOf(mem.uuid) == -1){
//            memberKeys.push(mem.uuid);
//            members.push({"name" : mem.firstName+" "+mem.lastName , "id" : mem.uuid });
//          }
//        });
//      });
//
//      data.members = members;
//
//      var clients = [];
//      angular.forEach(groups,function(group,index){
//        var cts = angular.fromJson(Storage.get(group.id));
//        angular.forEach(cts,function(client,index){
//          clients.push({"name" : client.firstName+" "+client.lastName , "id" : client.uuid});
//        });
//      });
//
//      data.clients = clients;
////      }else{
////        // data from the server
////      }
//
//      // start to populate data from storage
//      if(typeof data.teams == 'undefined'){
//
//      }
//
//      if(typeof data.clientGroups == 'undefined'){
//
//      }

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


      $scope.setViewTo('teams');


      $scope.connector = {

        data: connections,

        connections: {
          teamClients:  [],
          teams:        {},
          clients:      {}
        },

        teamClients: function ()
        {
          this.connections.teamClients = [];

          var _this = this;

          angular.forEach(this.data.teamClients, function (gid, tid)
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
        },


        teams: function ()
        {
          this.connections.teams = {};

          var connections = {};

          angular.forEach(this.data.teams, function (members, tid)
          {
            connections[tid] = [];

            angular.forEach(members, function (mid)
            {
              angular.forEach(data.members, function (member)
              {
                if (member.id == mid)
                {
                  connections[tid].push(member);
                }
              })
            });
          });

          this.connections.teams = connections;

          return this.connections;
        },


        clients: function ()
        {
          this.connections.clients = {};

          var connections = {};

          angular.forEach(this.data.clients, function (clients, gid)
          {
            connections[gid] = [];

            angular.forEach(clients, function (cid)
            {
              angular.forEach(data.clients, function (client)
              {
                if (client.id == cid)
                {
                  connections[gid].push(client);
                }
              })
            });
          });

          this.connections.clients = connections;

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
            $scope.connector.teams());
            break;

          case 'clients':
            $rootScope.$broadcast('TreeGridManager', grid, '1:n', {
              left:   data.clients,
              right:  data.groups
            },
            $scope.connector.clients());
            break;
        }
      };
      
    }
    
]);

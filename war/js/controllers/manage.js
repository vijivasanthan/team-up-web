/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Manage', [])

/**
 * Groups controller
 */
.controller('manageCtrl',[
    '$rootScope', '$scope', '$location', 'Clients', '$route', '$routeParams', 'Storage', 'Teams', '$window','data',
    function ($rootScope, $scope, $location, Clients, $route, $routeParams, Storage , Teams, $window,data){

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
          }
        ],

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
          t2: 'g2'
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


//      if (data.local)
//      {
//          /**
//           * Data from local storage
//           * Teams, team-member, team-group connection data
//           */
//          var teams_local = angular.fromJson(Storage.get("Teams")),
//              connections = {
//                teamClients:{},
//                teams:      {},
//                clients:    {}
//              },
//              members    = [],
//              memberKeys = [];
//
//          data.teams = [];
//
//          angular.forEach(teams_local, function(team)
//          {
//
//            /*
//             * push team data
//             */
//            data.teams.push({"id" : team.uuid , "name" : team.name});
//
//            var mems = angular.fromJson(Storage.get(team.uuid));
//            var memIds = [];
//            angular.forEach(mems,function(mem,index){
//              if(memberKeys.indexOf(mem.uuid) == -1){
//                memberKeys.push(mem.uuid);
//                members.push({"name" : mem.firstName+" "+mem.lastName , "id" : mem.uuid });
//                memIds.push(mem.uuid);
//              }
//            });
//
//            connections.teams[team.uuid] = memIds;
//
// <<<<<<< HEAD
//            /*
//             * push team group connection data
//             */
//
//            var grps = angular.fromJson(Storage.get("teamGroup_"+team.uuid));
//            if(typeof grps[0] != 'undefined'){
//                connections.teamClients[team.uuid] = grps[0].id;
//            }
//
//          });
//
//
//
//          data.members = members;
//
//          /**
//           * clients , group-client connection data
//           */
//          var groups = angular.fromJson(Storage.get("ClientGroups"));
//          data.groups = groups;
//
//          var clients = [];
//
//          angular.forEach(groups,function(group,index){
//            var cts = angular.fromJson(Storage.get(group.id));
//            var ctIds = [];
//            angular.forEach(cts,function(client,index){
//              clients.push({"name" : client.firstName+" "+client.lastName , "id" : client.uuid});
//              ctIds.push(client.uuid);
//            });
//
//            connections.clients[group.id] = ctIds;
//          });
//
//          data.clients = clients;
//      }else{
//        // data from the server
//      }
// =======
//      /**
//       * Connections
//       */
//      var connections = {
//        teamClients: {
//          t1: 'g1',
//          t2: 'g2'
//        },
//        teams: {
//          t1: [
//            'm1',
//            'm2'
//          ],
//          t2: [
//            'm3'
//          ]
//        },
//        clients: {
//          g1: [
//            'c1',
//            'c2'
//          ],
//          g2: [
//            'c3'
//          ]
//        }
//      };


//      if(data.local){
//          /*
//           * data from local storage
//           */
//
//          /**
//           * teams , team-member , team-group connection data
//           */
//          var teams_local = angular.fromJson(Storage.get("Teams"));
//
//          console.log('teams ->', teams_local);
//
//          var connections = {teamClients: {} , teams: {} ,clients: {} };
//
//
//
//          var members = [];
//          data.teams = [];
//
//          angular.forEach(teams_local,function(team,index){
//
//            /*
//             * push team data
//             */
//            data.teams.push({"id" : team.uuid , "name" : team.name});
//
//            var mems = angular.fromJson(Storage.get(team.uuid));
//            var memIds = [];
//            angular.forEach(mems,function(mem,index){
//                members.push({"name" : mem.firstName+" "+mem.lastName , "id" : mem.uuid });
//                memIds.push(mem.uuid);
//            });
//
//            console.log(team.name+"("+team.uuid+")","==>",memIds);
//
//            connections.teams[team.uuid] = memIds;
//
//          });
//
//          data.members = members;
//
//          /**
//           * clients , group-client connection data
//           */
//          var groups = angular.fromJson(Storage.get("ClientGroups"));
//          var groupIds = [];
//          data.groups = groups;
//
//          var clients = [];
//          var clientIds = [];
//
//          angular.forEach(groups,function(group,index){
//            var cts = angular.fromJson(Storage.get(group.id));
//            var ctIds = [];
//            angular.forEach(cts,function(client,index){
//              clients.push({"name" : client.firstName+" "+client.lastName , "id" : client.uuid});
//              ctIds.push(client.uuid);
//
//              // add to global client ids
//              if(clientIds.indexOf(client.uuid) == -1){
//                  clientIds.push(client.uuid);
//              }
//            });
//
//            connections.clients[group.id] = ctIds;
//
//            groupIds.push(group.id);
//          });
//
//          /*
//           * get the clients not in the client group
//           */
//          var clients_Not_In_Group = angular.fromJson(Storage.get("clients"));
//
//          angular.forEach(clients_Not_In_Group,function(client,index){
//              if(clientIds.indexOf(client.uuid) == -1){
//                  clientIds.push(client.uuid);
//                  clients.push({"name" : client.firstName+" "+client.lastName , "id" : client.uuid});
//              }
//          });
//
//          data.clients = clients;
//
//          angular.forEach(teams_local,function(team,index){
//              /*
//               * push team group connection data
//               */
//              var grps = angular.fromJson(Storage.get("teamGroup_"+team.uuid));
//              var kp = true;
//              angular.forEach(grps,function(grp,i){
//                  if(groupIds.indexOf(grp.id) != -1 && kp){
//                      connections.teamClients[team.uuid] = grp.id;
//                      kp = false;
//                  }
//              });
//
//          });
//
//          // keep the original connections into the scope
//          $scope.connections = connections;
//      }else{
//        // data from the server
//      }
//>>>>>>> 349776e07db6b8c05b5466a98daed16519c78b5e

      /**
       * Introduce and reset data containers
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
       * Default view
       */
      $scope.setViewTo('teamClients');


      /**
       * Prepare connections
       */
      $scope.connector = {

        /**
         * Cache connections
         */
        data: connections,

        /**
         * Containers
         */
        connections: {
          teamClients:  [],
          teams:        {},
          clients:      {}
        },

        /**
         * Team & Clients connections
         */
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

        /**
         * Populate connections
         */
        populate: function (connections, data)
        {
          var population = {};

          angular.forEach(connections, function (nodes, key)
          {
            population[key] = [];

            angular.forEach(nodes, function (kid)
            {
              angular.forEach(data, function (node)
              {
                if (node.id == kid)
                {
                  population[key].push({
                    _id:  node.id,
                    name: node.name
                  });
                }
              })
            });
          });

          // console.log('population ->', population);

          return population;
        },

        /**
         * Teams connections
         */
        teams: function ()
        {
          this.connections.teams = {};

          this.connections.teams = this.populate(this.data.teams, data.members);

          return this.connections;
        },

        /**
         * Clients connections
         */
        clients: function ()
        {
          this.connections.clients = {};

          this.connections.clients = this.populate(this.data.clients, data.clients);

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

      $scope.getChanges = function(preTeams,afterTeams){
          
          var changes = {};
          angular.forEach(preTeams,function(pMembers,tId){
              var notChanged = [];
              var afterMembers = afterTeams[tId]
              // find the unchanged items
              angular.forEach(pMembers,function(p_mem,t_i){
                  angular.forEach(afterMembers,function(at,t_j){
                      if(p_mem == at){
                          notChanged.push(p_mem);
                      }
                  });
              });
              console.log(tId,"-->",notChanged);
              
              /*
               * try to remove the unchanged items from both list
               * 
               * then for items in the previous list are the items need to be removed
               *  
               *          items in the changed list are the items need to be added
               */ 
              
              angular.forEach(notChanged,function(nc){
                  pMembers.splice(pMembers.indexOf(nc),1);
                  afterMembers.splice(afterMembers.indexOf(nc),1);
              });
              
              console.log("need to remove : " + pMembers); 
              console.log("need to add : " + afterMembers);
              console.log("----------------------");
              
              var addMembers = [];
              var removeMembers = [];
              
              angular.copy(pMembers, removeMembers);
              angular.copy(afterMembers, addMembers);
              
              if(addMembers.length > 0 || addMembers.length > 0 ){
                  changes[tId] = {a : addMembers, 
                                  r : removeMembers};
              }
              
              // add the nonChanged item back 
              angular.forEach(notChanged,function(nc){
                  pMembers.push(nc);
                  afterMembers.push(nc);
              });
              
          });
          
          return changes; 
      }

      /**
       * Save function listeners
       */
      $rootScope.$on('save:teamClients', function ()
      {
        console.log("before changing ->",connections.teamClients);
        console.log('saving team clients ->', arguments[1]);
      });
      
      $rootScope.$on('save:teams', function ()
      {
        console.log("before teams -> ", $scope.connections.teams);  
        console.log('saving teams ->', arguments[1]);
        
        var preTeams = $scope.connections.teams;
        var afterTeams = arguments[1];
        var changes = $scope.getChanges(preTeams,afterTeams);
        
        // get all the changes  
        if(angular.equals({},changes)){
            console.log("no changes ! ");
        }else{
            console.log("Team Member changs : " ,changes);
            
            $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);
            
            Teams.manage(changes).then(function(result){
                
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();
                
            });
        }
        
        
      });

      $rootScope.$on('save:clients', function ()
      {
        console.log("before clients -> ", $scope.connections.clients);
        console.log('saving clients ->', arguments[1]);
        
        var preClients = $scope.connections.clients;
        var afterClients = arguments[1];
        var changes = $scope.getChanges(preClients,afterClients);
        
        console.log("Group Client changes : ", changes);
        
        // get all the changes  
        if(angular.equals({},changes)){
            console.log("no changes ! ");
        }else{
            $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);
            
            Clients.manage(changes).then(function(result){
                
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();
                
            });
        }
        
      });
      
      
      
    }
    
]);

define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'manageCtrl', [
        '$rootScope', '$scope', '$location', 'Clients', '$route', '$routeParams', 'Store', 'Teams', '$window', 'data',
        'TeamUp',
        function ($rootScope, $scope, $location, Clients, $route, $routeParams, Store, Teams, $window, data, TeamUp)
        {
          $scope.loadData = function (data)
          {
            if (data && data.local)
            {
              var teamsLocal = Store('app').get('teams');

              var connections = {
                teamClients: {},
                teams:       {},
                clients:     {}
              };

              var members = [];

              data.teams = [];

              var memberGlobalIds = [];

              angular.forEach(
                teamsLocal,
                function (team)
                {
                  data.teams.push(
                    {
                      'id':   team.uuid,
                      'name': team.name
                    }
                  );

                  var memberIds = [];

                  angular.forEach(
                    Store('app').get(team.uuid),
                    function (member)
                    {
                      memberIds.push(member.uuid);

                      if (memberGlobalIds.indexOf(member.uuid) == - 1)
                      {
                        members.push(
                          {
                            'name': member.firstName + ' ' + member.lastName,
                            'id': member.uuid
                          }
                        );

                        memberGlobalIds.push(member.uuid);
                      }
                    });

                  connections.teams[team.uuid] = memberIds;
                });

              angular.forEach(
                Store('app').get('members'),
                function (member)
                {
                  if (memberGlobalIds.indexOf(member.uuid) == - 1)
                  {
                    members.push(
                      {
                        'name': member.firstName + " " + member.lastName,
                        'id': member.uuid
                      }
                    );
                  }
                });

              data.members = members;

              data.groups = Store('app').get('ClientGroups');

              var groupIds = [];
              var clients = [];
              var clientIds = [];

              angular.forEach(
                data.groups,
                function (group)
                {
                  var clientIds = [];

                  angular.forEach(
                    Store('app').get(group.id),
                    function (client)
                    {
                      clientIds.push(client.uuid);

                      // add to global client ids
                      if (clientIds.indexOf(client.uuid) == - 1)
                      {
                        clientIds.push(client.uuid);

                        clients.push(
                          {
                            'name': client.firstName + ' ' + client.lastName,
                            'id': client.uuid
                          }
                        );
                      }
                    });

                  connections.clients[group.id] = clientIds;

                  groupIds.push(group.id);
                });

              angular.forEach(
                Store('app').get('clients'),
                function (client)
                {
                  if (clientIds.indexOf(client.uuid) == - 1)
                  {
                    clientIds.push(client.uuid);

                    clients.push(
                      {
                        'name': client.firstName + ' ' + client.lastName,
                        'id': client.uuid
                      }
                    );
                  }
                });

              data.clients = clients;

              angular.forEach(
                teamsLocal,
                function (team)
                {
                  var kp = true;

                  angular.forEach(
                    Store('app').get('teamGroup_' + team.uuid),
                    function (group)
                    {
                      if (groupIds.indexOf(group.id) != - 1 && kp)
                      {
                        connections.teamClients[team.uuid] = group.id;

                        kp = false;
                      }
                    });

                });

              $scope.connections = connections;

              return {
                data: data,
                con:  connections
              };
            }
            else
            {
              return {
                data: {},
                con:  {}
              };
            }

          };

          // TODO: Repetitive code
          var localData = $scope.loadData(data);
          data = localData.data;
          var connections = localData.con;

          $scope.data = {
            left:  [],
            right: []
          };

          function setView (hash)
          {
            $scope.views = {
              teamClients: false,
              teams:       false,
              clients:     false
            };

            $scope.views[hash] = true;

            // TODO: Repetitive code
            var localData = $scope.loadData(data);
            data = localData.data;
            connections = localData.con;
          }

          $scope.setViewTo = function (hash)
          {
            if (typeof $scope.dataChanged != "undefined" && $scope.dataChanged($location.$$hash))
            {
              if (! confirm($rootScope.ui.teamup.managePanelchangePrompt))
              {
                event.preventDefault();

                return false;
              }
            }

            $scope.$watch(
              hash, function ()
              {
                $location.hash(hash);

                setView(hash);

                $scope.manage(hash);
              });
          };

          $scope.setViewTo('teamClients');

          $scope.connector = {
            data:        connections,
            connections: {
              teamClients: [],
              teams:       {},
              clients:     {}
            },
            teamClients: function ()
            {
              this.connections.teamClients = [];

              angular.forEach(
                this.data.teamClients,
                (function (gid, tid)
                {
                  var connection = {
                    sourceItems: [],
                    targetItem:  {}
                  };

                  angular.forEach(
                    data.teams,
                    function (team)
                    {
                      if (team.id == tid)
                      {
                        connection.targetItem = team;
                      }
                    });

                  var _group;

                  for (var i = 0; i < data.groups.length; i ++)
                  {
                    if (data.groups[i].id == gid)
                    {
                      _group = data.groups[i];

                      connection.sourceItems.push(_group);
                    }
                  }

                  this.connections.teamClients.push(connection);
                }).bind(this)
              );

              return this.connections;
            },

            populate: function (connections, data, section)
            {
              var population = {};

              angular.forEach(
                connections, function (nodes, key)
                {
                  population[key] = [];

                  angular.forEach(
                    nodes, function (kid)
                    {
                      angular.forEach(
                        data, function (node)
                        {
                          if (node.id == kid)
                          {
                            population[key].push(
                              {
                                _id:  node.id,
                                name: node.name,
                                _parent: section + key
                              });
                          }
                        });
                    });
                });

              return population;
            },

            teams: function ()
            {
              this.connections.teams = {};

              this.connections.teams = this.populate(this.data.teams, data.members, 'teams_right_');

              return this.connections;
            },

            clients: function ()
            {
              this.connections.clients = {};

              this.connections.clients = this.populate(this.data.clients, data.clients, 'clients_right_');

              return this.connections;
            }
          };

          $scope.manage = function (grid)
          {
            switch (grid)
            {
              case 'teamClients':
                $rootScope.$broadcast(
                  'TreeGridManager', grid, '1:1', {
                    left:  data.groups,
                    right: data.teams
                  },
                  $scope.connector.teamClients());
                break;

              case 'teams':
                $rootScope.$broadcast(
                  'TreeGridManager', grid, '1:n', {
                    left:  data.members,
                    right: data.teams
                  },
                  $scope.connector.teams());
                break;

              case 'clients':
                $rootScope.$broadcast(
                  'TreeGridManager', grid, '1:n', {
                    left:  data.clients,
                    right: data.groups
                  },
                  $scope.connector.clients());
                break;
            }
          };

          $scope.getChanges = function (preTeams, afterTeams)
          {
            var changes = {};

            angular.forEach(
              preTeams, function (pMembers, tId)
              {
                var notChanged = [];
                var afterMembers = afterTeams[tId];

                // find the unchanged items
                angular.forEach(
                  pMembers, function (p_mem)
                  {
                    angular.forEach(
                      afterMembers, function (at)
                      {
                        if (p_mem == at)
                        {
                          notChanged.push(p_mem);
                        }
                      });
                  });

                /*
                 * try to remove the unchanged items from both list
                 *
                 * then for items in the previous list are the items need to be removed
                 *
                 *          items in the changed list are the items need to be added
                 */

                angular.forEach(
                  notChanged, function (nc)
                  {
                    pMembers.splice(pMembers.indexOf(nc), 1);
                    afterMembers.splice(afterMembers.indexOf(nc), 1);
                  });

                var addMembers = [];
                var removeMembers = [];

                angular.copy(pMembers, removeMembers);
                angular.copy(afterMembers, addMembers);

                if (addMembers.length > 0 ||
                    addMembers.length > 0 ||
                    removeMembers.length > 0 ||
                    removeMembers.length > 0)
                {
                  changes[tId] = {
                    a: addMembers,
                    r: removeMembers
                  };
                }

                // add the nonChanged item back
                angular.forEach(
                  notChanged, function (nc)
                  {
                    pMembers.push(nc);

                    afterMembers.push(nc);
                  });

              });

            return changes;
          };

          /**
           * Save function listeners
           */
          /**
           * remove the duplicated listeners when going back to the controller
           * temp solution
           */
          if ($rootScope.$$listeners["save:teamClients"] && $rootScope.$$listeners["save:teamClients"].length > 0)
          {
            $rootScope.$$listeners["save:teamClients"] = [];
          }

          if ($rootScope.$$listeners["save:teams"] && $rootScope.$$listeners["save:teams"].length > 0)
          {
            $rootScope.$$listeners["save:teams"] = [];
          }

          if ($rootScope.$$listeners["save:clients"] && $rootScope.$$listeners["save:clients"].length > 0)
          {
            $rootScope.$$listeners["save:clients"] = [];
          }

          $scope.getChangesFromTeamClients = function (argument)
          {
            var preTc = $scope.connections.teamClients;
            var afterTc = argument;

            var teamIds = [];

            angular.forEach(
              preTc, function (preG, teamId_i)
              {
                if (teamIds.indexOf(teamId_i) == - 1)
                {
                  teamIds.push(teamId_i);
                }
              });

            angular.forEach(
              afterTc, function (afterG, teamId_j)
              {
                if (teamIds.indexOf(teamId_j) == - 1)
                {
                  teamIds.push(teamId_j);
                }
              });

            var changes = {};

            angular.forEach(
              teamIds, function (tId)
              {
                if (typeof preTc[tId] == 'undefined' && afterTc[tId])
                {
                  changes[tId] = {a: [afterTc[tId]], r: []};
                }
                else if (typeof afterTc[tId] == 'undefined' && preTc[tId])
                {
                  changes[tId] = {r: [preTc[tId]], a: []};
                }
                else if (preTc[tId] && afterTc[tId] && preTc[tId] != afterTc[tId])
                {
                  changes[tId] = {a: [afterTc[tId]], r: [preTc[tId]]};
                }
              });

            return changes;
          };

          $scope.applyTeamClientsChanges = function (changes)
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

            Teams.manageGroups(changes).then(
              function (results)
              {
                var error = "";
                angular.forEach(
                  results, function (res, i)
                  {
                    if (res.error)
                    {
                      error += res.error.data.error;
                    }
                  });

                if (error == "")
                {
                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                  $route.reload();
                }
                else
                {
                  $rootScope.notifier.error(error);
                }

                $rootScope.statusBar.off();
              });
          };

          $rootScope.$on(
            'save:teamClients', function ()
            {
              var changes = $scope.getChangesFromTeamClients(arguments[1]);

              if (angular.equals({}, changes))
              {
                console.log("no changes ! ");
              }
              else
              {
                // console.log("Team Groups changes : ", changes);

                $scope.applyTeamClientsChanges(changes);
              }
            });

          $scope.applyTeamsChanges = function (changes)
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

            Teams.manage(changes).then(
              function ()
              {
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);

                TeamUp._('teamMemberFree')
                  .then(
                  function (result)
                  {
                    Store('app').save('members', result);

                    $rootScope.statusBar.off();

                    $route.reload();
                  },
                  function (error) { console.log(error) });
              }
            );
          };

          $rootScope.$on(
            'save:teams',
            function ()
            {
              var preTeams = $scope.connections.teams;
              var afterTeams = arguments[1];
              var changes = $scope.getChanges(preTeams, afterTeams);

              if (angular.equals({}, changes))
              {
                console.log("no changes ! ");
              }
              else
              {
                $scope.applyTeamsChanges(changes);
              }
            });

          $rootScope.$on(
            'save:clients',
            function ()
            {
              var preClients = $scope.connections.clients;
              var afterClients = arguments[1];
              var changes = $scope.getChanges(preClients, afterClients);

              if (angular.equals({}, changes))
              {
                console.log("no changes ! ");
              }
              else
              {
                $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                Clients.manage(changes)
                  .then(
                  function ()
                  {
                    $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                    $rootScope.statusBar.off();

                    $route.reload();
                  }
                );
              }
            });

          $scope.dataChanged = function (currentLoc)
          {
            var loc_parts = currentLoc.split("#");
            var tab = loc_parts[loc_parts.length - 1];
            var changes = {};

            if (tab == "teamClients")
            {
              var argument = $scope.$$childTail.getData.teamClients();
              changes = $scope.getChangesFromTeamClients(argument);
            }
            else if (tab == "teams")
            {
              var preTeams = $scope.connections.teams;
              var afterTeams = $scope.$$childTail.getData.teams();
              changes = $scope.getChanges(preTeams, afterTeams);
            }
            else if (tab == "clients")
            {
              var preClients = $scope.connections.clients;
              var afterClients = $scope.$$childTail.getData.clients();
              changes = $scope.getChanges(preClients, afterClients);
            }

            return (angular.equals({}, changes)) ? false : true;
          };
        }
      ]);
  }
);
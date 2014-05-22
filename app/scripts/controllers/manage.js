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

              var groupIds = [],
                  clients = [],
                  clientIds = [];

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
                }
              );

              data.clients = clients;

              angular.forEach(
                teamsLocal,
                function (team)
                {
                  var flag = true;

                  angular.forEach(
                    Store('app').get('teamGroup_' + team.uuid),
                    function (group)
                    {
                      if (groupIds.indexOf(group.id) != - 1 && flag)
                      {
                        connections.teamClients[team.uuid] = group.id;

                        flag = false;
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
            if (typeof $scope.dataChanged != "undefined" &&
                $scope.dataChanged($location.$$hash))
            {
              if (! confirm($rootScope.ui.teamup.managePanelchangePrompt))
              {
                event.preventDefault();

                return false;
              }
            }

            $scope.$watch(
              hash,
              function ()
              {
                $location.hash(hash);

                setView(hash);

                $scope.manage(hash);
              }
            );
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
                    }
                  );

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
                connections,
                function (nodes, key)
                {
                  population[key] = [];

                  angular.forEach(
                    nodes,
                    function (kid)
                    {
                      angular.forEach(
                        data,
                        function (node)
                        {
                          if (node.id == kid)
                          {
                            population[key].push(
                              {
                                _id:  node.id,
                                name: node.name,
                                _parent: section + key
                              }
                            );
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

          $scope.getChanges = function (beforeTeams, afterTeams)
          {
            var changes = {};

            angular.forEach(
              beforeTeams, 
              function (_beforeTeam, tId)
              {
                var notChanged = [];
                var afterMembers = afterTeams[tId];

                // find the unchanged items
                angular.forEach(
                  _beforeTeam, 
                  function (_beforeTeamMember)
                  {
                    angular.forEach(
                      afterMembers, 
                      function (afterTeam)
                      {
                        if (_beforeTeamMember == afterTeam)
                        {
                          notChanged.push(_beforeTeamMember);
                        }
                      });
                  }
                );

                /*
                 * try to remove the unchanged items from both list
                 *
                 * then for items in the previous list are the items need to be removed
                 *
                 *          items in the changed list are the items need to be added
                 */

                angular.forEach(
                  notChanged, 
                  function (notchangedNode)
                  {
                    _beforeTeam.splice(_beforeTeam.indexOf(notchangedNode), 1);
                    
                    afterMembers.splice(afterMembers.indexOf(notchangedNode), 1);
                  });

                var addMembers = [],
                    removeMembers = [];

                angular.copy(_beforeTeam, removeMembers);
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
                  notChanged, 
                  function (notChangedNode)
                  {
                    _beforeTeam.push(notChangedNode);

                    afterMembers.push(notChangedNode);
                  }
                );

              });

            return changes;
          };

          // TODO: Remove these intern angular methods!!
          /**
           * Save function listeners
           */
          /**
           * remove the duplicated listeners when going back to the controller
           * temp solution
           */
          if ($rootScope.$$listeners["save:teamClients"] &&
              $rootScope.$$listeners["save:teamClients"].length > 0)
          {
            $rootScope.$$listeners["save:teamClients"] = [];
          }

          if ($rootScope.$$listeners["save:teams"] &&
              $rootScope.$$listeners["save:teams"].length > 0)
          {
            $rootScope.$$listeners["save:teams"] = [];
          }

          if ($rootScope.$$listeners["save:clients"] &&
              $rootScope.$$listeners["save:clients"].length > 0)
          {
            $rootScope.$$listeners["save:clients"] = [];
          }

          $scope.getChangesFromTeamClients = function (argument)
          {
            var beforeTeamClients = $scope.connections.teamClients,
                afterTeamClients = argument;

            var teamIds = [];

            angular.forEach(
              beforeTeamClients,
              function (teamClient, i)
              {
                if (teamIds.indexOf(i) == - 1)
                {
                  teamIds.push(i);
                }
              }
            );

            angular.forEach(
              afterTeamClients,
              function (teamClient, i)
              {
                if (teamIds.indexOf(i) == - 1)
                {
                  teamIds.push(i);
                }
              });

            var changes = {};

            angular.forEach(
              teamIds,
              function (tId)
              {
                if (typeof beforeTeamClients[tId] == 'undefined' &&
                    afterTeamClients[tId])
                {
                  changes[tId] = {
                    a: [afterTeamClients[tId]],
                    r: []
                  };
                }
                else if (typeof afterTeamClients[tId] == 'undefined' &&
                         beforeTeamClients[tId])
                {
                  changes[tId] = {
                    r: [beforeTeamClients[tId]],
                    a: []
                  };
                }
                else if (beforeTeamClients[tId] &&
                         afterTeamClients[tId] &&
                         beforeTeamClients[tId] != afterTeamClients[tId])
                {
                  changes[tId] = {
                    a: [afterTeamClients[tId]],
                    r: [beforeTeamClients[tId]]
                  };
                }
              });

            return changes;
          };

          $scope.applyTeamClientsChanges = function (changes)
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

            Teams.manageGroups(changes)
              .then(
              function (results)
              {
                var error = "";

                angular.forEach(
                  results,
                  function (result)
                  {
                    if (result.error)
                    {
                      error += result.error.data.error;
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
              }
            );
          };

          $rootScope.$on(
            'save:teamClients',
            function ()
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

            Teams.manage(changes)
              .then(
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
              var changes = $scope.getChanges($scope.connections.teams, arguments[1]);

              if (angular.equals({}, changes))
              {
                console.log("no changes ! ");
              }
              else
              {
                $scope.applyTeamsChanges(changes);
              }
            }
          );

          $rootScope.$on(
            'save:clients',
            function ()
            {
              var changes = $scope.getChanges($scope.connections.clients, arguments[1]);

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
            }
          );

          $scope.dataChanged = function (current)
          {
            var parts = current.split("#"),
                tab = parts[parts.length - 1],
                changes = {};

            if (tab == "teamClients")
            {
              // TODO: Remove this intern angular method
              changes = $scope.getChangesFromTeamClients($scope.$$childTail.getData.teamClients());
            }
            else if (tab == "teams")
            {
              changes = $scope.getChanges(
                $scope.connections.teams,
                $scope.$$childTail.getData.teams()
              );
            }
            else if (tab == "clients")
            {
              changes = $scope.getChanges(
                $scope.connections.clients,
                $scope.$$childTail.getData.clients()
              );
            }

            return (angular.equals({}, changes)) ? false : true;
          };
        }
      ]);
  }
);
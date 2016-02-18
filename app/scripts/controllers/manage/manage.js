define(
  ['../controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'manageCtrl',
        function ($rootScope, $scope, $location, Clients, $route, $routeParams, Store,
                  Teams, $window, data, TeamUp, $filter, $timeout, Permission, $injector, dataMembers)
        {
          $rootScope.fixStyles();

          function loadData (data)
          {
            // console.log('loading data -> ', new Date());

            if (data && data.local)
            {
              // console.log('loading local ->', data.local);

              var teamsLocal = Store('app').get('teams'),
                connections = {
                  teamClients: {},
                  teams: {},
                  clients: {}
                },
                members = [],
                memberGlobalIds = [];

              // console.log('teamsLocal ->', teamsLocal);
              // console.log('-------------------------------------------');

              data.teams = [];

              angular.forEach(
                teamsLocal,
                function (team)
                {
                  data.teams.push(
                    {
                      'id': team.uuid,
                      'name': team.name
                    }
                  );

                  var memberIds = [];
                  var currentTeam = Store('app').get(team.uuid);
                  currentTeam = $filter('orderBy')(currentTeam, 'lastName');

                  angular.forEach(
                    currentTeam,
                    function (member)
                    {
                      if (!_.isUndefined(member) && !_.isUndefined(member.uuid))
                      {
                        memberIds.push(member.uuid);
                        members.push(
                          {
                            'name': member.firstName + ' ' + member.lastName,
                            'lastName': member.lastName,
                            'id': member.uuid
                          }
                        );
                      }

                      if (memberGlobalIds.indexOf(member.uuid) == - 1)
                      {
                        memberGlobalIds.push(member.uuid);
                      }
                    }
                  );

                  connections.teams[team.uuid] = memberIds;
                }
              );
              data.teams = $filter('orderBy')(data.teams, 'name');

              angular.forEach(
                dataMembers,
                function (member)
                {
                  if (memberGlobalIds.indexOf(member.uuid) == - 1)
                  {
                    members.push(
                      {
                        'name': member.firstName + ' ' + member.lastName,
                        'lastName': member.lastName,
                        'id': member.uuid
                      }
                    );
                  }
                }
              );

              data.members = $filter('orderBy')(members, 'lastName');

              data.groups = Store('app').get('ClientGroups');

              data.groups = $filter('orderBy')(data.groups, 'name');

              console.log('data.groups', data.groups);

              // console.log('members ->', members);
              // console.log('ClientGroups ->', data.groups);
              // console.log('-------------------------------------------');

              var groupIds = [],
                clients = [],
                clientIds = [];

              var allClients = Store('app').get('clients');
              allClients = $filter('orderBy')(allClients, 'lastName');

              angular.forEach(
                allClients,
                function (client)
                {
                  if (clientIds.indexOf(client.uuid) == -1)
                  {
                    clientIds.push(client.uuid);

                    clients.push(
                      {
                        'name': client.firstName + ' ' + client.lastName,
                        'clientGroupUuid': client.clientGroupUuid || null,
                        'id': client.uuid
                      }
                    );
                  }
                }
              );

              //TODO clientsGrouped
              //var clientsGrouped = _.groupBy(clients, 'clientGroupUuid');

              angular.forEach(
                data.groups,
                function (group)
                {
                  var cIds = [];
                  var currentClientGroup = Store('app').get(group.id);
                  currentClientGroup = $filter('orderBy')(currentClientGroup, 'lastName');

                  angular.forEach(
                    currentClientGroup,
                    function (client)
                    {
                      if (client != null && cIds.indexOf(client.uuid) == - 1 && typeof client.uuid != "undefined")
                      {
                        cIds.push(client.uuid);

                        //clients.push(
                        //  {
                        //    'name': client.firstName + ' ' + client.lastName,
                        //    'id': client.uuid
                        //  }
                        //);
                      }

                      if (client != null && clientIds.indexOf(client.uuid) == - 1)
                      {
                        clientIds.push(client.uuid);
                      }
                    }
                  );

                  connections.clients[group.id] = cIds;
                  groupIds.push(group.id);
                }
              );

              //TODO clientsGrouped
              //console.error('connections.clients', connections.clients);
              //var addClients = {};
              //
              //_.each(connections.clients, function (clientsSingleGroup, clientGroupid)
              //{
              //  addClients[clientGroupid] = {
              //    a: clientsSingleGroup,
              //    r: []
              //  };
              //})
              //
              //console.error('addClients', addClients);

              //Clients.manage(addClients)
              //  .then(
              //    function (result)
              //    {
              //      console.error('result', result);
              //      $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
              //      $rootScope.statusBar.off();
              //
              //      $timeout(function () { $route.reload() }, 250);
              //    }
              //  );
              data.clients = clients;

              connections.teamClients = data.teamsClientGroupRelations;//Teams.queryLocalClientGroup(teamsLocal);

              $scope.connections = connections;

              return {
                data: data,
                con: connections
              };
            }
            else
            {
              return {
                data: {},
                con: {}
              };
            }
          }
          // end of loadData

          if(! $rootScope.app.resources.teamUuids.length)
          {
            $rootScope.infoUserWithoutTeam();
          }

          // TODO: Repetitive code
          var localData = loadData(data);
          data = localData.data;
          var connections = localData.con;

          $scope.data = {
            left: [],
            right: []
          };

          function setView (hash)
          {
            $scope.views = {
              teamClients: false,
              teams: false,
              clients: false
            };

            $scope.views[hash] = true;

            // TODO: Repetitive code
            var localData = loadData(data);
            data = localData.data;
            connections = localData.con;
          }

          $scope.setViewTo = function (hash)
          {
            if (typeof $scope.dataChanged != 'undefined' && $scope.dataChanged($location.$$hash))
            {
              if (! confirm($rootScope.ui.teamup.managePanelchangePrompt))
              {
                event.preventDefault();

                return false;
              }
            }

            switch (hash)
            {
              case "clients":
                console.log("clients is on ");
                break;
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

          $scope.setViewTo($rootScope.app.domainPermission.clients ? 'teamClients' : 'teams');

          $scope.connector = {
            data: connections,
            connections: {
              teamClients: [],
              teams: {},
              clients: {}
            },
            teamClients: function ()
            {
              this.connections.teamClients = [];

              angular.forEach(
                this.data.teamClients,
                (function (groupId, teamId)
                {
                  var connection = {
                    sourceItems: [],
                    targetItem: {}
                  };

                  angular.forEach(
                    data.teams,
                    function (team)
                    {
                      if (team.id == teamId)
                      {
                        connection.targetItem = team;
                      }
                    }
                  );

                  var _group;

                  for (var i = 0; i < data.groups.length; i ++)
                  {
                    if (data.groups[i].id == groupId)
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

            populate: function (connections, currentData, section)
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
                        currentData,
                        function (node)
                        {
                          if (node.id == kid)
                          {
                            population[key].push(
                              {
                                _id: node.id,
                                name: node.name,
                                _parent: section + key
                              }
                            );
                          }
                        }
                      );
                    }
                  );
                }
              );
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
              //console.log('clients', data.clients);
              this.connections.clients = this.populate(this.data.clients, data.clients, 'clients_right_');

              return this.connections;
            }
          };

          $scope.manage = function (grid)
          {
            switch (grid)
            {
              case 'teamClients':

                // console.log('grid ->', grid);
                // console.log('groups ->', data.groups);
                // console.log('teams ->', data.teams);
                // console.log('connections ->', $scope.connector.teamClients());

                $rootScope.$broadcast(
                  'TreeGridManager',
                  grid,
                  '1:1',
                  {
                    left: data.groups,
                    right: data.teams
                  },
                  $scope.connector.teamClients()
                );

                break;

              case 'teams':

                $rootScope.$broadcast(
                  'TreeGridManager',
                  grid,
                  '1:n',
                  {
                    left: data.members,
                    right: data.teams
                  },
                  $scope.connector.teams()
                );

                break;

              case 'clients':
                $rootScope.$broadcast(
                  'TreeGridManager',
                  grid,
                  '1:n',
                  {
                    left: data.clients,
                    right: data.groups
                  },
                  $scope.connector.clients()
                );

                break;
            }
          };

          $scope.getChanges = function (beforeTeams, afterTeams)
          {
            var changes = {};

            angular.forEach(
              beforeTeams,
              function (_beforeTeam, teamId)
              {
                var notChanged = [],
                  afterMembers = afterTeams[teamId];

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
                      }
                    );
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
                  function (notChangedNode)
                  {
                    _beforeTeam.splice(_beforeTeam.indexOf(notChangedNode), 1);

                    afterMembers.splice(afterMembers.indexOf(notChangedNode), 1);
                  }
                );

                var addMembers = [],
                  removeMembers = [];

                angular.copy(_beforeTeam, removeMembers);
                angular.copy(afterMembers, addMembers);

                if (addMembers.length > 0 ||
                  removeMembers.length > 0
                )
                {
                  // TODO: More readable property names!
                  changes[teamId] = {
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
              }
            );

            // deal the empty "before team"
            angular.forEach(
              afterTeams, function (_afterTeam, afterteamId)
              {
                angular.forEach(
                  beforeTeams, function (beforeTeam, beforeteamId)
                  {
                    if (afterteamId == beforeteamId)
                    {
                      afterteamId = null;
                    }
                  });
                // this means there is new items going to add to the emtpy before team
                if (afterteamId != null)
                {
                  changes[afterteamId] = {
                    a: _afterTeam,
                    r: []
                  };
                }
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
          if ($rootScope.$$listeners['save:teamClients'] &&
            $rootScope.$$listeners['save:teamClients'].length > 0)
          {
            $rootScope.$$listeners['save:teamClients'] = [];
          }

          if ($rootScope.$$listeners['save:teams'] &&
            $rootScope.$$listeners['save:teams'].length > 0)
          {
            $rootScope.$$listeners['save:teams'] = [];
          }

          if ($rootScope.$$listeners['save:clients'] &&
            $rootScope.$$listeners['save:clients'].length > 0)
          {
            $rootScope.$$listeners['save:clients'] = [];
          }

          $scope.getChangesFromTeamClients = function (argument)
          {
            var beforeTeamClients = $scope.connections.teamClients,
              afterTeamClients = argument,
              teamIds = [];

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
              }
            );

            var changes = {};

            angular.forEach(
              teamIds,
              function (tId)
              {
                if (typeof beforeTeamClients[tId] == 'undefined' && afterTeamClients[tId])
                {
                  // TODO: More readable property names!
                  changes[tId] = {
                    a: [afterTeamClients[tId]],
                    r: []
                  };
                }
                else if (typeof afterTeamClients[tId] == 'undefined' && beforeTeamClients[tId])
                {
                  // TODO: More readable property names!
                  changes[tId] = {
                    r: [beforeTeamClients[tId]],
                    a: []
                  };
                }
                else if (beforeTeamClients[tId] &&
                  afterTeamClients[tId] &&
                  beforeTeamClients[tId] != afterTeamClients[tId])
                {
                  // TODO: More readable property names!
                  changes[tId] = {
                    a: [afterTeamClients[tId]],
                    r: [beforeTeamClients[tId]]
                  };
                }
              });

            return changes;
          };

          // TODO: Check whether it is in action?!
          $scope.safeApply = function (fn)
          {
            var phase = this.$root.$$phase;

            if (phase == '$apply' || phase == '$digest')
            {
              if (fn && (typeof(fn) === 'function'))
              {
                fn();
              }
            }
            else
            {
              this.$apply(fn);
            }
          };

          $scope.applyTeamClientsChanges = function (changes)
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

            Teams.manageGroups(changes)
              .then(
              function (results)
              {
                var error = '';

                angular.forEach(
                  results,
                  function (result)
                  {
                    console.error('result', result);
                    if (result.error && result.error.data)
                    {
                      error += result.error.data.error;
                    }
                  }
                );

                if (error == '')
                {
                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);

                  $timeout(function () { $route.reload() }, 250);
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
                // console.log('no changes ! ');
              }
              else
              {
                $scope.applyTeamClientsChanges(changes);
              }
            }
          );

          $scope.applyTeamsChanges = function (changes)
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

            var currentUserTeams = $rootScope.app.resources.teamUuids;

            Teams.manage(changes)
              .then(
              function ()
              {
                var Profile = $injector.get('Profile');
                Profile.fetchUserData($rootScope.app.resources.uuid)
                  .then(
                  function(userData)
                  {
                    if(currentUserTeams.length != userData.teamUuids.length)
                    {
                      Permission.getAccess(function (permissionProfile)
                      {
                        if(permissionProfile.chat) $rootScope.$broadcast('loadChatsCurrentTeam');
                      });
                    }
                  }
                );

                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);

                $timeout(function () { $route.reload() }, 250);
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
                // console.log('no changes ! ');
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
                // console.log('no changes ! ');
              }
              else
              {
                $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                console.error('changes', changes);

                Clients.manage(changes)
                  .then(
                  function ()
                  {
                    $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                    $rootScope.statusBar.off();

                    $timeout(function () { $route.reload() }, 250);
                  }
                );
              }
            }
          );

          // Check if anything changed before changing the view
          $scope.dataChanged = function (current)
          {
            var parts = current.split('#'),
              tab = parts[parts.length - 1],
              changes = {};

            if (tab == 'teamClients')
            {
              // TODO: Remove this intern angular method
              changes = $scope.getChangesFromTeamClients($scope.$$childTail.getData.teamClients());
            }
            else if (tab == 'teams')
            {
              changes = $scope.getChanges(
                $scope.connections.teams,
                $scope.$$childTail.getData.teams()
              );
            }
            else if (tab == 'clients')
            {
              changes = $scope.getChanges(
                $scope.connections.clients,
                $scope.$$childTail.getData.clients()
              );
            }

            return (angular.equals({}, changes)) ? false : true;
          };
        }
    );
  }
);
define(
  ['app', 'config'],
  function(app, config)
  {
    'use strict';

    app.config(
      [
        '$locationProvider',
        '$routeProvider',
        '$httpProvider',
        '$provide',
        'tmhDynamicLocaleProvider',
        function($locationProvider,
                 $routeProvider,
                 $httpProvider,
                 $provide,
                 tmhDynamicLocaleProvider)
        {
          //stops caching requests
          $httpProvider.defaults.headers.get = $httpProvider.defaults.headers.get || {};
          $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
          $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
          $httpProvider.defaults.headers.get.Pragma = 'no-cache';

          //dynamic angular localization
          tmhDynamicLocaleProvider
            .localeLocationPattern('scripts/i18n/angular-locale_{{locale}}.js');

          $provide
            .decorator(
              "$exceptionHandler",
              [
                "$delegate",
                function($delegate)
                {
                  return function(exception, cause)
                  {
                    console.error('exceptionq', exception);
                    trackGa('send', 'exception', {
                      exDescription: exception.message,
                      exFatal: false,
                      stack: exception.stack,
                      line: '123'
                      //exStack: exception.stack
                    });

                    trackGa('send', 'event', 'JavaScript Error',
                            exception.message, exception.stack, {'nonInteraction': 1});

                    $delegate(exception, cause);
                  };
                }
              ]
            );

          //Chrome Ipad solution in case of using $location.hash()
          $provide
            .decorator(
              '$browser',
              [
                '$delegate',
                function($delegate)
                {
                  var originalUrl = $delegate.url;
                  $delegate.url   = function()
                  {
                    var result = originalUrl.apply(this, arguments);
                    if( result && result.replace )
                    {
                      result = result.replace(/%23/g, '#');
                    }
                    return result;
                  };
                  return $delegate;
                }
              ]
            );

          $routeProvider
            .when(
              '/login',
              {
                templateUrl: 'views/login/loginForm.html',
                controller: 'login as loginCtrl'
              })

            .when(
              '/logout',
              {
                templateUrl: 'logout.html',
                resolve: {
                  data: [
                    '$rootScope',
                    function($rootScope)
                    {
                      trackGa('send', 'event', 'Logout', 'User logout', 'team uuid ' + $rootScope.app.resources.teamUuids[0]);
                      $rootScope.logout();
                    }
                  ]
                }
              })

            .when(
              '/password',
              {
                templateUrl: 'views/login/password.html',
                controller: 'password as password'
              })

            .when(
              '/tasks2',
              {
                templateUrl: 'views/task/tasks2.html',
                controller: 'tasks2Ctrl',
                reloadOnSearch: false,
                resolve: {
                  data: function(Teams, Clients, TaskCRUD, $q)
                  {
                    var deferred = $q.defer(),
                        data     = {
                          teams: null,
                          myTasks: null,
                          allTasks: null,
                          members: null,
                          teamClientsGroups: null,
                          clientGroups: null,
                          clients: null
                        };

                    Teams.getAllLocal()
                         .then(function(teams)
                               {
                                 data.teams = teams;
                                 return Teams.getAllWithMembers()
                               })
                         .then(function(members)
                               {
                                 data.members = members;
                                 return $q.all([
                                                 TaskCRUD.queryMine(),
                                                 TaskCRUD.queryAll(),
                                                 Teams.relationClientGroups(data.teams)
                                               ])
                               })
                         .then(function(teamsTasksData)
                               {
                                 data.myTasks           = teamsTasksData[0];
                                 data.allTasks          = teamsTasksData[1];
                                 data.teamClientsGroups = teamsTasksData[2];
                                 return Clients.getAllLocal();
                               })
                         .then(function(clientGroups)
                               {
                                 data.clientGroups = clientGroups;
                                 return Clients.getAllWithClients();
                               })
                         .then(function(GroupsAndClients)
                               {
                                 data.clients = GroupsAndClients;
                                 deferred.resolve(data);
                               });
                    return deferred.promise;
                  }
                }
              })

            .when('/task/upload', {
              templateUrl: 'views/task/upload.html',
              controller: 'upload as upload',
              reloadOnSearch: false,
            })

            .when('/task/mytasks', {
              templateUrl: 'views/task/myTasks.html',
              controller: 'myTasks as mytasks',
              reloadOnSearch: false,
              resolve: {
                data: function(TaskCRUD, $q)
                {

                  var deferred = $q.defer(),
                      data     = {
                        myTasks: null
                      };

                  TaskCRUD.queryMine()
                          .then(function(taskData)
                                {
                                  var tasks = {
                                    on: taskData
                                  };

                                  data.myTasks = {
                                    loading: false,
                                    list: tasks['on']
                                  };
                                  deferred.resolve(data);
                                });
                  return deferred.promise;
                }
              }
            })

            .when('/task/alltasks', {
              templateUrl: 'views/task/allTasks.html',
              controller: 'allTasks as alltasks',
              reloadOnSearch: false,
              resolve: {
                data: function(TaskCRUD, Teams, CurrentSelection, $q, $location)
                {
                  var deferred = $q.defer(),
                      teamId   = Teams.checkExistence(
                                  ($location.search()).teamId ||
                                  CurrentSelection.getTeamId()
                                ),
                      data     = {
                        tasks: null,
                        teams: null,
                        currentTeamId: teamId
                      };
                  console.error("teamId ->", teamId);

                  Teams.getAllLocal()
                       .then(function(teams)
                             {
                               data.teams = teams;
                               return TaskCRUD.queryByTeam(teamId);
                             })
                      .then(function(taskData)
                            {
                              var tasks = {
                                on: taskData
                              };

                              data.myTasks = {
                                loading: false,
                                list: tasks['on']
                                //archive: (tasks.off.length > 0)
                              };
                              deferred.resolve(data);
                            });

                  return deferred.promise;
                }
              }
            })

            .when('/task/new', {
              templateUrl: 'views/task/saveTask.html',
              controller: 'saveTask as task',
              reloadOnSearch: false,
              resolve: {
                data: function($rootScope, Teams, Clients, TaskCRUD, Task, CurrentSelection, $q)
                {
                  var deferred = $q.defer(),
                      teamId   = CurrentSelection.getTeamId(),
                      data     = {
                        teams: null,
                        currentTeamId: teamId,
                        currentTeamMembers: null,
                        teamClientgroupLinks: null,
                        clientGroups: null,
                        currentGroupClients: null
                      };

                  Teams.getAllLocal()
                       .then(function(teams)
                             {
                               data.teams = teams;
                               return Teams.getSingle(teamId);
                             })
                       .then(function(members)
                             {
                               data.currentTeamMembers = members;
                               return Clients.getAllLocal();
                             })
                       .then(function(clientGroups)
                             {
                               data.clientGroups = clientGroups;
                               return TaskCRUD.teamClientLink(data.currentTeamId, clientGroups);
                             })
                       .then(function(teamClientgroupLinks)
                             {
                               data.teamClientgroupLinks = teamClientgroupLinks;
                               if( ! teamClientgroupLinks[0] )
                               {
                                 $rootScope.notifier.error($rootScope.ui.teamup.noClientGroupFound);
                                 return null;
                               }
                               else
                               {
                                 var clientGroupId = teamClientgroupLinks[0].id;
                                 return Clients.getSingle(clientGroupId);
                               }
                             })
                       .then(function(currentGroupClients)
                             {
                               data.currentGroupClients = currentGroupClients;
                               deferred.resolve(data);
                             });

                  return deferred.promise;
                }
              }
            })

            .when('/task/:taskId/edit', {
              templateUrl: 'views/task/saveTask.html',
              controller: 'saveTask as task',
              reloadOnSearch: false,
              resolve: {
                data: function($route,
                               $rootScope,
                               Teams,
                               Clients,
                               TaskCRUD,
                               Task,
                               TeamUp,
                               CurrentSelection,
                               $location,
                               $q)
                {
                  var taskId = $route.current.params.taskId;

                  var deferred = $q.defer(),
                      teamId   = CurrentSelection.getTeamId(),
                      data     = {
                        teams: null,
                        currentTeamId: teamId,
                        currentTeamMembers: null,
                        teamClientgroupLinks: null,
                        clientGroups: null,
                        currentGroupClients: null,
                        task: null
                      };

                  TaskCRUD.read(taskId)
                          .then(function(task)
                                {
                                  data.task = task;
                                  if( ! data.task.uuid )
                                  {
                                    $location.path('/task/new');
                                  }
                                });

                  Teams.getAllLocal()
                       .then(function(teams)
                             {
                               data.teams = teams;
                               return Teams.getSingle(teamId);
                             })
                       .then(function(members)
                             {
                               data.currentTeamMembers = members;
                               return Clients.getAllLocal();
                             })
                       .then(function(clientGroups)
                             {
                               data.clientGroups = clientGroups;
                               return TaskCRUD.teamClientLink(data.currentTeamId, clientGroups);
                             })
                       .then(function(teamClientgroupLinks)
                             {
                               if( teamClientgroupLinks.length )
                               {
                                 data.teamClientgroupLinks = teamClientgroupLinks;
                                 var clientGroupId         = teamClientgroupLinks[0].id;
                                 return Clients.getSingle(clientGroupId);
                               }
                             })
                       .then(function(currentGroupClients)
                             {
                               data.currentGroupClients = currentGroupClients;
                               deferred.resolve(data);
                             });

                  return deferred.promise;
                }
              }
            })

            .when('/task', {
              redirectTo: 'task/new'
            })

            .when('/admin', {
              templateUrl: 'views/admin.html',
              controller: 'adminCtrl'
            })

            .when('/scenarios', {
              templateUrl: 'views/scenarios.html',
              controller: 'adminCtrl'
            })

            .when(
              '/team',
              {
                redirectTo: function(routeParams, path, search)
                {
                  var teamParam = (search.uuid)
                    ? '?uuid=' + search.uuid
                    : '';

                  return 'team/members' + teamParam;
                }
              })

            .when(
              '/team/members',
              {
                templateUrl: 'views/team/members.html',
                controller: 'member as member',
                reloadOnSearch: false,
                resolve: {
                  data: function($q, $location, Teams, Member)
                  {
                    var teamId = Teams.checkExistence(($location.search()).teamId);
                    $location.search('teamId', teamId);
                    return Teams.getSingle(teamId)
                                .then(function(members)
                                      {
                                        Member.setList(members);
                                        return members;
                                      });
                  }
                }
              })

            .when(
              '/team/new',
              {
                templateUrl: 'views/team/newTeam.html',
                controller: 'team as team',
                reloadOnSearch: false
              })

            .when(
              '/team/member/new',
              {
                templateUrl: 'views/team/newMember.html',
                controller: 'member as member',
                reloadOnSearch: false
              })

            .when(
              '/team/member/search',
              {
                templateUrl: 'views/team/searchMember.html',
                controller: 'member as member',
                reloadOnSearch: false
              })

            .when(
              '/client',
              {
                templateUrl: 'views/client/clients.html',
                controller: 'clientCtrl',
                reloadOnSearch: false,
                resolve: {
                  data: [
                    'Clients', 'CurrentSelection', '$route', '$q',
                    function(Clients, CurrentSelection, $route, $q)
                    {
                      var deferred = $q.defer();
                      var clientResult, clientGroupId;
                      var promise  = ($route.current.params)
                        ? Clients.query(false, $route.current.params)
                        : Clients.query();

                      promise
                        .then(function(result)
                              {
                                clientResult  = result;
                                clientGroupId = ($route.current.params).uuid
                                  || CurrentSelection.getClientGroupId()
                                  || Object.keys(clientResult.clients)[0];
                                return Clients.getSingle(clientGroupId);
                              })
                        .then(function(clients)
                              {
                                clientResult.clients[clientGroupId] = clients;
                                deferred.resolve({
                                                   clientGroups: clientResult.clientGroups,
                                                   clients: clientResult.clients,
                                                   currentClientGroupId: clientGroupId
                                                 });
                              });
                      return deferred.promise;
                    }
                  ]
                }
              })

            .when(
              '/clientProfile/:clientId',
              {
                templateUrl: 'views/client/clients.html',
                controller: 'clientCtrl',
                reloadOnSearch: false,
                resolve: {
                  data: [
                    '$rootScope', '$route',
                    function($rootScope, $route)
                    {
                      angular.element('.navbar #clientMenu').addClass('active');

                      return {clientId: $route.current.params.clientId};
                    }
                  ]
                }
              })

            .when(
              '/manage',
              {
                templateUrl: 'views/manage/manage.html',
                controller: 'manageCtrl',
                reloadOnSearch: false,
                resolve: {
                  data: function(Clients, Teams, $location)
                  {
                    return Clients.getAll()
                                  .then(function()
                                        {
                                          return Teams.getAllLocal();
                                        })
                                  .then(function(teams)
                                        {
                                          return Teams.relationClientGroups(teams);
                                        })
                                  .then(function(teamsClientGroupRelations)
                                        {
                                          // TODO: Lose short property names and make them more readable!
                                          return (($location.hash() && $location.hash() == 'reload')) ?
                                          {
                                            teamsClientGroupRelations: teamsClientGroupRelations,
                                            t: Teams.query(),
                                            cg: Clients.query()
                                          } :
                                          {
                                            local: true,
                                            teamsClientGroupRelations: teamsClientGroupRelations
                                          };
                                        });
                  },
                  dataMembers: function($rootScope, $q, TeamUp, Teams, Clients)
                  {
                    var deferred = $q.defer();
                    var promises = [
                      TeamUp._('allTeamMembers'),
                      Teams.getAllWithMembers()
                    ];

                    if( $rootScope.app.domainPermission.clients )
                    {
                      promises.push(Clients.queryAllLocally());
                    }

                    $q.all(promises).then(function(result)
                                          {
                                            deferred.resolve(result[0]);
                                          });
                    return deferred.promise;
                  }
                }
              })

            .when(
              '/treegrid',
              {
                templateUrl: 'views/manage/treegrid.html',
                controller: 'treegridCtrl',
                reloadOnSearch: false,
                resolve: {
                  data: [
                    'Clients', 'Teams', '$location',
                    function(ClientGroups, Teams, $location)
                    {
                      // TODO: Lose short property names and make them more readable!
                      return (($location.hash() && $location.hash() == 'reload')) ?
                      {
                        t: Teams.query(),
                        cg: ClientGroups.query()
                      } :
                      {local: true};
                    }
                  ]
                }
              })

            .when(
              '/team-telefoon/scenario',
              {
                templateUrl: 'views/team-telephone/scenario.html',
                controller: 'scenario as scenario',
                reloadOnSearch: false,
                resolve: {
                  data: [
                    'Teams', 'TeamUp', 'CurrentSelection', '$rootScope', '$q', '$location',
                    function(Teams, TeamUp, CurrentSelection, $rootScope, $q, $location)
                    {
                      removeActiveClass('.teamMenu');

                      var deferred = $q.defer();
                      var teamId   = CurrentSelection.getTeamId();
                      var promises = [
                        Teams.getAllLocal(),
                        TeamUp._('TTScenarioTemplateGet')
                      ];

                      TeamUp._('TTOptionsGet', {second: teamId})
                            .then(function(options)
                                  {
                                    //Check if team telephone is activated (has adapterId)
                                    (! options.adapterId || $rootScope.app.resources.role > 1)
                                      ? $location.path('team-telefoon/options')
                                      : $q.all(promises)
                                          .then(function(result)
                                                {
                                                  deferred.resolve({
                                                                     teams: result[0],
                                                                     templates: result[1] || []
                                                                   });
                                                });

                                  });
                      return deferred.promise;
                    }
                  ]
                }
              })

            .when(
              '/team-telefoon/options',
              {
                templateUrl: 'views/team-telephone/options.html',
                controller: 'options as options',
                reloadOnSearch: false,
                resolve: {
                  data: [
                    'Teams', 'TeamUp', 'CurrentSelection', '$q',
                    function(Teams, TeamUp, CurrentSelection, $q)
                    {
                      removeActiveClass('.teamMenu');

                      var teamId               = CurrentSelection.getTeamId(),
                          teamTelephoneOptions = null;

                      return TeamUp._('TTOptionsGet', {second: teamId})
                                   .then(function(options)
                                         {
                                           teamTelephoneOptions = options;

                                           var promises = [
                                             Teams.getAllLocal(),
                                             TeamUp._('TTScenarioTemplateGet')
                                           ];
                                           //if a team is not a team-telephone team, add open phonenumbers
                                           if( options.error && options.error.status === 404 )
                                           {
                                             promises.push(
                                               TeamUp._('TTAdaptersGet', {
                                                 adapterType: 'call',
                                                 excludeAdaptersWithDialog: 'true'
                                               })
                                             );
                                           }
                                           return $q.all(promises)
                                         })
                                   .then(function(result)
                                         {
                                           console.error('result', result);
                                           return {
                                             teams: result[0],
                                             phoneNumbers: result[2] || [],
                                             teamTelephoneOptions: teamTelephoneOptions,
                                             scenarioTemplates: result[1] || []
                                           }
                                         });
                    }
                  ]
                }
              })

            .when('/team-telefoon/agenda/:userId?', {
              templateUrl: 'views/team-telephone/agenda.html',
              controller: 'agenda',
              resolve: {
                data: function($route, Slots, Storage, Dater, Store, Teams,
                               $q, $rootScope, $location, moment,
                               CurrentSelection, Profile, TeamUp)
                {
                  //remove active class TODO create a directive to solve this bug
                  removeActiveClass('.teamMenu');

                  var groupId  = CurrentSelection.getTeamId(),
                      deferred = $q.defer(),
                      userId   = $route.current.params.userId,
                      data     = {
                        members: null,
                        user: null,
                        timeline: null
                      };

                  if( _.isUndefined(userId) )
                  {
                    redirectLocationLoggedUser();
                  }

                  TeamUp._('TTOptionsGet', {second: groupId})
                        .then(function(options)
                              {
                                //team telephone not activated
                                if( ! options.adapterId )
                                {
                                  $location.path('team-telefoon/options');
                                }
                                else
                                {
                                  Teams.getSingle(groupId)
                                       .then(function(members)
                                             {
                                               data.members = members;
                                               return members.error && members || Profile.fetchUserData(userId);
                                             })
                                       .then(function(user)
                                             {
                                               var loggedUserTeams = $rootScope.app.resources.teamUuids,
                                                   urlUserTeams    = user.teamUuids,
                                                   userAllow       = true;

                                               data.user = user;

                                               //Check if there are equal team, otherwise it's not aloud to edit this user's
                                               //timeline with the role of team lid
                                               if( $rootScope.app.resources.role > 1 )
                                               {
                                                 userAllow = hasEqualTeams(
                                                   loggedUserTeams.concat(urlUserTeams)
                                                 );
                                               }

                                               return (! userAllow)
                                                 ? $q.reject(user)
                                                 : $q.all([
                                                            getAllSlots(userId, groupId),
                                                            Teams.getAllLocal()
                                                          ]);

                                               function hasEqualTeams(teams)
                                               {
                                                 return _.uniq(teams).length !== teams.length;
                                               }
                                             })
                                       .then(function(result)
                                             {
                                               deferred.resolve({
                                                                  members: data.members,
                                                                  timeline: result[0],
                                                                  user: data.user,
                                                                  teams: result[1]
                                                                });
                                             },
                                             function()
                                             {
                                               redirectLocationLoggedUser();
                                             });
                                }
                              });

                  return deferred.promise;

                  /**
                   * All slots timeline
                   * @param userId current user timeline
                   * @param groupId current team timeline
                   */
                  function getAllSlots(userId, groupId)
                  {
                    return Slots.all({
                                       groupId: groupId,
                                       stamps: {
                                         start: +moment({hour: 0, minute: 0}).weekday(0),
                                         end: +moment({hour: 0, minute: 0}).weekday(7)
                                       },
                                       month: Dater.current.month(),
                                       layouts: {
                                         user: true,
                                         group: true,
                                         members: (userId != $rootScope.app.resources.uuid)
                                       },
                                       user: userId
                                     });
                  }

                  /**
                   * redirect to the timeline of the logged user
                   */
                  function redirectLocationLoggedUser()
                  {
                    $location.path('/team-telefoon/agenda/' + $rootScope.app.resources.uuid);
                  };
                }
              },
              reloadOnSearch: false
            })

            .when(
              '/team-telefoon/logs',
              {
                templateUrl: 'views/team-telephone/logs.html',
                controller: 'logs as logs',
                resolve: {
                  data: function($q, Logs, TeamUp, Teams, $location, CurrentSelection)
                  {
                    removeActiveClass('.teamMenu');

                    var deferred = $q.defer(),
                        teamId   = CurrentSelection.getTeamId()

                    TeamUp._('TTOptionsGet', {second: teamId})
                          .then(function(options)
                                {
                                  //team telephone not activated
                                  if( ! options.adapterId )
                                  {
                                    $location.path('team-telefoon/options');
                                  }
                                  else
                                  {
                                    var _teams = null;

                                    Teams.getAllLocal()
                                         .then(function(teams)
                                               {
                                                 _teams = teams;
                                                 return Teams.getSingle(teamId);
                                               })
                                         .then(function(members)
                                               {
                                                 return Logs.fetch({
                                                                     adapterId: options.adapterId,
                                                                     members: _.map(members, _.partialRight(_.pick, ['fullName', 'phone'])),
                                                                     currentTeam: {
                                                                       fullName: (_.findWhere(_teams, {uuid: teamId})).name,
                                                                       phone: options.phoneNumber
                                                                     }
                                                                   });
                                               })
                                         .then(function(logs)
                                               {
                                                 deferred.resolve({
                                                                    teams: _teams,
                                                                    logData: logs
                                                                  });
                                               });
                                  }
                                });
                    return deferred.promise;
                  }
                },
                reloadOnSearch: false
              })

            .when(
              '/team-telefoon/create',
              {
                templateUrl: 'views/team-telephone/create.html',
                controller: 'create as teamtelefoon',
                reloadOnSearch: false
              })

            .when(
              '/team-telefoon',
              {
                redirectTo: function(route, path)
                {
                  return path + '/status';
                }
              })

            .when(
              '/task/planboard',
              {
                templateUrl: 'views/task/planboard/planboard.html',
                controller: 'planboard',
                reloadOnSearch: false,
                resolve: {
                  data: function(Clients, Teams, CurrentSelection, $q)
                  {
                    var teamId = Teams.checkExistence(CurrentSelection.getTeamId());

                    return $q.all([
                                    Teams.getAllLocal(),
                                    Clients.getAll(),
                                    Teams.getSingle(teamId)
                                  ])
                                 .then(function(result)
                                       {
                                         return {
                                           teams: result[0],
                                           clientGroups: result[1],
                                           currentTeamId: teamId,
                                           currentTeamMembers: result[2]
                                         };
                                       });

                  }
                }
              })

            .when(
              '/team-telefoon/status/phones',
              {
                templateUrl: 'views/team-telephone/phones.html',
                controller: 'phones',
                reloadOnSearch: false,
                resolve: {
                  data: function(Teams, Slots, $q, $location, CurrentSelection)
                  {
                    var teamId   = CurrentSelection.getTeamId(),
                        deferred = $q.defer();
                    removeActiveClass('.teamMenu');

                    $q.all([
                             Teams.getSingle(teamId),
                             Slots.MemberReachabilitiesByTeam(teamId, null),
                             Teams.getAllLocal()
                           ]).then(function(result)
                                   {
                                     deferred.resolve({
                                                        members: result[0],
                                                        membersReachability: result[1],
                                                        teams: result[2]
                                                      });
                                   });
                    return deferred.promise;
                  }
                }
              })

            .when(
              '/team-telefoon/status',
              {
                templateUrl: 'views/team-telephone/status.html',
                controller: 'status as status',
                reloadOnSearch: false,
                resolve: {
                  data: function($q, $location, CurrentSelection, TeamUp, Teams, Slots)
                  {
                    var teamId   = CurrentSelection.getTeamId(),
                        deferred = $q.defer();
                    removeActiveClass('.teamMenu');

                    TeamUp._('TTOptionsGet', {second: teamId})
                          .then(function(options)
                                {
                                  //Check if team telephone is activated (has adapterId)
                                  (! options.adapterId)
                                    ? $location.path('team-telefoon/options')
                                    : $q.all([
                                               Teams.getSingle(teamId),
                                               Slots.MemberReachabilitiesByTeam(teamId, null),
                                               Teams.getAllLocal()
                                             ]).then(function(result)
                                                     {
                                                       deferred.resolve({
                                                                          members: result[0],
                                                                          membersReachability: result[1],
                                                                          teams: result[2]
                                                                        });
                                                     });
                                });
                    return deferred.promise;
                  }
                }
              })

            .when(
              '/team-telefoon/order',
              {
                templateUrl: 'views/team-telephone/order.html',
                controller: 'order',
                resolve: {
                  data: function(TeamUp, Teams, CurrentSelection, $q, $location)
                  {
                    removeActiveClass('.teamMenu');

                    var teamId     = CurrentSelection.getTeamId(),
                        teamStatus = Teams.getSingle(teamId),
                        teamOrder  = TeamUp._('callOrderGet', {second: teamId}),
                        allTeams   = Teams.getAllLocal(),
                        deferred   = $q.defer();

                    TeamUp._('TTOptionsGet', {second: teamId})
                          .then(function(options)
                                {
                                  //team telephone not activated
                                  if( ! options.adapterId )
                                  {
                                    $location.path('team-telefoon/options');
                                  }
                                  else
                                  {
                                    $q.all([teamStatus, teamOrder, allTeams])
                                      .then(function(teamResult)
                                            {
                                              deferred.resolve({
                                                                 teamMembers: teamResult[0],
                                                                 teamOrder: teamResult[1],
                                                                 teams: teamResult[2]
                                                               });
                                            });
                                  }
                                });

                    return deferred.promise;
                  }
                },
                reloadOnSearch: false
              })

            .when(
              '/chat',
              {
                //templateUrl: 'views/messages.html',
                controller: 'chat',
                reloadOnSearch: false
              })

            .when(
              '/profile/:userId?',
              {
                templateUrl: 'views/profile.html',
                controller: 'profileCtrl',
                reloadOnSearch: false,
                resolve: {
                  data: [
                    '$rootScope', '$route', 'Profile', '$location',
                    function($rootScope, $route, Profile, $location)
                    {
                      if( ! $route.current.params.userId )
                      {
                        $location.path('/profile/' + $rootScope.app.resources.uuid).hash('profile');
                      }

                      return Profile.fetchUserData($route.current.params.userId);
                    }
                  ]
                }
              })

            .when(
              '/vis',
              {
                templateUrl: 'views/vis.html',
                controller: 'vis',
                reloadOnSearch: false
              })

            .when(
              '/help',
              {
                templateUrl: 'views/help.html',
                controller: 'helpCtrl',
                reloadOnSearch: false
              })

            .when(
              '/video/',
              {
                templateUrl: 'views/video.html',
                controller: 'videoCtrl',
                reloadOnSearch: false
              })

            .when(
              '/',
              {
                redirectTo: '/team'
              })

            .when(
              '/404',
              {
                templateUrl: 'views/404.html'
              })

            .otherwise({redirectTo: '/404'});

          $httpProvider.interceptors.push(function($location, Store, $injector, $q)
                                          {
                                            return {
                                              request: function(config)
                                              {
                                                return config || $q.when(config);
                                              },
                                              requestError: function(rejection)
                                              {
                                                return $q.reject(rejection);
                                              },
                                              response: function(response)
                                              {
                                                return response || $q.when(response);
                                              },
                                              responseError: function(rejection)
                                              {
                                                var promise = $q.reject(rejection);

                                                if( rejection.status > 0 )
                                                {
                                                  var rejections = $injector.get('Rejections');

                                                  switch(rejection.status)
                                                  {
                                                    case 403:
                                                      var loginData = Store('app').get('loginData');

                                                      if( loginData.password )
                                                      {
                                                        promise = rejections.reSetSession(loginData, rejection.config);
                                                      }
                                                      else
                                                      {
                                                        rejections.sessionTimeOut();
                                                      }
                                                      break;
                                                    case 404:
                                                      console.log('404 not found', rejection);
                                                      break;
                                                    default:
                                                      rejections.trowError(rejection);
                                                      break;
                                                  }
                                                }

                                                return promise;
                                              }
                                            };
                                          });

          var removeActiveClass = function(divId)
          {
            angular.element(divId).removeClass('active');
          };
        }
      ]);
  }
);

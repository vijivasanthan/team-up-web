define(
  ['app', 'config'],
  function (app, config)
  {
    'use strict';

    app.config(
      [
        '$locationProvider',
        '$routeProvider',
        '$httpProvider',
        '$provide',
        'tmhDynamicLocaleProvider',
        function ($locationProvider,
                  $routeProvider,
                  $httpProvider,
                  $provide,
                  tmhDynamicLocaleProvider)
        {
          //dynamic angular localization
          tmhDynamicLocaleProvider
            .localeLocationPattern('scripts/i18n/angular-locale_{{locale}}.js');

          $provide
            .decorator(
            "$exceptionHandler",
            [
              "$delegate",
              function ($delegate)
              {
                return function (exception, cause)
                {
                  trackGa('send', 'exception', {
                    exDescription: exception.message,
                    exFatal: false,
                    exStack: exception.stack
                  });

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
              function ($delegate)
              {
                var originalUrl = $delegate.url;
                $delegate.url = function ()
                {
                  var result = originalUrl.apply(this, arguments);
                  if (result && result.replace)
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
              templateUrl: 'views/logout.html',
              resolve: {
                data: [
                  '$rootScope',
                  function ($rootScope)
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
            '/tasks',
            {
              templateUrl: 'views/tasks.html',
              controller: 'tasksCtrl'
            })

            .when(
            '/tasks2',
            {
              templateUrl: 'views/tasks2.html',
              controller: 'tasks2Ctrl',
              reloadOnSearch: false,
              resolve: {
                data: function (Teams, Clients, Task, $q)
                {
                  var deferred = $q.defer(),
                    data = {
                      teams: null,
                      myTasks: null,
                      allTasks: null,
                      members: null,
                      teamClientsGroups: null,
                      clientGroups: null,
                      clients: null
                    };

                  Teams.getAllLocal()
                    .then(function (teams)
                    {
                      data.teams = teams;
                      return Teams.getAllWithMembers()
                    })
                    .then(function (members)
                    {
                      data.members = members;
                      return $q.all([
                        Task.queryMine(),
                        Task.queryAll(),
                        Teams.relationClientGroups(data.teams)
                      ])
                    })
                    .then(function (teamsTasksData)
                    {
                      data.myTasks = teamsTasksData[0];
                      data.allTasks = teamsTasksData[1];
                      data.teamClientsGroups = teamsTasksData[2];
                      return Clients.getAllLocal();
                    })
                    .then(function (clientGroups)
                    {
                      data.clientGroups = clientGroups;
                      return Clients.getAllWithClients();
                    })
                    .then(function (GroupsAndClients)
                    {
                      data.clients = GroupsAndClients;
                      deferred.resolve(data);
                    });
                  return deferred.promise;
                }
              }
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
              redirectTo: function (routeParams, path, search)
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
              templateUrl: 'views/teams/members.html',
              controller: 'member as member',
              reloadOnSearch: false,
              resolve: {
                data: function ($q, $location, Teams, Member)
                {
                  var teamId = Teams.checkExistence(($location.search()).teamId);

                  return Teams.getSingle(teamId)
                    .then(function (members)
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
              templateUrl: 'views/teams/newTeam.html',
              controller: 'team as team',
              reloadOnSearch: false
            })

            .when(
            '/team/member/new',
            {
              templateUrl: 'views/teams/newMember.html',
              controller: 'member as member',
              reloadOnSearch: false
            })

            .when(
            '/team/member/search',
            {
              templateUrl: 'views/teams/searchMember.html',
              controller: 'member as member',
              reloadOnSearch: false
            })

            .when(
            '/client',
            {
              templateUrl: 'views/clients.html',
              controller: 'clientCtrl',
              reloadOnSearch: false,
              resolve: {
                data: [
                  'Clients', 'CurrentSelection', '$route', '$q',
                  function (Clients, CurrentSelection, $route, $q)
                  {
                    var deferred = $q.defer();
                    var clientResult, clientGroupId;
                    var promise = ($route.current.params)
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
              templateUrl: 'views/clients.html',
              controller: 'clientCtrl',
              reloadOnSearch: false,
              resolve: {
                data: [
                  '$rootScope', '$route',
                  function ($rootScope, $route)
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
              templateUrl: 'views/manage.html',
              controller: 'manageCtrl',
              reloadOnSearch: false,
              resolve: {
                data: [
                  'Clients', 'Teams', '$location',
                  function (Clients, Teams, $location)
                  {
                    // TODO: Lose short property names and make them more readable!
                    return (($location.hash() && $location.hash() == 'reload')) ?
                    {
                      t: Teams.query(),
                      cg: Clients.query()
                    } :
                    {local: true};
                  }
                ],
                dataMembers: function ($q, TeamUp, Teams)
                {
                  var deferred = $q.defer();
                  $q.all([
                    TeamUp._('allTeamMembers'),
                    Teams.getAllWithMembers()
                  ]).then(function (result)
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
              templateUrl: 'views/treegrid.html',
              controller: 'treegridCtrl',
              reloadOnSearch: false,
              resolve: {
                data: [
                  'Clients', 'Teams', '$location',
                  function (ClientGroups, Teams, $location)
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
            '/team-telefoon/options',
            {
              templateUrl: 'views/team-telephone/options.html',
              controller: 'options as options',
              reloadOnSearch: false,
              resolve: {
                data: [
                  'Teams', 'TeamUp', 'CurrentSelection', '$q',
                  function (Teams, TeamUp, CurrentSelection, $q)
                  {
                    removeActiveClass('.teamMenu');

                    var teamId = CurrentSelection.getTeamId(),
                      teamTelephoneOptions = null;

                    return TeamUp._('TTOptionsGet', {second: teamId})
                      .then(function (options)
                      {
                        teamTelephoneOptions = options;

                        var promises = [Teams.getAllLocal()];
                        if (options.error && options.error.status === 404)
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
                      .then(function (result)
                      {
                        return {
                          teams: result[0],
                          phoneNumbers: result[1] || [],
                          teamTelephoneOptions: teamTelephoneOptions
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
                data: function ($route, Slots, Storage, Dater, Store, Teams,
                                $q, $rootScope, $location, CurrentSelection, Profile, TeamUp)
                {
                  //remove active class TODO create a directive to solve this bug
                  removeActiveClass('.teamMenu');

                  var groupId = CurrentSelection.getTeamId(),
                    deferred = $q.defer(),
                    userId = $route.current.params.userId,
                    data = {
                      members: null,
                      user: null,
                      timeline: null
                    };

                  if (_.isUndefined(userId))
                  {
                    redirectLocationLoggedUser();
                  }

                  TeamUp._('TTOptionsGet', {second: groupId})
                    .then(function (options)
                    {
                      //team telephone not activated
                      if (!options.adapterId)
                      {
                        $location.path('team-telefoon/options');
                      }
                      else
                      {
                        Teams.getSingle(groupId)
                          .then(function (members)
                          {
                            data.members = members;
                            return members.error && members || Profile.fetchUserData(userId);
                          })
                          .then(function (user)
                          {
                            var loggedUserTeams = $rootScope.app.resources.teamUuids,
                              urlUserTeams = user.teamUuids,
                              userAllow = true;

                            data.user = user;

                            //Check if there are equal team, otherwise it's not aloud to edit this user's
                            //timeline with the role of team lid
                            if ($rootScope.app.resources.role > 1)
                            {
                              userAllow = hasEqualTeams(
                                loggedUserTeams.concat(urlUserTeams)
                              );
                            }

                            return (!userAllow)
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
                          .then(function (result)
                          {
                            deferred.resolve({
                              members: data.members,
                              timeline: result[0],
                              user: data.user,
                              teams: result[1]
                            });
                          },
                          function ()
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
                    var periods = Store('app').get('periods');

                    return Slots.all({
                      groupId: groupId,
                      stamps: (Dater.current.today() > 360) ? {
                        start: periods.days[358].last.timeStamp,
                        end: periods.days[365].last.timeStamp
                      } : {
                        start: periods.days[Dater.current.today() - 1].last.timeStamp,
                        end: periods.days[Dater.current.today() + 6].last.timeStamp
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
                data: function ($q, Logs, TeamUp, Teams, $location, CurrentSelection)
                {
                  removeActiveClass('.teamMenu');

                  var deferred = $q.defer(),
                    teamId = CurrentSelection.getTeamId()

                  TeamUp._('TTOptionsGet', {second: teamId})
                    .then(function (options)
                    {
                      //team telephone not activated
                      if (!options.adapterId)
                      {
                        $location.path('team-telefoon/options');
                      }
                      else
                      {
                        var _teams = null;

                        Teams.getAllLocal()
                          .then(function(teams) {
                            _teams = teams;
                            return Teams.getSingle(teamId);
                          })
                          .then(function(members) {
                            return Logs.fetch({
                              adapterId: options.adapterId,
                              members: _.map(members,_.partialRight(_.pick,['fullName','phone'])),
                              currentTeam: {
                                fullName: (_.findWhere(_teams, {uuid: teamId})).name,
                                phone: options.phoneNumber
                              }
                            });
                          })
                          .then(function (logs)
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
            '/team-telefoon',
            {
              redirectTo: function (route, path)
              {
                return path + '/status';
              }
            })

            .when(
            '/tasks2/planboard',
            {
              templateUrl: 'views/planboard.html',
              controller: 'planboard',
              reloadOnSearch: false
            })

            .when(
            '/team-telefoon/status/phones',
            {
              templateUrl: 'views/phones.html',
              controller: 'phones',
              reloadOnSearch: false,
              resolve: {
                data: function (Teams, Slots, $q, $location, CurrentSelection)
                {
                  var teamId = CurrentSelection.getTeamId(),
                    deferred = $q.defer();
                  removeActiveClass('.teamMenu');

                  $q.all([
                    Teams.getSingle(teamId),
                    Slots.MemberReachabilitiesByTeam(teamId, null),
                    Teams.getAllLocal()
                  ]).then(function (result)
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
              controller: 'status',
              reloadOnSearch: false,
              resolve: {
                data: function ($q, $location, CurrentSelection, TeamUp, Teams, Slots)
                {
                  var teamId = CurrentSelection.getTeamId(),
                    deferred = $q.defer();
                  removeActiveClass('.teamMenu');

                  TeamUp._('TTOptionsGet', {second: teamId})
                    .then(function (options)
                    {
                      //team telephone not activated
                      if (!options.adapterId)
                      {
                        $location.path('team-telefoon/options');
                      }
                      else
                      {
                        $q.all([
                          Teams.getSingle(teamId),
                          Slots.MemberReachabilitiesByTeam(teamId, null),
                          Teams.getAllLocal()
                        ]).then(function (result)
                        {
                          deferred.resolve({
                            members: result[0],
                            membersReachability: result[1],
                            teams: result[2]
                          });
                        });
                      }
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
                data: function (TeamUp, Teams, CurrentSelection, $q, $location)
                {
                  removeActiveClass('.teamMenu');

                  var teamId = CurrentSelection.getTeamId(),
                    teamStatus = Teams.getSingle(teamId),
                    teamOrder = TeamUp._('callOrderGet', {second: teamId}),
                    allTeams = Teams.getAllLocal(),
                    deferred = $q.defer();

                  TeamUp._('TTOptionsGet', {second: teamId})
                    .then(function (options)
                    {
                      //team telephone not activated
                      if (!options.adapterId)
                      {
                        $location.path('team-telefoon/options');
                      }
                      else
                      {
                        $q.all([teamStatus, teamOrder, allTeams])
                          .then(function (teamResult)
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
            '/messages',
            {
              templateUrl: 'views/messages.html',
              controller: 'messages',
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
                  function ($rootScope, $route, Profile, $location)
                  {
                    if (!$route.current.params.userId)
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
              resolve: {
                'data': function ($rootScope, $location, $route, $q, Session, TeamUp, Settings)
                {
                  var deferred = $q.defer(),
                      backEnds = angular.copy(config.app.host),//The different backend url's
                      teamPhoneNumber = $route.current.params.teamPhoneNumber,
                      video = {};

                  /**
                   * Get the callId of the video conversation
                   * @param bacEnd The current backend url
                   * @param teamPhoneNumber The team telephone number
                   */
                  video.getCallIdRequest = function(bacEnd, teamPhoneNumber)
                  {
                    Settings.setBackEnd(bacEnd);//set current backend
                    TeamUp._('TTvideo', //get the callId for the video conversation
                      {
                        phoneNumber: teamPhoneNumber,
                        type: 'video'
                      })
                      .then(video.getCallIdResponse);//get the response
                  };

                  /**
                   * The callback of the request will do a request again if there are multiple backend url's if a
                   * error appears
                   * @param result
                   */
                  video.getCallIdResponse = function(result)
                  {//if a error appears, check then if there are multiple backends, to try another time
                    //to get a callID
                    (result.error && backEnds.length)
                      ? video.getCallIdRequest(backEnds.shift(), teamPhoneNumber)
                      : deferred.resolve({
                          callId: result.callId || '',
                          fullName: decodeURI($route.current.params.fullName) || 'user'
                        });
                  };
                  //This routing is only for the ones without session
                  (Session.check())
                    ? $location.path($rootScope.currentLocation)
                    : video.getCallIdRequest(backEnds.shift(), teamPhoneNumber);

                  return deferred.promise;
                }
              },
              reloadOnSearch: false
            })

            .otherwise({redirectTo: '/login'});

          $httpProvider.interceptors.push(function ($location, Store, $injector, $q)
          {
            return {
              request: function (config)
              {
                return config || $q.when(config);
              },
              requestError: function (rejection)
              {
                return $q.reject(rejection);
              },
              response: function (response)
              {
                return response || $q.when(response);
              },
              responseError: function (rejection)
              {
                var promise = $q.reject(rejection);

                if (rejection.status > 0)
                {
                  var rejections = $injector.get('Rejections');

                  switch (rejection.status)
                  {
                    case 403:
                      var loginData = Store('app').get('loginData');

                      if (loginData.password)
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

          var removeActiveClass = function (divId)
          {
            angular.element(divId).removeClass('active');
          };
        }
      ]);
  }
);

define(
  ['app'],
  function (app)
  {
    'use strict';

    app.config(
      [
        '$locationProvider', '$routeProvider', '$httpProvider', '$provide',
        function ($locationProvider, $routeProvider, $httpProvider, $provide)
        {
          $provide
            .decorator(
            "$exceptionHandler",
            [
              "$delegate",
              function($delegate)
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
              function($delegate)
              {
                var originalUrl = $delegate.url;
                $delegate.url = function() {
                  var result = originalUrl.apply(this, arguments);
                  if (result && result.replace) {
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
              templateUrl: 'views/login.html',
              controller: 'login'
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
            '/tasks',
            {
              templateUrl: 'views/tasks.html',
              controller: 'tasksCtrl'
            })

            .when(
            '/tasks2',
            {
              templateUrl: 'views/tasks2.html',
              controller: 'tasks2Ctrl'
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
            '/team/',
            {
              templateUrl: 'views/teams.html',
              controller: 'teamCtrl',
              reloadOnSearch: false,
              resolve: {
                data: [
                  '$rootScope', 'Teams', '$route', 'CurrentSelection',
                  function ($rootScope, Teams, $route, CurrentSelection)
                  {
                    //TODO needs a better solution to start a videocall by chatmessage
                    if($route.current.params.video && $rootScope.app.domainPermission.videoChat)
                    {
                      $rootScope.startVideoCall(null, $route.current.params.video);
                    }

                    return Teams.get($route.current.params.uuid)
                      .then(function(team) {
                        var TeamsMembers = Teams.queryLocal();

                        return {
                          members: TeamsMembers.members,
                          teams: TeamsMembers.teams,
                          currentTeam: team
                        };
                      });
                  }
                ]
              }
            })

            .when(
            '/client',
            {
              templateUrl: 'views/clients.html',
              controller: 'clientCtrl',
              reloadOnSearch: false,
              resolve: {
                data: [
                  'Clients', '$route',
                  function (Clients, $route)
                  {
                    return ($route.current.params.local && $route.current.params.local == 'true') ?
                           Clients.queryLocal() :
                           Clients.query(false, $route.current.params);
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

                    return { clientId: $route.current.params.clientId };
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
                           { local: true};
                  }
                ],
                dataMembers: function(Teams) {
                    return Teams.updateMembersLocal();
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
                           { local: true };
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
                  'Teams', '$route',
                  function (Teams, $route)
                  {
                    removeActiveClass('.teamMenu');

                    return ($route.current.params.local && $route.current.params.local == 'true')
                      ? Teams.queryLocal()
                      : Teams.query(false, $route.current.params);
                  }
                ]
              }
            })

            .when('/team-telefoon/agenda/:userId?', {
              templateUrl: 'views/team-telephone/agenda.html',
              controller: 'agenda',
              resolve: {
                data: function($route, Slots, Storage, Dater, Store, Teams,
                               $q, $rootScope, $location, CurrentSelection)
                {
                  //remove active class TODO create a directive to solve this bug
                  removeActiveClass('.teamMenu');

                  var periods = Store('app').get('periods'),
                      groupId = CurrentSelection.getTeamId(),
                      userId = $route.current.params.userId;

                  //Check the possiblities of the user by role
                  if(! checkUserId())
                  {
                    redirectLocationLoggedUser();
                  }

                  var teamsMembers = ($route.current.params.local && $route.current.params.local == 'true')
                    ? Teams.queryLocal()
                    : Teams.query(false, $route.current.params);
                  var currentUser = null;
                  var teamsMembersData = null;

                  return $q.when(teamsMembers)
                    .then(function(teamData)
                    {
                      teamsMembersData = teamData;
                      currentUser = _.findWhere(teamData.members[groupId], {uuid: userId});
                      return getAllSlots(
                        (currentUser && currentUser.uuid) || $rootScope.app.resources.uuid
                      );
                    })
                    .then(function(timelineData)
                    {
                      return ({
                        teamsMembers: teamsMembersData,
                        timelineData: timelineData,
                        userData: currentUser
                      });
                    }
                  );

                  function getAllSlots(userId)
                  {
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
                   *
                   * @returns {boolean}
                   */
                  function checkUserId()
                  {
                    var userAllow = true;

                    if(_.isUndefined(userId))
                    {
                      userAllow = false;
                    }

                    //Get the teams of the userId in url
                    var currentTeamsRouteUser = $rootScope.getTeamsofMembers(userId);

                    //check if userId belongs to the same team as the logged user (teammember role only)
                    if(! currentTeamsRouteUser.length)
                    {
                      userAllow = false;
                    }
                    else if($rootScope.app.resources.role > 1)
                    {
                      var userTeam = _.where(currentTeamsRouteUser, {uuid: groupId});

                      if(_.isEmpty(userTeam))
                      {
                        userAllow = false;
                      }
                    }
                    else
                    {
                      groupId = currentTeamsRouteUser[0].uuid;
                    }

                    return userAllow;
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
                data: function(Logs)
                {
                  removeActiveClass('.teamMenu');

                  return Logs.fetchByTeam();
                }
              },
              reloadOnSearch: false
            })

            .when(
            '/team-telefoon',
            {
              redirectTo: function(route, path)
              {
                return path + '/agenda';
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
                data: [
                  'Teams',
                  function (Teams)
                  {
                    removeActiveClass('.teamMenu');

                    return Teams.queryLocal();
                  }
                ]
              }
            })

            .when(
            '/team-telefoon/status',
            {
              templateUrl: 'views/team-telephone/status.html',
              controller: 'status',
              reloadOnSearch: false,
              resolve: {
                data: function (TeamUp, Slots, $q, CurrentSelection)
                {
                  var teamId = CurrentSelection.getTeamId();

                  removeActiveClass('.teamMenu');

                  return $q.all([
                    TeamUp._('teamStatusQuery', {third: teamId}),
                    Slots.MemberReachabilitiesByTeam(teamId, null)
                  ]).then(function(result) {
                    return {
                      members: result[0],
                      membersReachability: result[1]
                    };
                  });
                }
              }
            })

            .when(
            '/team-telefoon/order',
            {
              templateUrl: 'views/team-telephone/order.html',
              controller: 'order',
              resolve: {
                data: function(TeamUp, CurrentSelection, $q)
                {
                  removeActiveClass('.teamMenu');

                  var teamId = CurrentSelection.getTeamId(),
                      teamStatus = TeamUp._('teamStatusQuery', {third: teamId}),
                      teamOrder = TeamUp._('callOrderGet', {second: teamId});

                  return $q.all([teamStatus, teamOrder]).then(
                    function(teamResult)
                    {
                      return {
                        teamMembers: teamResult[0],
                        teamOrder: teamResult[1]
                      };
                    }
                  );
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
                    if (! $route.current.params.userId)
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
            '/video/:videoId?',
            {
              templateUrl: 'views/video.html',
              controller: 'videoCtrl',
              reloadOnSearch: false
            })

            .otherwise({ redirectTo: '/login' });

          $httpProvider.interceptors.push(
            [
              '$location', 'Store', '$injector', '$q',
              function ($location, Store, $injector, $q)
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
                    if(rejection.status > 0)
                    {
                      switch (rejection.status)
                      {
                        case 403:
                          var loginData = Store('app').get('loginData'),
                              rejections = $injector.get('Rejections');

                          if(loginData.password)
                          {
                            return rejections.reSetSession(loginData, rejection.config);
                          }
                          else
                          {
                            rejections.sessionTimeOut();
                          }
                          break;
                      }

                      trackGa('send', 'exception', {
                        exDescription: rejection.statusText,
                        exFatal: false,
                        exError: 'Response error',
                        exStatus: rejection.status,
                        exUrl: rejection.config.url,
                        exData: rejection.data,
                        exParams: _.values(rejection.config.params).join() || '',
                        exMethodData: _.values(rejection.config.data).join() || ''
                      });
                    }

                    return $q.reject(rejection);
                  }
                };
              }
            ]);

          var removeActiveClass = function(divId)
          {
            angular.element(divId).removeClass('active');
          };
        }
      ]);
  }
);

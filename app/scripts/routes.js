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
              "$window",
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
            '/team',
            {
              templateUrl: 'views/teams.html',
              controller: 'teamCtrl',
              reloadOnSearch: false,
              resolve: {
                data: [
                  'Teams', '$route',
                  function (Teams, $route)
                  {
                    return ($route.current.params.local && $route.current.params.local == 'true') ?
                           Teams.queryLocal() :
                           Teams.query(false, $route.current.params);
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

            //TODO make it work so u could redirect to edit a task
            .when(
            '/editTask/:taskId',
            {
              templateUrl: 'views/tasks2.html',
              controller: 'tasks2Ctrl',
              reloadOnSearch: false,
              resolve: {
              //  data: [
              //    '$rootScope', '$route', '$location', 'Task',
              //    function ($rootScope, $route, $location, Task)
              //    {
              //      //angular.element('.navbar .tasks2').addClass('active');
              //      $location.hash('editTask');
              //      return Task.getId($route.current.params.taskId);
              //
              //
              //      //return { taskId: $route.current.params.taskId };
              //    }
              //  ]
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
                           { local: true };
                  }
                ]
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

            .when('/team-telefoon/agenda/:userId?', {
              templateUrl: 'views/team-telephone/agenda.html',
              controller: 'agenda',
              resolve: {
                data: function($route, Slots, Storage, Dater, Store, TeamUp, $q, $rootScope, $location)
                {
                  var periods = Store('app').get('periods'),
                    groups = Store('app').get('teams'),
                    lastVisited = Store('app').get('currentTeamClientGroup'),
                    groupId = (! _.isUndefined(lastVisited) && lastVisited.team)
                      ? lastVisited.team
                      : groups[0].uuid,
                    redirectLocationLoggedUser = function()
                    {
                      $location.path('/team-telefoon/agenda/' + $rootScope.app.resources.uuid);
                    }



                  //Check if there is a userId in the url
                  if(_.isUndefined($route.current.params.userId))
                  {
                    redirectLocationLoggedUser();
                    return false;
                  }

                  //Get the teams of the userId in url
                  var currentTeamsRouteUser = $rootScope.getTeamsofMembers($route.current.params.userId);

                  //check if userId belongs to the same team as the logged user (teammember role only)
                  if($rootScope.app.resources.role > 1)
                  {
                    var userTeam = _.where(currentTeamsRouteUser, {uuid: groupId});

                    if(_.isEmpty(userTeam))
                    {
                      redirectLocationLoggedUser();
                    }
                  }
                  else
                  {
                    groupId = currentTeamsRouteUser[0].uuid;
                  }

                  //remove active class TODO create a directive to solve this bug
                  removeActiveClass('.teamMenu');

                  var deferred = $q.defer();
                  var getAllSlots = function(userId)
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
                        members: false
                      },
                      user: userId
                    });
                  };

                  TeamUp._(
                    'profileGet',
                    {
                      third: $route.current.params.userId
                    },
                    null,
                    {
                      success: function (userData)
                      {
                        getAllSlots(userData.uuid)
                          .then(
                            function(timelineData)
                            {
                              deferred.resolve({
                                timelineData: timelineData,
                                userData: userData
                              });
                            }
                          );
                      }
                    }
                  );

                  return deferred.promise;
                }
              },
              reloadOnSearch: false
            })

            .when(
            '/team-telefoon/logs',
            {
              templateUrl: 'views/team-telephone/logs.html',
              controller: 'logs',
              resolve: {
                data: function(Logs)
                {
                  removeActiveClass('.teamMenu');
                  return Logs.fetch({
                    end: new Date.now().getTime(),
                    start: new Date.today().addDays(- 7).getTime()
                  });
                }
              },
              reloadOnSearch: false
            })

            .when(
            '/team-telefoon',
            {
              redirectTo: function(route, path, search)
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
            '/team-telefoon/status',
            {
              templateUrl: 'views/team-telephone/status.html',
              controller: 'status',
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
            '/team-telefoon/order',
            {
              templateUrl: 'views/team-telephone/order.html',
              controller: 'order',
              resolve: {
                data: function()
                {
                  removeActiveClass('.teamMenu');
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

            .otherwise({ redirectTo: '/login' });

          $httpProvider.interceptors.push(
            [
              '$q', 'Log', '$location',
              function ($q, Log, $location)
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
                          localStorage.setItem('sessionTimeout', '');
                          $location.path('/logout');
                          window.location.href = 'logout.html';
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
          }
        }
      ]);
  }
);

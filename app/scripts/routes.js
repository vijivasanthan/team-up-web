define(
  ['app'],
  function (app)
  {
    'use strict';

    app.config(
      [
        '$locationProvider', '$routeProvider', '$httpProvider',
        function ($locationProvider, $routeProvider, $httpProvider)
        {
          $routeProvider

            .when(
            '/login',
            {
              templateUrl: 'views/login.html',
              controller: 'login'
            })

            .when(
            '/logout',
            { templateUrl: 'views/logout.html' })

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

            .when(
            '/upload',
            {
              templateUrl: 'views/upload.html',
              controller: 'uploadCtrl'
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

            .when('/agenda', {
              templateUrl: 'views/agenda.html',
              controller: 'agenda',
              resolve: {
                data: function ($route, Slots, Storage, Dater, Store) {


                  var periods = Store('app').get('periods'),
                    //settings = angular.fromJson(Store('app').get('resources').settingsWebPaige),
                    groups = Store('app').get('teams'),
                    groupId = groups[0].uuid;

                  return  Slots.all({
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
                    }
                  });
                }
              },
              reloadOnSearch: false
            })

            .when(
            '/tasks2/planboard',
            {
              templateUrl: 'views/planboard.html',
              controller: 'planboard',
              reloadOnSearch: false
            })

            .when(
            '/dashboard',
            {
              templateUrl: 'views/dashboard.html',
              controller: 'dashboard'
            })

            .when(
            '/logs',
            {
              templateUrl: 'views/logs.html',
              controller: 'logs',
              resolve: {
                data: function(Logs)
                {
                  return Logs.fetch({
                    end: new Date.now().getTime(),
                    start: new Date.today().addDays(- 7).getTime()
                  });
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
            '/profile/:userId',
            {
              templateUrl: 'views/profile.html',
              controller: 'profileCtrl',
              reloadOnSearch: false,
              resolve: {
                data: [
                  '$rootScope', '$route', 'TeamUp', 'Store',
                  function ($rootScope, $route, TeamUp, Store)
                  {
                    return TeamUp._(
                      'profileGet',
                      { third: $route.current.params.userId },
                      null,
                      {
                        success: function (resources)
                        {
                          // TODO: Move this callback with other identical ones to a central location
                          if ($route.current.params.userId == $rootScope.app.resources.uuid)
                          {
                            $rootScope.app.resources = resources;

                            Store('app').save('resources', resources);
                          }
                        }
                      }
                    );
                  }
                ]
              }
            })
            //TODO this routing is not needed anymore and not well configured, the profile controller is already
            // loaded before the location path will change by the logged user
            .when(
            '/profile',
            {
              templateUrl: 'views/profile.html',
              controller: 'profileCtrl',
              resolve: {
                data: [
                  '$rootScope', '$route', '$location',
                  function ($rootScope, $route, $location)
                  {
                    if (! $route.current.params.userId || ! $location.hash())
                    {
                      $location.path('/profile/' + $rootScope.app.resources.uuid).hash('profile');
                    }
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
            '/support',
            {
              templateUrl: 'views/support.html',
              controller: 'supportCtrl',
              reloadOnSearch: false
            })

            .otherwise({ redirectTo: '/login' });

          $httpProvider.interceptors.push(
            [
              '$q', 'Log', '$location' ,
              function ($q, Log, $location)
              {
                return {
                  request: function (config)
                  {
                    return config || $q.when(config);
                  },
                  requestError: function (rejection)
                  {
                    // console.warn('request error ->', rejection);
                    Log.error(rejection);
                    return $q.reject(rejection);
                  },
                  response: function (response)
                  {
                    return response || $q.when(response);
                  },
                  responseError: function (rejection)
                  {
                    // console.warn('response error ->', rejection);
                    if (rejection.status == 403)
                    {
                      localStorage.setItem('sessionTimeout', '');
                      $location.path('/logout');
                      window.location.href = 'logout.html';
                    }

                    // Log.error(rejection);
                    return $q.reject(rejection);
                  }
                };
              }
            ]);
        }
      ]);
  }
);

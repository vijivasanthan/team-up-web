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

            .when(
            '/planboard',
            {
              templateUrl: 'views/planboard.html',
              controller: 'planboard',
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
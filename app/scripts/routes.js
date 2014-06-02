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
              controller:  'login'
            })

            .when(
            '/logout',
            { templateUrl: 'views/logout.html' })

            .when(
            '/tasks',
            {
              templateUrl: 'views/tasks.html',
              controller:  'tasksCtrl'
            })

            .when(
            '/team',
            {
              templateUrl:    'views/teams.html',
              controller:     'teamCtrl',
              reloadOnSearch: false,
              resolve:        {
                data: [
                  'Teams', '$route',
                  function (Teams, $route)
                  {
                    return ($route.current.params.local && $route.current.params.local == 'true') ?
                           Teams.queryLocal() :
                           Teams.query();
                  }
                ]
              }
            })

            .when(
            '/client',
            {
              templateUrl:    'views/clients.html',
              controller:     'clientCtrl',
              reloadOnSearch: false,
              resolve:        {
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
              templateUrl:    'views/clients.html',
              controller:     'clientCtrl',
              reloadOnSearch: false,
              resolve:        {
                data: [
                  '$rootScope', '$route',
                  function ($rootScope, $route)
                  {
                    return { clientId: $route.current.params.clientId };
                  }
                ]
              }
            })

            .when(
            '/manage',
            {
              templateUrl:    'views/manage.html',
              controller:     'manageCtrl',
              reloadOnSearch: false,
              resolve:        {
                data: [
                  'Clients', 'Teams', '$location',
                  function (ClientGroups, Teams, $location)
                  {
                    // TODO: Lose short property names and make them more readable!
                    return (($location.hash() && $location.hash() == 'reload')) ?
                           {
                             t:  Teams.query(),
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
              templateUrl:    'views/treegrid.html',
              controller:     'treegridCtrl',
              reloadOnSearch: false,
              resolve:        {
                data: [
                  'Clients', 'Teams', '$location',
                  function (ClientGroups, Teams, $location)
                  {
                    // TODO: Lose short property names and make them more readable!
                    return (($location.hash() && $location.hash() == 'reload')) ?
                           {
                             t:  Teams.query(),
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
              templateUrl:    'views/planboard.html',
              controller:     'planboard',
              reloadOnSearch: false
            })

            .when(
            '/messages',
            {
              templateUrl:    'views/messages.html',
              controller:     'messages',
              reloadOnSearch: false
            })

            .when(
            '/profile/:userId',
            {
              templateUrl:    'views/profile.html',
              controller:     'profileCtrl',
              reloadOnSearch: false,
              resolve:        {
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
              controller:  'profileCtrl',
              resolve:     {
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
              templateUrl:    'views/vis.html',
              controller:     'vis',
              reloadOnSearch: false
            })

            .otherwise({ redirectTo: '/login' });

          $httpProvider.interceptors.push('Interceptor');
        }
      ]);
  }
);
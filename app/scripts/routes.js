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
            {
              templateUrl: 'views/logout.html',
              controller:  'logout'
            })

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
                    if ($route.current.params.local && $route.current.params.local == "true")
                    {
                      return Teams.queryLocal();
                    }
                    else
                    {
                      return Teams.query(false, $route.current.params);
                    }
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
                    if ($route.current.params.local && $route.current.params.local == "true")
                    {
                      return Clients.queryLocal();
                    }
                    else
                    {
                      return Clients.query(false, $route.current.params);
                    }
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
                    return {
                      clientId: $route.current.params.clientId
                    };
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
                    var ret = {};

                    if ($location.hash() && $location.hash() == 'reload')
                    {
                      var teams = Teams.query();
                      var cGroups = ClientGroups.query();

                      ret = {
                        t:  teams,
                        cg: cGroups
                      };
                    }
                    else
                    {
                      ret.local = true;
                    }

                    return ret;
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
                  '$rootScope', '$route', 'TeamUp', 'Storage',
                  function ($rootScope, $route, TeamUp, Storage)
                  {
                    return TeamUp._(
                      'profileGet',
                      {
                        third: $route.current.params.userId
                      },
                      null,
                      {
                        success: function (resources)
                        {
                          // TODO: Move this callback with other identical ones to a central location
                          if ($route.current.params.userId == $rootScope.app.resources.uuid)
                          {
                            $rootScope.app.resources = resources;

                            Storage.add('resources', angular.toJson(resources));
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

            .otherwise(
            {
              redirectTo: '/login'
            });

          $httpProvider.interceptors.push('Interceptor');
        }
      ]);
  }
);
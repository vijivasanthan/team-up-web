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

            .when('/login',
            {
              templateUrl: 'views/login.html',
              controller: 'login'
            })

            .when('/logout',
            {
              templateUrl: 'views/logout.html',
              controller: 'logout'
            })

            .when('/team',
            {
              templateUrl: 'views/teams.html',
              controller: 'teamCtrl',
              resolve: {
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
                      return Teams.query(false,$route.current.params);
                    }
                  }
                ]
              },
              reloadOnSearch: false
            })

            .when('/client',
            {
              templateUrl: 'views/clients.html',
              controller: 'clientCtrl',
              resolve: {
                data: [
                  'Clients', '$route',
                  function (ClientGroups, $route)
                  {
                    if ($route.current.params.local && $route.current.params.local == "true")
                    {
                      return ClientGroups.queryLocal();
                    }
                    else
                    {
                      return ClientGroups.query(false,$route.current.params);
                    }
                  }
                ]
              },
              reloadOnSearch: false
            })

            .when('/clientProfile/:clientId',
            {
              templateUrl: 'views/clients.html',
              controller: 'clientCtrl',
              resolve: {
                data: [
                  '$rootScope', '$route',
                  function ($rootScope, $route)
                  {
                    return {
                      clientId: $route.current.params.clientId
                    };
                  }
                ]
              },
              reloadOnSearch: false
            })

            .when('/manage',
            {
              templateUrl: 'views/manage.html',
              controller: 'manageCtrl',
              resolve: {
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
                        t: teams,
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
              },
              reloadOnSearch: false
            })

            .when('/planboard',
            {
              templateUrl: 'views/planboard.html',
              controller: 'planboard',
              reloadOnSearch: false
            })

            .when('/messages',
            {
              templateUrl: 'views/messages.html',
              controller: 'messages',
              reloadOnSearch: false
            })

            .when('/profile/:userId',
            {
              templateUrl: 'views/profile.html',
              controller: 'profileCtrl',
              resolve: {
                data: [
                  '$rootScope', 'Profile', '$route',
                  function ($rootScope, Profile, $route)
                  {
                    return Profile.get($route.current.params.userId, false);
                  }
                ]
              },
              reloadOnSearch: false
            })

            .when('/profile',
            {
              templateUrl: 'views/profile.html',
              controller: 'profileCtrl',
              resolve: {
                data: [
                  '$rootScope', '$route', '$location',
                  function ($rootScope, $route, $location)
                  {
                    if (!$route.current.params.userId || !$location.hash())
                      $location.path('/profile/' + $rootScope.app.resources.uuid).hash('profile');
                  }
                ]
              }
            })

            .otherwise({
              redirectTo: '/login'
            });

          // $httpProvider.interceptors.push('Interceptor');
        }
      ]);
  }
);
/*jslint node: true */
/*global angular */
'use strict';


/**
 * Providers & Routes
 */
angular.module('WebPaige')
.config(
[
  '$locationProvider', '$routeProvider', '$httpProvider',
  function ($locationProvider, $routeProvider, $httpProvider)
  {
    /**
     * Login router
     */
    $routeProvider
    .when('/login',
    {
      templateUrl: 'scripts/js/dist/views/login.html',
      controller: 'login'
    })


    /**
     * Logout router
     */
    .when('/logout',
    {
      templateUrl: 'scripts/js/dist/views/logout.html',
      controller: 'logout'
    })


    /**
     * Dashboard router
     */
    .when('/dashboard',
    {
      templateUrl: 'scripts/js/dist/views/dashboard.html',
      controller: 'dashboard'
    })


    /**
     * TV Monitor / Dashboard router
     */
    .when('/tv',
    {
      templateUrl: 'scripts/js/dist/views/tv.html',
      controller: 'tv',
      resolve: {
        data:
          [
            '$route', '$http',
            function ($route, $http)
            {
              if ($route.current.params.sessionID)
              {
                $http.defaults.headers.common['X-SESSION_ID'] = $route.current.params.sessionID;
              }
            }
          ]
      }
    })


    /**
     * Planboard router
     */
    .when('/planboard',
    {
      templateUrl: 'scripts/js/dist/views/planboard.html',
      controller: 'planboard',
      resolve: {
        data:
        [
          '$route', 'Slots', 'Storage', 'Dater',
          function ($route, Slots, Storage, Dater)
          {
            var periods   = Storage.local.periods(),
                settings  = Storage.local.settings();

            var stamps = {};

            if (Dater.current.today() > 360)
            {
              stamps = {
                start:  periods.days[358].last.timeStamp,
                end:    periods.days[365].last.timeStamp
              }
            }
            else
            {
              stamps = {
                start:  periods.days[Dater.current.today() - 1].last.timeStamp,
                end:    periods.days[Dater.current.today() + 6].last.timeStamp
              }
            }

            return  Slots.all({
                      groupId:  settings.app.group,
                      stamps:   stamps,
                      month:    Dater.current.month(),
                      layouts: {
                        user:     true,
                        group:    true,
                        members:  false
                      }
                    });
          }
        ]
      },
      reloadOnSearch: false
    })


    /**
     * Messages router
     */
    .when('/messages',
    {
      templateUrl: 'scripts/js/dist/views/messages.html',
      controller: 'messages',
      resolve: {
        data: [
          '$route', 'Messages',
          function ($route, Messages)
          {
            return Messages.query();
          }
        ]
      },
      reloadOnSearch: false
    })


    /**
     * Groups router
     */
    .when('/groups',
    {
      templateUrl: 'scripts/js/dist/views/groups.html',
      controller: 'groups',
      resolve: {
        data: [
          'Groups',
          function (Groups)
          {
            return Groups.query();
          }
        ]
      },
      reloadOnSearch: false
    })


    /**
     * Profile (user specific) router
     */
    .when('/profile/:userId',
    {
      templateUrl: 'scripts/js/dist/views/profile.html',
      controller: 'profile',
      resolve: {
        data: [
          '$rootScope', 'Profile', '$route', '$location',
          function ($rootScope, Profile, $route, $location)
          {
            if ($route.current.params.userId.toLowerCase() != $rootScope.app.resources.uuid)
            {
              // IE route fix
              var onejan = new Date(new Date().getFullYear(),0,1);

              // var periods = Dater.getPeriods(),
              var periods = angular.fromJson(localStorage.getItem('WebPaige.periods')),
                  // current = Dater.current.week(),
                  // current = new Date().getWeek(),
                  current = Math.ceil((((new Date() - onejan) / 86400000) + onejan.getDay()+1)/7);

              // console.log('---->', current);

              var ranges  = {
                    start:  periods.weeks[current].first.timeStamp / 1000,
                    end:    periods.weeks[current].last.timeStamp / 1000
                  };

              return Profile.getWithSlots($route.current.params.userId.toLowerCase(), false, ranges);
            }
            else
            {
              return Profile.get($route.current.params.userId.toLowerCase(), false);
            }
          }
        ]
      },
      reloadOnSearch: false
    })


    /**
     * Profile (user hiself) router
     */
    .when('/profile',
    {
      templateUrl: 'scripts/js/dist/views/profile.html',
      controller: 'profile',
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


    /**
     * Settings router
     */
    .when('/settings',
    {
      templateUrl: 'scripts/js/dist/views/settings.html',
      controller: 'settings',
      resolve: {
        data: [
          'Settings',
          function (Settings)
          {
            return angular.fromJson(Settings.get());
          }
        ]
      }
    })


    /**
     * Help router
     */
    .when('/help',
    {
      templateUrl: 'scripts/js/dist/views/help.html',
      controller: 'help'
    })


    /**
     * Router fallback
     */
    .otherwise({
      redirectTo: '/login'
    });


    /**
     * Define interceptor
     */
    $httpProvider.responseInterceptors.push('Interceptor');
  }
]);
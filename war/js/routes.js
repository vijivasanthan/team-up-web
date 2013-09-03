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
      templateUrl: 'dist/views/login.html',
      controller: 'login'
    })


    /**
     * Forgot password router
     */
    .when('/forgotpass',
    {
      templateUrl: 'dist/views/forgotpass.html',
      controller: 'forgotpass'
    })


    /**
     * Register router
     */
    .when('/register',
    {
      templateUrl: 'dist/views/register.html',
      controller: 'register'
    })


    /**
     * Logout router
     */
    // .when('/logout',
    // {
    //   templateUrl: 'dist/views/logout.html',
    //   controller: 'logout'
    // })


    /**
     * Teams router
     */
     .when('/team',
     {
       templateUrl: 'dist/views/teams.html',
       controller: 'teamCtrl',
       resolve: {
           data: [
             'Teams','$route',
             function (Teams,$route)
             {
               return Teams.query(false,$route.current.params);
             }
           ]
       },
       reloadOnSearch: false
     })


    /**
     * Client router
     */
    .when('/client',
    {
      templateUrl:    'dist/views/clients.html',
      controller:     'clientCtrl',
      resolve: {
          data: [
            'Clients','$route',
            function (ClientGroups,$route)
            {
              return ClientGroups.query(false,$route.current.params);
            }
          ]
      },
      reloadOnSearch: false
    })
    
    /**
     * Client Profile router
     */
    .when('/clientProfile/:clientId',
    {
      templateUrl:    'dist/views/clients.html',
      controller:     'clientCtrl',
      resolve: {
          data: [
            '$rootScope', '$route', '$location', 'Clients', 
            function ($rootScope, $route, $location, Clients)
            {
                var data = {clientId : $route.current.params.clientId};
                return data;
//                return Clients.getReports($route.current.params.clientId, false);
            }
          ]
      },
      reloadOnSearch: false
    })
    
    /**
     * Client Group - Team , Management 
     */
    .when('/manage',
    {
      templateUrl:    'dist/views/manage.html',
      controller:     'manageCtrl',
      resolve: {
          data: [
            'Clients','Teams','$location',
            function (ClientGroups,Teams,$location)
            {
                  var ret = {};
                  
                  if($location.hash() && $location.hash() == 'reload'){
                      var teams = Teams.query();
                      var cGroups = ClientGroups.query();
                      ret = { t : teams , cg : cGroups};
                      // ret = Teams.getAll();
                  }else{
                      ret.local = true;
                  }
              
                  return ret;
            }
          ]
      },
      reloadOnSearch: false
    })
    

    /**
     * Settings router
     */
    // .when('/settings',
    // {
    //   templateUrl: 'dist/views/settings.html',
    //   controller: 'settings'
    // })


    /**
     * Planboard router
     */
    // .when('/planboard',
    // {
    //   templateUrl: 'dist/views/planboard.html',
    //   controller: 'planboard',
    //   resolve: {
    //     data:
    //     [
    //       '$route', 'Slots', 'Storage', 'Dater',
    //       function ($route, Slots, Storage, Dater)
    //       {
    //         var periods = Storage.local.periods(),
    //             current = Dater.current.week(),
    //             initial = periods.weeks[current],
    //             groups  = Storage.local.groups(),
    //             settings = Storage.local.settings();

    //         return  Slots.all({
    //                   groupId:  settings.app.group,
    //                   division: 'all',
    //                   stamps: {
    //                     start:  initial.first.timeStamp,
    //                     end:    initial.last.timeStamp
    //                   },
    //                   month: Dater.current.month(),
    //                   layouts: {
    //                     user:     true,
    //                     group:    true,
    //                     members:  false
    //                   }
    //                 });
    //       }
    //     ]
    //   },
    //   reloadOnSearch: false
    // })


    /**
     * Messages router
     */
     .when('/messages',
     {
       templateUrl: 'dist/views/messages.html',
       controller: 'messages',
//       resolve: {
//         data: [
//           '$route', 'Messages',
//           function ($route, Messages)
//           {
//             return Messages.query();
//           }
//         ]
//       },
       reloadOnSearch: false
     })


    /**
     * Groups router
     */
    // .when('/groups',
    // {
    //   templateUrl: 'dist/views/groups.html',
    //   controller: 'groups',
    //   resolve: {
    //     data: [
    //       'Groups',
    //       function (Groups)
    //       {
    //         return Groups.query();
    //       }
    //     ]
    //   },
    //   reloadOnSearch: false
    // })


    /**
     * Profile (user specific) router
     */
     .when('/profile/:userId',
     {
       templateUrl: 'dist/views/profile.html',
       controller: 'profileCtrl',
       resolve: {
         data: [
           '$rootScope', 'Profile', '$route', '$location', 'Dater',
           function ($rootScope, Profile, $route, $location, Dater)
           {
               return Profile.get($route.current.params.userId, false);
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
       templateUrl: 'dist/views/profile.html',
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


    /**
     * Settings router
     */
    // .when('/settings',
    // {
    //   templateUrl: 'dist/views/settings.html',
    //   controller: 'settings',
    //   resolve: {
    //     data: [
    //       'Settings',
    //       function (Settings)
    //       {
    //         return angular.fromJson(Settings.get());
    //       }
    //     ]
    //   }
    // })


    /**
     * Help router
     */
    // .when('/help',
    // {
    //   templateUrl: 'dist/views/help.html',
    //   controller: 'help'
    // })


    /**
     * Router fallback
     */
    .otherwise({
      redirectTo: '/login'
    });


    /**
     * Define interceptor
     */
    // $httpProvider.responseInterceptors.push('Interceptor');
  }
]);
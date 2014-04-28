define(
  ['app'],
  function (app)
  {
    'use strict';

    app.config(
      [
        '$routeProvider', '$httpProvider',
        function ($routeProvider, $httpProvider)
        {
          $routeProvider
            .when('/home',
            {
              templateUrl:  'views/home.html',
              controller:   'home'
            })
            .when('/partial1',
            {
              templateUrl:  'views/partial1.html',
              controller:   'partial1'
            })
            .when('/partial2',
            {
              templateUrl:  'views/partial2.html',
              controller:   'partial2'
            })
            .otherwise({
              redirectTo: '/home'
            });

          //$httpProvider.interceptors.push('Interceptor');
        }
      ]
    );
  }
);
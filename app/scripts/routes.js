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
            .when('/login',
            {
              templateUrl: 'views/login.html',
              controller: 'login'
            })
            .otherwise({
              redirectTo: '/login'
            });

          // $httpProvider.interceptors.push('Interceptor');
        }
      ]
    );
  }
);
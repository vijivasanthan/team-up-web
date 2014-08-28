define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'supportCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        function ($rootScope, $scope, $location)
        {
          $rootScope.fixStyles();

          var view = (! $location.hash()) ? 'web' : $location.hash();

          function resetViews ()
          {
            $scope.views = {
              web: false,
              ios: false,
              android: false
            };
          }

          var setView = function (hash)
          {
            resetViews();

            $scope.views[hash] = true;

            $location.hash(hash);
          };

          $scope.setViewTo = function (hash)
          {
            $scope.$watch(
              hash,
              function ()
              {
                $location.hash(hash);

                setView(hash);
              }
            );
          };

          setView(view);
        }
      ]
    );
  }
);
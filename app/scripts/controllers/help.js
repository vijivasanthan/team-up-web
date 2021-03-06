define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'helpCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        function ($rootScope, $scope, $location)
        {
          $rootScope.fixStyles();

          function resetViews ()
          {
            $scope.views = {
              teamTelephone: false,
              web: false,
              ios: false,
              android: false,
              teams: false
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

          setView($location.hash() || 'teams');
        }
      ]
    );
  }
);
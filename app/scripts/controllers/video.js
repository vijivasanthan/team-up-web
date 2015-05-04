define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'videoCtrl', 
        function ($rootScope, $route, $scope, $location)
        {
          $rootScope.fixStyles();

          angular.element('.navbar').show();
          angular.element('body').css('background-color', '');
          angular.element('#footer').show();

          console.log('$route.current.params.userId', $route.current.params.videoId);

          //var view = (! $location.hash()) ? 'web' : $location.hash();
          //
          //function resetViews ()
          //{
          //  $scope.views = {
          //    web: false,
          //    ios: false,
          //    android: false
          //  };
          //}
          //
          //var setView = function (hash)
          //{
          //  resetViews();
          //
          //  $scope.views[hash] = true;
          //
          //  $location.hash(hash);
          //};
          //
          //$scope.setViewTo = function (hash)
          //{
          //  $scope.$watch(
          //    hash,
          //    function ()
          //    {
          //      $location.hash(hash);
          //
          //      setView(hash);
          //    }
          //  );
          //};
          //
          //setView(view);
        }
    );
  }
);
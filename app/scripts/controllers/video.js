define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'videoCtrl',
        function ($rootScope, $route, $scope, $filter, $location)
        {
          $rootScope.fixStyles();

          angular.element('.navbar').show();
          angular.element('body').css('background-color', '');
          angular.element('#footer').show();

          $scope.getRoom = function()
          {
            return $filter('trusted_url')('http://webrtc.ask-fast.com/?room=' + $route.current.params.videoId);
          };
        }
    );
  }
);
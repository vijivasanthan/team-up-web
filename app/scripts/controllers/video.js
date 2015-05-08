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

          //Ook implementatie als er geen room name wordt meegegeven
          $scope.getRoom = function()
          {
            var videoCall = null;

            if($route.current.params.videoId)
            {
              videoCall = $filter('trusted_url')('http://webrtc.ask-fast.com/?room=' + $route.current.params.videoId);
            }
            else
            {
              //$rootScope.notifier.error("Er is geen roomnummer opgegeven");
            }

            return videoCall;
          };
        }
    );
  }
);
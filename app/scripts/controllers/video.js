define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'videoCtrl',
        function ($rootScope, $route, $scope, $filter, check)
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
              //http://webrtc.ask-fast.com
              //http://webrtc.ask-cs.com
              //http://localhost:9001
              var url = config.app.videoCallUrl + '/?room=' + $route.current.params.videoId + '&username=user';
              videoCall = $filter(url);
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
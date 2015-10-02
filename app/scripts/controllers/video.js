define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'videoCtrl',
        function ($rootScope, $route, $scope, $filter, data)
        {
          console.error('data', data);

          $rootScope.fixStyles();

          angular.element('.navbar').show();
          angular.element('body').css('background-color', '');
          angular.element('#footer').show();

          //Ook implementatie als er geen room name wordt meegegeven
          $scope.getRoom = function()
          {
            var videoCall = null;

            var url = config.app.videoCallUrl + '/?room=' + 123 + '&userName=' + data.fullName;

            if($route.current.params.videoId)
            {
              //http://webrtc.ask-fast.com
              //http://webrtc.ask-cs.com
              //http://localhost:9001
            }
            else
            {
              //$rootScope.notifier.error("Er is geen roomnummer opgegeven");
            }
            console.log('url', url);

            return $filter('trusted_url')(url);
          };
        }
    );
  }
);
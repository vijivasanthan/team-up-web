define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'videoCtrl',
        function ($rootScope, $scope, $filter, data, $timeout)
        {
          console.error('data', data);
          $scope.hasCall = (data.callId);

          $rootScope.fixStyles();

          angular.element('.navbar').show();
          angular.element('body').css('background-color', '');
          angular.element('#footer').show();

          //Ook implementatie als er geen callid wordt meegegeven
          $scope.getCall = function(callback)
          {
            var videoCall = null;
            var url = config.app.videoCallUrl + '/?room=' + (data.callId || 123) + '&username=' + data.fullName;
            (callback && callback());
            return $filter('trusted_url')(url);
          };

          $scope.sendHeight = function ()
          {
            var height = angular.element('.responsive_video iframe').css('min-height');
            console.error('height', height);

            $timeout(function ()
            {
              console.error('send ', height);
              window.parent.postMessage(height, "*");
            }, 1000);
          };
        }
    );
  }
);
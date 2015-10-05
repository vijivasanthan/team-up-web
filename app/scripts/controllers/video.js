define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'videoCtrl',
        function ($rootScope, $scope, $filter, data)
        {
          console.error('data', data);
          $scope.hasCall = (data.callId);

          $rootScope.fixStyles();

          angular.element('.navbar').show();
          angular.element('body').css('background-color', '');
          angular.element('#footer').show();

          //Ook implementatie als er geen callid wordt meegegeven
          $scope.getCall = function()
          {
            var videoCall = null;
            var url = config.app.videoCallUrl + '/?room=' + (data.callId || 123) + '&username=' + data.fullName;
            return $filter('trusted_url')(url);
          };
        }
    );
  }
);
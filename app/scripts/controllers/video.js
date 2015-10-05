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
          $scope.hasRoom = (data.roomId);

          $rootScope.fixStyles();

          angular.element('.navbar').show();
          angular.element('body').css('background-color', '');
          angular.element('#footer').show();

          //Ook implementatie als er geen room name wordt meegegeven
          $scope.getRoom = function()
          {
            var videoCall = null;
            var url = config.app.videoCallUrl + '/?room=' + 123 + '&username=' + data.fullName;
            return $filter('trusted_url')(url);
          };
        }
    );
  }
);
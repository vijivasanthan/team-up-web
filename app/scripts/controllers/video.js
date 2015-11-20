define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'videoCtrl',
      function ($rootScope, $scope, $filter, data)
      {
        $scope.hasCall = (!! data.callId);
        $rootScope.fixStyles();

        angular.element('.navbar').show();
        angular.element('body').css('background-color', '');
        angular.element('#footer').show();

        //Ook implementatie als er geen callid wordt meegegeven
        $scope.getCall = function(callback)
        {
          var videoCall = null;
          var url = config.app.videoCallUrl + '/r/' + (data.callId || 123); // + '&username=' + data.fullName;
          (callback && callback());
          return $filter('trusted_url')(url);
        };

        //Show get back button if the one of the users hangsup
      }
    );
  }
);
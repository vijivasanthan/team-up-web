define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'videoCtrl',
      function ($rootScope, $scope, $filter, $location)
      {
        $rootScope.fixStyles();

        angular.element('.navbar').show();
        angular.element('body').css('background-color', '');
        angular.element('#footer').show();

        $scope.getCall = function(callback)
        {
          var params = $location.search();
          var url = config.app.videoCallUrl + '/r/' + (params.roomId || 123) + "?teamupName=" + params.fullName;
          (callback && callback());
          return $filter('trusted_url')(url);
        };
      }
    );
  }
);

define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller ('partial1',
      [
        '$scope',
        function ($scope)
        {
          // $scope.name = User.get();
        }
      ]
    );
  }
);
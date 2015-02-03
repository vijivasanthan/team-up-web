define(
  ['controllers/controllers', 'config'],
  function (controllers, config) {
    'use strict';

    controllers.controller('exampleTestCtrl', function(
      $rootScope,
      $scope
      //TestModal
    ){
      $scope.exampleTestString = 'Controller testing works';

      //$scope.passWord = 'dasd2135';
      //
      //$scope.testLengthPassword = function()
      //{
      //  $scope.strength = ($scope.passWord.length >= 8) ? 'strong' : 'weak';
      //}
      //
      //$scope.getACL = function()
      //{
      //  TestModal.getPermissionProfile()
      //    .then(function(result) {
      //      $scope.userId = result;
      //    });
      //};

    });
  }
);
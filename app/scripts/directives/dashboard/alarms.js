define(['directives/directives'], function (directives) {
  'use strict';

  directives.directive('alarms', function () {
    return {
      restrict: 'EA',
      templateUrl: 'views/dashboard/alarms.html',
      link: function (scope, element, attr) {
      }
    };
  });
});
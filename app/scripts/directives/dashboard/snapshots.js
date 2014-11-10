define(['directives/directives'], function (directives) {
  'use strict';

  directives.directive('snapshots', function () {
    return {
      restrict: 'EA',
      templateUrl: 'views/dashboard/snapshots.html',
      link: function (scope, element, attr) {
      }
    };
  });
});
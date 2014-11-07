define(['directives/directives'], function (directives) {
  'use strict';

  directives.directive('presenceOverview', function () {
    return {
      restrict: 'EA',
      templateUrl: 'views/dashboard/presence-overview.html',
      link: function (scope, element, attr) {
      }
    };
  });
});
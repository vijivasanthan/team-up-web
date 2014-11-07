define(['directives/directives'], function (directives) {
  'use strict';

  directives.directive('summaries', function () {
    return {
      restrict: 'EA',
      templateUrl: 'views/dashboard/summaries.html',
      link: function (scope, element, attr) {
      }
    };
  });
});
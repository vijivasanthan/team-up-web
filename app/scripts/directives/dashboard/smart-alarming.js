define(['directives/directives'], function (directives) {
  'use strict';

  directives.directive('smartAlarming', function () {
    return {
      restrict: 'EA',
      templateUrl: 'views/dashboard/smart-alarming.html',
      link: function (scope, element, attr) {
      }
    };
  });
});
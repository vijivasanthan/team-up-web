define(
  ['directives/directives'],
  function (directives)
  {
    'use strict';

    directives.directive(
      'treeGrid',
      [
        '$rootScope', '$window',
        function ($rootScope, $window)
        {
          return {
            restrict: 'AE',
            controller: function ($scope)
            {
            },
            link: function (scope, element, attrs)
            {
              console.log('$rootScope, $scope, $window ->', scope);
            }
          };
        }
      ]
    );


  }
);
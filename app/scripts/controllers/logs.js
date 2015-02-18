define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'logs', [
        '$rootScope',
        '$scope',
        '$filter',
        '$timeout',
        'Logs',
        'data',
        function ($rootScope, $scope, $filter, $timeout, Logs, data)
        {
          $rootScope.fixStyles();

          $scope.data = data;

          $scope.orderBy = function (ordered)
          {
            $scope.ordered = ordered;

            $scope.reversed = !$scope.reversed;
          };

          $scope.ordered = 'started.stamp';
          $scope.reversed = true;

          $scope.daterange = $filter('date')(data.periods.start, 'dd-MM-yyyy') + ' / ' +
          $filter('date')(data.periods.end, 'dd-MM-yyyy');

          $rootScope.$on('getLogRange', function ()
          {
            var periods = arguments[1];

            fetchLogs(periods);
          });

          function fetchLogs(dataRange)
          {
            $timeout(function ()
            {
              $rootScope.statusBar.display('Logs laden..')
              $scope.loadLogs = true;
            });

            Logs.fetch(dataRange)
              .then(function (data)
              {
                $scope.loadLogs = false;
                $scope.data = data;

                $rootScope.statusBar.off();
              });
          }
        }
      ]
    );
  });

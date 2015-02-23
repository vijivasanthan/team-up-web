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
        'Store',
        function ($rootScope, $scope, $filter, $timeout, Logs, data, Store)
        {
          $rootScope.fixStyles();

          $scope.data = data.logs;

          $scope.teams = data.teamAdapters;

          var selectedTeam = Store('app').get('currentTeamClientGroup'),
              currentTeamAdapter = _.findWhere($scope.teams, {teamId: selectedTeam.team});

          $scope.current = (currentTeamAdapter)
              ? currentTeamAdapter.adapterId
              : $scope.teams[0].adapterId;

          $scope.orderBy = function (ordered)
          {
            $scope.ordered = ordered;

            $scope.reversed = !$scope.reversed;
          };

          $scope.ordered = 'started.stamp';
          $scope.reversed = true;

          $scope.daterange = $filter('date')($scope.data.periods.start, 'dd-MM-yyyy') + ' / ' +
          $filter('date')($scope.data.periods.end, 'dd-MM-yyyy');

          $rootScope.$on('getLogRange', function ()
          {
            var periods = arguments[1];

            fetchLogs(periods);
          });

          function fetchLogs(dataRange)
          {
            $timeout(function ()
            {
              $rootScope.statusBar.display('Logs laden..');
              $scope.loadLogs = true;
            });

            Logs.fetch(dataRange)
              .then(function (data)
              {
                console.log('data', data);

                $scope.loadLogs = false;
                $scope.data = data;

                $rootScope.statusBar.off();
              });
          }
        }
      ]
    );
  });

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
        'CurrentSelection',
        function ($rootScope, $scope, $filter, $timeout, Logs, data, Store, CurrentSelection)
        {
          $rootScope.fixStyles();

          $scope.data = data.logs;

          $scope.teams = data.teamAdapters;

          var currentTeamAdapter = _.findWhere($scope.teams, {teamId: CurrentSelection.getTeamId()});

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

          $scope.switchTeam = function(adapterId)
          {
            var team = (! _.isNull(adapterId))
              ? _.findWhere($scope.teams, {adapterId: adapterId})
              : null;

            if(!_.isNull(team))
            {
              CurrentSelection.local = team.teamId;
            }
          };

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

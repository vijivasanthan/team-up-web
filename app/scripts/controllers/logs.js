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
          //$scope.teams = data.teamAdapters;

          //var currentTeamAdapter = _.findWhere($scope.teams, {teamId: CurrentSelection.getTeamId()});

          //$scope.current = (currentTeamAdapter)
          //    ? currentTeamAdapter.adapterId
          //    : $scope.teams[0].adapterId;

          //$scope.switchTeam = function(adapterId)
          //{
          //  var team = (! _.isNull(adapterId))
          //    ? _.findWhere($scope.teams, {adapterId: adapterId})
          //    : null;
          //
          //  if(!_.isNull(team))
          //  {
          //    CurrentSelection.local = team.teamId;
          //  }
          //};

          //filter: current
          //|filter: current

          //.form-group.has-feedback.pull-left(ng-hide='app.resources.role > 1')
          //	label.control-label Selecteer team
          //	.controls
          //		select(ng-model='current',
          //		ng-options='team.adapterId as team.name for team in teams | orderBy:"name"',
          //		ng-selected='current',
          //		ng-change='switchTeam(current)')

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
              $rootScope.statusBar.display($rootScope.ui.logs.loadLogs);
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

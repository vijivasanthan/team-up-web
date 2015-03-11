define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'logs', [
        '$rootScope',
        '$filter',
        '$timeout',
        'Logs',
        'data',
        function ($rootScope, $filter, $timeout, Logs, data)
        {
          $rootScope.fixStyles();

          var vm = this;
          vm.data = data;
          vm.teams = data.teams;

          var everyoneId = 'all',
            periods = {
              startTime: vm.data.logData.periods.startTime,
              endTime: vm.data.logData.periods.endTime
            };

          vm.teams.unshift({
            name: $rootScope.ui.dashboard.everyone,
            teamId: everyoneId,
            adapterId: everyoneId
          });

          vm.current = ($rootScope.app.resources.role > 1)
            ? ($rootScope.app.resources.teamUuids)[0]
            : everyoneId;

          vm.ordered = 'started.stamp';
          vm.reversed = true;

          vm.daterange = $filter('date')(periods.startTime, 'dd-MM-yyyy') + ' / ' +
          $filter('date')(periods.endTime, 'dd-MM-yyyy');

          $rootScope.$on('getLogRange', function ()
          {
            periods = arguments[1];

            vm.fetchLogs();
          });

          vm.fetchLogs = function()
          {
            var teamPhoneAdapterData = _.findWhere(vm.data.teams, {teamId: vm.current}),
              options = {
                startTime: periods.startTime,
                endTime: periods.endTime,
                adapterId: teamPhoneAdapterData.adapterId || _.uniqueId()
              };

            $timeout(function ()
            {
              $rootScope.statusBar.display($rootScope.ui.logs.loadLogs);
              vm.loadLogs = true;
            });

            Logs.fetch(options)
              .then(function (logData)
              {
                vm.loadLogs = false;
                vm.data.logData = logData;

                $rootScope.statusBar.off();
              });
          }
        }
      ]
    );
  });
define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'logs',
      function ($rootScope, $filter, $timeout, Logs, CurrentSelection, data)
      {
        $rootScope.fixStyles();

        var vm = this,
          everyoneId = 'all',
          periods = {
            startTime: data.logData.periods.startTime,
            endTime: data.logData.periods.endTime
          };

        vm.data = data;
        vm.teams = data.teams;

        if ($rootScope.app.resources.role == 1)
        {
          vm.teams.unshift({
            name: $rootScope.ui.dashboard.everyone,
            teamId: everyoneId,
            adapterId: everyoneId
          });
        }

        vm.current = CurrentSelection.getTeamId();

        vm.ordered = 'started.stamp';
        vm.reversed = true;
        vm.daterange = $filter('date')(periods.startTime, 'dd-MM-yyyy') + ' / ' +
        $filter('date')(periods.endTime, 'dd-MM-yyyy');

        $rootScope.$on('getLogRange', function ()
        {
          periods = arguments[1];

          vm.fetchLogs();
        });

        vm.fetchLogs = function ()
        {
          CurrentSelection.local = vm.current;

          var teamPhoneAdapterData = _.findWhere(vm.data.teams, {teamId: vm.current}),
            options = {
              startTime: data.logData.periods.startTime,
              endTime: data.logData.periods.endTime,
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
        };
      }
    );
  });
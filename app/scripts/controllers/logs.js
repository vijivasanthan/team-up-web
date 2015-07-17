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

        var vm = this;

        vm.data = data;

        if ($rootScope.app.resources.role == 1)
        {
          vm.data.teams.unshift({
            name: $rootScope.ui.dashboard.everyone,
            teamId: 'all',
            adapterId: 'all'
          });
        }

        vm.current = CurrentSelection.getTeamId();

        vm.ordered = 'started.stamp';
        vm.reversed = true;
        vm.daterange = $filter('date')(data.logData.periods.startTime, 'dd-MM-yyyy') + ' / ' +
        $filter('date')(data.logData.periods.endTime, 'dd-MM-yyyy');

        $rootScope.$on('getLogRange', function ()
        {
          var periods = arguments[1];
          data.logData.periods.startTime = periods.startTime;
          data.logData.periods.endTime = periods.endTime;

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
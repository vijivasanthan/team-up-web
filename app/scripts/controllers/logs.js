define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'logs',
      function (
        $rootScope,
        $location,
        $filter,
        $timeout,
        TeamUp,
        Logs,
        CurrentSelection,
        Teams,
        data)
      {
        $rootScope.fixStyles();

        var vm = this;
        vm.data = data;

        if ($rootScope.app.resources.role == 1)
        {
          vm.data.teams.unshift({
            name: $rootScope.ui.dashboard.everyone,
            uuid: 'all'
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
          var options = {
            startTime: data.logData.periods.startTime,
            endTime: data.logData.periods.endTime
          };

          $timeout(function ()
          {
            $rootScope.statusBar.display($rootScope.ui.logs.loadLogs);
            vm.loadLogs = true;
          });

          (vm.current == 'all')
            ? fetchForAllTeams(options)
            : fetchForSingleTeam(options);
        };

        /**
         * Fetch logs per team
         */
        function fetchForSingleTeam(options)
        {
          CurrentSelection.local = vm.current;

          TeamUp._('TTOptionsGet', {second: vm.current})
            .then(function (TeamTelephoneSettings)
            {
              options.adapterId = TeamTelephoneSettings.adapterId;

              if (! TeamTelephoneSettings.adapterId)
              {
                $location.path('team-telefoon/options');
              }
              else
              {
                var _teams = null;

                Teams.getSingle(vm.current)
                  .then(function(members)
                  {
                    return Logs.fetch(
                      _.extend(options, {
                          adapterId: options.adapterId,
                          members: _.map(members, _.partialRight(_.pick,['fullName','phone'])),
                          currentTeam: {
                            fullName: (_.findWhere(
                                vm.data.teams, {uuid: vm.current})
                            ).name,
                            phone: TeamTelephoneSettings.phoneNumber
                          }
                        }
                      )
                    );
                  })
                  .then(receiveLogs);
              }
            });
        }

        /**
         * Fetch all logs
         * @param options
         */
        function fetchForAllTeams(options)
        {
          options.adapterId = null;
          Logs.fetch(options)
            .then(receiveLogs);
        }

        /**
         * Receive logs if the promise is fullfilled
         * @param logData The logs per team of all teams
         */
        function receiveLogs(logData)
        {
          vm.loadLogs = false;
          vm.data.logData = logData;

          $rootScope.statusBar.off();
        }
      }
    );
  });
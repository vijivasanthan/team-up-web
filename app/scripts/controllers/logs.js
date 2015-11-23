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

        //viewmodel
        var self = this;

        //properties
        self.data = data;
        self.current = CurrentSelection.getTeamId();
        self.ordered = 'started.stamp';
        self.reversed = true;
        self.daterange = $filter('date')(data.logData.periods.startTime, 'dd-MM-yyyy') + ' / ' +
          $filter('date')(data.logData.periods.endTime, 'dd-MM-yyyy');

        //methods
        self.fetchLogs = fetchLogs;
        self.toggleGroupedLogs = toggleGroupedLogs;
        self.init = init;

        //initialisation
        self.init();

        //event receiver
        $rootScope.$on('getLogRange', function ()
        {
          var periods = arguments[1];
          data.logData.periods.startTime = periods.startTime;
          data.logData.periods.endTime = periods.endTime;

          self.fetchLogs();
        });

        /**
         * Fetch logs by range for everyone or per team,
         * the last option depends on the logged user role
         */
        function fetchLogs()
        {
          var options = {
            startTime: data.logData.periods.startTime,
            endTime: data.logData.periods.endTime
          };

          $timeout(function ()
          {
            $rootScope.statusBar.display($rootScope.ui.logs.loadLogs);
            self.loadLogs = true;
          });

          (self.current == 'all')
            ? fetchForAllTeams(options)
            : fetchForSingleTeam(options);
        }

        /**
         * Fetch logs per team
         */
        function fetchForSingleTeam(options)
        {
          var _TeamTelephoneSettings = null;
          CurrentSelection.local = self.current;

          //Check if the requested team has teamtelephone functionality by the adapterId
          TeamUp._('TTOptionsGet', {second: self.current})
            .then(function (TeamTelephoneSettings)
            {
              _TeamTelephoneSettings = TeamTelephoneSettings;
              options.adapterId = TeamTelephoneSettings.adapterId;

              return (! TeamTelephoneSettings.adapterId)
                ? $location.path('team-telefoon/options')
                : Teams.getSingle(self.current);//get the members of the team, so the phonenumbers could be translated to names
            })
            .then(function(members)
            {
                return Logs.fetch(
                  _.extend(options,
                    {
                      adapterId: options.adapterId,
                      members: _.map(members, _.partialRight(_.pick,['fullName','phone'])),//get only the fullname and phonenumber of the members
                      currentTeam: {
                        fullName: (_.findWhere(
                            self.data.teams, {uuid: self.current})
                        ).name,//find the name of the requested team by the teamId(self.current)
                        phone: _TeamTelephoneSettings.phoneNumber
                      }
                    }
                  )
                );
            })
            .then(receiveLogs);
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
          self.loadLogs = false;
          self.data.logData = logData;

          $rootScope.statusBar.off();
        }

        /**
         * Toggle groups logs
         * @param showAll hide/show logs
         * @param logViews the logs
         */
        function toggleGroupedLogs(showAll, logViews)
        {
          _.each(logViews, function (log)
          {
            log.expanding = showAll;
          })
          self.data.logData.logs = logViews;
        }

        /**
         * Initialisation
         */
        function init()
        {
          //If the logged user has a role as teammember
          // don't add the everyone option in the selectbar
          if ($rootScope.app.resources.role == 1)
          {
            self.data.teams.unshift({
              name: $rootScope.ui.dashboard.everyone,
              uuid: 'all'
            });
          }
        }
      }
    );
  });
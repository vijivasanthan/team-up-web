define(
  ['../controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'scenario',
      function ($scope, $rootScope, $filter, $location, TeamUp, CurrentSelection, Teams, data, $q, $compile)
      {
        $rootScope.fixStyles();
        //TODO fix the localized string in this controller
        //view model
        var self = this;

        //properties
        self.data = data;
        self.currentTeamId = CurrentSelection.getTeamId();
        self.currentTeam = setTeamIdToName(self.currentTeamId);

        //methods
        self.fetch = fetch;
        self.save = save;

        //initialisation
        init();
        show(data);

        function init()
        {
          self.selectedTeams = [];
        }

        /**
         * Fetch team-telephone options
         */
        function fetch()
        {
          CurrentSelection.local = self.currentTeamId;
          self.currentTeam = setTeamIdToName(self.currentTeamId);
          $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

          console.error("self.currentTeamId ->", self.currentTeamId);

          if(self.currentTeamId === 'all')
          {
            self.currentTeam = $rootScope.ui.dashboard.everyone;
            $rootScope.statusBar.off();
          }
          else
          {
            Teams.getTeamTelephoneOptions(self.currentTeamId)
              .then(function (options)
            {
              show(self.data);
              $rootScope.statusBar.off();
            })
          }
          

        }

        function saveAllTeams(scenario)
        {
          console.error("self.data.teams ->", self.data.teams);
        }

        /**
         * Save team-telephone options
         * @param newOptions The options to be saved
         */
        function save(scernarioByTeam)
        {
          self.error = false;

          if (self.data.templates.length && !scernarioByTeam)
          {
            $rootScope.notifier.error("Kies een scenario");
            self.error = true;
            return;
          }

          console.error("self.selectedTeams ->", self.selectedTeams);

          var scenarioByTeamPromises = _.map(self.selectedTeams, function(teamId)
          {
            return TeamUp._('TTScenarioTemplateSave', {
                  second: teamId,
                  templateId: scernarioByTeam
                });
          });

          $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);
          $q.all(scenarioByTeamPromises)
            .then(function (results)
            {
              var errors = [];

              //get all the errors
              _.each(results, function(result, index)
              {
                if(result.error)
                {
                  var teamId = self.selectedTeams[index],
                      team = _.findWhere(self.data.teams, {uuid: teamId});
                  console.error("team.name ->", team.name + ' is not updated, because of a error');
                  errors.push(team.name);
                  self.error = true;
                }
              });


              if(! self.error) $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
              else
              {
                var errorMessage = $filter('commaSeperatedWithEnding')(errors, $rootScope.ui.teamup.and);
                $rootScope.notifier.error(errorMessage + $rootScope.ui.teamup.somethingUpdated(errors));
              }

              $rootScope.statusBar.off();
            });
        }

        /**
         * Filter to get the team name by id and finally set the firstletter as capital
         * @param teamId The current team id
         * @returns {*} The name of the team with the firstletter as capital
         */
        function setTeamIdToName(teamId)
        {
          return $filter('groupIdToName')(teamId);
        }

        /**
         * Show the TeamTelephone settings per Team
         * if it's not a TeamTelephone team, the activate form will be shown
         * This form will show up only if you have the role of coordinator
         * @param options
         */
        function show(data)
        {
          //not yet in use, because the scenario id of a team cannot be shown
        }
      }
    );
  });

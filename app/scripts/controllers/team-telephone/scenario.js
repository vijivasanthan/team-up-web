define(
  ['../controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'scenario',
      function ($scope, $rootScope, $filter, $location, TeamUp, CurrentSelection, Teams, data, $q)
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
        self.AddSelectedTeamsToTitle = AddSelectedTeamsToTitle;

        //initialisation
        init();
        show(data);

        function init()
        {
          self.selectedTeams = [
            _.findWhere(data.teams, {uuid: self.currentTeamId})
          ];
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

        /**
         * Save team-telephone options
         * @param newOptions The options to be saved
         */
        function save(scernarioByTeam)
        {
          self.error = false;

          if(! self.selectedTeams.length) return $rootScope.notifier.error($rootScope.ui.teamup.selectTeams);
          if (self.data.templates.length && !scernarioByTeam) return $rootScope.notifier.error("Kies een scenario");
          
          var scenarioByTeamPromises = _.map(self.selectedTeams, function(team)
          {
            return TeamUp._('TTScenarioTemplateSave', {
                  second: team.uuid,
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
                  var teamId = (self.selectedTeams[index]).uuid,
                      team = _.findWhere(self.data.teams, {uuid: teamId});
                  console.error("team.name ->", team.name + ' is not updated, because of an error');
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

	      /**
         * Order them asc and add them to the title
         */
        function AddSelectedTeamsToTitle()
        {
          if(self.selectedTeams.length < 5)
          {
            self.selectedTeams = $filter('orderBy')(self.selectedTeams);
            self.currentTeam = _.pluck(self.selectedTeams, 'name').join(", ");
          }
        }
      }
    );
  });

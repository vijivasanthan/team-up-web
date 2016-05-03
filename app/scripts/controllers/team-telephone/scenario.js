define(
  ['../controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'scenario',
      function ($scope, $rootScope, $filter, $location, TeamUp, CurrentSelection, Teams, data)
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
          if ($rootScope.app.resources.role == 1)
          {
            self.data.teams.unshift({
                                      name: $rootScope.ui.dashboard.everyone,
                                      uuid: 'all'
                                    });
          }
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


        self.selectedIcon = "";
        self.selectedIcons = []; //"Gear", "Globe", "Heart", "Camera"
        self.icons = [{"value":"Gear","label":"<i class=\"fa fa-gear\"></i> Gear"},{"value":"Globe","label":"<i class=\"fa fa-globe\"></i> Globe"},{"value":"Heart","label":"<i class=\"fa fa-heart\"></i> Heart"},{"value":"Camera","label":"<i class=\"fa fa-camera\"></i> Camera"}];

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
          if(self.currentTeamId === 'all') return saveAllTeams(scenario);

          $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

          var teamScenarioTemplateId = TeamUp._('TTScenarioTemplateSave', {
              second: self.currentTeamId,
              templateId: scernarioByTeam
            })
            .then(function (result)
            {
              console.error('result', result);
              (!result.error)
                ?  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged)
                : $rootScope.notifier.error($rootScope.ui.teamup.errorCode[0] + $rootScope.ui.teamup.error.support);
              // save the scenarioId of the team locally newOptions.scenarioId

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

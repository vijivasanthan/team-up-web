define(
  ['../controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'scenario',
      function ($scope, $rootScope, $filter, $location, TeamUp, CurrentSelection, data)
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
        show(data);

        /**
         * Fetch team-telephone options
         */
        function fetch()
        {
          CurrentSelection.local = self.currentTeamId;
          self.currentTeam = setTeamIdToName(self.currentTeamId);
          $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

          TeamUp._(
            'TTOptionsGet',
            {second: self.currentTeamId}
          ).then(function (options)
          {
            (!options.adapterId)
              ? $location.path('team-telefoon/options')
              : show(self.data);

            $rootScope.statusBar.off();
          })
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

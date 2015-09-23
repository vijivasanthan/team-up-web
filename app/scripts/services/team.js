define(['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory('Team',
      function ($rootScope,
                $location,
                $q,
                Store,
                TeamUp,
                Permission,
                Teams,
                CurrentSelection)
      {
        // constructor \\
        var teamService = function ()
        {
          /**
           * Initializing the team service
           */
        };

        // public methods \\
        (function ()
        {
          /**
           * Get a single team by id
           * @param teamId The id of the team
           * @returns {*} A promise with the members of the team
           */
          this.get = function (teamId)
          {
            $rootScope.statusBar.display($rootScope.ui.login.loading_Members);
            CurrentSelection.local = teamId;

            return Teams.getSingle(teamId)
              .then(function (members)
              {
                $rootScope.statusBar.off();
                return members;
              });
          },

            this.create = function (team)
            {
              if (!team)
              {
                $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
                return;
              }
              $rootScope.statusBar.display($rootScope.ui.teamup.saveTeam);

              return TeamUp._('teamAdd',
                {id: $rootScope.app.resources.uuid},
                team)
                .then(function (newTeam)
                {
                  $rootScope.statusBar.off();
                  return newTeam;
                });
            }
        }).call(teamService.prototype);


        // private methods \\

        /**
         */
        function testPrivate()
        {
          return null;
        }

        return new teamService();
      });
  });
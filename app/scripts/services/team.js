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

          this.list = Store('app').get('teams');
        };

        // public methods \\
        (function ()
        {
          this.updateList = function (oldEditedTeam, newEditedTeam)
          {
            var index = _.findIndex(this.list, { uuid: oldEditedTeam.uuid });

            if(this.list.length)
            {
              this.list[index] = newEditedTeam;
            }
          };
          this.getList = function ()
          {
            return this.list;
          };
          this.removeFromList = function (currentTeam)
          {
            var index = _.findIndex(this.list, { uuid: currentTeam });

            if(index >= 0)
            {
              console.error('index', index);
              this.list.splice(index, 1);
              Store('app').save('teams', this.list);
              console.error('this.list', this.list);
            }
          };

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
                $location.search('teamId', teamId);
                $rootScope.statusBar.off();
                return members;
              });
          },
          this.update = function (editedTeam)
          {
            var self = this;

            if (! editedTeam.name)
            {
              $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
              return;
            }

            $rootScope.statusBar.display($rootScope.ui.teamup.saveTeam)

            return TeamUp._('teamUpdate', { second: editedTeam.uuid }, editedTeam)
              .then(function (result)
              {
                self.updateList(editedTeam, result);
                return result.error && result || Teams.getAll();
              })
              .then(function(teams)
              {
                if(! teams.error)
                {
                  $rootScope.statusBar.off();
                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                  return teams;
                }
              });
          }

            this.getName = function (teamId)
            {
              return Teams.getAllLocal()
                .then(function(teams)
                {
                  return _.findWhere(teams, {uuid: teamId});
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

              var _newTeam = null;
              return TeamUp._('teamAdd',
                {id: $rootScope.app.resources.uuid},
                team)
                .then(function (newTeam)
                {
                  _newTeam = newTeam;
                  return Teams.getAll();
                })
                .then(function(teams)
                {
                  CurrentSelection.local = _newTeam.uuid;
                  $location.path('team/members');
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
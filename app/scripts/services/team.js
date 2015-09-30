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
        };

        // public methods \\
        (function ()
        {
          this.updateList = function (oldEditedTeam, newEditedTeam)
          {
            var index = _.findIndex(this.list, {uuid: oldEditedTeam.uuid});

            if (this.list.length)
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
            var index = _.findIndex(this.list, {uuid: currentTeam});

            if (index >= 0)
            {
              console.error('index', index);
              this.list.splice(index, 1);
              Store('app').save('teams', this.list);
              console.error('this.list', this.list);
            }
          };
          this.setCurrent = function (teamId)
          {
            this.current.teamId = teamId;
          }
          this.getCurrent = function ()
          {
            return this.current;
          }
            this.create = function (team)
            {
              var self = this;

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
                  self.list.push(newTeam);
                  Store('app').save('teams', self.list);
                  return Teams.getAll();
                })
                .then(function (teams)
                {
                  //The last added team is the current one
                  CurrentSelection.local = self.list[self.list.length - 1].uuid;
                  $location.path('team/members');
                });
            },
            /**
             * Get a single team by id
             * @param teamId The id of the team
             * @returns {*} A promise with the members of the team
             */
            this.read = function (teamId)
            {
              $rootScope.statusBar.display($rootScope.ui.login.loading_Members);

              var _teamId = teamId || CurrentSelection.getTeamId();

              CurrentSelection.local = _teamId;

              return Teams.getSingle(_teamId)
                .then(function (members)
                {
                  $location.search('teamId', _teamId);
                  $rootScope.statusBar.off();
                  return members;
                });
            },
            this.update = function (editedTeam)
            {
              var self = this;

              if (!editedTeam.name)
              {
                $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
                return;
              }

              $rootScope.statusBar.display($rootScope.ui.teamup.saveTeam)

              return TeamUp._('teamUpdate', {second: editedTeam.uuid}, editedTeam)
                .then(function (result)
                {
                  self.updateList(editedTeam, result);
                  return result.error && result || Teams.getAll();
                })
                .then(function (teams)
                {
                  if (!teams.error)
                  {
                    $rootScope.statusBar.off();
                    $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                    return teams;
                  }
                });
            },
            this.delete = function (current)
            {
              var self = this,
                deferred = $q.defer();

              angular.element('#confirmTeamModal').modal('hide');
              $rootScope.statusBar.display($rootScope.ui.teamup.deletingTeam);

              TeamUp._('teamDelete', {second: current})
                .then(function (teamDelete)
                {
                  self.removeFromList(current);
                  return teamDelete.error && teamDelete || Teams.getAll();
                })
                .then(function (teams)
                {
                  if (!teams.error)
                  {
                    self.setCurrent(self.list[0].uuid);
                    deferred.resolve(self.getCurrent());
                    $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                    $rootScope.statusBar.off();
                  }
                });

              return deferred.promise;
            },
            this.init = function (teamId)
            {
              var _teamId = teamId || CurrentSelection.getTeamId();
              CurrentSelection.local = _teamId;

              this.list = Store('app').get('teams');
              this.current = {};
              this.setCurrent(_teamId);
            };
        }).call(teamService.prototype);

        return new teamService();
      });
  });
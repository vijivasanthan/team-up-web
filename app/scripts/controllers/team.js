define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'team',
      function (Team)
      {
        //view model
        var self = this;

        /**
         * Create a team
         * @param teamName The name of the team
         */
        self.create = function(teamName)
        {
          Team.create(teamName);
        };

        /**
         * Get a team by id
         * @param teamId the id of the team
         * @param callback initialize the team and a callback with the members result as parameter
         */
        self.read = function (teamId, callback)
        {
          Team.read(teamId)
            .then(function(members)
            {
              (callback && callback(members));
              self.init(teamId);
            });
        };

        /**
         * Update a team by id
         * @param teamId The id of the team
         * @param confirmation in showing the current teamname in a textfield
         */
        self.update = function (teamId, confirm)
        {
          if(! confirm)
          {
            self.updateForm = true;
            var team =  _.findWhere(self.list, {uuid: teamId});
            self.editForm = {
              name: team.name,
              uuid: team.uuid
            };
          }
          else
          {
            Team.update(teamId)
              .then(function()
              {
                self.updateForm = false;
              });
          }
        };

        /**
         * Delete a team by id
         * @param teamId The id of the team
         * @param confirm confirmation if the user is sure to delete the team
         * @param callback
         */
        self.delete = function (teamId, confirm, callback)
        {
          if(! confirm)
          {
            angular.element('#confirmTeamModal').modal('show');
          }
          else
          {
            Team.delete(teamId)
              .then(function(newTeamId)
              {
                (callback && callback(newTeamId));
              });
          }
        };

        /**
         * Confirm to add a member
         * Check if member is already in a team,
         * if that's the case ask if that member needs to leave
         * his current team for the new team
         * @param member the userobject added to the team
         * @param teamOption
         * @confirm
         */
        self.addMember = function(member, teamOption, confirm)
        {
          (! confirm)
            ? angular.element('#confirmMemberAddModal').modal('show')
            : Team.addMember(member, teamOption);
        };

        /**
         * Initialize the current team and a list of all teams
         * @param teamId
         */
        self.init = function (teamId)
        {
          Team.init(teamId);
          self.list = Team.getList();
          self.current = Team.getCurrent();
        };

        self.init();
      }
    );
  }
);

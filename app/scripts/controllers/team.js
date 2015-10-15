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

        self.read = function (current, callback)
        {
          Team.read(current)
            .then(function(members)
            {
              (callback && callback(members));
              self.init();
            });
        };

        self.update = function (current, confirm)
        {
          if(! confirm)
          {
            self.updateForm = true;
            var team =  _.findWhere(self.list, {uuid: current});
            self.editForm = {
              name: team.name,
              uuid: team.uuid
            };
          }
          else
          {
            Team.update(current)
              .then(function()
              {
                self.updateForm = false;
              });
          }
        };

        self.delete = function (current, confirm, callback)
        {
          if(! confirm)
          {
            angular.element('#confirmTeamModal').modal('show');
          }
          else
          {
            Team.delete(current)
              .then(function(newCurrent)
              {
                (callback && callback(newCurrent));
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

        self.init = function (current)
        {
          Team.init(current);
          self.list = Team.getList();
          self.current = Team.getCurrent();
        };

        self.init();
      }
    );
  }
);

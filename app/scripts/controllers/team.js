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

        self.read = function (current)
        {
          Team.read(current);
        };

        self.update = function (team, confirm)
        {
          if(! confirm)
          {
            self.updateForm = true;
            self.editForm = {
              name: team.name,
              uuid: team.uuid
            };
          }
          else
          {
            Team.update(team)
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

        self.init = function (current, callback)
        {
          //set the list from the resolve method
          Team.init(current);
          self.list = Team.getList();
          self.current = Team.getCurrent();
          (callback && callback(current));
        };

        self.init();
      }
    );
  }
);

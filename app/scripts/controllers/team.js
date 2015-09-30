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
        var vm = this;

        /**
         * Create a team
         * @param teamName The name of the team
         */
        vm.create = function(teamName)
        {
          Team.create(teamName);
        };

        vm.read = function (current)
        {
          Team.read(current);
        };

        vm.update = function (team, confirm)
        {
          if(! confirm)
          {
            vm.updateForm = true;
            vm.editForm = {
              name: team.name,
              uuid: team.uuid
            };
          }
          else
          {
            Team.update(team)
              .then(function()
              {
                vm.updateForm = false;
              });
          }
        };

        vm.delete = function (current, confirm, callback)
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

        vm.init = function (current, callback)
        {
          //set the list from the resolve method
          Team.init(current);
          vm.list = Team.getList();
          vm.current = Team.getCurrent();
          (callback && callback(current));
        };

        vm.init();
      }
    );
  }
);

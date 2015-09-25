define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'newTeam',
      function (Team)
      {
        this.allTeams = [];

        this.create = function(team)
        {
          Team.create(team);
        };

        this.showEditForm = function (currentTeam)
        {
          this.updateForm = true;

          Team.getName(currentTeam)
            .then(function(editableTeam)
            {
              console.log('editableTeam', editableTeam);

              this.teamEditForm = {
                name: editableTeam.name,
                uuid: editableTeam.uuid
              };
            }.bind(this));
        };

        this.update = function (editedTeam, callback)
        {
          console.log('editedTeam', editedTeam);
          Team.update(editedTeam)
            .then(function(teams)
            {
              this.allTeams = teams;
              this.updateForm = false;

              (callback && callback(teams));
            }.bind(this));
        }
      }
    );
  }
);

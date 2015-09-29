define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'newTeam',
      function (Team)
      {
        this.create = function(team)
        {
          Team.create(team);
        };

        this.update = function (editedTeam)
        {
          Team.update(editedTeam)
            .then(function()
            {
              this.updateForm = false;
            }.bind(this));
        };

        this.showEditForm = function (currentTeam)
        {
          this.updateForm = true;

          Team.getName(currentTeam)
            .then(function(editableTeam)
            {
              this.teamEditForm = {
                name: editableTeam.name,
                uuid: editableTeam.uuid
              };
            }.bind(this));
        };
      }
    );
  }
);

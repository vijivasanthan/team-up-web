define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'newTeam',
      function (Team, Member)
      {

        this.create = function(team)
        {
          Team.create(team)
            .then(function(result)
            {
              //$location.path or $location.search
              //result.newTeam.uuid;
            });
        };
      }
    );
  }
);

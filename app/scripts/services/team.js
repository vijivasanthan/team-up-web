define(['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory('Team',
      function ()
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
           */
          this.testPublic = function ()
          {
            return null;
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
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
                CurrentSelection,
                Profile)
      {
        // constructor \\
        var clientGroupService = function ()
        {
        };

        (function ()
        {
          // public methods \\
          //this.updateList = updateList;

        }).call(clientGroupService.prototype);

        return new clientGroupService();
      });
  });
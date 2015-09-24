define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'teamMembers',
      function (Team, data)
      {
        this.data = data;

        console.log('this.data', this.data);
      }
    );
  }
);

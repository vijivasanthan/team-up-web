define(
  ['../controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'myTasks',
      function ()
      {
        var self = this;
        console.log("mytasks controller called");
      }
    );
  }
);

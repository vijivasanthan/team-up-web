define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Task',
        function ($rootScope, $resource, $q)
        {
          var Task = $resource();

          return new Task;
        }
    );
  }
);

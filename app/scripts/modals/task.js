define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Task',
      [
        '$rootScope', 'Store', 'TeamUp',
        function ($rootScope, Store, TeamUp)
        {
          return {
//            period : function (task)
//            {
//              return Math.abs((task.plannedEndVisitTime - task.plannedStartVisitTime) / 1000);
//            },
            queryMine: function ()
            {
              return TeamUp._("taskMineQuery")
                .then(
                function (tasks)
                {
                  angular.forEach(
                    tasks,
                    function (task)
                    {
                      var client = $rootScope.getClientByID(task.relatedClientUuid);

                      task.relatedClientName = client.firstName + ' ' + client.lastName;

                      task.relatedClientAddress = client.address;
                    }.bind(this)
                  );

                  Store('app').save('myTasks', tasks);

                  return tasks;
                }.bind(this)
              );
            }
          }
        }
      ]
    );
  }
);
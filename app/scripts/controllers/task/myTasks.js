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

        self.queryMine = queryMine;

        function queryMine(only, callback)
        {
          Task.queryMine()
            .then(
            function (tasks)
            {
              $scope.tasks.mine = {
                loading: false,
                list: (angular.isDefined($scope.showAllTasks) && $scope.showAllTasks)
                  ? tasks['on'].concat(tasks['off'])
                  : tasks['on'],
                archieve: (tasks.off.length > 0)
              };

              (callback && callback.call(this, tasks));
            }
          );

          if (!only)
          {
            queryAll();
          }
        }
      }
    );
  }
);

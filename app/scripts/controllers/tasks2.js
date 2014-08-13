define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'tasks2Ctrl', [
        '$rootScope',
        '$scope',
        '$location',
        'Task',
        function ($rootScope, $scope, $location, Task)
        {
          $rootScope.fixStyles();

          var view = (! $location.hash()) ? 'myTasks' : $location.hash();

          function resetViews ()
          {
            $scope.views = {
              myTasks: false,
              allTasks: false,
              newTask: false
            };
          }

          var setView = function (hash)
          {
            resetViews();

            $scope.views[hash] = true;
          };

          $scope.setViewTo = function (hash)
          {
            $scope.$watch(
              hash,
              function ()
              {
                $location.hash(hash);

                setView(hash);
              }
            );
          };

          setView(view);

          $scope.tasks = {
            mine: {
              loading: true,
              list: []
            },
            all: {
              loading: true,
              list: []
            }
          };

          Task.queryMine()
            .then(
            function (tasks)
            {
              $scope.tasks.mine = {
                loading: false,
                list: tasks
              };
            }
          );
        }
      ]
    );
  }
);
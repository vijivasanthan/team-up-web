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
        '$timeout',
        'Store',
        'Task',
        function ($rootScope, $scope, $location, $timeout, Store, Task)
        {
          $rootScope.fixStyles();

          var view = (! $location.hash()) ? 'myTasks' : $location.hash();

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

            $scope.tasks = ($scope.tasks) ? $scope.tasks : {};

            $scope.views[hash] = true;

            $location.hash(hash);

            switch (hash)
            {
              case 'myTasks':
                var myTasks = Store('app').get('myTasks2');

                var delay = 0;

                if (myTasks)
                {
                  $scope.tasks.mine = {
                    loading: false,
                    list: myTasks
                  };

                  delay = 2000;
                }

                $timeout(function () { queryMine() }, delay);
                break;

              case 'allTasks':

                var allTasks = Store('app').get('allTasks2');

                if (allTasks)
                {
                  $scope.tasks.all = {
                    loading: false,
                    list: allTasks
                  };
                }

                $timeout(function () { queryAll() }, 1000);
                break;

              case 'newTask':
                break;

            }
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

          function queryMine()
          {
            Task.queryMine()
              .then(
              function (tasks)
              {
                $scope.tasks.mine = {
                  loading: false,
                  list: tasks
                };

//                $timeout(
//                  function ()
//                  {
//                    angular.element('#taskModal').modal('show');
//
//                    $scope.task = tasks[0];
//                  }, 25
//                );
              }
            );

            queryAll();
          }

          function queryAll()
          {
            Task.queryAll()
              .then(
              function (tasks)
              {
                $scope.tasks.all = {
                  loading: false,
                  list: tasks
                };
              }
            );
          }

          $scope.openTask = function (task)
          {
            $scope.task = task;

            angular.element('#taskModal').modal('show');
          }


        }
      ]
    );
  }
);
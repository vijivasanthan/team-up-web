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
        'TeamUp',
        'Task',
        function ($rootScope, $scope, $location, $timeout, Store, TeamUp, Task)
        {
          $rootScope.fixStyles();

          var view = (! $location.hash()) ? 'myTasks' : $location.hash();

          function resetViews ()
          {
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

            $scope.views = {
              myTasks: false,
              allTasks: false,
              newTask: false
            };

            $scope.reversed = true;

            $scope.order = 'status.id';
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

                if (myTasks.length > 0)
                {
                  $scope.tasks.mine = {
                    loading: false,
                    list: myTasks
                  };

                  delay = 250;
                }

                $timeout(function () { queryMine() }, delay);
                break;

              case 'allTasks':
                var allTasks = Store('app').get('allTasks2');

                if (allTasks.on || allTasks.off)
                {
                  $scope.tasks.all = {
                    loading: false,
                    list: allTasks.on
                  };
                }

                $timeout(function () { queryAll() }, 250);
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

          function queryMine ()
          {
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

            queryAll();
          }

          function queryAll ()
          {
            Task.queryAll()
              .then(
              function (tasks)
              {
                $scope.tasks.all = {
                  loading: false,
                  list: tasks.on
                };
              }
            );
          }

          $scope.showAllTasks = false;

          $scope.$watch(
            'showAllTasks',
            function (toggle)
            {
              var allTasks = Store('app').get('allTasks2');

              if (toggle)
              {
                $scope.tasks.all.list = allTasks['on'].concat(allTasks['off']);
              }
              else
              {
                $scope.tasks.all.list = allTasks.on;
              }
            }
          );

          $scope.openTask = function (task)
          {
            $scope.task = task;

            angular.element('#taskModal').modal('show');
          };

          $scope.orderBy = function (ordered)
          {
            $scope.ordered = ordered;

            $scope.reversed = ! $scope.reversed;
          };


          /**
           * ******************************************************************************
           */


            // Assign any task to logged in user (Plus sign)
          $scope.assignTask = function (task)
          {

            task.assignedTeamMemberUuid = $rootScope.app.resources.uuid;

            TeamUp._(
              'taskUpdate',
              { second: task.uuid },
              task
            ).then(
              function (result)
              {
                // console.log(result);

                if (result.error)
                {
                  if (result.error.data.result)
                  {
                    $rootScope.notifier.error($rootScope.transError(result.error.data.result));
                  }
                  else
                  {
                    $rootScope.notifier.error($rootScope.transError(result.error));
                  }
                  task.assignedTeamMemberUuid = null;
                }
                else
                {
                  // console.log(result);

                  // $scope.reloadAndSaveTask(result.result, 'assign');

                  queryAll();
                }

              }
            );

          };


          // Un-assign a task for logged in user
          $scope.unAssignTask = function (task)
          {
            task.assignedTeamMemberUuid = null;

            TeamUp._(
              'taskUpdate',
              { second: task.uuid },
              task
            ).then(
              function (result)
              {
                // console.log(result);

                if (result.error)
                {
                  if (result.error.data)
                  {
                    $rootScope.notifier.error($rootScope.transError(result.error.data.result));
                  }
                  else
                  {
                    $rootScope.notifier.error($rootScope.transError(result.error));
                  }
                  task.assignedTeamMemberUuid = null;
                }
                else
                {
                  // console.log(result);

                  // $scope.reloadAndSaveTask(result.result, 'unAssign');

                  queryMine();
                }

              }
            );
          };


          /**
           * ******************************************************************************
           */


          $scope._task = {};

          $scope.confirmDeleteTask = function (task)
          {
            $timeout(
              function ()
              {
                $scope._task = task;

                angular.element('#confirmTaskModal').modal('show');
              }
            );
          };

          // Remove a task
          $scope.deleteTask = function (task)
          {
            $scope._task = {};

            angular.element('#confirmTaskModal').modal('hide');

            TeamUp._(
              'taskDelete',
              { second: task.uuid },
              task
            ).then(
              function (result)
              {
                // console.log("after delete action , ", result);

                if (result.error)
                {
                  if (result.error.data)
                  {
                    $rootScope.notifier.error(result.error.data);
                  }
                  else
                  {
                    $rootScope.notifier.error(result.error);
                  }
                }
                else
                {
                  $rootScope.notifier.success($rootScope.ui.task.taskDeleted);
                  // $scope.reloadAndSaveTask(result.uuid, 'delete');

                  queryMine();
                }

              }
            );
          };


        }
      ]
    );
  }
);
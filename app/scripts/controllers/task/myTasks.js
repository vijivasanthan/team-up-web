define(
  ['../controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'myTasks',
      function ($rootScope,
                $timeout,
                $filter,
                $location,
                Store,
                TaskCRUD,
                TeamUp,
                Task,
                data)
      {
        var self = this;

        //properties
        self.tasks = data.myTasks;
        self.reversed = true;

        //methods
        self.orderBy = orderBy;
        self.assignTask = assignTask;
        self.unAssignTask = unAssignTask;
        self.confirmDeleteTask = confirmDeleteTask;
        self.viewTaskData = viewTaskData;
        self.deleteTask = deleteTask;
        self.toggleStatusFinished = toggleStatusFinished;

        function orderBy(ordered)
        {
          self.ordered = ordered;

          self.reversed = !self.reversed;
        }

        function toggleStatusFinished()
        {
          console.log(self.isStatusFinished);
          if(self.isStatusFinished) {
            TaskCRUD.queryMine(3)
              .then(function (finishedTasks)
              {
                if(finishedTasks.length) {
                  self.tasks.list = self.tasks.list.concat(finishedTasks);
                  self.tasks.list = _.unique(self.tasks.list);
                }
                else{
                  $rootScope.notifier.success("Geen gearchiveerde taken aanwezig");
                  self.isStatusFinished = false;
                }
              });
          }
          else{
            self.tasks.list = self.tasks.list.filter(function(task)
            {
              return task.status !== 3;
            });
          }
        }



        function assignTask(task)
        {
          trackGa('send', 'event', 'Task-assign', $rootScope.app.resources.uuid, task.uuid);

          task.assignedTeamMemberUuid = $rootScope.app.resources.uuid;

          updateTask(task, true);
          $location.path("/task/mytasks");
        }

        function unAssignTask(task)
        {
          trackGa('send', 'event', 'Task-unassign', $rootScope.app.resources.uuid, task.uuid);

          task.assignedTeamMemberUuid = null;
          task.assignedTeamUuid = null;

          updateTask(task);
        }

        function updateTask(task, only)
        {
          TaskCRUD.update(task)
            .then(
            function (result)
            {
              if (result.error)
              {
                $rootScope.notifier.error(
                  $rootScope.transError(
                    (result.error.data) ? result.error.data.result : result.error
                  )
                );

                task.assignedTeamMemberUuid = null;

                return;
              }

              queryMine(only);
            }
          );
        }

        function viewTaskData(task)
        {
          //get the clientgroupdUuid from the client

          self.currentTask = task;

          if (task.assignedTeamUuid)
          {
            self.currentTask.assignedTeamFullName = $rootScope.getTeamName(task.assignedTeamUuid);
          }

          if (task.relatedClient.clientGroupUuid)
          {
            self.currentTask.relatedClient.clientGroupName = $rootScope.getClientGroupName(task.relatedClient.clientGroupUuid);
          }

          if(task.authorUuid) {
            var authordata = $rootScope.getTeamMemberById(task.authorUuid);
            self.author = authordata.firstName + ' ' + authordata.lastName;
          }
          angular.element('#taskModal').modal('show');
        }

        function confirmDeleteTask(task)
        {
          $timeout(
            function ()
            {
              self.taskToRemove = task;

              angular.element('#confirmTaskModal').modal('show');
            }
          );
        }

        // Remove a task
        function deleteTask(task)
        {
          self.taskToRemove = {};

          angular.element('#confirmTaskModal').modal('hide');

          TaskCRUD.delete(task.uuid)
            .then(function(result)
            {
              if (result.error)
              {
                  $rootScope.notifier.error(result.error);
              }
              else
              {
                $rootScope.notifier.success($rootScope.ui.task.taskDeleted);
                if(task.status == 3)
                {
                  console.log('this tasks was archieved');
                }
                TaskCRUD.queryMine();
                location.reload();
              }
            });
        }
      }
    );
  }
);

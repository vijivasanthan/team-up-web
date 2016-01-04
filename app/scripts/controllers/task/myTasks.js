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
                $window,
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
        self.teams = data.teams;
        self.currentTeamUuid = data.currentTeam;
        self.reversed = true;

        //methods
        self.orderBy = orderBy;
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

        /**
         * show/hide finished tasks
         */
        function toggleStatusFinished()
        {
          console.log("finished tasks " + self.isStatusFinished);
          if(self.isStatusFinished)
          {
            TaskCRUD.queryMine(3)
              .then(function (finishedTasks)
              {
                if(finishedTasks.length)
                {
                  self.tasks.list = self.tasks.list.concat(finishedTasks);
                  self.tasks.list = _.unique(self.tasks.list);
                }
                else
                {
                  $rootScope.notifier.success($rootScope.ui.task.noArchivedTask);
                  self.isStatusFinished = false;
                }
              });
          }
          else
          {
            self.tasks.list = self.tasks.list.filter(function(task)
            {
              return task.status !== 3;
            });
          }
        }

        /**
         * unassign task to team member
         * @param task
         */
        function unAssignTask(task)
        {
          task = TaskCRUD.unassign(task);
          updateTask(task);
        }

        /**
         * update task with changes and requery
         * @param task
         */
        function updateTask(task)
        {
          TaskCRUD.update(task)
            .then(function (result) {
              if (! result.error)
              {
                var index = _.findIndex(self.tasks.list, { uuid: task.uuid });
                self.tasks.list.splice(index, 1);
              }
            });
        }

        /**
         * view task details
         * @param task
         */
        function viewTaskData(task)
        {
          self.currentTask = task;
          TaskCRUD.getDetails(task)
            .then(function (taskData) {
              self.currentTask = taskData;
            })
        }

        /**
         * confirm deleting the task
         * @param task
         */
        function confirmDeleteTask(task)
        {
          self.taskToRemove = task;
          TaskCRUD.confirmDeleteTaskMessage();
        }

        /**
         * delete a task
         * @param task
         * @param viewType
         */
        function deleteTask(task)
        {
          self.taskToRemove = {};

          angular.element('#confirmTaskModal').modal('hide');

          TaskCRUD.delete(task.uuid)
            .then(function(result)
            {
              if (! result.error)
              {
                var index = _.findIndex(self.tasks.list, { uuid: task.uuid });
                self.tasks.list.splice(index, 1);
                $rootScope.notifier.success($rootScope.ui.task.taskDeleted);
              }
            });
        }
      }
    );
  }
);
define(
  ['../controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'allTasks',
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
        self.tasks = data.tasks;
        self.teams = data.teams;
        self.reversed = true;
        self.selectedTeam = data.currentTeamId;

        //methods
        self.orderBy = orderBy;
        self.assignTask = assignTask;
        self.unAssignTask = unAssignTask;
        self.confirmDeleteTask = confirmDeleteTask;
        self.viewTaskData = viewTaskData;
        self.deleteTask = deleteTask;
        self.toggleStatusFinished = toggleStatusFinished;
        self.getTasksForTeam = getTasksForTeam;

        /**
         * order tasks in the view on their properties
         * @param ordered
         */
        function orderBy(ordered)
        {
          self.ordered = ordered;

          self.reversed = !self.reversed;
        }

        /**
         * get all tasks for a given team
         * @param team
         */
        function getTasksForTeam(team)
        {
          self.selectedTeam = team;
          TaskCRUD.queryByTeam(self.selectedTeam)
            .then(function (taskData)
            {
              self.tasks = {
                loading: false,
                list: taskData
              };
            });
        }


        /**
         * show/hide finished tasks
         */
        function toggleStatusFinished()
        {
          if(self.isStatusFinished)
          {
            //get all finished tasks, and insert them in the current tasklist
            TaskCRUD.queryByTeam(self.selectedTeam, 3)
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
            //get all tasks without status 3
            self.tasks.list = self.tasks.list.filter(function(task)
            {
              return task.status !== 3;
            });
          }
        }

        /**
         * assign task to team member
         * @param task
         */
        function assignTask(task)
        {
          task = TaskCRUD.assign(task);
          updateTask(task, function () {
            $location.path("/task/mytasks");
          });
        }

        /**
         * unassign task to team member
         * @param task
         */
        function unAssignTask(task)
        {
          task = TaskCRUD.unassign(task);
          updateTask(task, function () {
            getTasksForTeam(self.selectedTeam);
          });
        }

        /**
         * update task with changes and requery
         * @param task
         */
        function updateTask(task, callBack)
        {
          TaskCRUD.update(task)
            .then(function (result) {
              if (! result.error)
              {
                (callBack && callBack());
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
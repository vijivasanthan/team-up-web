define(
  ['controllers/controllers'],
  function (controllers) {
    'use strict';

    controllers.controller(
      'tasks2Ctrl',
      function ($rootScope, $scope, $location, $timeout, $filter, Store, TeamUp, Task,
                Teams, Clients, Dater, moment, data) {
        $rootScope.fixStyles();

        function resetViews() {
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
            newTask: false,
            editTask: false,
            upload: false
          };

          $scope.showAllTasks = false;

          $scope.showOnlyAvailable = true;

          $scope.reversed = true;

          $scope.order = 'plannedStartVisitTime';

          // $scope.filtered = { assignedTeamMemberUuid: null };
        }

        var setView = function (hash) {
          resetViews();

          $scope.tasks = ($scope.tasks) ? $scope.tasks : {};

          $scope.views[hash] = true;

          $location.hash(hash);

          switch (hash) {
            case 'myTasks':
              var myTasks = Store('app').get('myTasks2');

              var delay = 0;

              if (myTasks.on || myTasks.off) {
                $scope.tasks.mine = {
                  loading: false,
                  list: myTasks,
                  archieve: (myTasks.off.length > 0)
                };

                delay = 250;
              }


              $timeout(function () {
                queryMine()
              }, delay);
              break;

            case 'allTasks':
              var allTasks = Store('app').get('allTasks2');

              if (allTasks.on || allTasks.off) {
                $scope.tasks.all = {
                  loading: false,
                  list: allTasks.on
                };
              }

              $timeout(function () {
                queryAll()
              }, 250);
              break;
            case 'editTask':
              break;
            case 'newTask':
              setDates();
              break;
            case 'upload':
              break;
          }
        };

        $scope.setViewTo = function (hash) {
          $scope.$watch(
            hash,
            function () {
              $location.hash(hash);

              setView(hash);
            }
          );
        };

        setView($location.hash());

        $scope.teams = data.teams;

        $scope.task = $scope.task || {
            team: $scope.currentTeam
          };

        /**
         * Mody a task and prepare the form with the right values
         * @param task
         */
        $scope.modifyTask = function (task) {
          $scope.changeTeam(task.assignedTeamUuid);

          $scope.task = {
            uuid: task.uuid,
            team: task.assignedTeamUuid,
            member: task.assignedTeamMemberUuid,
            client: task.relatedclientUuid,
            start: {
              date: new Date(task.plannedStartVisitTime),
              time: task.plannedStartVisitTime,
              datetime: convertDateTimeToLocal(
                moment(task.plannedStartVisitTime)
              )
            },
            end: {
              date: new Date(task.plannedEndVisitTime),
              time: task.plannedEndVisitTime,
              datetime: convertDateTimeToLocal(
                moment(task.plannedEndVisitTime)
              )
            },
            description: task.description
          };

          resetViews();

          $scope.views.editTask = true;
        };

        function queryMine(only, callback) {
          Task.queryMine()
            .then(
            function (tasks) {
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

          if (!only) {
            queryAll();
          }
        }

        function queryAll(callback) {
          queryMine(true);

          Task.queryAll()
            .then(
            function (tasks) {
              $scope.tasks.all = {
                loading: false,
                list: (angular.isDefined($scope.showAllTasks) && $scope.showAllTasks)
                  ? tasks['on'].concat(tasks['off'])
                  : tasks['on'],
                archieve: (tasks['off'].length > 0)
              };

              (callback && callback.call(this, tasks));
            }
          );
        }

        $scope.showTasks = function (toggle, taskHolder) {
          if (taskHolder == 'mine') {
            var myTasks = Store('app').get('myTasks2');
            $scope.tasks.mine.list = (toggle) ? myTasks.on.concat(myTasks.off) : myTasks.on;
          }
          else {
            var allTasks = Store('app').get('allTasks2');
            $scope.tasks.all.list = (toggle) ? allTasks['on'].concat(allTasks['off']) : allTasks['on'];
          }
        };

        function convertDateTimeToLocal(d) {
          var d1 = new Date(d);

          d1.setMinutes(d1.getMinutes() - d1.getTimezoneOffset());

          return d1.toISOString().replace("Z", "");
        };

        //date and time methods if a new task is creating
        function setDates() {
          var currentStartTime = updateTime(new Date(), 15);
          var currentEndTime = updateTime(new Date(), 30);

          if (!$scope.task) {
            $scope.task = {};
            $scope.task.start = {};
            $scope.task.end = {};
          }

          $scope.task.start = {
            date: new Date(),
            time: currentStartTime,
            datetime: updateMobileDateTime(moment().toDate(), 15)
          };

          $scope.task.end = {
            date: new Date(),
            time: currentEndTime,
            datetime: updateMobileDateTime(moment().toDate(), 30)
          };
        }

        //TODO add following date methods to Dater
        function formatDateTime(date, dateFormat) {
          return $filter('date')(date, dateFormat);
        }

        function updateTime(date, minutes) {
          var roundMinutes = formatDateTime(date, 'm');
          roundMinutes = (roundMinutes % 15);

          return new Date(date.getTime() - (roundMinutes * 60000) + (minutes * 60000));
        }

        function updateMobileDateTime(newDate, minutes) {
          var start = moment(newDate),
            roundMinutes = (start.minute() % 15),
            newEndDateTime = moment(start).subtract(roundMinutes, "minutes").add(minutes, "minutes");

          return convertDateTimeToLocal(newEndDateTime);
        }

        $scope.newTime = function (newTime) {
          $scope.task.end.time = updateTime(newTime, 15);
        };

        $scope.newDate = function (newDate, mobile) {
          if (mobile) {
            $scope.task.end.datetime = convertDateTimeToLocal(moment(newDate).add(15, "minutes"));
          }
          else {
            $scope.task.end.date = newDate;
          }

        };

        //$scope.$watch(function() {
        //  return $scope.task.start.date;
        //}, function(newDate) {
        //  $scope.task.end.date = newDate;
        //});

        //          $scope.$watch(
        //            'showOnlyAvailable',
        //            function (toggle)
        //            {
        //              console.log('coming in here?');
        //
        //              $scope.filtered = !$scope.filtered;
        //
        ////              if (toggle)
        ////              {
        ////                 = { assignedTeamMemberUuid: null };
        ////              }
        ////              else
        ////              {
        ////                $scope.filtered = { assignedTeamMemberUuid: null };
        ////              }
        //            }
        //          );

        //          $scope.filterFn = function (task)
        //          {
        //            return ($scope.showOnlyAvailable && task.assignedTeamMemberUuid != null) ?
        //                   true :
        //                   false;
        //          };

        $scope.openTask = function (task) {
          $scope.task = task;
          $scope.task.team = task.assignedTeamUuid;

          if (task.assignedTeamUuid) {
            task.assignedTeamFullName = $rootScope.getTeamName(task.assignedTeamUuid);
          }
          if ($rootScope.app.domainPermission.clients) {
            if (task.relatedClient.clientGroupUuid) {
              task.relatedClient.clientGroupName = $rootScope.getClientGroupName(task.relatedClient.clientGroupUuid);
            }
          }
          var author = $rootScope.getTeamMemberById(task.authorUuid);
          $scope.author = author.firstName + ' ' + author.lastName;

          angular.element('#taskModal').modal('show');
        };

        //default filtering by status
        //$scope.ordered = '-status';

        $scope.orderBy = function (ordered) {
          $scope.ordered = ordered;

          $scope.reversed = !$scope.reversed;
        };

        function updateTask(task, only) {
          Task.update(task)
            .then(
            function (result) {
              if (result.error) {
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

        $scope.assignTask = function (task) {
          trackGa('send', 'event', 'Task-assign', $rootScope.app.resources.uuid, task.uuid);

          task.assignedTeamMemberUuid = $rootScope.app.resources.uuid;

          updateTask(task, true);

          setView('myTasks');
        };


        $scope.unAssignTask = function (task) {
          trackGa('send', 'event', 'Task-unassign', $rootScope.app.resources.uuid, task.uuid);

          task.assignedTeamMemberUuid = null;
          //task.assignedTeamUuid = null;
          updateTask(task);
        };


        $scope._task = {};

        $scope.confirmDeleteTask = function (task) {
          $timeout(
            function () {
              $scope._task = task;

              angular.element('#confirmTaskModal').modal('show');
            }
          );
        };

        // Remove a task
        $scope.deleteTask = function (task) {
          $scope._task = {};

          angular.element('#confirmTaskModal').modal('hide');

          TeamUp._(
            'taskDelete',
            {second: task.uuid},
            task
          ).then(
            function (result) {
              if (result.error) {
                if (result.error.data) {
                  $rootScope.notifier.error(result.error.data);
                }
                else {
                  $rootScope.notifier.error(result.error);
                }
              }
              else {
                $rootScope.notifier.success($rootScope.ui.task.taskDeleted);
                // $scope.reloadAndSaveTask(result.uuid, 'delete');

                if (task.status == 3) {
                  console.log('this tasks was archieved');
                }

                queryMine();
              }

            }
          );
        };

        $scope.members = data.members[$scope.currentTeam];

        $scope.groups = [];
        $scope.clients = [];


        // Related to chain of drop-downs of teams and client groups
        $scope.teamAffectGroup = function () {
          $scope.groups = [];

          angular.forEach(
            data.clientGroups,
            function (cg) {
              if ($scope.currentGroup == cg.id) {
                $scope.groups.push(cg);
              }
            }
          );

          $scope.groupAffectClient($scope.currentGroup);
        };

        // Related to chain of dropd-owns of groups and clients
        $scope.groupAffectClient = function (groupId) {
          $scope.clients = data.clients[groupId];

          if (( $scope.currentClient == null || typeof $scope.currentClient == 'undefined' )
            && $scope.clients && $scope.clients.length > 0) {
            $scope.currentClient = $scope.clients[0].uuid;
          }
          else {
            $scope.currentClient = null;
          }

          if ($scope.task && $scope.task.client) {
            $scope.task.client = $scope.currentClient;
          }
        };

        if (typeof data.teamClientsGroups[$scope.currentTeam] == 'undefined') {
          $scope.currentGroup = null;
        }
        else {
          {
            $scope.currentGroup = data.teamClientsGroups[$scope.currentTeam];
            $scope.teamAffectGroup();

            $scope.groupAffectClient($scope.currentGroup);
          }
        }

        $scope.changeClientGroup = function (cGroupId) {
          $scope.groupAffectClient(cGroupId);
        };

        $scope.changeTeam = function (teamUuid) {
          $scope.members = data.members[teamUuid];

            $scope.currentGroup = data.teamClientsGroups[teamUuid];
            // load team member's locations
            $scope.teamAffectGroup();

        };
        //change team depends on the default team
        $scope.changeTeam($scope.currentTeam);

        Task.chains();

        // Validation of the task form
        $scope.validateTaskForm = function (task) {
          // fields should not be empty
          if (!task || !task.start || !task.end) {
            $rootScope.notifier.error($rootScope.ui.task.filltheTime);
            return false;
          }

          if (task.start.date == "" || task.start.time == "" || !task.start.time) {
            $rootScope.notifier.error($rootScope.ui.task.startTimeEmpty);
            return false;
          }

          if (task.end.date == "" || task.end.time == "" || !task.end.time) {
            $rootScope.notifier.error($rootScope.ui.task.endTimeEmpty);
            return false;
          }

          if (!$scope.taskForm.$valid) {
            $rootScope.notifier.error($rootScope.ui.task.taskFormValide);
            return false;
          }

          var now = new Date().getTime();

          $scope.task.startTime = ($rootScope.browser.mobile) ?
            moment(task.start.datetime).utc().valueOf() :
            Dater.convert.absolute(formatDateTime(task.start.date, 'dd-MM-yyyy'), formatDateTime(task.start.time, 'HH:mm'), false);

          $scope.task.endTime = ($rootScope.browser.mobile) ?
            moment(task.end.datetime).utc().valueOf() :
            Dater.convert.absolute(formatDateTime(task.end.date, 'dd-MM-yyyy'), formatDateTime(task.end.time, 'HH:mm'), false);

          if ($scope.task.startTime <= now || $scope.task.endTime <= now) {
            $rootScope.notifier.error($rootScope.ui.task.planTaskInFuture);
            return false;
          }

          if ($scope.task.startTime >= $scope.task.endTime) {
            $rootScope.notifier.error($rootScope.ui.task.startLaterThanEnd);
            return false;
          }
          if ($rootScope.app.domainPermission.clients) {
            if (!task.client || task.client == null) {
              $rootScope.notifier.error($rootScope.ui.task.specifyClient);
              return false;
            }
          }
          return true;
        };

        $scope.checkLeadingZeros = function (startTime) {
          console.log('startTime', startTime);
        };

        /**
         * Save a task, this could be creating or editing.
         * @param task Save the task values from the form
         */
        $scope.saveTask = function (task) {
          if (!$scope.validateTaskForm(task)) {
            return;
          }

          var values = {
            uuid: (task.uuid) ? task.uuid : '',
            status: 2,
            plannedStartVisitTime: $scope.task.startTime,
            plannedEndVisitTime: $scope.task.endTime,
            relatedClientUuid: task.client,
            assignedTeamUuid: task.team,
            description: task.description,
            assignedTeamMemberUuid: task.member
          };

          if (!_.isEmpty(task.uuid)) {
            editTask(values);
          }
          else {
            createTask(values);
          }
        };

        /**
         * Create a task
         * @param task
         */
        var createTask = function (task) {
            $rootScope.statusBar.display($rootScope.ui.task.creatingTask);

            TeamUp._(
              'taskAdd',
              null,
              task
            ).then(function (result) {
                handleResultTask(result, task);
              });
          },
          editTask = function (task)//Edit a task
          {
            $rootScope.statusBar.display($rootScope.ui.task.editingTask);

            Task.update(task)
              .then(
              function (result) {
                handleResultTask(result, task);
              }
            );

          },
          handleResultTask = function (result, task)//Handle result after saving the task
          {
            if (result.error) {
              if (result.error.data) {
                $rootScope.notifier.error($rootScope.transError(result.error.data.result));
              }
              else {
                $rootScope.notifier.error($rootScope.transError(result.error));
              }
              $rootScope.statusBar.off();
            }
            else {
              if (task.assignedTeamMemberUuid == $rootScope.app.resources.uuid) {
                queryMine(
                  true,
                  function () {
                    setView('myTasks');

                    $rootScope.notifier.success($rootScope.ui.task.taskSaved);
                  }
                );
              }
              else {
                queryAll(
                  function () {
                    setView('allTasks');

                    $rootScope.notifier.success($rootScope.ui.task.taskSaved);
                  }
                );
              }
              $rootScope.statusBar.off();
            }
          };


        // Create a new task
        //$scope.createTask = function (task)
        //{
        //  if (!$scope.validateTaskForm(task))
        //  {
        //    return;
        //  }
        //
        //  $rootScope.statusBar.display($rootScope.ui.task.creatingTask);
        //
        //  var values = {
        //    uuid: '',
        //    status: 2,
        //    plannedStartVisitTime: $scope.task.startTime,
        //    plannedEndVisitTime: $scope.task.endTime,
        //    relatedClientUuid: task.client,
        //    assignedTeamUuid: task.team,
        //    description: task.description,
        //    assignedTeamMemberUuid: task.member
        //  };
        //
        //  TeamUp._(
        //    'taskAdd',
        //    null,
        //    values
        //  ).then(function(result){
        //      handleResultTask(result, task)
        //  });
        //};
      }
    );
  }
);

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
        'Teams',
        'Clients',
        function ($rootScope, $scope, $location, $timeout, Store, TeamUp, Task, Teams, Clients)
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

            $scope.showAllTasks = false;

            $scope.showOnlyAvailable = true;

            $scope.reversed = true;

            $scope.order = 'plannedStartVisitTime';

            // $scope.filtered = { assignedTeamMemberUuid: null };
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

          function queryMine (only)
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

            only || queryAll();
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


          function updateTask (task)
          {
            Task.update(task)
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

                queryMine();
              }
            );
          }

          $scope.assignTask = function (task)
          {
            task.assignedTeamMemberUuid = $rootScope.app.resources.uuid;

            updateTask(task);

            setView('myTasks');
          };


          $scope.unAssignTask = function (task)
          {
            task.assignedTeamMemberUuid = null;
            task.assignedTeamUuid = null;

            updateTask(task);
          };


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


          /**
           * ******************************************************************************
           */


          // prepare the teams, members, client groups and clients
          var teamsLocal = Teams.queryLocal();
          // console.log('teamsLocal ->', teamsLocal);

          var clientLocal = Clients.queryLocal();
          // console.log('clientLocal ->', clientLocal);

          var teamClientLocal = Teams.queryLocalClientGroup(teamsLocal.teams);
          // console.log('teamClientLocal ->', teamClientLocal);

          $scope.teams = teamsLocal.teams;

          if ($scope.currentTeam == null || typeof $scope.currentTeam == 'undefined')
          {
            $scope.currentTeam = teamsLocal.teams[0].uuid;
          }

          $scope.members = teamsLocal.members[$scope.currentTeam];

          $scope.groups = [];
          $scope.clients = [];



          // Related to chain of drop-downs of teams and client groups
          $scope.teamAffectGroup = function ()
          {
            angular.forEach(
              clientLocal.clientGroups,
              function (cg)
              {
                if ($scope.currentGroup == cg.id)
                {
                  $scope.groups = [];
                  $scope.groups.push(cg);
                }
              }
            );

            $scope.groupAffectClient($scope.currentGroup);
          };

          // Related to chain of dropd-owns of groups and clients
          $scope.groupAffectClient = function (groupId)
          {
            $scope.clients = clientLocal.clients[groupId];

            if (( $scope.curentClient == null || typeof $scope.curentClient == 'undefined' )
                  && $scope.clients && $scope.clients.length > 0)
            {
              $scope.curentClient = $scope.clients[0].uuid;
            }
            else
            {
              $scope.curentClient = null;
            }

            if ($scope.task && $scope.task.client)
            {
              $scope.task.client = $scope.curentClient;
            }
          };

          if (typeof teamClientLocal[$scope.currentTeam] == 'undefined')
          {
            $scope.currentGroup = null;
          }
          else
          {
            $scope.currentGroup = teamClientLocal[$scope.currentTeam];
            $scope.teamAffectGroup();

            $scope.groupAffectClient($scope.currentGroup);
          }

          $scope.changeClientGroup = function (cGroupId)
          {
            // console.log('client group id', cGroupId);

            $scope.groupAffectClient(cGroupId);
          };

          $scope.changeTeam = function (teamUuid)
          {
            $scope.members = teamsLocal.members[teamUuid];
            $scope.currentGroup = teamClientLocal[teamUuid];

            $scope.teamAffectGroup();

            // load team member's locations
          };


          // console.log('scope ->', $scope);

          Task.chains();

        }
      ]
    );
  }
);
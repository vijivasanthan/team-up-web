define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'tasksCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        'Store',
        'Teams',
        'Clients',
        'Dater',
        'TeamUp',
        '$filter',
        '$route',
        '$timeout',
        function ($rootScope, $scope, $location, Store, Teams, Clients, Dater, TeamUp, $filter,
                  $route, $timeout)
        {
          $rootScope.fixStyles();

          $scope.myTasks = Store('app').get('myTasks');
          $scope.allTasks = Store('app').get('allTasks');

          $scope.allTasks = $filter('orderBy')($scope.allTasks, "plannedStartVisitTime", true);
          $scope.myTasks = $filter('orderBy')($scope.myTasks, "plannedStartVisitTime", true);

          // prepare the order
          $scope.orders = [
            { id: 1, name: $rootScope.ui.task.orderType1 },
            { id: 2, name: $rootScope.ui.task.orderType2 }
          ];

          var params = $location.search();

          if (! params.orderType)
          {
            $scope.currentOrder = 1;
          }
          else
          {
            $scope.currentOrder = params.orderType;
          }





          $scope.orderItem = "plannedStartVisitTime";
          $scope.reverse = true;

          // Sort the lists of tasks by a given colomn
          $scope.resort = function (col)
          {
            if (col == "clientName")
            {
//              var sortClient = function (task)
//              {
//                var filtered = $filter('getObjAttr')(task.relatedClientUuid, 'client', 'name') + "";
//
//                console.log('filtered ->', filtered);
//
//                return filtered;
//              };

//              $scope.orderItem = sortClient;

              $timeout(function () { $scope.orderItem = 'relatedClientName' });
            }
            else if (col == "memberName")
            {
              var sortMember = function (task)
              {
                return $filter('getObjAttr')(task.assignedTeamMemberUuid, 'member', 'name') + "";
              };

              $scope.orderItem = sortMember;
            }
            else
            {
              $scope.orderItem = col;
            }

            $scope.reverse = ! $scope.reverse;
          };










          // prepare the teams, members, client groups and clients
          var teamsLocal = Teams.queryLocal();
          var clientLocal = Clients.queryLocal();

          var teamClientLocal = Teams.queryLocalClientGroup(teamsLocal.teams);

          $scope.teams = teamsLocal.teams;

          if ($scope.currentTeam == null || typeof $scope.currentTeam == 'undefined')
          {
            $scope.currentTeam = teamsLocal.teams[0].uuid;
          }

          $scope.members = teamsLocal.members[$scope.currentTeam];

          $scope.groups = [];
          $scope.clients = [];

          // Related to chain of drop-downs of teams and client groups
          $scope.teamAffectGroup = function (teamId)
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
            $scope.teamAffectGroup($scope.currentTeam);

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

            $scope.teamAffectGroup(teamUuid);

            // load team member's locations
          };



















          // Validation of the task form
          $scope.validateTaskForm = function (task)
          {
            // console.log($scope.curentClient);

            // fileds should not be empty
            if (! task || ! task.start || ! task.end)
            {
              $rootScope.notifier.error($rootScope.ui.task.filltheTime);
              return false;
            }

            if (task.start.date == "" || task.start.time == "" || ! task.start.time)
            {
              $rootScope.notifier.error($rootScope.ui.task.startTimeEmpty);
              return false;
            }

            if (task.end.date == "" || task.end.time == "" || ! task.end.time)
            {
              $rootScope.notifier.error($rootScope.ui.task.endTimeEmpty);
              return false;
            }

            $scope.task.startTime = ($rootScope.browser.mobile) ?
                                    new Date(task.start.date).getTime() :
                                    Dater.convert.absolute(task.start.date, task.start.time, false);

            $scope.task.endTime = ($rootScope.browser.mobile) ?
                                  new Date(task.end.date).getTime() :
                                  Dater.convert.absolute(task.end.date, task.end.time, false);

            // start time and end time should be in the future
            // end time should later than start time
            if ($scope.task.startTime <= Date.now().getTime() || $scope.task.endTime <= Date.now().getTime())
            {
              $rootScope.notifier.error($rootScope.ui.task.planTaskInFuture);
              return false;
            }

            if ($scope.task.startTime >= $scope.task.endTime)
            {
              $rootScope.notifier.error($rootScope.ui.task.startLaterThanEnd);
              return false;
            }

            // should assign a client
            // console.log($scope.curentClient);
            // console.log(task.client);

            if (! task.client || task.client == null)
            {
              $rootScope.notifier.error($rootScope.ui.task.specifyClient);
              return false;
            }
            // description should not be empty

            return true;
          };

          // Reload the task and save it into the localStorage "all tasks" or "my tasks"
          $scope.reloadAndSaveTask = function (taskId, type)
          {
            TeamUp._(
              'taskById',
              {second: taskId},
              null
            ).then(
              function (result)
              {
                // refresh the local cache

                // forward pages
                if (result.error && type != 'delete')
                {
                  $rootScope.notifier.error(result.error);
                }
                else
                {
                  var allTasks = Store('app').get('allTasks');
                  var myTasks = Store('app').get('myTasks');

                  var forwardTab = '';

                  // remove the task item from the
                  var deleteTask = function (tasks, uuid)
                  {
                    var i = 0;
                    for (; i < tasks.length; i ++)
                    {
                      if (uuid == tasks[i].uuid)
                      {
                        tasks.splice(i, 1);
                        i --;
                      }
                    }
                    return tasks;
                  };

                  if (type == 'assign' || type == 'unAssign' || type == 'add')
                  {
                    var foundTaskinAll = $filter('getByUuid')(allTasks, result.uuid);
                    var foundTaskinMy = $filter('getByUuid')(myTasks, result.uuid);

                    if (result.assignedTeamMemberUuid && result.assignedTeamMemberUuid == $rootScope.app.resources.uuid)
                    {
                      // remove it from the all tasks
                      if (foundTaskinAll)
                      {
                        allTasks = deleteTask(allTasks, foundTaskinAll.uuid);
                      }

                      if (foundTaskinMy)
                      {
                        // found it in my task list , means it is updated , so remove it first
                        myTasks = deleteTask(myTasks, foundTaskinMy.uuid);
                      }
                      if (! myTasks.length || myTasks.length == 0)
                      {
                        myTasks = [];
                      }
                      myTasks.push(result);
                    }
                    else
                    {
                      // forward to all task page
                      if (foundTaskinAll)
                      {
                        allTasks = deleteTask(allTasks, foundTaskinAll.uuid);
                      }
                      if (foundTaskinMy)
                      {
                        // found it in my task list , means it is updated , so remove it first
                        myTasks = deleteTask(myTasks, foundTaskinMy.uuid);
                      }

                      if (! allTasks.length || allTasks.length == 0)
                      {
                        allTasks = [];
                      }
                      allTasks.push(result);
                    }

                    // forward to specific tab
                    if (result.assignedTeamMemberUuid && result.assignedTeamMemberUuid == $rootScope.app.resources.uuid)
                    {
                      // forward to my task pages
                      forwardTab = 'myTasks';
                    }
                    else
                    {
                      // forward to all task pages
                      forwardTab = 'allTasks';
                    }

                  }
                  else if (type == 'delete')
                  {
                    allTasks = deleteTask(allTasks, taskId);
                    myTasks = deleteTask(myTasks, taskId);

                    forwardTab = $location.hash();
                    $route.reload();
                  }
                  else if (type == 'update')
                  {

                  }

                  Store('app').save('allTasks', allTasks);
                  Store('app').save('myTasks', myTasks);


                  $location.hash(forwardTab)
                }
              }
            );
          };

          // Create a new task
          $scope.createTask = function (task)
          {
            if (! $scope.validateTaskForm(task))
            {
              return;
            }

            var values = {
              uuid: "",
              status: 2,
              plannedStartVisitTime: $scope.task.startTime,
              plannedEndVisitTime: $scope.task.endTime,
              relatedClientUuid: task.client,
              assignedTeamUuid: task.team,
              description: task.description,
              assignedTeamMemberUuid: task.member
            };

            TeamUp._(
              'taskAdd',
              null,
              values
            ).then(
              function (result)
              {
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
                }
                else
                {
                  $rootScope.notifier.success($rootScope.ui.task.taskSaved);

                  // refresh the tasks in that team and 
                  // forward user to the task overview page. 
                  // 1> forward to my task page if the task is assgined to the login mebmer
                  // 2> forward to all task page if the task is assgined to other member or nobody

                  // result is the taskId
                  $scope.reloadAndSaveTask(result.result, 'add');

                }
              });

          };
          //







          var view;

          if (! $location.hash())
          {
            view = 'myTasks';
          }
          else
          {
            view = $location.hash();
          }

          function resetViews ()
          {
            // console.log('resetViews ->', $scope.views);

            $scope.views = {
              myTasks: false,
              allTasks: false,
              newTask: false
            };
          }

          var setView = function (hash)
          {
            // console.log('setView -> ', hash);

            resetViews();

            $scope.views[hash] = true;
          };

          $scope.setViewTo = function (hash)
          {
            // console.log('setViewTo ->', hash);

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








          // Assign any task to logged in user (Plus sign)
          $scope.assignYourself = function (task)
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

                  $scope.reloadAndSaveTask(result.result, 'assign');
                }

              }
            );
          };

          // Un-assign a task for logged in user
          $scope.unassignYourself = function (task)
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

                  $scope.reloadAndSaveTask(result.result, 'unAssign');
                }

              }
            );
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
                  $scope.reloadAndSaveTask(result.uuid, 'delete');
                }

              }
            );
          };

          // TODO: Update task page and function
          $scope.updateTask = function (task)
          {
            // TeamUp._(
            //   'taskDelete',
            //   { second: task.uuid },
            //   task
            //   ).then(function(result){
            //     console.log(result);
            //     if(result.error ){
            //         if(result.error.data){
            //           $rootScope.notifier.error(result.error.data.result);
            //         }else{
            //           $rootScope.notifier.error(result.error);
            //         }
            //     }else{
            //       console.log(result);
            //       $scope.reloadAndSaveTask(result.result,'delete');
            //     }

            //   }
            // );
          };

          // TODO: Investigate on this functionality
          //--------------- map function start  ------------------//

          if (view != 'myTasks' && view != 'allTasks')
          {
            $scope.map = {
              center: {
                latitude: 52,
                longitude: 4
              },
              zoom: 8,
              bounds: {},
            };
          }

          // Entry page, so might need to trigger some user defiend event here, 
          // TODO: Investigate on this! (This might not be a good idea, better solution needed.)
          $scope.$on(
            '$viewContentLoaded',
            function ()
            {
              // console.log("$viewContentLoaded");

              $("#task-map .angular-google-map-container").height(500);
              google.maps.event.trigger($("#task-map"), "resize");

              // make sure the loading of the 
              if (! $rootScope.taskVisit)
              {
                $rootScope.$broadcast('taskFinishLoading');
                $rootScope.taskVisit = true;
              }

            });

          $scope.clientCoords = {latitude: 0, longitude: 0};

          $scope.changeClient = function (clientId)
          {
            // console.log("latlong " + $filter('getObjAttr')(clientId, 'client', 'latlong'));

            var str_ll = $filter('getObjAttr')(clientId, 'client', 'latlong');

            var ll = str_ll.split(",");

            if (ll.length == 2)
            {

              $scope.clientCoords.latitude = ll[0];
              $scope.clientCoords.longitude = ll[1];

              $scope.map.center.latitude = ll[0];
              $scope.map.center.longitude = ll[1];
            }

          };
          //--------------- map function end  ------------------//

          // For prioritizing tasks order
          //--------------- start the sortable function ----------//
          $scope.sortableOptions = {
            update: function (e, ui)
            {
              var logEntry = $scope.myTasks.map(
                function (i)
                {
                  return i.plannedEndVisitTime;
                }).join(', ');

              // console.log('update', logEntry);

              //$scope.sortingLog.push('Update: ' + logEntry);
            },
            stop: function (e, ui)
            {
              // this callback has the changed model
              var logEntry = $scope.myTasks.map(
                function (i)
                {
                  return i.plannedEndVisitTime;
                }).join(', ');

              // console.log('stop', logEntry);

              //$scope.sortingLog.push('Stop: ' + logEntry);
            },
            cancel: function (e, ui)
            {
              // console(e, ui);
            }
          };
          //--------------- end the sortable function ----------//








          //--------------- start the pagination test ----------//
          // TODO: These can be set as parameters , it should also be binded to the URL parameter
          $scope.tasksPerPage = 7;

          if (params.tasksPerPage)
          {
            $scope.taskPerPage = parseInt(params.tasksPerPage);
          }

          var currentPage = 1;

          if (params.currentPage)
          {
            currentPage = parseInt(params.currentPage);
            if (view == "myTasks")
            {
              if (currentPage > Math.round($scope.myTasks.length / $scope.tasksPerPage))
              {
                currentPage = 1;
              }
            }
            else if (view == "allTasks")
            {
              if (currentPage > Math.round($scope.allTasks.length / $scope.tasksPerPage))
              {
                currentPage = 1;
              }
            }
          }

          $scope.allTaskCurrentPage = currentPage;
          $scope.myTaskCurrentPage = currentPage;

          $scope.maxSize = 10;

          if (params.maxSize)
          {
            $scope.maxSize = parseInt(params.maxSize);
          }

          $scope.currentTasks = [];

          if (view == 'allTasks')
          {
            $scope.$watch(
              'allTaskCurrentPage',
              function ()
              {
                //console.log("All task page changed to  " + $scope.allTaskCurrentPage);
                $scope.currentTasks = [];

                var tasks = [];

                angular.forEach(
                  $scope.allTasks,
                  function (task, i)
                  {
                    if (i >= ($scope.allTaskCurrentPage - 1) * $scope.tasksPerPage &&
                        i < ($scope.allTaskCurrentPage) * $scope.tasksPerPage)
                    {
                      tasks.push(task);
                    }
                  }
                );

                $scope.currentTasks = tasks;
              }
            );
          }

          if (view == 'myTasks')
          {
            $scope.$watch(
              'myTaskCurrentPage',
              function ()
              {
                //console.log("My task page changed to  " + $scope.myTaskCurrentPage);
                $scope.currentTasks = [];

                var tasks = [];

                angular.forEach(
                  $scope.myTasks,
                  function (task, i)
                  {
                    if (i >= ($scope.myTaskCurrentPage - 1) * $scope.tasksPerPage &&
                        i < ($scope.myTaskCurrentPage) * $scope.tasksPerPage)
                    {
                      tasks.push(task);
                    }
                  }
                );

                $scope.currentTasks = tasks;
              }
            );
          }

          //--------------- end the pagination test ----------//









          // Refresh the task list manually
          $scope.refreshTask = function (tab)
          {
            // console.log(tab);

            $rootScope.statusBar.display($rootScope.ui.task.refreshTask);

            if (tab == 'my')
            {
              TeamUp._("taskMineQuery").then(
                function (result)
                {
                  console.log('result ->', result);

                  angular.forEach(
                    result,
                    function (task)
                    {
                      var client = $rootScope.getClientByID(task.relatedClientUuid);

                      console.log('client ->', client);
                    }
                  );

                  Store('app').save('myTasks', result);
                  $scope.myTasks = Store('app').get('myTasks');
                  // $scope.myTasks = $filter('orderBy')($scope.myTasks, "plannedStartVisitTime", true);
                  $scope.myTasks = $filter('orderBy')($scope.myTasks, $scope.orderItem, true);

                  // refresh the paging data
                  if ($scope.myTaskCurrentPage != 1)
                  {
                    $scope.myTaskCurrentPage = 1;
                    $rootScope.statusBar.off();
                  }
                  else
                  {
                    $scope.myTaskCurrentPage = 0;
                    setTimeout(
                      function ()
                      {
                        $scope.myTaskCurrentPage = 1;
                        $rootScope.statusBar.off();
                      }, 500);
                  }
                });
            }
            else if (tab == 'all')
            {
              var allTasks = [];
              angular.forEach(
                $scope.teams, function (team_obj)
                {
                  TeamUp._(
                    "taskByTeam",
                    {fourth: team_obj.uuid}
                  ).then(
                    function (result)
                    {
                      angular.forEach(
                        result, function (taskObj)
                        {
                          var foundTask = $filter('getByUuid')(allTasks, taskObj.uuid);
                          if (foundTask == null)
                          {
                            allTasks.push(taskObj);
                          }
                        });
                      Store('app').save('allTasks', allTasks);
                      $scope.allTasks = $filter('orderBy')(allTasks, "plannedStartVisitTime", true);

                      // refresh the paging data
                      if ($scope.allTaskCurrentPage != 1)
                      {
                        $scope.allTaskCurrentPage = 1;
                        $rootScope.statusBar.off();
                      }
                      else
                      {
                        $scope.allTaskCurrentPage = 0;
                        setTimeout(
                          function ()
                          {
                            $scope.allTaskCurrentPage = 1;
                            $rootScope.statusBar.off();
                          }, 500);
                      }
                    });
                });
            }
          };

//          // TODO: Check whether it is workign properly!
//          // Description toggle
//          $scope.toggleMyDesc = function (taskId)
//          {
//            $('#myTaskdesc_' + taskId).toggle()
//          };
//
//          // Description toggle
//          $scope.toggleAllDesc = function (taskId)
//          {
//            $('#allTaskdesc_' + taskId).toggle()
//          };
        }
      ]
    );
  }
);
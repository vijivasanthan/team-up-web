define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'tasksCtrl', [
        '$rootScope', '$scope', '$location', 'Store', 'Teams', 'Clients', 'Dater', 'TeamUp','$filter','$route',
        function ($rootScope, $scope, $location, Store, Teams, Clients, Dater, TeamUp, $filter,$route)
        {
          $rootScope.fixStyles();

          $scope.myTasks = Store('app').get('myTasks');
          $scope.allTasks = Store('app').get('allTasks');

          // prepare the order
          $scope.orders = [
            {id: 1, name: $rootScope.ui.task.orderType1},
            {id: 2, name: $rootScope.ui.task.orderType2}
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

          $scope.orderItem = "plannedEndVisitTime";
          $scope.reverse = false;

          $scope.resort = function(col){
              if(col == "clientName"){
                  var sortClient = function(task){                      
                      return $filter('getObjAttr')(task.relatedClientUuid,'client','name') + ""; 
                  }
                  $scope.orderItem = sortClient;                  
              }else if(col == "memberName"){
                  var sortMember = function(task){
                    return $filter('getObjAttr')(task.assignedTeamMemberUuid,'member','name') + ""; 
                  }
                  $scope.orderItem = sortMember;
              }else{
                  $scope.orderItem = col;                  
              }
              $scope.reverse = !$scope.reverse; 
          }

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
            console.log('client group id' , cGroupId);
            $scope.groupAffectClient(cGroupId);
          };

          $scope.changeTeam = function (teamUuid)
          {
            $scope.members = teamsLocal.members[teamUuid];
            $scope.currentGroup = teamClientLocal[teamUuid];

            $scope.teamAffectGroup(teamUuid);

            // load team member's locations

          };

          $scope.validateTaskForm = function (task)
          {
            console.log($scope.curentClient);

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
            console.log($scope.curentClient);
            console.log(task.client);

            if (! task.client || task.client == null)
            {
              $rootScope.notifier.error($rootScope.ui.task.specifyClient);
              return false;
            }
            // description should not be empty

            return true;
          };

          // reload the task and save it into the localstorage "all tasks" or "my tasks"
          $scope.reloadAndSaveTask = function(taskId,type){
              TeamUp._(
                'taskById',
                {second : taskId},
                null
              ).then(function(result){
                  // refresh the local cache 

                  // forward pages 
                  if(result.error && type != 'delete'){
                      $rootScope.notifier.error(result.error);
                  }else{
                      var allTasks = Store('app').get('allTasks');
                      var myTasks = Store('app').get('myTasks'); 

                      var forwardTab = '';

                        // remove the task item from the 
                      var deleteTask = function(tasks,uuid){
                          var i = 0 ;
                          for(;i < tasks.length;i++){
                            if(uuid == tasks[i].uuid){
                               tasks.splice(i,1);
                               i--;
                            }
                          }
                          return tasks;
                      }

                      if(type == 'assign' || type == 'unAssign' || type == 'add'){
                          var foundTaskinAll = $filter('getByUuid')(allTasks,result.uuid);
                          var foundTaskinMy = $filter('getByUuid')(myTasks,result.uuid);

                           if(result.assignedTeamMemberUuid && result.assignedTeamMemberUuid == $rootScope.app.resources.uuid){                          
                              // remove it from the all tasks
                              if(foundTaskinAll){
                                  allTasks = deleteTask(allTasks,foundTaskinAll.uuid);
                              }

                              if(foundTaskinMy){
                                  // found it in my task list , means it is updated , so remove it first 
                                  myTasks = deleteTask(myTasks,foundTaskinMy.uuid);                              
                              }
                              if(!myTasks.length || myTasks.length == 0){
                                myTasks = [];
                              }
                              myTasks.push(result);                          
                          }else if(!result.assignedTeamMemberUuid){
                              // forward to all task page 
                              if(foundTaskinAll){
                                  allTasks = deleteTask(allTasks,foundTaskinAll.uuid); 
                              }
                              if(foundTaskinMy){
                                  // found it in my task list , means it is updated , so remove it first 
                                  myTasks = deleteTask(myTasks,foundTaskinMy.uuid);                              
                              }

                              if(!allTasks.length || allTasks.length == 0){
                                allTasks = [];
                              }
                              allTasks.push(result);
                          }

                          // forward to specific tab 
                          if(result.assignedTeamMemberUuid && result.assignedTeamMemberUuid == $rootScope.app.resources.uuid){
                              // forward to my task pages 
                              forwardTab = 'myTasks';
                          }else{
                              // forward to all task pages 
                              forwardTab =  'allTasks';
                          }

                      }else if(type == 'delete'){
                          allTasks = deleteTask(allTasks,taskId);
                          myTasks = deleteTask(myTasks,taskId);

                          forwardTab = $location.hash();
                          $route.reload();
                      }else if(type == 'update'){

                      }
                    
                      Store('app').save('allTasks',allTasks);
                      Store('app').save('myTasks',myTasks);

                      
                      $location.hash(forwardTab)
                  }
                }  
              );
          }

          // create a new task
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
                  $rootScope.notifier.error(result.error);
                }
                else
                {
                  $rootScope.notifier.success($rootScope.ui.task.taskSaved);

                  // refresh the tasks in that team and 
                  // forward user to the task overview page. 
                  // 1> forward to my task page if the task is assgined to the login mebmer
                  // 2> forward to all task page if the task is assgined to other member or nobody

                  // result is the taskId
                  $scope.reloadAndSaveTask(result.result,'add');

                }
              });

          };
          //

          var view;
          if(! $location.hash()){
            view = 'myTasks';
          }else{
            view = $location.hash();
          }

          function resetViews ()
          {
            console.log('resetViews ->',$scope.views);

            $scope.views = {
              myTasks: false,
              allTasks: false,
              newTask: false
            };
          }

          var setView = function (hash)
          {
            console.log('setView -> ',hash);

            resetViews();

            $scope.views[hash] = true;
          };

          $scope.setViewTo = function (hash)
          {
            console.log('setViewTo ->', hash);

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

          $scope.assignYourself = function(task){
              task.assignedTeamMemberUuid = $rootScope.app.resources.uuid;              
              TeamUp._(
                'taskUpdate',
                { second: task.uuid },
                task
                ).then(function(result){
                  console.log(result);
                  if(result.error ){
                      if(result.error.data.result){
                        $rootScope.notifier.error(result.error.data.result); 
                      }else{
                        $rootScope.notifier.error(result.error); 
                      }
                      task.assignedTeamMemberUuid = null;                      
                  }else{
                    console.log(result); 
                    $scope.reloadAndSaveTask(result.result,'assign'); 
                  }
                  
                }
              );
          };

          $scope.unassignYourself = function(task){
              task.assignedTeamMemberUuid = null;              
              TeamUp._(
                'taskUpdate',
                { second: task.uuid },
                task
                ).then(function(result){
                  console.log(result);
                  if(result.error ){
                      if(result.error.data){
                        $rootScope.notifier.error(result.error.data.result); 
                      }else{
                        $rootScope.notifier.error(result.error); 
                      }
                      task.assignedTeamMemberUuid = null;                      
                  }else{
                    console.log(result); 
                    $scope.reloadAndSaveTask(result.result,'unAssign'); 
                  }
                  
                }
              );  
          }

          $scope.deleteTask = function(task){
              if(!confirm($rootScope.ui.task.deleteTaskConfirm)){
                  return;
              }
              TeamUp._(
                'taskDelete',
                { second: task.uuid },
                task
                ).then(function(result){
                  console.log("after delete action , " , result);
                  if(result.error){
                      if(result.error.data){                        
                        $rootScope.notifier.error(result.error.data); 
                      }else{
                        $rootScope.notifier.error(result.error); 
                      }                      
                  }else{                    
                    $rootScope.notifier.success($rootScope.ui.task.taskDeleted); 
                    $scope.reloadAndSaveTask(result.uuid,'delete'); 
                  }
                  
                }
              ); 
          }

          $scope.updateTask = function(task){
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
          }

          if(view != 'myTasks' && view != 'allTasks'){              
              $scope.map = {
                  center: {
                      latitude: 52,
                      longitude: 4
                  },
                  zoom: 8,
                  bounds: {},
              };  
          }
          
          
          $scope.$on('$viewContentLoaded', function () {

              console.log("$viewContentLoaded" );            

              $("#task-map .angular-google-map-container").height(500);
              google.maps.event.trigger($("#task-map"),"resize");

          });          

          $scope.clientCoords = {latitude : 0, longitude : 0};
          
          $scope.changeClient = function(clientId){
          
              console.log("latlong " + $filter('getObjAttr')(clientId,'client','latlong') );
              var str_ll = $filter('getObjAttr')(clientId,'client','latlong');
              var ll = str_ll.split(",");
          
              if(ll.length == 2){

                  $scope.clientCoords.latitude =  ll[0];
                  $scope.clientCoords.longitude =  ll[1];      

                  $scope.map.center.latitude =  ll[0];
                  $scope.map.center.longitude =  ll[1];                                     
              }

          }

        }
      ]
    );
  }
);
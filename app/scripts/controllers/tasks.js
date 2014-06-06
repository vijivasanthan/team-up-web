define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'tasksCtrl', [
        '$rootScope', '$scope', '$location','Store','Teams','Clients','Dater','TeamUp',
        function ($rootScope, $scope, $location,Store,Teams,Clients,Dater,TeamUp)
        {
          $rootScope.fixStyles();
          $scope.myTasks = Store('app').get('myTasks');
          $scope.allTasks = Store('app').get('allTasks');          

          // prepare the order
          $scope.orders = [{id : 1, name : $rootScope.ui.task.orderType1},
                           {id : 2, name : $rootScope.ui.task.orderType2}];

          var params = $location.search();

          if(!params.orderType){
            $scope.currentOrder =  1;
          }else{
            $scope.currentOrder = params.orderType;
          }

          // prepare the teams, members, client groups and clients
          var teamsLocal = Teams.queryLocal();
          var clientLocal = Clients.queryLocal();

          var teamClientLocal = Teams.queryLocalClientGroup(teamsLocal.teams);

          console.log("teamsLocal " , teamsLocal);
          console.log("clientLocal  " , clientLocal);
          console.log("teamClientLocal " , teamClientLocal);

          $scope.teams = teamsLocal.teams;
          if($scope.currentTeam == null || typeof $scope.currentTeam == 'undefined'){
            $scope.currentTeam = teamsLocal.teams[0].uuid;
          }
          $scope.members = teamsLocal.members[$scope.currentTeam];

          $scope.groups = [];
          $scope.clients = [];

           $scope.teamAffectGroup = function(teamId){              
              angular.forEach(clientLocal.clientGroups,function(cg){
                  if($scope.currentGroup == cg.id){
                      $scope.groups = [];
                      $scope.groups.push(cg);
                  }
              });
              $scope.groupAffectClient($scope.currentGroup);
          }

          $scope.groupAffectClient = function(groupId){
              $scope.clients = clientLocal.clients[groupId];              
              if(( $scope.curentClient == null || typeof $scope.curentClient == 'undefined' ) 
                && $scope.clients && $scope.clients.length > 0 ){                
                  $scope.curentClient = $scope.clients[0].uuid;
              }else{
                  $scope.curentClient = null;
              }
              if($scope.task && $scope.task.client){
                $scope.task.client = $scope.curentClient; 
              }              
          }

          if(typeof teamClientLocal[$scope.currentTeam] == 'undefined'){
              $scope.currentGroup = null;              
          }else{
              $scope.currentGroup = teamClientLocal[$scope.currentTeam]; 
              $scope.teamAffectGroup($scope.currentTeam);

              $scope.groupAffectClient($scope.currentGroup);
          }
          

          $scope.changeClientGroup = function(cGroupId){
              $scope.groupAffectClient(cGroupId);
          }
          
          $scope.changeTeam = function(teamUuid){
              $scope.members = teamsLocal.members[teamUuid];
              $scope.currentGroup = teamClientLocal[teamUuid]; 

              $scope.teamAffectGroup(teamUuid);
          }

          $scope.validateTaskForm = function(task){
              console.log($scope.curentClient);
              // fileds should not be empty 
              if(!task || !task.start || !task.end){
                  $rootScope.notifier.error($rootScope.ui.task.filltheTime);
                  return false;
              }
              if(task.start.date == "" || task.start.time == "" || !task.start.time){
                  $rootScope.notifier.error($rootScope.ui.task.startTimeEmpty);
                  return false;
              }
              if(task.end.date == "" || task.end.time == "" || !task.end.time){
                  $rootScope.notifier.error($rootScope.ui.task.endTimeEmpty);
                  return false;
              }

              $scope.task.startTime =  ($rootScope.browser.mobile) ?
                           new Date(task.start.date).getTime() :
                           Dater.convert.absolute(task.start.date, task.start.time, false);
              $scope.task.endTime =  ($rootScope.browser.mobile) ?
                           new Date(task.end.date).getTime() :
                           Dater.convert.absolute(task.end.date, task.end.time, false);                                     

              // start time and end time should be in the future
              // end time should later than start time 
              if($scope.task.startTime <= Date.now().getTime() || $scope.task.endTime <= Date.now().getTime() ){
                  $rootScope.notifier.error($rootScope.ui.task.planTaskInFuture);
                  return false;   
              }

              if($scope.task.startTime >= $scope.task.endTime){
                  $rootScope.notifier.error($rootScope.ui.task.startLaterThanEnd);
                  return false;    
              }
              // should assign a client 
              console.log($scope.curentClient);
              console.log(task.client);

              if(!task.client || task.client == null){
                  $rootScope.notifier.error($rootScope.ui.task.specifyClient);
                  return false;    
              }
              // description should not be empty

              return true;
          }

          $scope.createTask = function(task){

            if(!$scope.validateTaskForm(task)){              
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
            ).then(function(result){
                if(result.error){
                  $rootScope.notifier.error(result.error);
                }else{
                  $rootScope.notifier.success($rootScope.ui.task.taskSaved);
                }
            });

          }
//
//          var uuid, view;
//
//          if (! params.uuid && ! $location.hash())
//          {
//            uuid = data.teams[0].uuid;
//            view = 'team';
//
//            $location.search(
//              {
//                uuid: data.teams[0].uuid
//              }).hash('team');
//          }
//          else if (! params.uuid)
//          {
//            uuid = data.teams[0].uuid;
//            view = $location.hash();
//            $location.search(
//              {
//                uuid: data.teams[0].uuid
//              });
//          }
//          else
//          {
//            uuid = params.uuid;
//            view = $location.hash();
//          }
//
//          setTeamView(uuid);

//          function setTeamView (id)
//          {
//            angular.forEach(
//              data.teams, function (team)
//              {
//                if (team.uuid == id)
//                {
//                  $scope.team = team;
//                }
//              });
//
//            $scope.members = data.members[id];
//
//            $scope.current = id;
//          }
//
//          $scope.requestTeam = function (current, switched)
//          {
//            setTeamView(current);
//
//            $scope.$watch(
//              $location.search(), function ()
//              {
//                $location.search(
//                  {
//                    uuid: current
//                  });
//              });
//
//            if (switched)
//            {
//              if ($location.hash() != 'team')
//              {
//                $location.hash('team');
//              }
//
//              setView('team');
//            }
//          };

          function resetViews ()
          {
            $scope.views = {
              myTasks:  false,
              allTasks: false,
              newTask:  false
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
              hash, function ()
              {
                $location.hash(hash);

                setView(hash);
              });
          };

          setView('myTasks');

//          $scope.toggleSelection = function (group, master)
//          {
//            var flag    = (master) ? true : false,
//                members = angular.fromJson(Storage.get(group.uuid));
//
//            angular.forEach(
//              members, function (member)
//              {
//                $scope.selection[member.uuid] = flag;
//              });
//          };
        }
      ]
    );
  }
);
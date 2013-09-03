/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Manage', [])

/**
 * Groups controller
 */
.controller('manageCtrl',[
    '$rootScope', '$scope', '$location', 'Clients', '$route', '$routeParams', 'Storage', 'Teams', '$window','data',
    function ($rootScope, $scope, $location, Clients, $route, $routeParams, Storage , Teams, $window,data){
        
       if(data.local){
           // data from local storage 
           var teams = angular.fromJson(Storage.get("Teams"));
           data.teams = teams;
           var groups = angular.fromJson(Storage.get("ClientGroups"));
           data.groups = groups;
           
           var members = [];
           var memberKeys = [];
           angular.forEach(teams,function(team,index){
               var mems = angular.fromJson(Storage.get(team.uuid));
               angular.forEach(mems,function(mem,index){
                   if(memberKeys.indexOf(mem.uuid) == -1){
                       memberKeys.push(mem.uuid);
                       members.push({"name" : mem.firstName+" "+mem.lastName , "id" : mem.uuid }); 
                   }
               });
           });
           
           data.members = members;
           
           var clients = [];
           angular.forEach(groups,function(group,index){
               var cts = angular.fromJson(Storage.get(group.id));
               angular.forEach(cts,function(client,index){
                   clients.push({"name" : client.firstName+" "+client.lastName , "id" : client.uuid});
              });
           });
           
           data.clients = clients;
       }else{
           // data from the server
       }
        
      // start to populate data from storage 
      if(typeof data.teams == 'undefined'){
          
      }
    
      if(typeof data.clientGroups == 'undefined'){
          
      }


      $scope.data = {
        left: [],
        right: []
      };


      /**
       * View setter
       */
      function setView (hash)
      {
        $scope.views = {
          teamClients:  false,
          teams:        false,
          clients:      false
        };

        $scope.views[hash] = true;
      }


      /**
       * Switch between the views and set hash accordingly
       */
      $scope.setViewTo = function (hash)
      {
        $scope.$watch(hash, function ()
        {
          $location.hash(hash);

          setView(hash);

          $scope.manage(hash);

        });
      };

      $scope.setViewTo('teamClients');


      /**
       * Manage TreeGrids
       */
      $scope.manage = function (grid)
      {
        switch (grid)
        {
          case 'teamClients':
            $rootScope.$broadcast('TreeGridManager', grid, '1:1', {
              left:   data.groups,
              right:  data.teams
            });
            break;

          case 'teams':
            $rootScope.$broadcast('TreeGridManager', grid, '1:n', {
              left:   data.members,
              right:  data.teams
            });
            break;

          case 'clients':
            $rootScope.$broadcast('TreeGridManager', grid, '1:n', {
              left:   data.clients,
              right:  data.groups
            });
            break;
        }
      };

      
      $scope.confirm = function(){
          
      }
      
    }
    
]);

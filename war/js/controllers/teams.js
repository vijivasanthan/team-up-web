/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Teams', [])

/**
 * Groups controller
 */
.controller('teamCtrl',[
    '$rootScope', '$scope', '$location', 'Teams','data', '$route', '$routeParams', 'Storage',
    function ($rootScope, $scope, $location, Teams,data, $route, $routeParams, Storage){
        /**
         * Fix styles
         */
        $rootScope.fixStyles();
        
        $scope.members = data.members;
        $scope.teams = data.teams;
        
        /**
         * Self this
         */
        var self = this,
        params = $location.search();
        
        $scope.imgHost = profile.host();
        
        /**
         * Init search query
         */
        $scope.search = {
            query: ''
        };


        /**
         * Reset selection
         */
        $scope.selection = {};


        /**
         * Set groups
         */
        $scope.data = data;


        /**
         * Grab and set roles for view
         */
        $scope.roles = $rootScope.config.roles;

        

        var uuid, view;

        /**
         * If no params or hashes given in url
         */
        if (!params.uuid && !$location.hash())
        {
            uuid = data.teams[0].uuid;
            view = 'team';
  
            $location.search({uuid: data.teams[0].uuid}).hash('team');
        }
        else
        {
            uuid = params.uuid;
            view = $location.hash();
        }
        
        
        /**
         * Set group
         */
        setTeamView(uuid);


        /**
         * Set view
         */
        setView(view);

        /**
         * Set Team View
         */
          $scope.views = { 
              team : true,
              newTeam : false,
              newMember : false
          }
          

        /**
         * Set given group for view
         */
        function setTeamView(id){
            
            angular.forEach(data.teams, function (team, index)
            {
                if (team.uuid == id) $scope.team = team;
            });

            $scope.members = data.members[id];

            $scope.current = id;

//            wisher(id);
        }

      /**
       * Request for a group
       */
      $scope.requestTeam= function (current, switched)
      {
          setTeamView(current);

          $scope.$watch($location.search(), function ()
          {
              $location.search({uuid: current});
          });

          if (switched)
          {
              if ($location.hash() != 'team') $location.hash('team');

              setView('team');
          }
      };
         
      /**
       * View setter
       */
      function setView (hash)
      {
          $scope.views = {
              team:   false,
              newTeam:    false,
              newmember:   false
          };

          $scope.views[hash] = true;
      }
      
        /**
         * Selection toggler
         */
        $scope.toggleSelection = function (group, master)
        {
            var flag = (master) ? true : false,
                    members = angular.fromJson(Storage.get(group.uuid));

            angular.forEach(members, function (member, index)
            {
                $scope.selection[member.uuid] = flag;
            });
        };
        

    }
]);
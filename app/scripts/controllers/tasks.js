define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'tasksCtrl', [
        '$rootScope', '$scope', '$location',
        function ($rootScope, $scope, $location)
        {
          $rootScope.fixStyles();

//          var params = $location.search();
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
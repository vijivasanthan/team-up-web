define(['controllers/controllers'], function (controllers)
{
  'use strict';

  controllers.controller(
    'status',
      function ($scope, $rootScope, $q, Slots, Store, data)
      {
        $rootScope.notification.status = false;

        $rootScope.fixStyles();

        var teams = Store('app').get('teams'),
          members = Store('app').get('members'),
          currentMembers = null,
          everyoneId = 'all';

        //Check if members already stored locally in case of slow back end call
        if(! members.length > 0)
        {
          members = [];
          //get all teams members arrays and merge the values to one single array
          members = _.flatten(_.values(data.members));
        }

        members = $rootScope.unique(members);

        teams.unshift({
          'name': $rootScope.ui.dashboard.everyone,
          'uuid': everyoneId
        });

        $scope.groups = teams;

        $scope.states = angular.copy($rootScope.config.app.timeline.config.states);

        $scope.states['no-state'] = {
          className: 'no-state',
          label: $rootScope.ui.dashboard.possiblyReachable,
          color: '#ececec',
          type: $rootScope.ui.dashboard.noPlanning,
          display: false
        };

        $scope.current = {
          group: everyoneId,
          division: everyoneId
        };

        $scope.loadingReachability = true;

        var getMemberSlots = function(id)
        {
          return (id == everyoneId)
            ? Slots.getAllMemberReachabilities(data.teams)
            : Slots.MemberReachabilitiesByTeam(id);
        };

        //TODO resolve the Reachabilities of the member in the routing
        $scope.getReachability = function (groupID)
        {
          var deferred = $q.defer(),
              id = null;

          if (!groupID)
          {
            groupID = $scope.current.group;
          }

          if (groupID == everyoneId)
          {
            currentMembers = members;
          }
          else if (typeof data.members[groupID] != 'undefined')
          {
            currentMembers = $rootScope.unique(data.members[groupID]);
          }

          getMemberSlots(groupID)
            .then(
            function (results)
            {
              var ordered = {};

              _.each(results.members, function (slots, id)
              {
                if (currentMembers[id] &&
                  (currentMembers[id].role != 0 && currentMembers[id].role != 4))
                {
                  var _member = {
                    id: id,
                    state: (slots.length > 0) ? slots[0].state : 'no-state',
                    label: (slots.length > 0) ? $scope.states[slots[0].state].label[0] : '',
                    end: (slots.length > 0 && slots[0].end !== undefined) ?
                    slots[0].end * 1000 :
                      $rootScope.ui.dashboard.possiblyReachable,
                    name: (currentMembers && currentMembers[id]) ?
                    currentMembers[id].firstName + ' ' + currentMembers[id].lastName :
                      id
                  };

                  if (slots.length > 0)
                  {
                    if (!ordered.reachable)
                    {
                      ordered.reachable = [];
                    }

                    if (!ordered.unreachable)
                    {
                      ordered.unreachable = [];
                    }

                    if (slots[0].state == 'com.ask-cs.State.Unavailable')
                    {
                      ordered.unreachable.push(_member);
                    }
                    else
                    {
                      if (slots[0].state == 'com.ask-cs.State.Available')
                      {
                        _member.style = 'sa-icon-reserve-available';
                      }

                      ordered.reachable.push(_member);
                    }
                  }
                  else
                  {
                    if (! ordered.possible)
                    {
                      ordered.possible = [];
                    }

                    ordered.possible.push(_member);
                  }
                }
              });

              $scope.loadingReachability = false;

              var sortByEnd = function (a, b)
              {
                if (a.end < b.end)
                {
                  return -1;
                }

                if (a.end > b.end)
                {
                  return 1;
                }

                return 0;
              };

              if (ordered.hasOwnProperty('reachable'))
              {
                ordered.reachable.sort(sortByEnd);
              }

              if (ordered.hasOwnProperty('unreachable'))
              {
                ordered.unreachable.sort(sortByEnd);
              }

              var _reachables = [];

              _.each(ordered.reachable, function (reachable)
              {
                if (reachable.state == 'com.ask-cs.State.Available')
                {
                  _reachables.push(reachable);
                }
              });

              ordered.reachable = _reachables;

              $scope.reachability = {
                members: ordered,
                synced: results.synced * 1000
              };

              deferred.resolve($scope.reachability);
            },
            function (results)
            {
              deferred.reject(results);
            });

          return deferred.promise;
        };


        $scope.getGroupReachability = function ()
        {
          var deferred = $q.defer();
          $scope.current.division = 'all';
          $scope.loadGroup = $rootScope.ui.dashboard.load;
          $rootScope.statusBar.display('team(s) ' + $rootScope.ui.dashboard.loading);

          $scope.getReachability($scope.current.group, $scope.current.division)
            .then(function (results)
            {
              deferred.resolve(results);

              $scope.loadGroup = '';
              $rootScope.statusBar.off();
            },
            function (results)
            {
              deferred.reject(results);
              $rootScope.statusBar.off();
            });
          return deferred.promise;
        };

        $scope.getGroupReachability();
      }
  );
});
define(['controllers/controllers'], function (controllers)
{
  'use strict';

  controllers.controller(
    'status',
    [
      '$scope',
      '$rootScope',
      '$q',
      '$window',
      '$location',
      'Slots',
      'Teams',
      '$timeout',
      'Store',
      'data',
      function ($scope, $rootScope, $q, $window, $location, Slots, Teams, $timeout, Store, data)
      {
        $rootScope.notification.status = false;

        $rootScope.fixStyles();

        var teams = Store('app').get('teams'),
          members = $rootScope.unique(Store('app').get('members')),
          initGroup;

        teams.unshift({
          'name': $rootScope.ui.dashboard.everyone,
          'uuid': 'all'
        });

        initGroup = 'all';

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
          group: initGroup,
          division: 'all'
        };

        $scope.loadingReachability = true;

        //TODO resolve the Reachabilities of the member in the routing
        $scope.getReachability = function (groupID, divisionID)
        {
          var deferred = $q.defer();

          if (!groupID)
          {
            groupID = $scope.current.group;
          }

          if (!divisionID)
          {
            divisionID = $scope.current.division;
          }


          if (groupID == 'all')
          {
            members = $rootScope.unique(Store('app').get('members'));
          }
          else if (typeof data.members[groupID] != 'undefined')
          {
            members = $rootScope.unique(data.members[groupID]);
          }

          Slots.getAllMemberReachabilities(data.teams)//.users(members)
            .then(
            function (results)
            {
              var ordered = {};

              _.each(results.members, function (slots, id)
              {
                if (members[id] &&
                  (members[id].role != 0 && members[id].role != 4))
                {

                  var _member = {
                    id: id,
                    state: (slots.length > 0) ? slots[0].state : 'no-state',
                    label: (slots.length > 0) ? $scope.states[slots[0].state].label[0] : '',
                    end: (slots.length > 0 && slots[0].end !== undefined) ?
                    slots[0].end * 1000 :
                      $rootScope.ui.dashboard.possiblyReachable,
                    name: (members && members[id]) ?
                    members[id].firstName + ' ' + members[id].lastName :
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

                    if (slots[0].state == 'unreachable')
                    {
                      ordered.unreachable.push(_member);
                    }
                    else
                    {
                      if (slots[0].state == 'reachable')
                      {
                        _member.style = 'sa-icon-reserve-available';
                      }

                      ordered.reachable.push(_member);
                    }
                  }
                  else
                  {
                    if (!ordered.possible)
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
                if (reachable.state == 'reachable')
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
          $rootScope.statusBar.display($scope.current.group);

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

        $scope.getDivisionReachability = function ()
        {
          $scope.getReachability($scope.current.group, $scope.current.division);
        };

        $scope.getGroupReachability();

        $scope.setPrefixedReachability = function (reachability, period)
        {
          Store('environment').save('setPrefixedReachability', {
            reachability: reachability,
            period: period
          });

          $location.path('/planboard').search({setPrefixedReachability: true});
        }
      }
    ]
  );
});
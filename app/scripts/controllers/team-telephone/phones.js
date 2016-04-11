define(['../controllers'], function (controllers)
{
  'use strict';

  controllers.controller(
    'phones',
    function ($scope, $rootScope, $location, TeamUp, $q, Slots, Store, data, Teams, CurrentSelection)
    {
      $rootScope.notification.status = false;
      $rootScope.fixStyles();
      $scope.teams = angular.copy(data.teams);
      $scope.states = angular.copy($rootScope.config.app.timeline.config.states);

      $scope.states['no-state'] = {
        className: 'no-state',
        label: $rootScope.ui.teamup.stateValue.possibly_reachable,
        color: '#ececec',
        type: $rootScope.ui.teamup.stateValue.possibly_reachable,
        display: false
      };

      $scope.currentTeam = CurrentSelection.getTeamId();
      $scope.teamMembers = data.members;
      getReachability(data.membersReachability, setKeyAsUsername(data.members));

      $scope.teams.push({
        name: $rootScope.ui.dashboard.everyone,
        uuid: 'Everyone'
      });

      /**
       * Load the current team(s) including the slots
       */
      $scope.getGroupReachability = function ()
      {
        $scope.loadGroup = $rootScope.ui.dashboard.load;
        $rootScope.statusBar.display('team(s) ' + $rootScope.ui.dashboard.loading);

        if ($scope.currentTeam === 'Everyone')
        {
          fetchAllTeams();
        }
        else
        {
          fetchReachPerTeam();
        }
      };

      function fetchAllTeams()
      {
        var promises = [],
            allMembers = [],
            allReach = {
              members: {}
            };

        _.each(data.teams, function (team)
        {
          var promise = $q.all([
            Teams.getSingle(team.uuid),
            Slots.MemberReachabilitiesByTeam(team.uuid, null)
          ]);
          promises.push(promise);
        });

        $q.all(promises)
          .then(function(results)
          {
            _.each(results, function (result)
            {
              if(result[0] && result[0].length)
              {
                var team = result[0];
                _.each(team, function (member)
                {
                  allMembers[member.uuid] = member;
                });
              }


              if(result[1])
              {
                if(result[1].members)
                {
                  _.each(result[1].members, function (memberData, memberKey)
                  {
                    allReach.members[memberKey] = memberData;
                  });
                }

                allReach.synced = result[1].synced;
              }
            });
            getReachability(allReach, allMembers);
          });
      }

      function fetchReachPerTeam()
      {
        CurrentSelection.local = $scope.currentTeam;

        Teams.getTeamTelephoneOptions($scope.currentTeam)
          .then(function (options)
          {
            var promise = $q.all([
              Teams.getSingle($scope.currentTeam),
              Slots.MemberReachabilitiesByTeam($scope.currentTeam, null)
            ]);

            if (!options.adapterId)
            {
              $rootScope.notifier.error($rootScope.ui.options.teamTelephoneNotActivated);
              promise = $q.reject();
            }
            return promise;
          })
          .then(function (result)
          {
            $scope.teamMembers = result[0];
            getReachability(result[1], setKeyAsUsername($scope.teamMembers));
          });
      }

      /**
       * merge the member reachability data with the personal data of the member
       * @param reachabilityData reachability data
       */
      function getReachability(currentReachability, currentMembers)
      {
        var ordered = {};
        $scope.loadingReachability = true;

        $scope.loadGroup = '';
        $rootScope.statusBar.off();



        _.each(currentReachability.members, function (slots, id)
        {
          //console.log('slots', slots);
          //console.log('id', id);

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

            if (currentMembers && currentMembers[id])
            {
              _member.name = currentMembers[id].firstName + ' ' + currentMembers[id].lastName;
              _member.phone = currentMembers[id].phone;
              _member.states = currentMembers[id].states;
            }
            else
            {
              _member.name = id;
              _member.states = null;
            }

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
              if (!ordered.possible)
              {
                ordered.possible = [];
              }

              ordered.possible.push(_member);
            }
          }
        });

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

        $scope.loadingReachability = false;

        $scope.reachability = {
          members: ordered,
          synced: currentReachability.synced * 1000
        };
      }

      /**
       * Set key as username array of members
       * @param members
       * @returns {Array}
       */
      function setKeyAsUsername(members)
      {
        var newMembers = [];

        _.each(members, function (member)
        {
          newMembers[member.uuid] = member;
        });

        return newMembers;
      }
    }
  );
});
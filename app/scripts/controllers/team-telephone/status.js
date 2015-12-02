define(['../controllers'], function (controllers)
{
  'use strict';

  controllers.controller(
    'status',
      function ($rootScope, $location, TeamUp, $q, Slots, Store, data, Teams, CurrentSelection)
      {
        //rootScope
        $rootScope.notification.status = false;
        $rootScope.fixStyles();

        //viewmodel
        var self = this;

        //properties
        self.teams = data.teams;
        self.states = angular.copy($rootScope.config.app.timeline.config.states);
        self.currentTeam = CurrentSelection.getTeamId();
        self.teamMembers = data.members;

        //methods
        self.getGroupReachability = getGroupReachability;

        //initialisation
        init();

        /**
         * Load the current team(s) including the slots
         */
        function getGroupReachability()
        {
          self.loadGroup = $rootScope.ui.dashboard.load;
          $rootScope.statusBar.display('team(s) ' + $rootScope.ui.dashboard.loading);

          CurrentSelection.local = self.currentTeam;

          TeamUp._('TTOptionsGet', {second: self.currentTeam})
            .then(function (options)
            {
              var promise = $q.all([
                Teams.getSingle(self.currentTeam),
                Slots.MemberReachabilitiesByTeam(self.currentTeam, null)
              ]);

              if (!options.adapterId)
              {
                $location.path('team-telefoon/options');
                promise = $q.reject();
              }
              return promise;
            })
            .then(function (result)
            {
              self.teamMembers = result[0];
              normalizeReachability(result[1], setKeyAsUsername(self.teamMembers));
            });
        }

        /**
         * merge the member reachability data with the personal data of the member
         * @param reachabilityData reachability data
         */
        function normalizeReachability(currentReachability, currentMembers)
        {
          var ordered = {};
          self.loadingReachability = true;

          self.loadGroup = '';
          $rootScope.statusBar.off();

          _.each(currentReachability.members, function (slots, id)
          {
            if (currentMembers[id] &&
              (currentMembers[id].role != 0 && currentMembers[id].role != 4))
            {
              var _member = {
                id: id,
                state: (slots.length > 0) ? slots[0].state : 'no-state',
                label: (slots.length > 0) ? self.states[slots[0].state].label[0] : '',
                end: (slots.length > 0 && slots[0].end !== undefined) ?
                slots[0].end * 1000 :
                  $rootScope.ui.dashboard.possiblyReachable,
                name: (currentMembers && currentMembers[id]) ?
                currentMembers[id].firstName + ' ' + currentMembers[id].lastName :
                  id
              };

              if(currentMembers && currentMembers[id])
              {
                _member.name = currentMembers[id].firstName + ' ' + currentMembers[id].lastName;
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
                if (! ordered.possible)
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

          self.loadingReachability = false;

          self.reachability = {
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
          return _.indexBy(members, 'uuid');
        }

        /**
         * Iitialize a extra state and set the reachability of the members
         */
        function init()
        {
          self.states['no-state'] = {
            className: 'no-state',
            label: $rootScope.ui.teamup.stateValue.possibly_reachable,
            color: '#ececec',
            type: $rootScope.ui.teamup.stateValue.possibly_reachable,
            display: false
          };
          normalizeReachability(data.membersReachability, setKeyAsUsername(data.members));
        }
      }
  );
});
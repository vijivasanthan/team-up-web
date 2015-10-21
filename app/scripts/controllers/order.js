define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'order',
      function ($rootScope, $scope, $location, Teams, TeamUp, data, CurrentSelection, $q)
      {
        $rootScope.fixStyles();

        var tempOrder = [];
        $scope.currentTeam = CurrentSelection.getTeamId();

        $scope.orderTypes = [
          {
          name: $rootScope.ui.order.fixedOrder,
          id: 'FIXED'
          },
          {
            name: $rootScope.ui.order.randomOrder,
            id: 'RANDOM'
          },
          {
            name: $rootScope.ui.order.evenOrder,
            id: 'LONGEST_IDLE'
          }
        ];

        $scope.orderType = data.teamOrder.sortBy;

        showOrder(data.teamOrder.order, data.teamMembers);

        $scope.groups = data.teams;

        //$scope.sortableOptions = {
        //  animation: 150,
        //  scroll:false,
        //  draggable: 'tr'
        //};

        /**
         * Fetch the order of a team,
         * inclusive the personal data per member of the team
         */
        $scope.fetchOrder = function ()
        {
          var groupID = $scope.currentTeam;

          $scope.load = $rootScope.ui.dashboard.load;

          $rootScope.statusBar.display($rootScope.ui.order.loadTeam);

          if (groupID !== '')
          {
            CurrentSelection.local = groupID;

            var teamStatus = TeamUp._('teamStatusQuery', {third: groupID}),
              teamOrder = TeamUp._('callOrderGet', {second: groupID});

            TeamUp._('TTOptionsGet', {second: $scope.currentTeam})
              .then(function (options)
              {
                var promise = $q.all([teamStatus, teamOrder]);
                if (!options.adapterId)
                {
                  $location.path('team-telefoon/options');
                  promise = $q.reject();
                }
                return promise;
              })
              .then(function (teamResult)
              {
                data.teamMembers = teamResult[0];
                var teamOrder = teamResult[1];

                showOrder(teamOrder.order, data.teamMembers);

                $scope.orderType = teamOrder.sortBy;
                $scope.load = '';
                $rootScope.statusBar.off();
              }
            );
          }
        };

        /**
         * Saving the order of team
         */
        $scope.saveOrder = function ()
        {
          var groupID = $scope.currentTeam,
              orderArray = [],
              payload = {};

          $rootScope.statusBar.display($rootScope.ui.teamup.saveTeam);

          payload.sortBy = $scope.orderType;

          _.each(tempOrder, function (member, key)
          {
            orderArray[key] = member.uuid;
          });

          payload.order = orderArray;

          TeamUp._('callOrderSave',
            {second: groupID},
            payload)
            .then(function (teamOrder)
            {
              showOrder(teamOrder.order, data.teamMembers);
              $rootScope.notifier.success($rootScope.ui.order.orderSaved);
              $rootScope.statusBar.off();
            });
        };

        /**
         * Order of the members, combined with their user data
         * @param orderArray the order in which the members are placed
         * @param teamMembers all the personaldata about the members in the current team
         */
        function showOrder(orderArray, teamMembers)
        {
          var members = teamMembers;
          var orderedMembers = [];

          _.each(members, function (member)
          {
            _.each(orderArray, function (uuid, key)
            {

              if (member.uuid === uuid)
              {
                if (member.phone)
                {
                  $rootScope.parsePhoneNumber(member.phone);

                  if ($rootScope.phoneNumberParsed.result === true)
                  {
                    member.phoneE164 = $rootScope.phoneNumberParsed.all.formatting.e164;
                  }
                }

                member.originalPosition = key;
                orderedMembers[key] = member;
              }

            });
          });

          tempOrder = orderedMembers;
          $scope.orderedMembers = orderedMembers;
        };

      }
    );
  }
);
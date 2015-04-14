define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'order',
      function ($rootScope, $scope, $location, Store, Teams, TeamUp, data, CurrentSelection)
      {
        $rootScope.fixStyles();

        var teamsLocal = Teams.queryLocal(),
          view,
          tempOrder = [],
          showOrder = function (orderArray)
          {
            var members = teamsLocal.members[$scope.current.group];
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

        $scope.current = {
          group: CurrentSelection.getTeamId()
        };

        $scope.orderType = data.sortBy;

        showOrder(data.order);

        $scope.groups = teamsLocal.teams;

        $scope.sortableOptions = {
          animation: 150,
          scroll:false,
          draggable: 'tr'
        };

        if (!$location.hash())
        {
          view = 'order';
        }
        else
        {
          view = $location.hash();
        }

        var setView = function (hash)
        {
          $scope.views = {
            order: false
          };

          $scope.views[hash] = true;
        };

        $scope.setViewTo = function (hash)
        {
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

        $scope.getOrder = function ()
        {
          var groupID = $scope.current.group;

          $scope.load = $rootScope.ui.dashboard.load;

          $rootScope.statusBar.display($rootScope.ui.order.loadTeam);

          if (groupID !== '')
          {

            CurrentSelection.local = groupID;

            TeamUp._('callOrderGet', {second: groupID})
              .then(function (result)
              {
                $scope.orderType = result.sortBy;

                showOrder(result.order);
                $scope.load = '';
                $rootScope.statusBar.off();
              });
          }
        };

        $scope.confirmOrder = function ()
        {
          var groupID = $scope.current.group;
          var orderArray = [];
          var payload = {};

          $rootScope.statusBar.display($rootScope.ui.teamup.saveTeam);

          payload.sortBy = $scope.orderType;

          _.each(tempOrder, function (member, key)
          {
            orderArray[key] = member.uuid;
          });

          payload.order = orderArray;

          TeamUp._('callOrderSave',
            {second: groupID}, payload)
            .then
          (
            function (result)
            {
              $rootScope.notifier.success($rootScope.ui.order.orderSaved);
              $rootScope.statusBar.off();
              $scope.orderType = result.sortBy;
              showOrder(result.order);
            }
          );

        };

      }
    );
  }
);
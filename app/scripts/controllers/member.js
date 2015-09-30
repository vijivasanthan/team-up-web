define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'member',
      function ($scope, Team, Member, data)
      {
        var vm = this;

        /**
         * Delete a team member from a single team
         * @param member the info of the member who will be deleted
         */
        vm.delete = function (current, teamId, confirm)
        {
          //Confirmation by deleting a member
          if(! confirm)
          {
            vm.current = current;
            angular.element('#confirmMemberModal').modal('show');
          }
          else
          {
            Member
              .deleteFromSingleTeam(current, teamId, callback)
              .then(function (memberHasRoleTeamMember)
              {
                // Check if the role is team member
                if (memberHasRoleTeamMember)
                {
                  (callback && callback());
                }
              });
          }
        };

        /**
         * Remove the current team from the teams of the user in the interface,
         * because the user with the role of teammember
         * is not permitted to see vm team anymore
         */
        function removeTeamFromView()
        {
          vm.data.currentTeamId = vm.data.teams[0].uuid;
          vm.requestTeam(vm.data.currentTeamId);
        }

        vm.init = function (teamId, membersData)
        {
          if(membersData)
          {
            Member.init(membersData);
            vm.list = Member.getList();
          }
          else
          {
            Team.get(teamId)
              .then(function(members)
              {
                Member.init(members);
                vm.list = Member.getList();
              });
          }
        };

        vm.init(Team.getCurrent(), data);
      }
    );
  }
);

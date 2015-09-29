define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'members',
      function ($scope, Team, Member, data)
      {
        var vm = this;

        /**
         * data.teams : All team names and ids
         * data.members : All members from current team
         * data.currentTeamId : The current team id
         * @type {data|*}
         */
        vm.data = angular.copy(data);
        Member.fillList(data.members);
        vm.data.members = Member.getList();
        vm.data.teams = Team.getList();

        /**
         * Request a team
         * @param current The id of the team
         */
        vm.requestTeam = function (teamId)
        {
          Team.get(teamId)
            .then(function (members)
            {
              Member.fillList(members);
            });
        };

        /**
         * Confirmation by deleting a member
         * @param member All the data from the member who is deleted
         */
        vm.confirmDeleteMember = function (member)
        {
          vm.currentMember = member;
          angular.element('#confirmMemberModal').modal('show');
        };

        /**
         * Delete a team member from a single team
         * @param member the info of the member who will be deleted
         */
        vm.deleteMember = function (member)
        {
          Member
            .deleteFromSingleTeam(member, vm.data.currentTeamId)
            .then(function (memberHasRoleTeamMember)
            {
              // Check if the role is team member
              if (memberHasRoleTeamMember)
              {
                removeTeamFromView();
              }
            });
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
      }
    );
  }
);

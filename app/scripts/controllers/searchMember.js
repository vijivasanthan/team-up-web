define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'searchMember',
      function (Team, Member)
      {
        var self = this;

        self.searchResults = null;
        self.searchValue = "";
        self.searchSubmit = false;
        self.searchTeams = [];

        Team.init();

        self.search = function (value)
        {
          self.findMembersLoad = true;
          Member.search(value)
            .then(function(result)
            {
              self.load = false;
              self.searchResults = result.members;
              self.searchTeams = result.teams;
            });
        };

        /**
         * Confirm to add a member
         * Check if member is already in a team,
         * if that's the case ask if that member needs to leave
         * his current team for the new team
         * @param member the userobject added to the team
         */
        self.confirmAddTeamMember = function (member)
        {
          if (member.teamUuids.length > 0)
          {
            self.selected = member;
            angular.element('#confirmMemberAddModal').modal('show');
          }
          else
          {
            self.addExistingMember(member);
          }
        };
      }
    );
  }
);

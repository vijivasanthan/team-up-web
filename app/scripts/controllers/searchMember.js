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

        self.membersBySearch = null;
        self.memberValue = "";
        self.findMemberSubmit = false;

        self.search = function (value)
        {
          self.findMembersLoad = true;
          Member.search(value)
            .then(function(result)
            {
              self.findMembersLoad = false;
              self.membersBySearch = result.members;
              console.error('result', result);
              console.error('self.membersBySearch', self.membersBySearch);
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
            self.member = member;
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

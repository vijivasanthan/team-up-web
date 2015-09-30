define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'member',
      function ($scope, Team, Member, data)
      {
        var self = this;

        /**
         * Delete a team member from a single team
         * @param member the info of the member who will be deleted
         */
        self.delete = function (current, teamId, confirm)
        {
          //Confirmation by deleting a member
          if(! confirm)
          {
            self.current = current;
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
         * is not permitted to see self team anymore
         */
        function removeTeamFromView()
        {
          self.data.currentTeamId = self.data.teams[0].uuid;
          self.requestTeam(self.data.currentTeamId);
        }

        self.init = function (teamId, membersData)
        {
          if(membersData)
          {
            Member.init(membersData);
            self.list = Member.getList();
          }
          else
          {
            Team.get(teamId)
              .then(function(members)
              {
                Member.init(members);
                self.list = Member.getList();
              });
          }
        };

        self.init(Team.getCurrent(), data);
      }
    );
  }
);

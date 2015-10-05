define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'member',
      function (Team, Member, data)
      {
        var self = this;

        self.create = function (member)
        {
          //create member
        };

        self.read = function (member)
        {
          //read member
        };

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
          //check wat je met de read method op dit moment wil
          self.data.currentTeamId = self.data.teams[0].uuid;
          self.requestTeam(self.data.currentTeamId);
        }

        self.init = function (teamId, membersData, callback)
        {
          (membersData)
            ? initialize(membersData)
            : callback && callback(teamId, initialize);

          function initialize(data)
          {
            Member.init(data);
            self.list = Member.getList();
          }
        };

        self.init(Team.getCurrent(), data);
      }
    );
  }
);

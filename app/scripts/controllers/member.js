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

        /**
         * Delete a team member from a single team
         * @param member the info of the member who will be deleted
         */
        self.delete = function (current, teamId, confirm)
        {
          //Confirmation by deleting a member
          (! confirm)
            ? angular.element('#confirmMemberModal').modal('show')
            : Member.deleteFromSingleTeam(current, teamId);
        };

        /**
         * Initialize a team with members
         * Reinitialize everytime a new team is requested
         * @param teamId The id of the team
         * @param membersData members of the team already initialized
         * @param callback to read the data of a team and send the result of members back
         */
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

define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'members',
      function (Team, Member, data)
      {
        /**
         * data.teams : All team names and ids
         * data.members : All members from current team
         * data.currentTeamId : The current team id
         * @type {data|*}
         */
        this.data = data;

        console.log('this.data', this.data);

        /**
         * Request a team
         * @param current The id of the team
         */
        this.requestTeam = function (teamId)
        {
          Team.get(teamId)
            .then(function (members)
            {
              this.data.members = members;
            }.bind(this));
        };

        /**
         * Confirmation by deleting a member
         * @param member All the data from the member who is deleted
         */
        this.confirmDeleteMember = function (member)
        {
          this.currentMember = member;
          angular.element('#confirmMemberModal').modal('show');
        };

        /**
         * Delete a team member from a single team
         * @param member the info of the member who will be deleted
         */
        this.deleteMember = function (member)
        {
          Member
            .deleteFromSingleTeam(member, this.data.currentTeamId)
            .then(function (result)
            {
              // Check if the role is team member and
              // the deleted member is equal to the logged one
              // memberDeleteResult.loggedUser
              if (result.loggedUser)
              {
                (result.loggedUser.role > 1 &&
                result.loggedUser.teamUuids.length)
                  ? removeTeamFromView.call(this)
                  : removeMemberFromView.call(this, member);
              }
            });
        };

        this.updateTeam = function (teams)
        {
          this.data.teams = teams;
        }.bind(this);

        /**
         * Remove the current team from the teams of the user in the interface,
         * because the user with the role of teammember
         * is not permitted to see this team anymore
         */
        function removeTeamFromView()
        {
          var currentTeam = _.findWhere(this.data.teams, {uuid: this.data.currentTeamId}),
            indexTeam = this.data.teams.indexOf(currentTeam);

          this.data.teams.splice(indexTeam, 1);
          this.data.currentTeamId = this.data.teams[0].uuid;
          this.requestTeam(this.data.currentTeamId);
        }

        /**
         * Remove the deleted member from the current team in the interface
         */
        function removeMemberFromView(member)
        {
          var deletedMember = _.findWhere(this.data.members, {uuid: member.uuid}),
            memberIndex = this.data.members.indexOf(deletedMember);

          this.data.members.splice(memberIndex, 1);
        }
      }
    );
  }
);

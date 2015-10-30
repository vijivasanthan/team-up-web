define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'team',
      function ($interval, Team)
      {
        //view model
        var self = this;
        self.create = create;
        self.read = read;
        self.update = update;
        self.delete = _delete;
        self.sync = sync;
        self.addMember = addMember;
        self.init = init;

        self.init();

        /**
         * Create a team
         * @param teamName The name of the team
         */
        function create(teamName)
        {
          Team.create(teamName);
        }

        /**
         * Get a team by id
         * @param teamId the id of the team
         * @param callback initialize the team and a callback with the members result as parameter
         */
        function read(teamId, callback)
        {
          Team.read(teamId)
            .then(function (members)
            {
              (callback && callback(members));
              self.init(teamId);
            });
        }

        /**
         * Update the team by the id, If the team object is not specified,
         * The edit button is pressed, so the team info is requested
         * @param teamId The id of the team
         * @param team The team object with the name and id
         */
        function update(teamId, team)
        {
          if (!team)
          {
            var selectedTeam = _.findWhere(self.list, {uuid: teamId});
            self.updateForm = true;
            self.editForm = {
              name: selectedTeam.name,
              uuid: selectedTeam.uuid
            };
          }
          else
          {
            Team.update(team)
              .then(function ()
              {
                self.updateForm = false;
              });
          }
        }

        /**
         * Delete a team by id
         * @param teamId The id of the team
         * @param confirm confirmation if the user is sure to delete the team
         * @param callback
         */
        function _delete(teamId, confirm, callback)
        {
          if (!confirm)
          {
            angular.element('#confirmTeamModal').modal('show');
          }
          else
          {
            Team.delete(teamId)
              .then(function (newTeamId)
              {
                (callback && callback(newTeamId));
              });
          }
        }

        /**
         * Syncen team, members and slots from Nedap
         * @param teamId The id of the team
         * @param callback
         */
        function sync(teamId, callback)
        {
          Team.sync(teamId)
            .then(function (sync)
            {
              (callback && callback(sync));
            });
        }

        /**
         * Confirm to add a member
         * Check if member is already in a team,
         * if that's the case ask if that member needs to leave
         * his current team for the new team
         * @param member the userobject added to the team
         * @param teamOption
         * @confirm
         */
        function addMember(member, teamOption, confirm)
        {
          (!confirm
          && member.teamUuids &&
          member.teamUuids.length)
            ? angular.element('#confirmMemberAddModal').modal('show')
            : Team.addMember(member, teamOption);
        }

        //self.loadingWithProgress = function ()
        //{
        //  // Set progress 0;
        //  self.laddaLoadingBar = 0;
        //  // Run in every 30 milliseconds
        //  var interval = $interval(function ()
        //  {
        //    // Increment by 1;
        //    self.laddaLoadingBar++;
        //    if (self.laddaLoadingBar >= 100) {
        //      // Cancel interval if progress is 100
        //      $interval.cancel(interval);
        //      //Set ladda loading false
        //      self.laddaLoadingBar = false;
        //    }
        //  }, 30);
        //};

        /**
         * Initialize the current team and a list of all teams
         * @param teamId
         */
        function init(teamId)
        {
          Team.init(teamId);
          self.list = Team.getList();
          self.current = Team.getCurrent();
        }
      }
    );
  }
);

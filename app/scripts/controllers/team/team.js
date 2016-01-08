define(
  ['../controllers', 'config'],
  function (controllers, config)
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
        self.removeUnwantedChars = removeUnwantedChars;
        self.init = init;

        self.init();

        /**
         * Create a team
         * @param team object {name: example}
         */
        function create(team, confirm)
        {
          if(self.new.$valid)
          {
            var addTeamModal = angular.element('#confirmAddTeamModal');

            if(confirm || !Team.checkNameExist(team))
            {
              addTeamModal.modal('hide');
              Team.create(team);
            }
            else addTeamModal.modal('show');
          }
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
        function update(teamId, team, confirm)
        {
          var selectedTeam = _.findWhere(self.list, {uuid: teamId});
          if (!team)
          {
            self.updateForm = true;
            self.editForm = {
              name: selectedTeam.name,
              uuid: selectedTeam.uuid
            };
          }
          else
          {
            var addTeamModal = angular.element('#confirmAddTeamModal');
            //check if the new teamname already exist, one exception for the current teamname
            if(confirm || selectedTeam.name === team.name || !Team.checkNameExist(team))
            {
              addTeamModal.modal('hide');
              Team.update(team)
                .then(function ()
                {
                  self.updateForm = false;
                });
            }//show confirmation if the teamname already exist, so the user have the choice to add it or not
            else addTeamModal.modal('show');
          }
        }

        /**
         * Remove characters who are unwanted
         * @param formVar the formvariable who is added as param
         * @returns {{hasUnwantedChars: boolean, formVar: String}}
         */
        function removeUnwantedChars(formVar)
        {
          var formCheck = {
            hasUnwantedChars: false,
            formVar: formVar
          };

          if(!_.isEmpty(formVar))
          {
            var regEx = config.app.regularPunction,
              matchesFormVar = (formVar.match(regEx));
            if (!_.isNull(matchesFormVar))
            {
              matchesFormVar = matchesFormVar.join('');
            }
            formCheck.hasUnwantedChars = (formVar !== matchesFormVar);
            formCheck.formVar = matchesFormVar || '';
          }
          return formCheck;
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
              .then(function (data)
              {
                ( callback && callback(data.teamId, data.members) );
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

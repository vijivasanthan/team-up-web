define(
  ['../controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'member',
      function (Team, Member)
      {
        //viewmodel
        var self = this;

        //props
        self.searchResults = null; //The searchresult are by default empty
        self.searchValue = ""; // The value of the search is empty by start
        self.searchSubmit = false; //The submit button on the search field is default false
        self.searchTeams = []; //The teams of the members found by the searched value
        self.roles = Member.getRoles();
        self.list = Member.getList() || [];

        //methods
        self.create = create;
        self.delete = _delete;
        self.checkUserName = checkUserName;
        self.search = search;
        self.init = init;

        /**
         * Create new member if the member data is valid
         * @param member The new member data
         * @param teamId The current selected team
         */
        function create(member, teamId)
        {
          console.error('self.newForm', self.newForm);
          if (self.newForm.$valid)
          {
            Member.resetValidation(self.newForm);
            Member.create(member, teamId);
          }
        }

        /**
         * Delete a team member from a single team
         * @param member the info of the member who will be deleted
         */
        function _delete(current, teamId, confirm)
        {
          //Confirmation by deleting a member
          (!confirm)
            ? angular.element('#confirmMemberModal').modal('show')
            : Member.deleteFromSingleTeam(current, teamId);
        }

        /**
         * Search for a member by his first -and/or lastname
         * @param value
         */
        function search(value)
        {
          self.load = true;
          Member.search(value)
            .then(function (result)
            {
              self.load = false;
              self.searchResults = result.members;
              self.searchTeams = result.teams;
            });
        }

        /**
         * Check if the username is correct, otherwise remove the unwanted chars
         */
        function checkUserName()
        {
          if(!_.isEmpty(self.form.userName))
          {
            var regUserName = /([A-Za-z0-9-_])/g,
              matchesUserName = (self.form.userName.match(regUserName));
            if (!_.isNull(matchesUserName))
            {
              matchesUserName = matchesUserName.join('');
            }
            self.UserNameWrong = (self.form.userName !== matchesUserName);
            self.form.userName = matchesUserName || '';
          }
        }

        /**
         * Initialize a team with members
         * Reinitialize everytime a new team is requested
         * @param teamId The id of the team
         * @param membersData members of the team already initialized
         * @param callback to read the data of a team and send the result of members back
         */
        function init(teamId, membersData, callback)
        {
          (membersData)
            ? initialize(membersData)
            : callback && callback(teamId, initialize);

          function initialize(data)
          {
            Member.init(data);
            self.list = Member.getList();
          }
        }
      }
    );
  }
);

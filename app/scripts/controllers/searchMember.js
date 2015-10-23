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
        self.searchResults = null; //The searchresult are by default empty
        self.searchValue = ""; // The value of the search is empty by start
        self.searchSubmit = false; //The submit button on the search field is default false
        self.searchTeams = []; //The teams of the members found by the searched value
        self.search = search;

        Team.init();//initialize the team service, so there is a current team and a list of teams

        /**
         * Search for a member by his first -and/or lastname
         * @param value
         */
        function search(value)
        {
          self.findMembersLoad = true;
          Member.search(value)
            .then(function (result)
            {
              self.load = false;
              self.searchResults = result.members;
              self.searchTeams = result.teams;
            });
        }
      }
    );
  }
);

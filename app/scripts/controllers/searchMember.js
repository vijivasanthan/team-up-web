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

        this.search = function (value)
        {
          self.findMembersLoad = true;
          Member.search(value)
            .then(function(result)
            {
              self.findMembersLoad = false;
              self.membersBySearch = result.members;
              console.error('self.membersBySearch', self.membersBySearch);
            });
        };
      }
    );
  }
);

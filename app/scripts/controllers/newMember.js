define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'newMember',
      function (Team, Member)
      {
        var self = this;
        self.roles = Member.getRoles();

        /**
         * Create new member if the member data is valid
         * @param member The new member data
         * @param teamId The current selected team
         */
        self.create = function(member, teamId)
        {
          if(Member.valid(member))
          {
            Member.create(member, teamId);
          }
        };

        /**
         * Check if the username is correct, otherwise remove the unwanted chars
         */
        self.checkUserName = function ()
        {
          var regUserName = /([A-Za-z0-9-_])/g,
            matchesUserName = (self.form.userName.match(regUserName));

          if (!_.isNull(matchesUserName))
          {
            matchesUserName = matchesUserName.join('');
          }

          self.UserNameWrong = (self.form.userName !== matchesUserName);
          self.form.userName = matchesUserName || '';
        };
      }
    );
  }
);

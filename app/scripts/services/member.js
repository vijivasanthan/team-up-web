define(['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory('Member',
      function ($rootScope,
                $q,
                TeamUp,
                Team,
                Permission,
                Store)
      {
        // constructor \\
        var memberService = function ()
        {
        };

        // public methods \\
        (function ()
        {
          /**
           * Fill the empty array list with
           * the current members of the team
           */
          this.fillList = function (list)
          {
            var self = this;
            //splice every object from the list,
            // so the reference will nog be lost
            if (self.list.length)
            {
              _.each(self.list, function ()
              {
                self.list.splice((self.list.length - 1), 1);
              });
            }
            //add the new members to the list
            _.each(list, function (member)
            {
              self.list.push(member);
            });
          },
          /**
           * Get the current list of mem
           */
            this.getList = function ()
            {
              return this.list;
            };
          /**
           * Remove the deleted member from the current team in the interface
           */
          this.removeFromList = function (member)
          {
            var index = _.findIndex(this.list, {uuid: member.uuid});

            if (index >= 0)
            {
              this.list.splice(index, 1);
            }
          };
          /**
           * Delete member from team
           * @param member All the data from the member who is deleted
           * @param
           */
          this.deleteFromSingleTeam = function (member, teamId)
          {
            var memberId = angular.lowercase(member.uuid),
              self = this,
              deferred = $q.defer();

            angular.element('#confirmMemberModal').modal('hide');
            $rootScope.statusBar.display($rootScope.ui.teamup.deletingMember);

            TeamUp._(
              'teamMemberDelete',
              {second: teamId},
              {ids: [memberId]}
            )
              .then(function ()
              {
                var loggedUser = (memberId === $rootScope.app.resources.uuid);
                if (memberId === $rootScope.app.resources.uuid)
                {
                  //update localTeams and return if there is
                  self.updateLocalTeams(memberId, teamId);

                  //Check if the user is a teammember, otherwise the team
                  //needs to be removed, because there is no permission anymore to read
                  ($rootScope.app.resources.role > 1 &&
                  $rootScope.app.resources.teamUuids.length)
                    ? Team.removeFromList(teamId)//update the the list of teams in the view
                    : self.removeFromList(member);
                }
                else
                {
                  self.removeFromList(member);
                }

                deferred.resolve((loggedUser && $rootScope.app.resources.teamUuids.length)
                  && member.role > 1);

                $rootScope.statusBar.off();
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
              });
            return deferred.promise;
          },
          /**
           * Check if the removed member is the logged user
           * Update his local resources
           * @param memberId
           * return true of false if the deleted user was the logged one,
           * has atleast one team and is a team member
           */
            this.updateLocalTeams = function (memberId, teamId)
            {
              //update local resources by removing the current team
              $rootScope.app.resources.teamUuids.splice(
                $rootScope.app.resources.teamUuids.indexOf(teamId),
                1
              );
              Store('get').save('resources', $rootScope.app.resources);

              //if the removed team was the logged user his last team, he or she needs to get
              //their accesslist updated, permission is limited without a team
              if ($rootScope.app.resources.teamUuids.length === 0)
              {
                Permission.getAccess();
              }
            },
            this.init = function (members)
            {
              this.list = [];
              this.fillList(members);
            };
        }).call(memberService.prototype);

        return new memberService();
      });
  });
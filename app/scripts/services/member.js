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
          /**
           * Initializing the team service
           */
        };

        // public methods \\
        (function ()
        {
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
                deferred.resolve({
                  loggedUser: self.updateLocalTeams(memberId, teamId)
                });
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
              var user = false;

              //Check if the member is equal to the the logged user
              if (memberId === $rootScope.app.resources.uuid)
              {
                //update local resources by removing the current team
                $rootScope.app.resources.teamUuids.splice(
                  $rootScope.app.resources.teamUuids.indexOf(teamId),
                  1
                );
                Store('get').save('resources', $rootScope.app.resources);

                user = $rootScope.app.resources;

                //if the removed team was the logged user his last team, he or she needs to get
                //their accesslist updated, permission is limited without a team
                if ($rootScope.app.resources.teamUuids.length === 0)
                {
                  user = false;
                  Permission.getAccess();
                }
              }
              return user;
            }
        }).call(memberService.prototype);


        // private methods \\


        return new memberService();
      });
  });
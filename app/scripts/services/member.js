define(['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory('Member',
      function ($rootScope,
                $location,
                $q,
                TeamUp,
                Team,
                Teams,
                Permission,
                Store,
                MD5)
      {
        // constructor \\
        var memberService = function ()
        {
        };

        // public methods \\
        (function ()
        {
          /**
           * Create a new member
           * @param member the new member data
           * @param teamId The team were to add the new member
           */
          this.create = function (member, teamId)
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.savingMember);
            var roles = this.getRoles();
            member.role = member.role || (roles[0]).id;


            var memberResources = angular.copy(member);
            memberResources.phone = $rootScope.phoneNumberParsed.format;
            memberResources.team = teamId;
            memberResources.password = MD5(memberResources.password);
            memberResources.teamUuids = [teamId];

            Teams.addMember(memberResources)
              .then(function ()
              {
                $rootScope.resetPhoneNumberChecker();
                $location.path('team/members');
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();
              });
          };

          /**
           * Fill the empty array list with
           * the current members of the team
           */
          this.fillList = function (list)
          {
            this.list = list.slice();
          };

          /**
           * Set the current list of members
           * @param list
           */
          this.setList = function (list)
          {
            this.list = list;
          };

          /**
           * Get the current list of members
           */
          this.getList = function ()
          {
            return this.list;
          };

          /**
           * Get current roles
           * @returns {*} What roles return depends on logged
           * user role
           */
          this.getRoles = function ()
          {
            var roles = config.app.roles;
            roles[0].label = $rootScope.ui.teamup.coordinator;
            roles[1].label = $rootScope.ui.teamup.teamMember;

            return ($rootScope.app.resources.role > 1)
              ? [roles[1]]
              : roles;
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
            ).then(function ()
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
                  : self.removeFromList(member);//remove team from list and update current team
              }
              else
              {
                self.removeFromList(member);
              }

              deferred.resolve(true);

              $rootScope.statusBar.off();
              $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
            });
            return deferred.promise;
          };

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
            };

            /**
             * Add member validation
             * @param member All the data of the added member
             * @returns {boolean} valid true of false
             */
            this.valid = function (member)
            {
              if (typeof member == 'undefined' || !member.userName || !member.password || !member.reTypePassword)
              {
                $rootScope.notifier.error($rootScope.ui.teamup.accountInfoFill);
                return false;
              }

              if (!member.role && $rootScope.app.resources.role == 1)
              {
                $rootScope.notifier.error($rootScope.ui.validation.role);
                return false;
              }

              if (member.password != member.reTypePassword)
              {
                $rootScope.notifier.error($rootScope.ui.teamup.passNotSame);
                return false;
              }

              if (member.password.length < 8 || member.password.length > 20)
              {
                $rootScope.notifier.error($rootScope.ui.validation.password.required + ' ' + $rootScope.ui.validation.password.amountMinChars(8));
                return false;
              }

              if (_.isUndefined(member.email) || member.email == false)
              {
                $rootScope.notifier.error($rootScope.ui.validation.email.notValid);
                return false;
              }

              if (!member.phone)
              {
                $rootScope.notifier.error($rootScope.ui.validation.phone.notValid);
                return false;
              }

              if ($rootScope.phoneNumberParsed.result == false)
              {
                $rootScope.notifier.error($rootScope.ui.validation.phone.notValid);
                return false;
              }
              return true;
            };

          this.search = function (name)
          {
            var deferred = $q.defer();

            if (_.isEmpty(name))
            {
              $rootScope.notifier.error($rootScope.ui.validation.search.notValid);
              deferred.reject($rootScope.ui.validation.search.notValid);
            }
            else
            {
              $rootScope.statusBar.display($rootScope.ui.teamup.loadMembersByName);
              TeamUp._('findMembers', { query: name })
                .then(function(members)
                {
                  deferred.resolve(members);
                  $rootScope.statusBar.off();
                }
              );
            }

            return deferred.promise;
          };

          /**
           * Initialize member list
           * @param members
           */
            this.init = function (members)
            {
              this.setList(members);
            };

        }).call(memberService.prototype);

        return new memberService();
      });
  });
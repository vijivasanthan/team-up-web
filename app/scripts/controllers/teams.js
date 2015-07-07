define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'teamCtrl',
      function ($rootScope, $scope, $location, Teams, data, $route, $routeParams, Store, Dater,
                TeamUp, $timeout, MD5, Profile, CurrentSelection, Permission)
      {
        $rootScope.fixStyles();

        $scope.data = {
          teams: data.teams,
          members: checkLocationMembers(data.members)
        };
        $scope.current = data.teamId;
        $scope.isLoggedUserTeam = ($rootScope.app.resources.teamUuids.indexOf($scope.current) >= 0);
        $location.search({ uuid: $scope.current }).hash($location.hash() || 'team');
        setView($location.hash());

        /**
         * set view of the different tabs
         * @param hash
         */
        $scope.setViewTo = function (hash)
        {
          $location.hash(hash);
          setView(hash);
        };

        /**
         * request a team
         * @param current The id of the team
         */
        $scope.requestTeam = function (current)
        {
          $scope.views.editTeam = false;
          CurrentSelection.local = current;

          loadCurrentTeam(current);

          $location.search({uuid: current});
        };

        /**
         * Edit the name of a team
         * @param current
         */
        $scope.editTeam = function (current)
        {
          var team = _.findWhere($scope.data.teams, {uuid: current});

          $scope.teamEditForm = {
            name: team.name,
            uuid: team.uuid
          };

          $scope.views.editTeam = true;
        };

        /**
         * Update the name of a team
         * @param team teamname and uuid
         */
        $scope.changeTeam = function (team)
        {
          if (! team.name.length)
          {
            $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
            return;
          }

          $rootScope.statusBar.display($rootScope.ui.teamup.saveTeam);

          TeamUp._('teamUpdate', { second: team.uuid }, team)
            .then(function (result)
            {
              return result.error && result || Teams.getAll();
            })
            .then(function(teams)
            {
              if(! teams.error)
              {
                $scope.data.teams = teams;
                $scope.views.editTeam = false;

                $rootScope.statusBar.off();
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
              }
            });
        };

        /**
         * Add a new team
         * @param team teamname
         */
        $scope.teamSubmit = function (team)
        {
          if (! _.isUndefined(team))
          {
            $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
            return;
          }
          $rootScope.statusBar.display($rootScope.ui.teamup.saveTeam);

          TeamUp._('teamAdd', {id: $rootScope.app.resources.uuid}, team)
            .then(function (newTeam)
            {
              if (newTeam.error)
              {
                return newTeam;
              }
              else
              {
                if (angular.isDefined($scope.teamForm))
                {
                  $scope.teamForm = null;
                }
                $scope.current = newTeam.uuid;

                return Teams.getAll();
              }
            })
            .then(function(teams)
            {
              if (! teams.error)
              {
                $scope.data.teams = teams;
                $scope.data.members = null;

                CurrentSelection.local = $scope.current;

                $location.search({ uuid: $scope.current });
                $scope.setViewTo('team');
                $rootScope.statusBar.off();
              }
            });
        };

        /**
         * Add a member to a team
         * All the data from the newly added member
         * @param member
         */
        $scope.memberSubmit = function (member)
        {
          member.team = $scope.current;

          if(! addMemberValidation(member))
          {
            return;
          }

          $rootScope.statusBar.display($rootScope.ui.teamup.savingMember);

          member.phone = $rootScope.phoneNumberParsed.format;

          var tempResources = angular.copy(member);
          tempResources.password = MD5(tempResources.password);
          tempResources.teamUuids = [$scope.current];

          Teams.addMember(tempResources)
            .then(function(newMember)
            {
              return newMember.error && newMember || Profile.fetchUserData(newMember.uuid);
            })
            .then(function(currentMemberData)
            {
              if(! currentMemberData.error)
              {
                $scope.data.members.push(currentMemberData);

                if (angular.isDefined($scope.teamMemberForm))
                {
                  $rootScope.resetPhoneNumberChecker();
                  $scope.memberForm = null;
                  $scope.teamMemberForm.$setPristine();
                }

                $scope.setViewTo('team');
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();
              }
            });
        };

        /**
         * Add already existing member to a team
         * @param member All the member data like uuid, name etc
         */
        $scope.addExistingMember = function (member)
        {
          $rootScope.statusBar.display($rootScope.ui.teamup.savingMember);

          TeamUp._(
            'teamMemberAdd',
            {second: $scope.current},
            {ids: [member.uuid]}
          )
          .then(function(result)
          {
            if (result.error)
            {
              return result;
            }
            else
            {
              $scope.result = result;
              if (angular.isDefined($scope.membersBySearch))
              {
                $scope.membersBySearch = null;
                $scope.memberValue = '';
              }
              return Profile.fetchUserData(member.uuid);
            }
          })
          .then(function(currentMember)
          {
            if(! currentMember.error)
            {
              $scope.data.members.push(currentMember);
              $scope.data.members = checkLocationMembers($scope.data.members);
              $scope.isLoggedUserTeam = ($rootScope.app.resources.teamUuids.indexOf($scope.current) >= 0);

              $scope.setViewTo('team');
              $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
              $rootScope.statusBar.off();
            }
          });
        };

        /**
         * Load all teams
         */
        $scope.loadTeams = function ()
        {
          Teams.getAll().then(
            function (teams)
            {
              if (! teams.error)
              {
                $scope.data.teams = teams;
                $scope.setViewTo('team');
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();
              }
            }
          );
        };

        // give a special flag to member if there is no states being shared
        $scope.noSharedStates = function (states)
        {
          var flag = true,
            result = true;

          angular.forEach(
            states,
            function (state)
            {
              if (state.share && flag)
              {
                result = false;
                flag = false;
              }
            }
          );

          return result;
        };

        /**
         * Confirmation before the deleting the team
         */
        $scope.confirmDeleteTeam = function ()
        {
          $timeout(
            function ()
            {
              angular.element('#confirmTeamModal').modal('show');
            }
          );
        };

        /**
         * Delete a team
         */
        $scope.deleteTeam = function ()
        {
          angular.element('#confirmTeamModal').modal('hide');
          $rootScope.statusBar.display($rootScope.ui.teamup.deletingTeam);

          TeamUp._('teamDelete', {second: $scope.current} )
            .then(function (teamDelete)
            {
              return teamDelete.error && teamDelete || Teams.getAll();
            })
            .then(function(teams)
            {
              if(! teams.error)
              {
                $scope.data.teams = teams;
                $scope.requestTeam(teams[0].uuid);
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();
              }
            });
        };

        /**
         * Confirmation by deleting a member
         * @param member All the data from the member who is deleted
         */
        $scope.confirmDeleteMember = function (member)
        {
          $scope.currentMember = null;

          $timeout(
            function ()
            {
              $scope.currentMember = member;

              angular.element('#confirmMemberModal').modal('show');
            }
          );
        };

        /**
         * Delete member from team
         * @param member All the data from the member who is deleted
         */
        $scope.deleteMember = function (member, callBack)
        {
          var memberId = angular.lowercase(member.uuid);

          angular.element('#confirmMemberModal').modal('hide');
          $rootScope.statusBar.display($rootScope.ui.teamup.deletingMember);

          TeamUp._(
            'teamMemberDelete',
            {second: $scope.current},
            {ids: [memberId]}
          ).then(function(memberDelete)
          {
            //callback
            if(! memberDelete.error)
            {
              removedLoggedMember(memberId);

              //Check if the role is team lid and the deleted member is equal to the logged one
              //remove current team from all teams
              if($rootScope.app.resources.role > 1
                && memberId === $rootScope.app.resources.uuid)
              {
                var currentTeam = _.findWhere($scope.data.teams, { uuid: $scope.current }),
                    indexTeam = $scope.data.teams.indexOf(currentTeam);
                $scope.data.teams.splice(indexTeam, 1);
                $scope.current = $scope.data.teams[0].uuid;
                $scope.requestTeam($scope.current);
              }
              else
              {
                var deletedMember = _.findWhere($scope.data.members, {uuid: memberId}),
                  memberIndex = $scope.data.members.indexOf(deletedMember);

                $scope.data.members.splice(memberIndex, 1);
                $rootScope.statusBar.off();
              }
              $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
            }
          });
        };

        /**
         * Check if the username is correct, otherwise remove the unwanted chars
         */
        $scope.checkUserName = function ()
        {
          var regUserName = /([A-Za-z0-9-_])/g,
            matchesUserName = ($scope.memberForm.userName.match(regUserName));

          if (!_.isNull(matchesUserName))
          {
            matchesUserName = matchesUserName.join('');
          }

          $scope.UserNameWrong = ($scope.memberForm.userName !== matchesUserName);
          $scope.memberForm.userName = matchesUserName || '';

        };

        /**
         * Search member by first and/or lastname
         * @param name the search parameter
         */
        $scope.searchMember = function (name)
        {
          if (_.isEmpty(name))
          {
            $rootScope.notifier.error($rootScope.ui.validation.search.notValid);
            return false;
          }
          else
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.loadMembersByName);
            $scope.findMembersLoad = true;

            TeamUp._('findMembers', { query: name })
              .then(function(result)
              {
                if (! result.error)
                {
                  $scope.membersBySearch = result.members;

                  if ($scope.membersBySearch && result.teams)
                  {
                    result.teams = ($rootScope.app.resources.role == 1)
                      ? Store('app').get('teams')
                      : _.union(result.teams, Store('app').get('teams'));

                    Store('app').save('searchMembersTeams', result.teams);
                  }

                  $rootScope.statusBar.off();
                  $scope.findMembersLoad = false;
                }
              }
            );
          }
        };

        /**
         * Confirm to add a member
         * Check if member is already in a team,
         * if that's the case ask if that member needs to leave
         * his current team for the new team
         * @param member the userobject added to the team
         */
        $scope.confirmAddTeamMember = function (member)
        {
          if (member.teamUuids.length > 0)
          {
            $scope.member = member;
            $timeout(
              function ()
              {
                angular.element('#confirmMemberAddModal').modal('show');
              }
            );
          }
          else
          {
            $scope.addExistingMember(member);
          }
        };

        /**
         * changeMemberTeamOption 1: Removes member from all his teams before adding to the current selected team
         * changeMemberTeamOption 2: Add member to the current selected team
         * @param member the userobject
         * @param changeMemberTeamOption could be 1 or 2 replace or add
         */
        $scope.changeMemberTeam = function (member, changeMemberTeamOption)
        {
          angular.element('#confirmMemberAddModal').modal('hide');
          $rootScope.statusBar.display($rootScope.ui.teamup.savingMember);

          if (changeMemberTeamOption == 1)
          {
            Teams.removeAll(member)
              .then(function(result)
              {
                if (! result.error)
                {
                  member.teamUuids = [];
                  $scope.addExistingMember(member);
                }
              }
            );
          }
          else
          {
            $scope.addExistingMember(member);
          }
        };

        /**
         * Check if the removed member is the logged user
         * Update his local resources
         * @param memberId
         */
        function removedLoggedMember(memberId)
        {
          //Check if the member is equal to the the logged user
          if(memberId == $rootScope.app.resources.uuid)
          {
            //update local resources by removing the current team
            $rootScope.app.resources.teamUuids.splice(
              $rootScope.app.resources.teamUuids.indexOf($scope.current),
              1
            );
            Store('get').save('resources', $rootScope.app.resources);

            //if the removed team was the logged user his last team, he or she needs to get
            //their accesslist updated
            if($rootScope.app.resources.teamUuids.length == 0)
            {
              Permission.getAccess();
            }
            else
            {
              $scope.isLoggedUserTeam = ($rootScope.app.resources.teamUuids.indexOf($scope.current) >= 0);
            }
          }
        }

        /**
         * Add member validation
         * @param member All the data of the added member
         * @returns {boolean} valid true of false
         */
        function addMemberValidation(member)
        {
          var valid = true;

          if (typeof member == 'undefined' || !member.userName || !member.password || !member.reTypePassword)
          {
            $rootScope.notifier.error($rootScope.ui.teamup.accountInfoFill);
            valid = false;
          }

          if (!member.role)
          {
            $rootScope.notifier.error($rootScope.ui.validation.role);
            valid = false;
          }

          if (member.password != member.reTypePassword)
          {
            $rootScope.notifier.error($rootScope.ui.teamup.passNotSame);
            valid = false;
          }

          if (member.password.length < 8 || member.password.length > 20)
          {
            $rootScope.notifier.error($rootScope.ui.validation.password.required + ' ' + $rootScope.ui.validation.password.amountMinChars(8));
            valid = false;
          }

          if (_.isUndefined(member.email) || member.email == false)
          {
            $rootScope.notifier.error($rootScope.ui.validation.email.notValid);
            valid = false;
          }

          if (!member.team)
          {
            $rootScope.notifier.error($rootScope.ui.teamup.selectTeam);
            valid = false;
          }

          if (!member.phone)
          {
            $rootScope.notifier.error($rootScope.ui.validation.phone.notValid);
            valid = false;
          }

          if ($rootScope.phoneNumberParsed.result == false)
          {
            $rootScope.notifier.error($rootScope.ui.validation.phone.notValid);
            valid = false;
          }
          return valid;
        }

        /**
         * Load a team by teamId
         * @param teamId The id of the team
         */
        function loadCurrentTeam(teamId)
        {
          $rootScope.statusBar.display($rootScope.ui.login.loading_Members);
          $scope.isLoggedUserTeam = ($rootScope.app.resources.teamUuids.indexOf(teamId) >= 0);

          Teams.getSingle(teamId)
            .then(function(members)
            {
              if(! members.error)
              {
                $scope.data.members = checkLocationMembers(members);
                $rootScope.statusBar.off();
              }
            });
        }

        /**
         * Check the status location of the member,
         * because of no location found
         * @param members All the members of the current team
         * @returns {*} All members of the current team, with there location status checked
         */
        function checkLocationMembers(members)
        {
          angular.forEach(
            members,
            function (member)
            {
              angular.forEach(
                member.states,
                function (state, i)
                {
                  if (state.name == 'Location')
                  {
                    state.value_rscoded = 'loading address';
                    if (state.value && member.address && member.address.street)
                    {
                      var coordinates = state.value.split(','),
                        latitude = parseFloat(coordinates[0]),
                        longitude = parseFloat(coordinates[1]);
                    }
                    else
                    {
                      //remove state location if there is no address available on the given coordinates
                      member.states.splice(i, 1);
                    }
                  }
                }
              );
            }
          );

          return members;
        }

        /**
         * set wich view has to be openend
         * @param hash the name of one of the tabs
         */
        function setView(hash)
        {
          $scope.views = {
            team: false,
            newTeam: false,
            newMember: false,
            editTeam: false
          };

          switch (hash)
          {
            case "newMember":
              if (angular.isDefined($scope.membersBySearch))
              {
                $scope.membersBySearch = null;
                $scope.memberValue = "";
                $scope.findMemberSubmit = false;
              }
              $rootScope.resetPhoneNumberChecker();
              $scope.userType = 'NEW';
              setRoles();
              break;
            default:
          }

          $scope.views[hash] = true;
        }

        /**
         * Set the different roles,
         * depending on the role of the logged user
         */
        function setRoles()
        {
          $scope.roles = [{
            id: '2',
            label: 'team lid'
          }];

          if($rootScope.app.resources.role == 1)
          {
            $scope.roles.push({
              id: '1',
              label: 'coordinator'
            });
          }
        }
      }
    );
  }
);

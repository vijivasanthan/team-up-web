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

        //TODO get this from a service
        $rootScope.resetPhoneNumberChecker();

        $scope.data = data;

        var params = $location.search();

        //$scope.search = {query: ''};

        $scope.roles = [];

        if($rootScope.app.resources.role == 1)
        {
          $scope.roles.push({
              id: '1',
              label: 'coordinator'
          });
        }

        $scope.roles.push({
          id: '2',
          label: 'team lid'
        });

        // TODO: Readable variable name!
        $scope.mfuncs = config.app.mfunctions;

        var setView = function (hash)
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
              break;
            default:
          }

          $scope.views[hash] = true;
        };

        var setTeamView = function (id)
        {
          TeamUp._('teamStatusQuery', {third: id})
            .then(function(members)
            {
              $scope.data.members = members;

              angular.forEach(
                $scope.data.members,
                function (member)
                {
                  //check if the state of the logged user is equal
                  $rootScope.checkUpdatedStatesLoggedUser(member);

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
            });
        };

        var uuid,
          view;

        if (!params.uuid && !$location.hash())
        {
          uuid = CurrentSelection.getTeamId();
          view = 'team';

          $location.search({uuid: data.teams[0].uuid}).hash('team');
        }
        else if (!params.uuid)
        {
          uuid = CurrentSelection.getTeamId();
          view = $location.hash();

          $location.search({uuid: uuid});
        }
        else
        {
          uuid = params.uuid;
          view = $location.hash();
        }

        $scope.current = uuid;
        setView(view);
        setTeamView(uuid);

        //set default team by last visited team
        $scope.memberForm = {};
        $scope.memberForm.team = uuid;
        //$scope.memberForm.pincode = '';

        /**
         * The type of user added to the team, existing or new
         * @param userType
         */
        $scope.setUserType = function (userType)
        {
          $scope.userType = userType;
        };

        $scope.setUserType('NEW');

        $scope.setViewTo = function (hash)
        {
          $scope.$watch(
            hash,
            function ()
            {
              $location.hash(hash);

              setView(hash);
            }
          );
        };

        $scope.requestTeam = function (current)
        {
          $scope.views.editTeam = false;
          CurrentSelection.local = current;

          setTeamView(current);

          $scope.$watch(
            $location.search(),
            function ()
            {
              $location.search({uuid: current});
            }
          );
        };

        $scope.editTeam = function (current)
        {
          var team = _.findWhere(data.teams, {uuid: current});

          $scope.teamEditForm = {
            name: team.name,
            uuid: team.uuid
          };

          $scope.views.editTeam = true;
        };

        $scope.cancelTeamEdit = function ()
        {
          $scope.views.editTeam = false;
        };

        $scope.changeTeam = function (team)
        {
          if ($.trim(team.name) == '')
          {
            $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);

            return;
          }

          $rootScope.statusBar.display($rootScope.ui.teamup.saveTeam);

          TeamUp._(
            'teamUpdate',
            {second: team.uuid},
            team
          ).then(
            function (result)
            {
              if (result.error)
              {
                $rootScope.notifier.error('Error with saving team info : ' + result.error);
              }
              else
              {
                $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                Teams.query(false, result)
                  .then(
                  function ()
                  {
                    $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                    $rootScope.statusBar.off();

                    $scope.team.name = team.name;
                    $scope.views.editTeam = false;
                  }
                );
              }
            }
          );
        };

        $scope.teamSubmit = function (team)
        {
          if (typeof team == 'undefined' || $.trim(team.name) == '')
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
                $rootScope.notifier.error($rootScope.ui.teamup.teamSubmitError);
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
              if (teams.error)
              {
                $rootScope.notifier.error($rootScope.ui.teamup.queryTeamError);
                //errorCode5
                console.warn('fetching teams error ->', teams.errorMessage);
              }
              else
              {
                $scope.data.teams = teams;
                $scope.data.members = null;

                //add team link with clientgroup local
                Store('app').save('teamGroup_' + $scope.current, {});
                CurrentSelection.local = $scope.current;

                $location.search({ uuid: $scope.current });
                $scope.setViewTo('team');
              }

              $rootScope.statusBar.off();
            });
        };

        //$scope.changePinToPhone = function ()
        //{
        //  var phone = $scope.memberForm.phone,
        //    phoneValidateResult = $rootScope.phoneNumberParsed.result;
        //
        //  $scope.tempPhone = $scope.tempPhone || '';
        //
        //
        //  if (phone && phone.length >= 10 && (_.isEmpty($scope.memberForm.pincode) ||
        //    $scope.memberForm.pincode == $scope.tempPhone)
        //    && phoneValidateResult == true)
        //  {
        //    var inputVal = angular.element('.inputPhoneNumber').val();
        //
        //    $scope.tempPhone = lastFourDigits(inputVal);
        //    $scope.memberForm.pincode = lastFourDigits(inputVal);
        //  }
        //};

        var lastFourDigits = function (phone)
        {
          return phone.substr(phone.length - 4);
        };

        $scope.memberSubmit = function (member)
        {
          if (typeof member == 'undefined' || !member.userName || !member.password || !member.reTypePassword)
          {
            $rootScope.notifier.error($rootScope.ui.teamup.accountInfoFill);
            return;
          }

          if (!member.role)
          {
            $rootScope.notifier.error($rootScope.ui.validation.role);
            return;
          }

          //if (!_.isEmpty(member.pincode) && $rootScope.pincodeExistsValidation == false)
          //{
          //  $rootScope.notifier.error($rootScope.ui.validation.pincode.exists);
          //  return false;
          //}

          if (member.password != member.reTypePassword)
          {
            $rootScope.notifier.error($rootScope.ui.teamup.passNotSame);
            return;
          }

          if (member.password.length < 8 || member.password.length > 20)
          {
            $rootScope.notifier.error($rootScope.ui.validation.password.required + ' ' + $rootScope.ui.validation.password.amountMinChars(8));
          }

          if (_.isUndefined(member.email) || member.email == false)
          {
            $rootScope.notifier.error($rootScope.ui.validation.email.notValid);
            return;
          }

          if (!member.team)
          {
            $rootScope.notifier.error($rootScope.ui.teamup.selectTeam);
            return;
          }

          if (!member.phone)
          {
            $rootScope.notifier.error($rootScope.ui.validation.phone.notValid);
            return;
          }

          if ($rootScope.phoneNumberParsed.result == false)
          {
            $rootScope.notifier.error($rootScope.ui.validation.phone.notValid);
            return;
          }
          else if ($rootScope.phoneNumberParsed.result == true)
          {
            member.phone = $rootScope.phoneNumberParsed.format;
          }

          $rootScope.statusBar.display($rootScope.ui.teamup.savingMember);

          //create a temp so the user don't see that the field changing
          var tempResources = angular.copy(member);
          //var pincode = tempResources.pincode;
          //delete tempResources.pincode;

          tempResources.password = MD5(tempResources.password);

          TeamUp._(
            'memberAdd',
            null,
            {
              uuid: tempResources.userName,
              userName: tempResources.userName,
              passwordHash: tempResources.password,
              firstName: tempResources.firstName,
              lastName: tempResources.lastName,
              phone: tempResources.phone,
              email: tempResources.email,
              teamUuids: [$scope.current],
              role: tempResources.role,
              birthDate: 0
              //function: member.function
            }
          ).then(
            function (result)
            {
              // change the REST return to json.
              if (result.error)
              {
                var errorData = result.error.data.error;

                $rootScope.notifier.error($rootScope.ui.teamup.teamSubmitError + errorData);
                $rootScope.statusBar.off();
              }
              else
              {
                $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                //Profile.save(result.uuid, {
                //  pincode: pincode
                //});

                // TODO: Repetitive code!
                $scope.loadTeams();
              }
            }
          );
        };

        $scope.addExistingMember = function (member)
        {
          $rootScope.statusBar.display($rootScope.ui.teamup.savingMember);

          TeamUp._(
            'teamMemberAdd',
            {second: $scope.current},
            {ids: [member.uuid]}
          ).then(
            function (result)
            {
              if (result.error)
              {
                $rootScope.notifier.error($rootScope.ui.teamup.teamSubmitError + result.errorMessage);
                $rootScope.statusBar.off();
              }
              else
              {
                $scope.result = result;

                if(member.uuid == $rootScope.app.resources.uuid)
                {
                  member.teamUuids.push($scope.current) ;
                  $rootScope.app.resources = member;
                  Store('app').save('resources', member);
                }

                if (angular.isDefined($scope.membersBySearch))
                {
                  $scope.membersBySearch = null;
                  $scope.memberValue = '';
                }

                //$scope.data.members.push(member);
                //
                //$scope.setViewTo('team');
                //$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                //$rootScope.statusBar.off();

                //TODO change this
                $scope.loadTeams();
              }
            }
          );
        };

        $scope.loadTeams = function ()
        {
          $rootScope.statusBar.display($rootScope.ui.teamup.savingMember);

          Teams.query(
            false,
            {'uuid': $scope.current}
          ).then(
            function (queries)
            {
              if (queries.error)
              {
                $rootScope.notifier.error($rootScope.ui.teamup.queryTeamError);
                console.warn('error ->', queries);
              }
              else
              {
                $scope.data = queries;

                $scope.data.members = queries.members[$scope.current];

                if (angular.isDefined($scope.teamMemberForm))
                {
                  $rootScope.resetPhoneNumberChecker();
                  $scope.teamMemberForm = {};
                }

                $scope.setViewTo('team');
              }

              $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
              $rootScope.statusBar.off();
            }
          );
        };

        $scope.editProfile = function (memberId, teamId)
        {
          sessionStorage.setItem(angular.lowercase(memberId) + '_team', teamId)
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

        $scope.confirmDeleteTeam = function ()
        {
          $timeout(
            function ()
            {
              angular.element('#confirmTeamModal').modal('show');
            }
          );
        };

        $scope.deleteTeam = function ()
        {
          angular.element('#confirmTeamModal').modal('hide');

          $rootScope.statusBar.display($rootScope.ui.teamup.deletingTeam);

          TeamUp._(
            'teamDelete',
            {second: $scope.current}
          ).then(
            function (result)
            {
              if (result)
              {
                Teams.query(
                  true,
                  {}
                ).then(
                  function (teams)
                  {
                    $scope.requestTeam(teams[0].uuid);
                    // locally refresh
                    angular.forEach(
                      $scope.data.teams,
                      function (team, i)
                      {
                        if (team.uuid == result.result)
                        {
                          $scope.data.teams.splice(i, 1);
                        }
                      }
                    );
                  }, function (error)
                  {
                    console.log(error)
                  });

              }

              $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
              $rootScope.statusBar.off();
            }, function (error)
            {
              console.log(error)
            });
        };

        $scope.currentMember = {};

        $scope.confirmDeleteMember = function (member)
        {
          $timeout(
            function ()
            {
              $scope.currentMember = member;

              angular.element('#confirmMemberModal').modal('show');
            }
          );
        };

        $scope.deleteMember = function (member)
        {
          angular.element('#confirmMemberModal').modal('hide');

          $rootScope.statusBar.display($rootScope.ui.teamup.deletingMember);

          // TODO : we should also fix the issue in the backend.
          var memberId = angular.lowercase(member.uuid),
            index = $scope.data.members.indexOf(member);

          TeamUp._(
            'teamMemberDelete',
            {second: $scope.current},
            {ids: [memberId]}
          ).then(
            function ()
            {
              Teams.query(false, {'uuid': $scope.current})
                .then(
                function ()
                {
                  $scope.data.members.splice(index, 1);

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
                  }

                  $rootScope.statusBar.off();
                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                }
              );
            }
          ),
            function (error)
            {
              console.log(error)
            };
        };

        /**
         * Check if pincode change and validate
         */
        //$scope.$watch(function ()
        //{
        //  return $scope.memberForm.pincode;
        //}, function ()
        //{
        //  $rootScope.pincodeExists($scope.memberForm.pincode, $rootScope.app.resources.uuid, true);
        //});

        // TODO: Investigate on this!
        //$scope.$on(
        //  '$viewContentLoaded',
        //  function ()
        //  {
        //    console.log("teams : viewContentLoaded");
        //
        //    // make sure the loading of the
        //    if (!$rootScope.taskVisit)
        //    {
        //      $rootScope.$broadcast('taskFinishLoading');
        //      $rootScope.taskVisit = true;
        //    }
        //  }
        //);

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

            TeamUp._(
              'findMembers',
              {query: name}
            ).then(
              function (result)
              {
                if (result.error)
                {
                  console.log('Error with finding members : ' + result.error);
                }
                else
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
              .then(
              function (result)
              {
                if (result.error)
                {
                  console.log('Error with deleting member from all his teams : ' + result.error);
                }
                else
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
      }
    );
  }
);

define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'teamCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        'Teams',
        'data',
        '$route',
        '$routeParams',
        'Store',
        'Dater',
        'TeamUp',
        '$timeout',
        'MD5',
        'Profile',
        '$filter',
        function ($rootScope, $scope, $location, Teams, data, $route, $routeParams, Store, Dater,
                  TeamUp, $timeout, MD5, Profile, $filter)
        {
          $rootScope.fixStyles();

          //TODO get this from a service
          $rootScope.resetPhoneNumberChecker();

          $scope.members = data.members;
          $scope.teams = data.teams;

          var params = $location.search();

          $scope.search = {query: ''};

          $scope.selection = {};

          $scope.data = data;

          $scope.roles = config.app.roles;

          // TODO: Readable variable name!
          $scope.mfuncs = config.app.mfunctions;

          $scope.membersWithoutTeam = $filter('membersWithoutTeam')($scope.data.members);

          var uuid,
            view;

          if (!params.uuid && !$location.hash())
          {
            uuid = data.teams[0].uuid;
            view = 'team';

            $location.search({uuid: data.teams[0].uuid}).hash('team');
          }
          else if (!params.uuid)
          {
            uuid = data.teams[0].uuid;
            view = $location.hash();

            $location.search({uuid: uuid});
          }
          else
          {
            uuid = params.uuid;
            view = $location.hash();
          }

          setTeamView(uuid);

          //set default team by last visited team
          $scope.memberForm = {};
          $scope.memberForm.team = uuid;
          $scope.memberForm.pincode = '';

          $scope.views = {
            team: true,
            newTeam: false,
            newMember: false,
            editTeam: false
          };

          function setTeamView(id)
          {
            $scope.team = _.findWhere(data.teams, {uuid: id});

            $scope.members = data.members[id];

            angular.forEach(
              $scope.members,
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
          }

          /**
           * The type of user added to the team, existing or new
           * @param userType
           */
          $scope.setUserType = function(userType)
          {
            $scope.userType = userType;
          };

          $scope.setUserType('NEW');


          $scope.requestTeam = function (current, switched)
          {
            var hash = $location.hash() || 'team';
            setTeamView(current);

            $scope.$watch(
              $location.search(),
              function ()
              {
                $location.search({uuid: current});
              }
            );

            setView(hash);
          };

          var setView = function (hash)
          {
            $scope.views = {
              team: false,
              newTeam: false,
              newMember: false,
              editTeam: false
            };

            $scope.views[hash] = true;
          };

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

          setView(view);

          $scope.toggleSelection = function (group, master)
          {
            var flag = (master) ? true : false;

            angular.forEach(
              Store('app').get(group.uuid),
              function (member)
              {
                $scope.selection[member.uuid] = flag
              }
            );
          };

          $scope.editTeam = function (team)
          {
            $scope.teamEditForm = {
              name: team.name,
              uuid: team.uuid
            };

            $scope.views.editTeam = true;
          };

          $scope.cancelTeamEdit = function (team)
          {
            $scope.teamEditForm = {
              name: team.name,
              uuid: team.uuid
            };

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

            TeamUp._(
              'teamAdd',
              {id: $rootScope.app.resources.uuid},
              team
            ).then(
              function (result)
              {
                if (result.error)
                {
                  $rootScope.notifier.error($rootScope.ui.teamup.teamSubmitError);
                }
                else
                {
                  $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                  // TODO: Repetitive code!
                  Teams.query(false, result)
                    .then(
                    function (queries)
                    {
                      if (queries.error)
                      {
                        $rootScope.notifier.error($rootScope.ui.teamup.queryTeamError);

                        console.warn('error ->', queries);
                      }
                      else
                      {
                        $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);

                        $scope.data = queries;

                        // also refresh the team-client group links cache
                        Teams.queryClientGroups(queries.teams).then(
                          function (res)
                          {
                            console.log("new team added to team-client list", res);
                          });

                        angular.forEach(
                          queries.teams,
                          function (team)
                          {
                            if (team.uuid == result.uuid)
                            {
                              $scope.teams = queries.teams;

                              angular.forEach(
                                queries.teams,
                                function (_team)
                                {
                                  if (_team.uuid == team.uuid)
                                  {
                                    $scope.team = _team;
                                  }
                                });

                              $scope.members = data.members[team.uuid];

                              $scope.current = team.uuid;

                              $scope.$watch(
                                $location.search(),
                                function ()
                                {
                                  $location.search({uuid: team.uuid})
                                }
                              );
                            }
                          }
                        );
                      }

                      $rootScope.statusBar.off();
                    }
                  );
                }
              }
            );
          };

          $scope.changePinToPhone = function()
          {
            var phone = $scope.memberForm.phone,
              phoneValidateResult = $rootScope.phoneNumberParsed.result;

            $scope.tempPhone = $scope.tempPhone || '';


            if(phone && phone.length >= 10 && (_.isEmpty($scope.memberForm.pincode) ||
              $scope.memberForm.pincode == $scope.tempPhone)
              && phoneValidateResult == true)
            {
              var inputVal = angular.element('.inputPhoneNumber').val();

              $scope.tempPhone = lastFourDigits(inputVal);
              $scope.memberForm.pincode = lastFourDigits(inputVal);
            }
          };

          var lastFourDigits = function(phone)
          {
            return phone.substr(phone.length - 4);
          };

          $scope.memberSubmit = function (member)
          {
            if (typeof member == 'undefined' || !member.userName || !member.password || !member.reTypePassword || !member.birthDate)
            {
              //angular.element
              $rootScope.notifier.error($rootScope.ui.teamup.accountInfoFill);

              return;
            }

            if(!_.isEmpty(member.pincode) && $rootScope.pincodeExistsValidation == false)
            {
              $rootScope.notifier.error($rootScope.ui.validation.pincode.exists);
              return false;
            }

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
            var pincode = tempResources.pincode;
            delete tempResources.pincode;

            tempResources.password = MD5(tempResources.password);
            tempResources.birthDate = Dater.convert.absolute(tempResources.birthDate, 0)

            TeamUp._(
              'memberAdd',
              null,
              {
                uuid: user.userName,
                userName: user.userName,
                passwordHash: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                email: user.email,
                teamUuids: [$scope.current],
                role: user.role,
                birthDate: user.birthDate
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

                  Profile.save(result.uuid, {
                    pincode: pincode
                  });

                  // TODO: Repetitive code!
                  loadTeams(result.teamId);
                }
              }
            );
          };

          $scope.addExistingUserMember = function(member)
          {
            var index = $scope.membersWithoutTeam.indexOf(member);
            $scope.membersWithoutTeam.splice(index, 1);

            TeamUp._(
              'teamMemberAdd',
              {second: $scope.current},
              {ids: [member.uuid]}
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
                  //update user without team
                  loadTeams();
                }
              }
            );
          };

          var loadTeams = function()
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

                  $scope.team = _.findWhere($scope.data.teams, {uuid: $scope.current});

                  $scope.members = $scope.data.members[$scope.team.uuid];

                  $scope.setViewTo('team');
                }

                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();
                //reset validation
                $rootScope.resetPhoneNumberChecker();

                if(angular.isDefined($scope.teamMemberForm))
                {
                  $scope.teamMemberForm.$setPristine();
                }
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
                        $scope.teams,
                        function (team, i)
                        {
                          if (team.uuid == result.result)
                          {
                            $scope.teams.splice(i, 1);
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
                index = $scope.data.members[$scope.current].indexOf(member);

            TeamUp._(
              'teamMemberDelete',
              {second: $scope.team.uuid},
              {ids: [memberId]}
            ).then(
              function ()
              {
                Teams.query(false, {'uuid': $scope.current})
                  .then(
                  function ()
                  {
                    $scope.data.members[$scope.current].splice(index, 1);
                    $scope.membersWithoutTeam = $filter('membersWithoutTeam')($scope.data.members);
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
          $scope.$watch(function ()
          {
            return $scope.memberForm.pincode;
          }, function ()
          {
            $rootScope.pincodeExists($scope.memberForm.pincode, $rootScope.app.resources.uuid, true);
          });

          // TODO: Investigate on this!
          $scope.$on(
            '$viewContentLoaded',
            function ()
            {
              console.log("teams : viewContentLoaded");

              // make sure the loading of the
              if (!$rootScope.taskVisit)
              {
                $rootScope.$broadcast('taskFinishLoading');
                $rootScope.taskVisit = true;
              }
            }
          );

          $scope.convertUserName = function ()
          {
            $scope.memberForm.userName = angular.lowercase($scope.memberForm.userName);
          }
        }
      ]
    );
  }
);

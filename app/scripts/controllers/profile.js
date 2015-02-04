define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'profileCtrl',
      [
        '$rootScope',
        '$scope',
        '$q',
        '$location',
        '$window',
        '$route',
        'data',
        'Store',
        'Teams',
        'Dater',
        '$filter',
        'TeamUp',
        '$timeout',
        'MD5',
        'Profile',
        'Pincode',
        function ($rootScope, $scope, $q, $location, $window, $route, data, Store, Teams,
                  Dater, $filter, TeamUp, $timeout, MD5, Profile)
        {
          var getProfileResource = function(userId, flag)
          {
            Profile.get(userId, flag)
              .then(
              function(profileData)
              {
                if(profileData)
                {
                  $scope.view.pincode = angular.copy(profileData.pincode) || '';
                  $scope.view.phoneNumbers = angular.copy(profileData.PhoneAddresses) || [];
                  $scope.edit = angular.copy($scope.view);
                }
              }
            );
          };

          $rootScope.fixStyles();

          $scope.roles = config.app.roles;
          $scope.mfuncs = config.app.mfunctions;

          $scope.view = data;
          $scope.view.birthDate = Dater.formatDate($scope.view.birthDate);

          // TODO: Still needed?
          $scope.noImgURL = config.app.noImgURL;

          $scope.edit = angular.copy($scope.view);

          getProfileResource($scope.view.uuid);

          var currentRole = $scope.view.role;

          if($rootScope.browser.mobile)
          {
            $scope.edit.birthDate = Dater.formatDateMobile($scope.edit.birthDate);
          }

          $scope.teams = $rootScope.getTeamsofMembers($scope.view.uuid);

          $scope.forms = {
            add: false,
            edit: false
          };

          setView($location.hash());

          function setView(hash)
          {
            $scope.views = {
              profile: false,
              edit: false,
              editImg: false,
              editPassword: false
            };

            $scope.views[hash] = true;

            $scope.views.user = (($rootScope.app.resources.uuid == $route.current.params.userId));
          }

          $scope.setViewTo = function (hash)
          {
            $scope.$watch(
              $location.hash(),
              function ()
              {
                $location.hash(hash);

                setView(hash);
              }
            );
          };

          /**
           * Check if pincode change and validate
           */
          $scope.$watch(function()
          {
            return $scope.edit.pincode;
          }, function() {
            $rootScope.pincodeExists($scope.edit.pincode, $scope.view.uuid, false);
          });

          $scope.parsedPhoneNumbers = [];

          /**
           * Reset the parsed phone numbers, get rid of the old result and messages
           * Current max 3 phone numbers
           */
          $scope.resetPhoneNumberCheck = function()
          {
            _.each([0, 1, 2],
              function (_index)
              {
                $scope.parsedPhoneNumbers[_index] = {};
              }
            );
          };

          /**
           * Checks the users phonenumbers
           * @param phoneNumber
           * @param index
           */
          $scope.checkPhoneNumber = function(phoneNumber, index)
          {
            //Checks phone number and adds message to the designatated class by index
            $rootScope.parsePhoneNumber(phoneNumber, index);
            //Adds the number parsed result to the specific phone number
            $scope.parsedPhoneNumbers[index] = $rootScope.phoneNumberParsed;
            //reset the phonenumber afterwards
            $rootScope.resetPhoneNumberChecker();
          };

          /**
           * If the user don't have a teamlidcode the last four digits will be the teamlidcode
           * @param index index of what phonenumber
           */
          $scope.setTeamMemberCodeAsPhone = function(index)
          {
            var phone = $scope.edit.phoneNumbers[index],
                phoneValidateResult = $scope.parsedPhoneNumbers[index].result;

            if(phone && phone.length >= 10 &&
              (_.isEmpty($scope.edit.pincode) || $scope.view.pincode != $scope.edit.pincode ||
              getLastFourDigits($scope.view.phoneNumbers[index]) == $scope.view.pincode) &&
              phoneValidateResult == true)
            {
              var inputVal = angular.element('.inputPhoneNumber0').val();

              //current value of the input is different then the $scope data
              //Will be the same after saving the form
              $scope.edit.pincode = getLastFourDigits(inputVal);
            }
          };

          var getLastFourDigits = function(phone)
          {
            return phone.substr(phone.length - 4);
          };

          /**
           * Save the profile data
           * @param resources Profile data
           * @returns {boolean}
           */
          $scope.save = function (resources)
          {
            //Check if there is atleast one phonenumber
            if (! resources.phoneNumbers[0])
            {
              $rootScope.notifier.error($rootScope.ui.validation.phone.notValidOnSubmit);
              return false;
            }

            if(!_.isEmpty(resources.pincode) && $rootScope.pincodeExistsValidation == false)
            {
              $rootScope.notifier.error($rootScope.ui.validation.pincode.exists);
              return false;
            }

            // let user know that user need to re-relogin if the login-user's role is changed.
            if (currentRole != resources.role && $rootScope.app.resources.uuid == resources.uuid)
            {
              if (!confirm($rootScope.ui.profile.roleChangePrompt))
              {
                return false;
              }
            }

            // check if the member is belong to any team, warn user to put his/herself to a team
            //TODO Check this part
            if (_.isNull(resources.teamUuids) || _.isUndefined(resources.teamUuids[0]))
            {
              resources.teamUuids = [];

              if ($scope.teams.length == 0)
              {
                //resources.teamUuids.push($scope.selectTeams[0].uuid);
                resources.teamUuids.push(sessionStorage.getItem(resources.uuid + '_team'));
              }
              else
              {
                resources.teamUuids.push($scope.teams[0].uuid);
              }
              if (resources.teamUuids[0] == null)
              {
                $rootScope.notifier.error($rootScope.ui.profile.specifyTeam);
                return false;
              }
            }

            if (_.isUndefined(resources.email) || resources.email == false)
            {
              $rootScope.notifier.error($rootScope.ui.validation.email.notValid);
              return false;
            }

            var valid = true;

            _.each(resources.phoneNumbers,
              function (phone, _index)
              {
                if(! _.isEmpty(phone) && ! _.isUndefined(phone)
                  && ! _.isUndefined($scope.parsedPhoneNumbers[_index])
                  && $scope.parsedPhoneNumbers[_index].result == true)
                {
                  resources.phoneNumbers[_index] = $scope.parsedPhoneNumbers[_index].format;
                }
                else if(! _.isEmpty(phone) && ! _.isUndefined(phone)
                  && ! _.isUndefined($scope.parsedPhoneNumbers[_index])
                  && $scope.parsedPhoneNumbers[_index].result == false)
                {
                  valid = false;
                }
              }
            );

            if(! valid)
            {
              $rootScope.notifier.error($rootScope.ui.validation.phone.multipleNotvalid);
              return false;
            }
            else
            {
              //After validation remove undefined from array
              resources.phoneNumbers = _.without(resources.phoneNumbers, undefined);
              $scope.resetPhoneNumberCheck();
            }

            if($rootScope.browser.mobile)
            {
              //browsers aren't recognizing local date string yet. Instead it's expecting a date format
              // to be provided in ISO 8601 (type='date')
              var tempDate = resources.birthDate,
                days = tempDate.substr(tempDate.length - 2),
                months = tempDate.substr(5, 2),
                years = tempDate.substr(0, 4);

              resources.birthDate = days + '-' + months + '-' + years;
            }

            //add first phonenumber resource to user object
            resources.phone = resources.phoneNumbers[0];

            //create a temp so the user don't see that the field changing
            var tempResources = angular.copy(resources);

            // deal with birthday
            try
            {
              tempResources.birthDate = Dater.convert.absolute(resources.birthDate, 0);
            }
            catch (error)
            {
              $rootScope.notifier.error($rootScope.ui.teamup.birthdayError);

              return false;
            }

            $rootScope.statusBar.display($rootScope.ui.profile.saveProfile);

            delete tempResources.birthday;
            delete tempResources.fullName;
            //delete resources.TeamMemberCodeAsPhone;

            //oldpass
            if(!_.isUndefined(resources.oldpass))
            {
              delete tempResources.oldpass;
            }
            //save profileresource
            Profile.save($route.current.params.userId,
              {
                PhoneAddresses: resources.phoneNumbers,
                PhoneAddress: resources.phone,
                pincode: resources.pincode
              }
            )
              .then(
              function(result)
              {
                if (result.error)
                {
                  $rootScope.notifier.error($rootScope.ui.errors.profile.save);
                  console.warn('error ->', result);
                }
                else
                {
                  delete tempResources.phoneNumbers;
                  delete tempResources.pincode;

                  saveUserData(tempResources);
                }
              }
            );
          };

          var saveUserData = function(resources)
          {
            Profile.saveUserData(resources)
              .then(
                function(result)
                {
                  if (result.error)
                  {
                    $rootScope.notifier.error('Error with saving profile information.');
                    console.warn('error ->', result);
                  }
                  else
                  {
                    Profile.fetchUserData($route.current.params.userId)
                      .then(
                        function(data)
                        {
                          if (data.error)
                          {
                            $rootScope.notifier.error('Error with getting profile data.');
                            console.warn('error ->', data);
                          }
                          else
                          {
                            $rootScope.notifier.success($rootScope.ui.profile.dataChanged);

                            $scope.view = data;
                            $scope.view.birthDate = Dater.formatDate($scope.view.birthDate);

                            getProfileResource(
                              $route.current.params.userId,
                              ($route.current.params.userId == $rootScope.app.resources.uuid)
                            );

                            if($rootScope.browser.mobile)
                            {
                              $scope.edit.birthDate = Dater.formatDateMobile($scope.view.birthDate);
                            }
                            else
                            {
                              $scope.edit.birthDate = $scope.view.birthDate;
                            }

                            $rootScope.statusBar.off();
                            $scope.setViewTo('profile');

                            if ($rootScope.app.resources.uuid == $route.current.params.userId)
                            {
                              $rootScope.app.resources.firstName = $scope.edit.firstName;
                              $rootScope.app.resources.lastName = $scope.edit.lastName;

                              // will logout if the role is changed for the user him/her-self.
                              if (currentRole != $scope.view.role)
                              {
                                $rootScope.nav("logout");
                              }
                            }

                            // refresh the teams in the background
                            angular.forEach
                            (
                              resources.teamUuids, function (teamId)
                              {
                                // FIXME: Message is not absent in localization file so turned off
                                // $rootScope.statusBar.display($rootScope.ui.profile.refreshTeam);

                                Teams.query(
                                  false,
                                  {uuid: teamId}
                                ).then(
                                  function ()
                                  {
                                    $rootScope.statusBar.off()
                                  }
                                );
                              }
                            );
                          }
                        }
                      );
                  }
                }
              );
          };

          $scope.editProfile = function ()
          {
            setView('edit');
          };

          $scope.editPassword = function ()
          {
            setView('editPassword');
          };

          // Change an avatar
          $scope.editImg = function ()
          {
            $scope.uploadURL = config.app.host + config.app.namespace + "/team/member/" + $route.current.params.userId + "/photo?square=true";
            $scope.setViewTo('editImg');
          };

          $scope.savePassword = function (resources)
          {
            //copy data so the user can't see real-life changes causing by two way binding
            var formData = angular.copy(resources);

            if (!formData.oldpass || !formData.newpass || !formData.newpassrepeat)
            {
              $rootScope.notifier.error($rootScope.ui.profile.pleaseFill);
              return;
            }
            else if (formData.newpass != null && formData.newpass != formData.newpassrepeat)
            {
              $rootScope.notifier.error($rootScope.ui.profile.passNotMatch);
              return;
            }
            else if (MD5(formData.oldpass) !== $scope.edit.passwordHash)
            {
              $rootScope.notifier.error($rootScope.ui.profile.currentPassWrong);
              return;
            }
            else if (formData.newpass != null)
            {
              $scope.view.passwordHash = MD5(formData.newpass);
              delete formData.oldpass;
              delete formData.newpass;
              delete formData.newpassrepeat;
            }

            $scope.save($scope.view);
          };

          $scope.confirmModal = function(id)
          {
            $timeout(
              function ()
              {
                angular.element(id).modal('show');
              }
            );
          };

          $scope.deleteAvatar = function()
          {
            //$data.uuid;
            angular.element('#confirmDeleteAvatar').modal('hide');
          };

          // Remove a profile completely
          $scope.deleteProfile = function ()
          {
            angular.element('#confirmProfileModal').modal('hide');

            $rootScope.statusBar.display($rootScope.ui.teamup.deletingMember);

            //TODO remove TeamUp._('teamMemberDelete',
            //Teams.removeAllTeamsFromMember(
            //  $scope.view.uuid,
            //  $scope.view.teamUuids
            //)
            //  .then(
            //    function(result)
            //    {
            //      console.log('scope.teams', $scope.teams);
            //
            //      $scope.teams = null;
            //
            //      console.log('scope.teams', $scope.teams);
            //      $scope.view.teamUuids = null;
            //
            //      $rootScope.statusBar.off();
            //    }
            //  );

            angular.forEach($scope.teams, function (team)
            {

              TeamUp._(
                'teamMemberDelete',
                {second: team.uuid},
                {ids: [$scope.view.uuid]}
              ).then(
                function ()
                {
                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);

                  angular.forEach($scope.view.teamUuids, function (teamId, i)
                  {
                    if (team.uuid == teamId)
                    {
                      $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                      Teams.query(
                        false,
                        {'uuid': teamId}
                      ).then(
                        function ()
                        {
                          $rootScope.statusBar.off()
                        }
                      );

                      $scope.view.teamUuids.splice(i, 1);
                      $scope.teams.splice(i, 1);
                      sessionStorage.removeItem(data.uuid + '_team');
                      Teams.updateMembersLocal();
                    }
                  });
                }, function (error)
                {
                  console.log(error)
                }
              );

              //update list of members
              TeamUp._('teamMemberFree')
                .then
              (
                function (result)
                {
                  Store('app').save('members', result);

                  $rootScope.statusBar.off();
                },
                function (error)
                {
                  console.log(error)
                }
              );
            });
          };
        }
      ]
    );
  }
);

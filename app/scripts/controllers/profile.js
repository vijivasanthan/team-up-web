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
        function ($rootScope, $scope, $q, $location, $window, $route, data, Store, Teams,
                  Dater, $filter, TeamUp, $timeout, MD5, Profile)
        {
          var profileResource = null;

          $rootScope.fixStyles();

          $scope.self = this;

          $scope.roles = config.app.roles;
          $scope.mfuncs = config.app.mfunctions;

          $scope.data = data;

          // TODO: Still needed?
          $scope.noImgURL = config.app.noImgURL;

          $scope.profilemeta = data;

          $scope.profilemeta.birthDate = formatDate($scope.profilemeta.birthDate);

          //temp userdata will be saved after pressing save
          $scope.profile = angular.copy($scope.profilemeta);

          //TODO resolve this one in routing
          var getProfileResource = function(userId, flag)
          {
            Profile.get(userId, flag)
              .then(
              function(profileData)
              {
                profileResource = profileData;
                $scope.profile.pincode = (profileResource.pincode)
                  ? profileResource.pincode
                  : '';
                $scope.profile.phoneNumbers = profileResource.PhoneAddresses || [];
                $scope.data.phoneNumbers = angular.copy($scope.profile.phoneNumbers);
              }
            );
          };

          getProfileResource($scope.profilemeta.uuid);

          $scope.currentRole = $scope.profilemeta.role;

          if($rootScope.browser.mobile)
          {
            $scope.profile.birthDate = formatDateMobile($scope.profile.birthDate);
          }

          // TODO: Investigate whether they are in use!
          $scope.imgHost = config.app.host;
          $scope.ns = config.app.namespace;

          var teams = [];
          $scope.selectTeams = Store('app').get('teams');

          var teams = $scope.$root.getTeamsofMembers($scope.profilemeta.uuid);

          $scope.teams = teams;

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
          $scope.$watch(function() {
            return $scope.profile.pincode;
          }, function() {
            $scope.pincodeExists();
          });

          var CHECK_PINCODE_DELAY = 250;

          $scope.pincodeExistsValidation = true;

          $scope.pincodeExists = function ()
          {
            if (!angular.isDefined($scope.profile.pincode) ||
              $scope.profile.pincode == '')
            {
              $scope.pincodeExistsValidation = false;
              $scope.pincodeExistsValidationMessage = $rootScope.ui.profile.pincodeNotValid;
            }
            else
            {
              if (angular.isDefined($scope.profile.pincode))
              {
                if ($scope.checkPincode)
                {
                  clearTimeout($scope.checkPincode);

                  $scope.checkPincode = null;
                }

                $scope.checkPincode = setTimeout(function ()
                {
                  $scope.checkPincode = null;

                  Profile.pincodeExists($scope.profilemeta.uuid, $scope.profile.pincode)
                    .then(
                    function (result)
                    {
                      $scope.pincodeExistsValidation = result;
                      $scope.pincodeExistsValidationMessage = $rootScope.ui.profile.pincodeInUse;
                    }
                  );
                }, CHECK_PINCODE_DELAY);
              }
            }
          };

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

          $scope.checkPincode = null;

          $scope.teamMemberCodeConfirmed = function()
          {
            angular.element('#confirmTeamMemberCodeAsPhoneModal').modal('hide');
            $scope.profile.TeamMemberCodeAsPhone = true;
            $scope.save($scope.profile);
          }

          /**
           * If the user don't have a teamlidcode the last four digits will be the teamlidcode
           * @param phone
           */
          $scope.setTeamMemberCodeAsPhone = function(phone)
          {
            if(phone && phone.length >= 12 && profileResource.pincode != $scope.profile.pincode)
            {
              $scope.profile.pincode = phone.substr(phone.length - 4)
            }
          };

          $scope.checkCurrentValue = function(phone)
          {
            if(phone)
            {
              console.log('phone', phone);
            }
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

            if (! $scope.pincodeExistsValidation)
            {
              $rootScope.notifier.error($rootScope.ui.profile.pincodeNotValid);
              return false;
            }

            //If the last 4 digits of the phonenumber are equal with the teammember code, the user has to confirm
            if (resources.pincode == resources.phoneNumbers[0].substr(resources.phoneNumbers[0].length - 4)
                && ! resources.TeamMemberCodeAsPhone)
            {
              $timeout(
                function ()
                {
                  angular.element('#confirmTeamMemberCodeAsPhoneModal').modal('show');
                }
              );
              return false;
            }

            // let user know that user need to re-relogin if the login-user's role is changed.
            if ($scope.currentRole != resources.role && $rootScope.app.resources.uuid == resources.uuid)
            {
              if (!confirm($rootScope.ui.profile.roleChangePrompt))
              {
                return false;
              }
            }

            // check if the member is belong to any team, warn user to put his/herself to a team
            if (resources.teamUuids == null || typeof resources.teamUuids[0] == 'undefined')
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

            // deal with birthday
            try
            {
              resources.birthDate = Dater.convert.absolute(resources.birthDate, 0);
            }
            catch (error)
            {
              $rootScope.notifier.error($rootScope.ui.teamup.birthdayError);

              return false;
            }

            $rootScope.statusBar.display($rootScope.ui.profile.saveProfile);
            //zet de phonenumbers om
            profileResource.PhoneAddresses = resources.phoneNumbers;

            //add first phonenumber to user object
            resources.phone = resources.phoneNumbers[0];

            //add pincode to profile resource local
            profileResource.pincode = resources.pincode;

            //delete resources phonenumbers
            delete resources.phoneNumbers;

            delete resources.birthday;
            delete resources.fullName;
            delete resources.TeamMemberCodeAsPhone;

            //delete resources.pincode
            delete resources.pincode;
            //oldpass
            if(!_.isUndefined(resources.oldpass))
            {
              delete resources.oldpass;
            }
            //save profileresource
            Profile.save($route.current.params.userId, profileResource)
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
                  saveProfile(resources);
                }
              }
            );
          };

          var saveProfile = function(resources)
          {
            TeamUp._(
              'profileSave',
              {
                second: resources.teamUuids[0],
                fourth: resources.uuid
              },
              resources
            ).then(
              function (result)
              {
                console.log('resources.birthDate', result);
                if (result.error)
                {
                  $rootScope.notifier.error('Error with saving profile information.');
                  console.warn('error ->', result);
                }
                else
                {
                  $rootScope.statusBar.display($rootScope.ui.profile.refreshing);

                  TeamUp._(
                    'profileGet',
                    {
                      third: $route.current.params.userId
                    },
                    null,
                    function (resources)
                    {
                      if ($route.current.params.userId == $rootScope.app.resources.uuid)
                      {
                        $rootScope.app.resources = result;

                        Store('app').save('resources', resources);
                      }
                    }
                  ).then(
                    function (data)
                    {
                      if (data.error)
                      {
                        $rootScope.notifier.error('Error with getting profile data.');
                        console.warn('error ->', data);
                      }
                      else
                      {
                        $rootScope.notifier.success($rootScope.ui.profile.dataChanged);

                        $scope.data = data;

                        $scope.data.birthDate = formatDate($scope.data.birthDate);

                        getProfileResource(
                          $route.current.params.userId,
                          ($route.current.params.userId == $rootScope.app.resources.uuid)
                        );

                        $scope.data.phoneNumbers = profileResource.PhoneAddresses;

                        $scope.profile = angular.copy($scope.data);

                        //TODO get a mobile debugger
                        if($rootScope.browser.mobile)
                        {
                          $scope.profile.birthDate = formatDateMobile($scope.data.birthDate);
                        }

                        $rootScope.statusBar.off();
                        $scope.setViewTo('profile');

                        if ($rootScope.app.resources.uuid == $route.current.params.userId)
                        {
                          $rootScope.app.resources.firstName = $scope.profile.firstName;
                          $rootScope.app.resources.lastName = $scope.profile.lastName;

                          // will logout if the role is changed for the user him/her-self.
                          if ($scope.currentRole != resources.role)
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
          }

          function formatDate(date)
          {
            return moment(date).format('DD-MM-YYYY');
          }

          function formatDateMobile(date)
          {
            return moment(Dater.convert.absolute(date, 0)).format('YYYY-MM-DD');
          }

          $scope.editProfile = function ()
          {
            setView('edit');
          };

          $scope.editPassword = function ()
          {
            setView('editPassword');
          }

          // Change an avatar
          $scope.editImg = function ()
          {
            $scope.uploadURL = $scope.imgHost + $scope.ns + "/team/member/" + $route.current.params.userId + "/photo?square=true";
            $scope.setViewTo('editImg');
          };

          $scope.confirmDeleteProfile = function ()
          {
            $timeout(
              function ()
              {
                angular.element('#confirmProfileModal').modal('show');
              }
            );
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
            else if (MD5(formData.oldpass) !== $scope.profile.passwordHash)
            {
              $rootScope.notifier.error($rootScope.ui.profile.currentPassWrong);
              return;
            }
            else if (formData.newpass != null)
            {
              $scope.data.passwordHash = MD5(formData.newpass);
              delete formData.oldpass;
              delete formData.newpass;
              delete formData.newpassrepeat;
            }

            $scope.save($scope.data);
          }

          // Remove a profile completely
          $scope.deleteProfile = function ()
          {
            angular.element('#confirmProfileModal').modal('hide');

            $rootScope.statusBar.display($rootScope.ui.teamup.deletingMember);

            var currentTeam;

            angular.forEach($scope.teams, function (team)
            {

              TeamUp._(
                'teamMemberDelete',
                {second: team.uuid},
                {ids: [$scope.profilemeta.uuid]}
              ).then(
                function (result)
                {
                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);

                  angular.forEach($scope.profilemeta.teamUuids, function (teamId, i)
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

                      $scope.profilemeta.teamUuids.splice(i, 1);
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

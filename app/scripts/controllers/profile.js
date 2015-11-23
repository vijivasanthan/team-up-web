define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'profileCtrl',
        function ($rootScope, $scope, $q, $location, $window, $route, data, Store, Teams,
                  Dater, $filter, TeamUp, $timeout, MD5, Profile, Permission, $injector)
        {
          var getProfileResource = function(userId, flag)
          {
            Profile.get(userId, flag)
              .then(
              function(profileData)
              {
                if(profileData)
                {
                  //$scope.view.pincode = angular.copy(profileData.pincode) || '';
                  $scope.view.phoneNumbers = angular.copy(profileData.PhoneAddresses) || [];

                  $scope.edit = angular.copy($scope.view);
                  if($scope.edit.phoneNumbers.length > 0)
                  {
                    //indexwise
                    $scope.edit.defaultPhone = 0;
                  }
                  //$scope.edit.defaultTeam = $scope.edit.teamUuids[0];
                }
              }
            );
          };

          $rootScope.fixStyles();

          $scope.roles = config.app.roles;
          $scope.roles[0].label = $rootScope.ui.teamup.coordinator;
          $scope.roles[1].label = $rootScope.ui.teamup.teamMember;

          $scope.mfuncs = config.app.mfunctions;

          $scope.view = data;

          // TODO: Still needed?
          $scope.noImgURL = config.app.noImgURL;

          $scope.edit = angular.copy($scope.view);

          getProfileResource($scope.view.uuid);

          var currentRole = $scope.view.role;

          $scope.teams = null;

          if($scope.view.teamUuids.length > 0)
          {
            $scope.teams = Teams.getTeamNamesOfUser($scope.view.teamUuids);
          }

          $rootScope.infoUserWithoutTeam();

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
                switch (hash)
                {
                  case "editPassword":
                    clearPasswordForm();
                    break;
                }

                $location.hash(hash);

                setView(hash);
              }
            );
          };

          /**
           * Check if pincode change and validate
           */
          //$scope.$watch(function()
          //{
          //  return $scope.edit.pincode;
          //}, function() {
          //  $rootScope.pincodeExists($scope.edit.pincode, $scope.view.uuid, false);
          //});

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
          //$scope.setTeamMemberCodeAsPhone = function(index)
          //{
          //  var phone = $scope.edit.phoneNumbers[index],
          //      phoneValidateResult = $scope.parsedPhoneNumbers[index].result;
          //
          //  if(phone && phone.length >= 10 &&
          //    (_.isEmpty($scope.edit.pincode) || $scope.view.pincode != $scope.edit.pincode ||
          //    getLastFourDigits($scope.view.phoneNumbers[index]) == $scope.view.pincode) &&
          //    phoneValidateResult == true)
          //  {
          //    var inputVal = angular.element('.inputPhoneNumber0').val();
          //
          //    //current value of the input is different then the $scope data
          //    //Will be the same after saving the form
          //    $scope.edit.pincode = getLastFourDigits(inputVal);
          //  }
          //};

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

            //Check if phoneNumbers are unique
            if(resources.phoneNumbers.length != (_.uniq(resources.phoneNumbers).length))
            {
              $rootScope.notifier.error('Een of meer telefoonnummers bestaan al, Andere nummer invoeren aub.');
              return false;
            }


            //if(!_.isEmpty(resources.pincode) && $rootScope.pincodeExistsValidation == false)
            //{
            //  $rootScope.notifier.error($rootScope.ui.validation.pincode.exists);
            //  return false;
            //}

            // let user know that user need to re-relogin if the login-user's role is changed.
            if (currentRole != resources.role && $rootScope.app.resources.uuid == resources.uuid)
            {
              if (!confirm($rootScope.ui.profile.roleChangePrompt))
              {
                return false;
              }
            }

            //TODO Check this part
            if (resources.teamUuids[0] == null)
            {
              $rootScope.notifier.error($rootScope.ui.profile.specifyTeam);
              return false;
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


            //resources.defaultTeam
            //var tempTeamUuids = [];
            //_.each(resources.teamUuids, function (teamUuid)
            //{
            //  if(teamUuid != resources.defaultTeam)
            //  {
            //    tempTeamUuids.push(teamUuid);
            //  }
            //});
            //
            //tempTeamUuids.unshift(resources.defaultTeam);
            //
            //resources.teamUuids = tempTeamUuids;


            //create a temp so the user don't see that the field changing
            var tempResources = angular.copy(resources);

            /**
             * Check if there is a default phone number,
             * if there is one, add the default as first phonenumber
             * And remove duplicate numbers
             */
            var phoneIndex = tempResources.phoneNumbers.indexOf(tempResources.defaultPhone);

            if(! _.isUndefined(tempResources.phoneNumbers[tempResources.defaultPhone]) &&
              resources.defaultPhone != 0
            )
            {
              var phoneDefault = tempResources.phoneNumbers[tempResources.defaultPhone];

              tempResources.phoneNumbers.unshift(phoneDefault);
              tempResources.phoneNumbers = _.uniq(tempResources.phoneNumbers);
            }

            //add first phonenumber resource to user object
            tempResources.phone = tempResources.phoneNumbers[0];

            $rootScope.statusBar.display($rootScope.ui.profile.saveProfile);

            delete tempResources.fullName;
            delete tempResources.defaultPhone;
            //delete tempResources.defaultTeam;
            //delete resources.TeamMemberCodeAsPhone;

            //save profileresource
            Profile.save(tempResources.uuid,
              {
                PhoneAddresses: tempResources.phoneNumbers,
                PhoneAddress: tempResources.phone
                //pincode: resources.pincode
              })
              .then(function()
              {
                delete tempResources.phoneNumbers;
                //delete tempResources.pincode;
                $scope.profileForm.$setPristine();
                saveUserData(tempResources);
              });
          };

          var saveUserData = function(resources)
          {
            Profile.saveUserData(resources)
              .then(function()
              {
                return Profile.fetchUserData($route.current.params.userId);
              })
              .then(function(data)
              {
                $rootScope.notifier.success($rootScope.ui.profile.dataChanged);

                $scope.view = data;

                getProfileResource(
                  $route.current.params.userId,
                  ($route.current.params.userId == $rootScope.app.resources.uuid)
                );

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
              });
          };

          $scope.editProfile = function ()
          {
            setView('edit');
          };

          // Change an avatar
          $scope.editImg = function ()
          {
            var Settings = $injector.get('Settings');
            $scope.uploadURL = Settings.getBackEnd() + config.app.namespace + "/team/member/" + $route.current.params.userId + "/photo?square=true";
            $scope.setViewTo('editImg');
          };

          $scope.savePassword = function (passwordData)
          {
            if ( ! passwordData.old || ! passwordData.new || ! passwordData.newRepeat)
            {
              $rootScope.notifier.error($rootScope.ui.profile.pleaseFill);
              return;
            }
            else if (passwordData.new !== passwordData.newRepeat)
            {
              $rootScope.notifier.error($rootScope.ui.profile.passNotMatch);
              return;
            }
            else
            {
              $rootScope.statusBar.display($rootScope.ui.profile.savingPassword);

              Profile.changePassword($scope.view.uuid, passwordData.old, passwordData.new)
                .then(function(result)
                {
                  clearPasswordForm();
                  $rootScope.notifier.success($rootScope.ui.profile.passwordChanged);
                  $rootScope.statusBar.off();
                  $scope.setViewTo("profile");
                });
            }
          };

          function clearPasswordForm()
          {
            $scope.password = null;
            $scope.passWordForm.$setPristine();
          }

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
            angular.element('#confirmDeleteAvatar').modal('hide');
          };

          /**
           * Removes the member from all his teams
           */
          $scope.deleteProfile = function ()
          {
            angular.element('#confirmProfileModal').modal('hide');
            $rootScope.statusBar.display($rootScope.ui.teamup.deletingMember);

            var changes = {};
            //add member to the deletelist per team
            _.each($scope.view.teamUuids, function(teamId)
            {
              changes[teamId] = {
                a: [],
                r: [$scope.view.uuid]
              };
            });

            Teams.manage(changes)
              .then(function()
              {
                //Check of logged user is equal to the profile user
                $scope.teams = null;
                $scope.view.teamUuids = [];
                $scope.edit.teamUuids = [];

                if($scope.view.uuid == $rootScope.app.resources.uuid)
                {
                  $rootScope.app.resources.teamUuids = [];
                  //update local resources without teams
                  Store('app').save('resources', $rootScope.app.resources);
                  //Some options are permitted for members with teams only
                  //get access again for a memmber without teams
                  Permission.getAccess();
                }
                $rootScope.statusBar.off();
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
              });
          };
        }
    );
  }
);

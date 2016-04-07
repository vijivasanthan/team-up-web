define(
  ['../controllers'],
  function(controllers)
  {
    'use strict';

    controllers.controller(
      'create',
      function($rootScope, $anchorScroll, $location, $q, Settings,
               TeamUp, Team, Member, CurrentSelection, MD5)
      {
        var self            = this;
        self.created        = false;
        self.ttPhoneNumbers = null;
        $anchorScroll.yOffset = 15;
        init();

        /**
         * Create new member if the member data is valid
         * @param member The new member data
         * @param teamId The current selected team
         */
        self.create = function(member)
        {
          console.error('member', member);

          //check phonenumbers again after saving the data
          checkPhoneNumbers()
            .then(function(notUsedPhoneNumbers)
                  {
                    self.ttPhoneNumbers = notUsedPhoneNumbers;

                    if( ! self.ttPhoneNumbers.length )
                    {
                      $rootScope.notifier.error($rootScope.ui.options.noPhoneNumbers);
                    }
                    else
                    {
                      var error = "";
                      if( ! self.ttPhoneNumbers.length ) error = $rootScope.ui.options.noPhoneNumbers;
                      //check if a teamname is given
                      else if( self.newForm.teamName['$invalid'] )
                      {
                        error = getLocalError(self.newForm.teamName.$error, $rootScope.ui.teamup.teamName);
                        goToPart('part0');
                      }
                      else if( self.newForm.voicemail['$invalid'] )//check if a voicemail e-mailaddress is given
                      {
                        var voicemailField      = self.newForm.voicemail;
                        error                   = getLocalError(voicemailField.$error, $rootScope.ui.options.voicemailEmailAddress);
                        voicemailField.$touched = true;
                        goToPart('part0');
                      }
                      else
                      {
                        error = validateNewMembers(member);
                        $anchorScroll();
                      }

                      if( error.length ) $rootScope.notifier.error(error);
                      else
                      {
                        console.error("alles VALID");
                        //add the teamtelefoon team if no errors accurred
                        newTTTeamRequest(member)
                      }
                    }
                  });
        };

        /**
         * Reset the parsed phone numbers, get rid of the old result and messages
         * Current max 3 phone numbers
         */
        self.resetPhoneNumberCheck = function()
        {
          self.parsedPhoneNumbers = [];

          _.each([0, 1, 2],
                 function(_index)
                 {
                   self.parsedPhoneNumbers[_index] = {};
                 }
          );
        };

        self.resetPhoneNumberCheck();

        /**
         * Checks the users phonenumbers
         * @param phoneNumber
         * @param index
         */
        self.checkPhoneNumber = function(phoneNumber, index)
        {
          //Checks phone number and adds message to the designatated class by index
          $rootScope.parsePhoneNumber(phoneNumber, index);
          //Adds the number parsed result to the specific phone number
          self.parsedPhoneNumbers[index] = $rootScope.phoneNumberParsed;

          if( self.parsedPhoneNumbers[index] && self.parsedPhoneNumbers[index].result )
          {
            self.form.phone[index + 1] = self.parsedPhoneNumbers[index].format;
          }
          //reset the phonenumber afterwards
          $rootScope.resetPhoneNumberChecker();
        };

	      /**
         * Initialise the form data and checks if there are TeamTelephonenumbers left
         */
        function init()
        {
          //init empty valued form fields
          self.form = {
            teamName: "",
            voicemail: "",
            firstName: ["", "", "", ""],
            lastName: ["", "", "", ""],
            email: ["", "", "", ""],
            phone: ["", "", "", ""],
            password: ["", "", "", ""],
            reTypePassword: ["", "", "", ""]
          };

          //self.form = {
          //  teamName: "heemraadssingel",
          //  voicemail: "lala@lala.nl",
          //  firstName: ["", "henkie", "suki", ""],
          //  lastName: ["", "watdenkie", "tuki", ""],
          //  email: ["", "lala@lala.nl", "lala@lala.nl", ""],
          //  phone: ["", "+31650587992", "+31650587992", ""],
          //  password: ["", "askaskask", "askaskask", ""],
          //  reTypePassword: ["", "askaskask", "askaskask", ""]
          //};

          //Check if the last selected team is a teamtelephone team
          TeamUp._('TTOptionsGet', {second: CurrentSelection.getTeamId()})
                .then(function(options)
                      {
                        //if no teamtelephone team hide the tabs except the options and new tab,
                        //because that's for activating a TeamTelephone team
                        if( ! options.adapterId )
                        {
                          var tabs       = angular.element('.nav-tabs-app li');
                          var tabsLength = tabs.length;
                          angular.element('.nav-tabs-app li').slice(0, tabsLength - 2).hide();
                        }
                      });
          //check if there are phonenumbers left to create a TeamTelefoon team
          checkPhoneNumbers()
            .then(function(notUsedPhoneNumbers)
                  {
                    self.ttPhoneNumbers = notUsedPhoneNumbers;

                    if( ! self.ttPhoneNumbers.length )
                    {
                      $rootScope.notifier.error($rootScope.ui.options.noPhoneNumbers);
                    }
                    self.created = false;
                  });
        }

        /**
         * New TeamTelefoon Team request
         * Bunch of calls to create a team, get TeamTelephone functionality and add some members
         * @param member
         */
        function newTTTeamRequest(member)
        {
          $rootScope.statusBar.display($rootScope.ui.teamup.saveTeam);
          Team.init();//init teams, so there is a list of teams and the current one is known

          //Create the team first
          Team.create({name: member.teamName})
              .then(function(newTeam)
                    {
                      console.error("new Team ->", newTeam);
                      if( newTeam )//if the team creation was successful
                      {
                        $rootScope.statusBar.display($rootScope.ui.teamup.savingMember);
                        //Adding the members to th team
                        var memberRequestPromises = getMemberPromises(member, newTeam.uuid);
                        $q.all(memberRequestPromises)
                          .then(function(result)
                                {
                                  console.error("result ->", result);
                                  //At last activate the team as TeamTelephone team
                                  return TeamUp._(
                                    'TTOptionsActivate',
                                    {second: newTeam.uuid},
                                    {
                                      adapterId: self.ttPhoneNumbers[0].id,
                                      voicemailEmailAddress: member.voicemail,
                                      phoneNumberAlias: null
                                    }
                                  );
                                })
                          .then(function(newOptions)
                                {
                                  console.error("newOptions ->", newOptions);
                                  //if the activation of the TeamTelephone was successful
                                  if(newOptions && newOptions.phoneNumber)
                                  {
                                    //turn the page and show all the data
                                    addToCreatedScreen(newOptions.phoneNumber);
                                    $rootScope.statusBar.off();
                                  }
                                });
                      }
                    });
        }

	      /**
         * Build per added member a request promise
         * @param member all the members data
         * @param teamId The id of the team, where the member need to be added
         * @returns {Array} A array with all the members data
	       */
        function getMemberPromises(member, teamId)
        {
          var memberRequests = [];

          //check which forms are filled
          for(var index = 1; index <= 3; index ++)
          {
            if( member.firstName[index] )
            {
              member.teamUuids = [teamId];
              member.uuid      = ((member.firstName[index] + _.random(1, 1000))
                                    .match(/([A-Za-z0-9-_])/g))
                                    .join("");//member.email[index];
              member.userName  = member.uuid;
              member.role      = 2;

              var memberData = {
                uuid: member.userName,
                userName: member.userName,
                passwordHash: MD5(member.password[index]),
                firstName: member.firstName[index],
                lastName: member.lastName[index],
                phone: member.phone[index],
                email: member.email[index],
                teamUuids: member.teamUuids,
                role: member.role,
                birthDate: 0
                //function: member.function
              };
              memberRequests.push(memberRequest(memberData, teamId));
            }
          }

          return memberRequests;

          //set up request
          function memberRequest(member)
          {
            return TeamUp._(
              'memberAdd',
              null,
              member
            )
          }
        }

        /**
         * scroll to the assigned part on the page
         * @param part there are three parts by each of the member forms
         */
        function goToPart(part)
        {
          (part !== $location.hash())
            ? $location.hash(part)
            : $anchorScroll(part);
        }

        //addToCreatedScreen();

	      /**
         * If the TeamTelephone team is activated all the newly created data is shown
         * @param phoneNumber the TeamTelephonenumber
         */
        function addToCreatedScreen(phoneNumber)
        {
          //var tel = $rootScope.parsePhoneNumber("+31857348932");
          //self.createdData = {
          //  ttPhoneNr: $rootScope.phoneNumberParsed.formatNational.split(' ').join('-'),
          //  teamName: "Heemraadssingel",
          //  memberForms: {
          //    memberForm1: {
          //      name: "Henk van Rooijen",
          //      email: "lala@lala.nl",
          //      phone: "+3164590334",
          //      password: "lala123"
          //    },
          //    memberForm2: {
          //      name: "Jan de Jong",
          //      email: "lala@lala.nl",
          //      phone: "+3164590334",
          //      password: "lala123"
          //    },
          //    memberForm3: {
          //      name: "Jan Visser",
          //      email: "lala@lala.nl",
          //      phone: "+3164590334",
          //      password: "lala123"
          //    }
          //  }
          //};

           $rootScope.parsePhoneNumber(phoneNumber);
          self.createdData = {
            ttPhoneNr: $rootScope.phoneNumberParsed.formatNational.split(' ').join('-'),
            teamName: self.form.teamName,
            memberForms: {}
          };

          for(var index = 1; index <= 3; index ++)
          {
            if( self.form.firstName[index] )
            {
              var newMemberData      = {};
              newMemberData.name = self.form.firstName[index] + " " + self.form.lastName[index];
              newMemberData.email = self.form.email[index];
              newMemberData.phone = self.form.phone[index];
              newMemberData.password = self.form.password[index];
              self.createdData.memberForms['memberForm' + (index - 1)] = newMemberData;
            }
          }

          //show the newly created team with the phonenumber
          self.created = true;
          //count how many boxed needed, it depends on the amount of members added
          self.showMemberSpanClass = "col-sm-" + (12 / _.keys(self.createdData.memberForms).length);
          //reset form
          self.newForm.$setPristine();
          $rootScope.resetPhoneNumberChecker();
        }

	      /**
         * create again button after creating a teamtelefoon team
         */
        self.createAgain = function()
        {
          init();
        };

        /**
         * Check if there are phonenumbers left after applying the new TeamTelefoon team
         */
        function checkPhoneNumbers()
        {
          return TeamUp._('TTAdaptersGet', {
            adapterType: 'call',
            excludeAdaptersWithDialog: 'true'
          });
        }

        /**
         * By checking which error is found the right translation could be returned
         * @param error The errorobject
         * @param fieldName Which fieldname are we talking about
         * @returns {string} translated errormessage
         */
        function getLocalError(error, fieldName)
        {
          var errorLocalization = $rootScope.ui.validation.default,
              errorMessage      = "";
          error                 = _.findLastKey(error) || "";

          switch(error)
          {
            case "required":
              errorMessage = errorLocalization.required(fieldName);
              break;
            case "minlength":
              errorMessage = errorLocalization.minLength(fieldName);
              break;
            case "maxlength":
              errorMessage = errorLocalization.maxLength(fieldName);
              break;
            case "email":
            case "pattern":
              errorMessage = $rootScope.ui.validation.email.notValid;
              break;
            case "invalidUsername":
              errorMessage = $rootScope.ui.teamup.errorCode["14"];
              break;
            case "invalidTeamname":
              errorMessage = $rootScope.ui.teamup.teamNameExistTitle;
              break;
          }
          return errorMessage;
        }

        /**
         * Validate new members,
         * especially because it's possible to add three in one time
         * @param member it's the member form
         * @returns {string} a errormessage could be empty by not finding any error
         */
        function validateNewMembers(member)
        {
          //mega loop, to check by index which member form is filled
          for(var index = 1; index <= 3; index ++)
          {
            var memberFormFilled = false,
                error            = "";
            //check if which member form is filled
            if( member &&
              ( (member.firstName[index]) ||
              (member.email[index]) ||
              (member.phone[index]) ||
              (member.password[index]) ||
              (member.reTypePassword[index]))
            )
            {
              //if form is filled
              memberFormFilled = true;
            }

            if( memberFormFilled || index === 1 )
            {
              if( member )
              {
                //if not index 1 add , a second or thirth team member are optional
                var currentMemberForm = self.newForm['memberFieldForm' + index];

                if( ! member.firstName[index] || currentMemberForm.firstname['$invalid'] )
                {
                  currentMemberForm.firstname.$touched = true;
                  error                                = getLocalError(currentMemberForm.firstname.$error,
                                                                       $rootScope.ui.profile.firstName
                  );
                }
                else if( currentMemberForm.lastname['$invalid'] )
                {
                  currentMemberForm.lastname.$touched = true;
                  error                               = getLocalError(currentMemberForm.lastname.$error,
                                                                      $rootScope.ui.profile.lastName
                  );
                }
                else if( ! member.email[index] || currentMemberForm.email['$invalid'] )
                {
                  currentMemberForm.email.$touched = true;
                  error                            = getLocalError(currentMemberForm.email.$error, "e-mail");
                }
                else if( (! _.isUndefined(self.parsedPhoneNumbers[index - 1]) && ! self.parsedPhoneNumbers[index - 1].result) || ! member.phone[index] )
                {
                  currentMemberForm.phone.$touched = true;
                  error                            = self.parsedPhoneNumbers[index - 1].message || $rootScope.ui.validation.phone.notValid;
                }
                else if( ! member.password[index] || currentMemberForm.password['$invalid'] )
                {
                  currentMemberForm.password.$touched = true;
                  error                               = getLocalError(currentMemberForm.password.$error,
                                                                      $rootScope.ui.login.ph_password.toLowerCase()
                  );
                }
                else if( member.reTypePassword[index] !== member.password[index] )
                {
                  error = $rootScope.ui.profile.passNotMatch;
                }
              }
              else error = $rootScope.ui.teamup.minimumOneMember;

              if( error.length )
              {
                goToPart('part' + index);
                return error + " " + $rootScope.ui.teamup.teamMember.toLocaleLowerCase() + " " + index;
              }
            }
          }
          return error;
        }
      }
    );
  }
);

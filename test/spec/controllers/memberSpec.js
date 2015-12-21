define(
  [
    'angular-mocks',
    'app',
    'controllers/team/member',
    'services/teamup',
    'services/teams',
    'modals/permission',
    'modals/profile',
    'services/moment',
    'services/settings',
    'services/currentSelection',
    'services/sloter',
    'services/stats',
    'services/member',
    'session',
    'services/md5',
    'lawnchair',
    'lawnchair-dom',
    'services/dater'
  ],
  function ()
  {
    'use strict';

    describe('Member Controller', function ()
    {
      beforeEach(
        module(
          'controllers',
          'services',
          'ngResource'
        )
      );

      afterEach(inject(function ($httpBackend)
      {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      }));

      var memberCtrl,
        rootScope,
        scope,
        Store,
        $httpBackend,
        md5Service,
        memberService,
        settingsService,
        dataService,
        momentService;

      // Initialize the controller and a mock scope
      beforeEach(
        inject
        (
          function ($controller,
                    _$rootScope_,
                    _$compile_,
                    _Member_,
                    _$httpBackend_,
                    _Store_,
                    _Settings_,
                    _MD5_,
                    _moment_)
          {
            rootScope = _$rootScope_;
            rootScope.statusBar = {
              display: function (message)
              {
                return message;
              },
              off: function ()
              {
                return null;
              }
            }
            rootScope.notifier = {
              error: function (error)
              {
                return error;
              },
              success: function ()
              {
                return 'success';
              }
            };
            rootScope.ui = {
              teamup: {
                teamNamePrompt1: 'Vul een teamnaam in.',
                saveTeam: 'Team opslaan',
                loadMembersByName: 'Leden laden...'
              },
              login: {
                loading_Members: 'Loading team members...'
              },
              validation: {
                search: {
                  notValid: 'Voer een voor- en/of achternaam in!'
                },
                email: {
                  notValid: 'Voer een valide e-mailadres in!'
                }
              }
            };
            rootScope.app = {
              resources: {
                teamUuids: testConfig.userResources.teamUuids
              },
              domainPermission: {
                clients: false
              }
            };
            rootScope.phoneNumberParsed = {
              result: function ()
              {
                return "+3165321312";
              }
            };
            rootScope.showChangedAvatar = function (team, uuid)
            {
              return null;
            };
            rootScope.infoUserWithoutTeam = function ()
            {
              return null;
            }
            memberService = _Member_;
            settingsService = _Settings_;
            settingsService.setBackEnd(testConfig.host);
            dataService = {};
            Store = _Store_;
            $httpBackend = _$httpBackend_;
            md5Service = _MD5_;
            momentService = _moment_;
            memberCtrl = $controller('member', {
              Member: memberService,
              data: dataService
            });
          }
        )
      );

      //delete a member

      //it('should give a error, because the e-mailfield is not filled', function ()
      //{
      //  var member = {
      //    "uuid": "Jansen",
      //    "userName": "Jansen",
      //    "passWord": md5Service('123123123'),
      //    "firstName": "Jan",
      //    "lastName": "Jansen",
      //    "phone": "+3165321312",
      //    "email": "",
      //    "role": "1",
      //    "team": [
      //      "b3915de1-f29c-4609-a67f-73aaef529902"
      //    ],
      //    teamUuids: [ "b3915de1-f29c-4609-a67f-73aaef529902"],
      //    "extraInfo": {
      //      "photoUUID": "04ecc3e9-c049-4df6-8054-93a26b443917"
      //    }
      //  };
      //
      //  var memberValid = memberService.valid(member);
      //  expect(memberValid)
      //    .toEqual(false);
      //});

      //create a member
      it("should add a member to the team", function ()
      {
        var member = {
          "uuid": "Jansen",
          "userName": "Jansen",
          "passwordHash": md5Service('123123123'),
          "password": '123123123',
          "reTypePassword": '123123123',
          "firstName": "Jan",
          "lastName": "Jansen",
          "email": "janjansen@gmail.com",
          teamUuids: [ "b3915de1-f29c-4609-a67f-73aaef529902"],
          "phone": "+3165321312",
          "team": [
            "b3915de1-f29c-4609-a67f-73aaef529902"
          ],
          "role": "1",
          "birthDate":0
        };
        rootScope.phoneNumberParsed.format = member.phone;
        rootScope.resetPhoneNumberChecker = function (){ return null; };

        var memberData = angular.copy(member);
        delete memberData.password;
        delete memberData.reTypePassword;
        delete memberData.team;


        memberCtrl.newForm = {
          "$valid": true,
          $setPristine: function ()
          {
            return true;
          },
          "$setUntouched": function ()
          {
            return true;
          },
          "$submitted": false,
          "$setValidity": function ()
          {
            return true;
          }
        };

        $httpBackend
          .expectPOST(testConfig.host + 'team/member', memberData)
          .respond(200, {});

        memberCtrl.create(member, "b3915de1-f29c-4609-a67f-73aaef529902");
        $httpBackend.flush();

        expect(true)
          .toEqual(true);
      })

      it("should find all member by the firstname henk", function ()
      {
        var searchVal = testConfig.userResources.firstName;
        var resultTeamId = testConfig.userResources.teamUuids[0];
        var foundMember = testConfig.userResources;
        $httpBackend
          .expectGET(testConfig.host + 'teammembers?query=' + searchVal)
          .respond(200, {
            members: [foundMember],
            teams: [{
              name: "Stefan Team",
              uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
            }]
          });

        memberCtrl.search(searchVal);
        $httpBackend.flush();

        expect(memberCtrl.searchResults[0].firstName)
          .toEqual(searchVal);
        expect(memberCtrl.searchTeams[0].uuid)
          .toEqual(resultTeamId);
      });

      it('should give a error, because submitted searchvalue was empty', function ()
      {
        memberService.search('')
          .then(null, function (errorMessage)
          {
            expect(errorMessage)
              .toEqual(rootScope.ui.validation.search.notValid);
          });
      });
    });
  }
);
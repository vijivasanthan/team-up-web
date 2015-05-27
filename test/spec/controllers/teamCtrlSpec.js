define(
  [
    'angular-mocks',
    'angular-route',
    'app',
    'lodash',
    'bootstrap',
    'moment',
    'lawnchair',
    'lawnchair-dom',
    'controllers/teams',
    'services/teams',
    'services/currentSelection',
    'modals/permission'
  ],
  function() {
    'use strict';

    describe('Teams Controller', function () {

      beforeEach(
        module(
          'controllers',
          'services',
          'ngResource',
          'ngRoute'
        )
      );

      afterEach(inject(function($httpBackend)
      {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      }));

      var teamsCtrl,
          rootScope,
          scope,
          $httpBackend,
          $location,
          data,
          teamsService,
          currentSelectionService,
          Store,
          Permission;

      // Initialize the controller and a mock scope
      beforeEach(
        inject
        (
          function (
            $controller,
            _CurrentSelection_,
            _$rootScope_,
            _$httpBackend_,
            _$location_,
            _Teams_,
            _Permission_,
            _Store_
          )
          {
            rootScope = _$rootScope_;
            scope = rootScope.$new();
            $httpBackend = _$httpBackend_;
            $location = _$location_;
            Store = _Store_;
            Permission = _Permission_;

            data = {};

            data.teams = [{
              name: "Stefan Team",
              uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
            },
              {
                name: "Suki Team",
                uuid: "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4"
              }
            ];

            data.members = {
              "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4": [
                {
                  "uuid": "suki",
                  "userName": "suki",
                  "firstName": "Suki",
                  "lastName": "van Beusekom",
                  "phone": "+31650587992",
                  "email": "",
                  "role": "1",
                  "function": null,
                  "birthDate": -3600000,
                  "phoneAddresses": [
                    "+31650587992"
                  ],
                  "emailAddresses": [
                    ""
                  ],
                  "teamUuids": [
                    "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4"
                  ],
                  "extraInfo": {
                    "photoUUID": "e01612fb-3b9a-4fc7-a22c-4cefe49d3ab5"
                  },
                  "address": null,
                  "states": [],
                  "apnskey": null,
                  "gcmkey": null,
                  "fullName": "Suki van Beusekom"
                }
              ],
              "b3915de1-f29c-4609-a67f-73aaef529902": [
                {
                  "uuid": "antoinette",
                  "userName": "antoinette",
                  "firstName": "Antoinette",
                  "lastName": "Habraken",
                  "phone": "+31103032453",
                  "email": "",
                  "role": "1",
                  "function": "1",
                  "birthDate": -3600000,
                  "phoneAddresses": [
                    "+31103032453"
                  ],
                  "emailAddresses": [
                    ""
                  ],
                  "teamUuids": [
                    "b3915de1-f29c-4609-a67f-73aaef529902"
                  ],
                  "extraInfo": {},
                  "address": null,
                  "states": [],
                  "apnskey": null,
                  "gcmkey": null,
                  "fullName": "Antoinette Habraken"
                },
                {
                  "uuid": "henkie",
                  "userName": "henkie",
                  "firstName": "henk",
                  "lastName": "van R00ijen",
                  "phone": "+31654789522",
                  "email": "hgvanrooijen@gmail.com",
                  "role": "1",
                  "function": "1",
                  "birthDate": 1420498800000,
                  "phoneAddresses": [
                    "+31654789522",
                    "+31658792547"
                  ],
                  "emailAddresses": [
                    "hgvanrooijen@gmail.com"
                  ],
                  "teamUuids": [
                    "7fde00aa-9a85-4425-b04c-b6ca4390658b",
                    "b3915de1-f29c-4609-a67f-73aaef529902"
                  ],
                  "extraInfo": {
                    "photoUUID": "04ecc3e9-c049-4df6-8054-93a26b443917"
                  },
                  "address": null,
                  "states": [],
                  "apnskey": null,
                  "gcmkey": null,
                  "fullName": "henk van R00ijen"
                },
                {
                  "uuid": "erwin",
                  "userName": "erwin",
                  "firstName": "Erwin",
                  "lastName": "Bretscher",
                  "phone": "+31612345678",
                  "email": "erwin@ask-cs.com",
                  "role": "1",
                  "function": null,
                  "birthDate": 1426460400000,
                  "phoneAddresses": [
                    "+31612345678"
                  ],
                  "emailAddresses": [
                    "erwin@ask-cs.com"
                  ],
                  "teamUuids": [
                    "b3915de1-f29c-4609-a67f-73aaef529902"
                  ],
                  "extraInfo": {},
                  "address": null,
                  "states": [],
                  "apnskey": null,
                  "gcmkey": null,
                  "fullName": "Erwin Bretscher"
                }
              ]
            };

            rootScope = {
              checkUpdatedStatesLoggedUser: function(member)
              {
                return null;
              },
              fixStyles: function()
              {
                return null;
              },
              notification: {
                status: false
              },
              ui: {
                dashboard: {
                  everyone: 'Iedereen'
                },
                teamup: {
                  accountInfoFill: 'accountinformatiem waaronder het password niet valide',
                  dataChanged: 'Data is gewijzigd!!'
                }
              },
              resetPhoneNumberChecker: function()
              {
                return null;
              },
              statusBar: {
                display: function(currentTeam) {},
                off: function(){}
              },
              pincodeExists: function(pincode, uuid, bool)
              {
                return null;
              },
              notifier: {
                error: function(errorMessage)
                {
                  return errorMessage
                },
                success: function(succesMessage)
                {
                  return succesMessage;
                }
              },
              phoneNumberParsed: {
                result: function(){
                  return true;
                }
              }
            };

            rootScope.app = {
              domainPermission: {
                clients: true
              },
              resources: testConfig.userResources
            };

            Store('app').save('teams', data.teams);

            currentSelectionService = _CurrentSelection_;
            teamsService = _Teams_;

            teamsCtrl = $controller('teamCtrl', {
              $location: $location,
              data: data,
              Teams: teamsService,
              CurrentSelection: currentSelectionService,
              Store: Store,
              $rootScope: rootScope,
              $scope: scope
            });
          }
        )
      );

      it('should get the list of teammembers of the testuser', function ()
      {
        Store('app').save(scope.current, scope.data.members);

        Store('app').save((scope.data.teams[1]).uuid, [
          {
            "uuid": "suki",
            "userName": "suki",
            "firstName": "Suki",
            "lastName": "van Beusekom",
            "phone": "+31650587992",
            "email": "",
            "role": "1",
            "function": null,
            "birthDate": -3600000,
            "phoneAddresses": [
              "+31650587992"
            ],
            "emailAddresses": [
              ""
            ],
            "teamUuids": [
              "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4"
            ],
            "extraInfo": {
              "photoUUID": "e01612fb-3b9a-4fc7-a22c-4cefe49d3ab5"
            },
            "address": null,
            "states": [],
            "apnskey": null,
            "gcmkey": null,
            "fullName": "Suki van Beusekom"
          }
        ]);

        $httpBackend.expectGET(testConfig.host + 'team').respond(scope.data.teams);

        $httpBackend.expectGET(testConfig.host + 'team/status/' + scope.current)
          .respond(scope.data.members[scope.current]);

        scope.loadTeams();

        $httpBackend.flush();

        expect(scope.members[0]).toBe(scope.data.members[scope.current][0]);
      });

      it('Should get the username and teamId of the member who is added', function ()
      {
        scope.data = data;

        var member = {
          uuid: "levis1234",
          userName: "levis1234",
          passwordHash: "4e8cc74b2e654b94acd1aea8fc654760",
          firstName: "Levi",
          lastName: "S",
          email: "levis@ask-cs.com",
          teamUuids: [scope.current],
          role: "1",
          birthDate: 0,
          phone: "+31645895478"
        };

        var memberInfo = angular.copy(member);
        memberInfo.password = 'askaskask';
        memberInfo.reTypePassword = memberInfo.password;
        memberInfo.pincode = 12345678;
        memberInfo.team = scope.current;

        var url = testConfig.host + 'team/member';

        var responsePostMember = {
          uuid: member.uuid,
          teamId: scope.current
        };

        $httpBackend.expectPOST(url, member).respond(responsePostMember);

        var resourceUrl = testConfig.host + 'node/' + member.uuid + '/resource';

        $httpBackend.expectGET(testConfig.host + 'team').respond(scope.data.teams);

        $httpBackend.expectGET(testConfig.host + 'team/status/' + scope.current)
          .respond(scope.data.members[scope.current]);

        //pincode is temp off
        //$httpBackend.expectPUT(resourceUrl, {pincode: memberInfo.pincode}).respond(true);

        scope.memberSubmit(memberInfo);

        $httpBackend.flush();

        expect(member.uuid).toEqual(responsePostMember.uuid);
        expect(scope.current).toEqual(responsePostMember.teamId);
      });

      it('Should get the same result by searching on the testuser comparing with his own resources', function ()
      {
        var expectedResponse = {
          "teams": [
            {
              "name": "Stefan Team",
              "uuid": "b3915de1-f29c-4609-a67f-73aaef529902"
            }
          ],
          "members": [
            {
              "uuid": "henkie",
              "userName": "henkie",
              "firstName": "henk",
              "lastName": "R00ijen",
              "phone": "+31654789522",
              "email": "hgvanrooijen@gmail.com",
              "role": "1",
              "function": "1",
              "birthDate": 1420498800000,
              "phoneAddresses": null,
              "emailAddresses": null,
              "teamUuids": [
                "b3915de1-f29c-4609-a67f-73aaef529902"
              ],
              "extraInfo": {
                "photoUUID": "04ecc3e9-c049-4df6-8054-93a26b443917"
              },
              "fullName": "henk R00ijen"
            }
          ]
        };
        var firstName = rootScope.app.resources.firstName;
        var lastName = rootScope.app.resources.lastName;
        var searchValue = encodeURIComponent(firstName + ' ' + lastName);
        var url = testConfig.host + 'teammembers?query=' + encodeURIComponent(searchValue);

        scope.membersBySearch = {};

        $httpBackend.expectGET(url).respond(expectedResponse);

        scope.searchMember(searchValue);

        $httpBackend.flush();

        //found members saved in scope.membersBySearch
        var member = _.findWhere(scope.membersBySearch, {uuid: rootScope.app.resources.uuid});
        var memberEqual = _.isEqual(member, rootScope.app.resources);

        expect(memberEqual).toBe(true);
      });

      it('Should check if the newly added team is the only team of the testuser', function ()
      {
        rootScope.app.resources.teamUuids = ['b3915de1-f29c-4609-a67f-73aaef529902'];

        //1 for change team, 2 for add team
        var changeMemberTeamOption = 1;
        var teamId = (scope.data.teams[1]).uuid;
        var url = testConfig.host + 'team/' + rootScope.app.resources.teamUuids[0] + '/removeMember';
        var data = {
          ids: [rootScope.app.resources.uuid]
        };

        scope.current = teamId;

        $httpBackend.expectPUT(url, data).respond({result: ''});

        var postUrl = testConfig.host + 'team/' + scope.current + '/member';

        $httpBackend.expectPOST(postUrl, data).respond('ok');

        $httpBackend.expectGET(testConfig.host + 'team').respond(data.teams);

        inject(function ($rootScope)
        {
          $rootScope.app = {
            resources: testConfig.userResources
          };

          scope.changeMemberTeam($rootScope.app.resources, changeMemberTeamOption);

          $httpBackend.flush();

          expect($rootScope.app.resources.teamUuids.length).toBe(1);
          expect($rootScope.app.resources.teamUuids[0]).toBe(teamId);
        });
      });

      it('Should get a positive response if a existing member is added to a team', function ()
      {
        var member = rootScope.app.resources;
        var teamId = (scope.data.teams[1]).uuid;
        var url = testConfig.host + 'team/' + teamId + '/member';
        var response = {0 : 'o', 1 : 'k'};

        scope.current = teamId;

        $httpBackend.expectPOST(
          url,
          {ids: [member.uuid]}
        ).respond(response);

        $httpBackend.expectGET(testConfig.host + 'team').respond(scope.data.teams);

        $httpBackend.expectGET(testConfig.host + 'team/status/' + scope.current)
          .respond(scope.data.members[scope.current]);

        scope.addExistingMember(member);

        $httpBackend.flush();

        expect(scope.result[0] + scope.result[1]).toBe(response[0] + response[1]);
      });

      it('Should get the selected teamUuid as parameter in the URL', function ()
      {
        inject(function ($rootScope) {
          $rootScope.app = {
            domainPermission: {
              clients: true
            }
          };

          scope.current = (data.teams[0]).uuid;

          scope.requestTeam(scope.current);

          var urlParameters = $location.search();
          //test hier op get toevoegen van een team
          expect(urlParameters.uuid).toBe(scope.current);
        });
      });

      it('Should check ', function ()
      {
        //zet rol teamlid and try to add a new teams
      });
    });
  }
);
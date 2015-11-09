define(
  [
    'angular-mocks',
    'app',
    'controllers/team',
    'services/team',
    'services/teamup',
    'services/teams',
    'modals/permission',
    'modals/profile',
    'services/moment',
    'services/currentSelection',
    'services/sloter',
    'services/stats',
    'session',
    'services/md5',
    'lawnchair',
    'lawnchair-dom',
    'services/dater'
  ],
  function ()
  {
    'use strict';

    describe('Team Controller', function ()
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

      var teamCtrl,
        rootScope,
        scope,
        Store,
        $httpBackend,
        md5Service,
        teamService,
        momentService;

      // Initialize the controller and a mock scope
      beforeEach(
        inject
        (
          function ($controller,
                    _$rootScope_,
                    _Team_,
                    _$httpBackend_,
                    _Store_,
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
                saveTeam: 'Team opslaan'
              },
              login: {
                loading_Members: 'Loading team members...'
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
            rootScope.showChangedAvatar = function (team, uuid)
            {
              return null;
            };
            rootScope.infoUserWithoutTeam = function ()
            {
              return null;
            }
            teamService = _Team_;

            teamService.list = [{
              name: "Stefan Team",
              uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
            },
              {
                name: "Suki Team",
                uuid: "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4"
              }
            ];

            teamService.getList = function ()
            {
              return teamService.list;
            };

            teamService.current = {
              teamId: rootScope.app.resources.teamUuids[0]
            };

            teamService.getCurrent = function ()
            {
              return teamService.current;
            };

            teamService.setCurrent = function (teamId)
            {
              teamService.current.teamId = teamId;
            };

            Store = _Store_;
            $httpBackend = _$httpBackend_;
            md5Service = _MD5_;
            momentService = _moment_;
            teamCtrl = $controller('team', {
              Team: teamService,
            });
          }
        )
      );

      it('should return the uuid of the newly added team as current team', function ()
      {
        teamService.list = [{
          name: "Stefan Team",
          uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
        },
          {
            name: "Suki Team",
            uuid: "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4"
          }
        ];

        teamCtrl.list = teamService.list;
        teamCtrl.new = {
          $valid: true
        };
        var newTeam = {name: 'Test team'};

        $httpBackend
          .expectPOST(testConfig.host + 'team',
          newTeam)
          .respond(200, {
            uuid: '123',
            name: newTeam.name
          });

        $httpBackend
          .expectGET(testConfig.host + 'team')
          .respond(200, [{
            name: "Stefan Team",
            uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
          },
            {
              name: "Suki Team",
              uuid: "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4"
            }
          ]);

        teamCtrl.create(newTeam);
        $httpBackend.flush();

        expect(teamCtrl.current.teamId)
          .toEqual(teamCtrl.list[2].uuid);
      });

      it('should be a new list of members, because a new team is loaded', function ()
      {
        teamService.list = [{
          name: "Stefan Team",
          uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
        },
          {
            name: "Suki Team",
            uuid: "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4"
          }
        ];

        teamCtrl.list = teamService.list;
        Store('app').save('teams', teamCtrl.list);
        teamService.setCurrent(teamCtrl.list[0].uuid);

        var readTeamId = teamCtrl.list[1].uuid,
          respondResult = [{uuid: 'suki', name: 'sukisuki'}]

        $httpBackend
          .expectGET(testConfig.host + 'team/status/' + readTeamId)
          .respond(200, respondResult);

        teamCtrl.read(readTeamId);
        $httpBackend.flush();

        expect(readTeamId)
          .toEqual(teamCtrl.current.teamId);
      });

      it('should check if the current teamname could be updated', function ()
      {
        var teams = [{
          name: "Stefan Team",
          uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
        },
          {
            name: "Suki Team",
            uuid: "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4"
          }];
        Store('app').save('teams', teams);
        teamCtrl.init(teams[0].uuid);

        var teamId = teamCtrl.current.teamId;
        var payload = {
          name: "This is the TestTeam",
          uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
        };
        var respondResult = teams;
        respondResult[0] = payload;

        $httpBackend
          .expect('PUT', testConfig.host + 'team/' + teamId, payload)
          .respond(200, payload);

        $httpBackend
          .expectGET(testConfig.host + 'team')
          .respond(200, respondResult);

        teamCtrl.update(teamId, payload);
        $httpBackend.flush();

        expect(respondResult[0].name)
          .toEqual(teamCtrl.list[1].name);
      });

      //it("should check if the teamname couldn't be empty by a update", function ()
      //{
      //  var teams = [{
      //    name: "Stefan Team",
      //    uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
      //  },
      //    {
      //      name: "Suki Team",
      //      uuid: "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4"
      //    }];
      //  Store('app').save('teams', teams);
      //  teamCtrl.init(teams[0].uuid);
      //
      //  var teamId = teamCtrl.current.teamId;
      //  var payload = {
      //    name: "",
      //    uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
      //  };
      //  var errorMessage = null;
      //
      //
      //  teamService.update(teamId, payload)
      //    .then(null, function (error)
      //    {
      //      errorMessage = error;
      //    });
      //  rootScope.$apply();
      //
      //  expect('Vul een teamnaam in.')
      //    .toEqual(errorMessage);
      //});

      it('should initialize the list of teams and the current team', function ()
      {
        var teams = [{
          name: "Stefan Team",
          uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
        },
          {
            name: "Suki Team",
            uuid: "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4"
          }];
        Store('app').save('teams', teams);
        teamCtrl.init(teams[0].uuid);

        expect(teams[0].uuid)
          .toEqual(teamCtrl.current.teamId);
        expect(teams[0].name)
          .toEqual(teamCtrl.list[1].name);
      });




      //it("should check if a team could be removed", function ()
      //{
      //  var teams = [{
      //    name: "Stefan Team",
      //    uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
      //  },
      //    {
      //      name: "Suki Team",
      //      uuid: "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4"
      //    }];
      //  teamCtrl.init(teams[0].uuid);
      //
      //  teamCtrl.delete(teamCtrl.current.teamId, true);
      //
      //  console.error('teamCtrl.list', teamCtrl.list);
      //
      //});


      //it("should check if the confirmation appears if the user tries to delete a team", function ()
      //{
      //  var teams = [{
      //    name: "Stefan Team",
      //    uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
      //  },
      //    {
      //      name: "Suki Team",
      //      uuid: "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4"
      //    }];
      //  Store('app').save('teams', teams);
      //  teamCtrl.init(teams[0].uuid);
      //
      //  teamCtrl.delete(teamCtrl.current.teamId);
      //  rootScope.$apply();
      //});

      //it("should check if the confirmation appears if the user tries to delete a team", function ()
      //{
      //  var teams = [{
      //    name: "Stefan Team",
      //    uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
      //  },
      //    {
      //      name: "Suki Team",
      //      uuid: "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4"
      //    }];
      //  Store('app').save('teams', teams);
      //  teamCtrl.init(teams[0].uuid);
      //
      //  teamCtrl.delete(teamCtrl.current.teamId);
      //  rootScope.$apply();
      //});

      //Check if the the editform closes by changing a team

      //it('should add a member to team', function ()
      //{
      //  var teams = [{
      //    name: "Stefan Team",
      //    uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
      //  },
      //    {
      //      name: "Suki Team",
      //      uuid: "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4"
      //    }];
      //  Store('app').save('teams', teams);
      //
      //
      //})




      //it('should return a error message saying, "Wrong username or password!"', function ()
      //{
      //  inject(function($controller) {
      //    Store('app').save('loginData', {});
      //
      //    var teamCtrl = $controller('team', {
      //      team: teamService
      //    });
      //
      //    loginCtrl.loginData = {
      //      username: testConfig.userResources.userName,
      //      password: "12fdsfggfd_fake_password_dsada432"
      //    };
      //
      //    Store('app').save('loginData', loginCtrl.loginData);
      //
      //    $httpBackend
      //      .expectGET(testConfig.host + 'login?pass=' +  md5Service(loginCtrl.loginData.password) + '&uuid=' + loginCtrl.loginData.username)
      //      .respond(404, {});
      //
      //    loginCtrl.login();
      //
      //    $httpBackend.flush();
      //
      //    expect(loginCtrl.error.login.message)
      //      .toEqual(rootScope.ui.login.alert_wrongUserPass);
      //  });
      //});
      //
      //it('should return a error message saying, "Fill in all fields!"', function ()
      //{
      //  inject(function($controller) {
      //    Store('app').save('loginData', {});
      //
      //    var loginCtrl = $controller('login', {
      //      Login: loginService
      //    });
      //
      //    loginCtrl.loginData = {
      //      username: testConfig.userResources.userName
      //    };
      //
      //    Store('app').save('loginData', loginCtrl.loginData);
      //
      //    loginCtrl.login();
      //
      //    expect(loginCtrl.error.login.message)
      //      .toEqual(rootScope.ui.login.alert_fillfiled);
      //  });
      //});
      //
      //it('should return a error message saying, "Your session has ended. Please login again"', function ()
      //{
      //  inject(function($controller) {
      //    var loginData = {
      //      username: testConfig.userResources.userName
      //    };
      //    Store('app').save('loginData', loginData);
      //    localStorage.setItem('sessionTimeout', '');
      //
      //    var login = $controller('login', {
      //      Login: loginService
      //    });
      //
      //    expect(login.error.login.message)
      //      .toEqual(rootScope.ui.teamup.sessionTimeout);
      //  });
      //});

      function loginRequests(loginData)
      {
        $httpBackend
          .expectGET(testConfig.host + 'login?pass=' + loginData.password + '&uuid=' + loginData.username)
          .respond({});

        $httpBackend
          .expectGET(testConfig.host + 'team/member')
          .respond(rootScope.app.resources);

        $httpBackend
          .expectGET(testConfig.host + 'team')
          .respond([]);

        $httpBackend
          .expectGET(testConfig.host + 'acl')
          .respond({});

        $httpBackend.flush();
      }
    });
  }
);
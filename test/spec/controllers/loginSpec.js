define(
  [
    'angular-mocks',
    'app',
    'controllers/login',
    'services/login',
    'services/teamup',
    'services/teams',
    'modals/permission',
    'services/moment',
    'session',
    'services/md5',
    'lawnchair',
    'lawnchair-dom',
    'services/dater'
  ],
  function() {
    'use strict';

    describe('Login Controller', function () {

      beforeEach(
        module(
          'controllers',
          'services',
          'ngResource'
        )
      );

      afterEach(inject(function($httpBackend)
      {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      }));

      var loginCtrl,
          rootScope,
          scope,
          Store,
          $httpBackend,
          md5Service,
          loginService,
          momentService;

      // Initialize the controller and a mock scope
      beforeEach(
        inject
        (
          function (
            $controller,
            _$rootScope_,
            _Login_,
            _$httpBackend_,
            _Store_,
            _MD5_,
            _moment_
          )
          {
            rootScope = _$rootScope_;
            rootScope.ui = {
              login: {
                alert_wrongUserPass: 'Onjuiste gebruikersnaam of wachtwoord!'
              },
              teamup: {
                sessionTimeout: 'Uw sessie is verlopen. Graag nogmaals inloggen.'
              }
            };
            rootScope.app = {
              resources: {
                teamUuids: testConfig.userResources.teamUuids
              }
            };
            rootScope.showChangedAvatar = function(team, uuid)
            {
              return null;
            };
            rootScope.infoUserWithoutTeam = function()
            {
              return null;
            }
            loginService = _Login_;
            Store = _Store_;
            $httpBackend = _$httpBackend_;
            md5Service = _MD5_;
            momentService = _moment_;
          }
        )
      );

      it('should return true, if the password is saved in the localStorage the remember me checkbox must be checked', function ()
      {
        inject(function($controller) {
          var loginData = {
            username: testConfig.userResources.userName,
            password: md5Service(testConfig.userResources.passWord)
          };
          Store('app').save('loginData', loginData);

          var login = $controller('login', {
            Login: loginService
          });

          loginRequests(loginData);

          expect(true)
            .toEqual(login.loginData.remember);
        });
      });

      it('should return a error message saying, "Wrong username or password!"', function ()
      {
        inject(function($controller) {
          Store('app').save('loginData', {});

          var loginCtrl = $controller('login', {
            Login: loginService
          });

          loginCtrl.loginData = {
            username: testConfig.userResources.userName,
            password: "12fdsfggfd_fake_password_dsada432"
          };

          Store('app').save('loginData', loginCtrl.loginData);

          $httpBackend
            .expectGET(testConfig.host + 'login?pass=' +  md5Service(loginCtrl.loginData.password) + '&uuid=' + loginCtrl.loginData.username)
            .respond(404, {});

          loginCtrl.login();

          $httpBackend.flush();

          expect(loginCtrl.error.login.message)
            .toEqual(rootScope.ui.login.alert_wrongUserPass);
        });
      });

      it('should return a error message saying, "Fill in all fields!"', function ()
      {
        inject(function($controller) {
          Store('app').save('loginData', {});

          var loginCtrl = $controller('login', {
            Login: loginService
          });

          loginCtrl.loginData = {
            username: testConfig.userResources.userName
          };

          Store('app').save('loginData', loginCtrl.loginData);

          loginCtrl.login();

          expect(loginCtrl.error.login.message)
            .toEqual(rootScope.ui.login.alert_fillfiled);
        });
      });

      it('should return a error message saying, "Your session has ended. Please login again"', function ()
      {
        inject(function($controller) {
          var loginData = {
            username: testConfig.userResources.userName
          };
          Store('app').save('loginData', loginData);
          localStorage.setItem('sessionTimeout', '');

          var login = $controller('login', {
            Login: loginService
          });

          expect(login.error.login.message)
            .toEqual(rootScope.ui.teamup.sessionTimeout);
        });
      });

      function loginRequests(loginData)
      {
        $httpBackend
          .expectGET(testConfig.host + 'login?pass=' +  loginData.password + '&uuid=' + loginData.username)
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
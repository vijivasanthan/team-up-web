define(
  [
    'angular-mocks',
    'app',
    'controllers/login/password',
    'services/password',
    'services/login',
    'modals/profile',
    'services/currentSelection',
    'services/md5'
  ],
  function ()
  {
    'use strict';

    describe('Password Controller', function ()
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

      var passwordCtrl,
        rootScope,
        $httpBackend,
        md5Service,
        passwordService,
        loginService;

      // Initialize the controller and a mock scope
      beforeEach(
        inject
        (
          function ($controller,
                    _$rootScope_,
                    _Password_,
                    _$httpBackend_,
                    _Login_,
                    _MD5_)
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
              profile: {
                forgot_password: 'Wachtwoord vergeten'
              },
              validation: {
                userName: {
                  valid: 'Een gebruikersnaam is vereist'
                }
              }
            };

            $httpBackend = _$httpBackend_;
            md5Service = _MD5_;
            loginService: _Login_;
            passwordService: _Password_;
            passwordCtrl = $controller('password', {
              $routeParams: {uuid: 'henkie', key: '1234'},
              Login: loginService
            });
          }
        )
      );
      //teamCtrl.list = teamService.list;
      //var newTeam = {name: 'Test team'};
      //
      //$httpBackend
      //  .expectPOST(testConfig.host + 'team',
      //  newTeam)
      //  .respond(200, {
      //    uuid: '123',
      //    name: newTeam.name
      //  });
      //
      //$httpBackend
      //  .expectGET(testConfig.host + 'team')
      //  .respond(200, {});
      //
      //teamCtrl.create(newTeam);
      //$httpBackend.flush();

      it('Should be true, because the changepassword form must be showed if the routeParams uuid and key are filled in by initialisation', function ()
      {
        expect(passwordCtrl.views.change)
          .toEqual(true);
      });

      //it('Should get an error if the username is not filled in in the Password forgot', function ()
      //{
      //  passwordCtrl.forgot('');
      //  console.error('passwordCtrl', passwordCtrl);
      //  expect(rootScope.ui.profile.forgot_password)
      //    .toEqual(passwordCtrl['error'].message);
      //});


    });
  }
);
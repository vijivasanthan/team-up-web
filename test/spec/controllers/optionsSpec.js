define(
  [
    'angular-mocks',
    'app',
    'controllers/options',
    'services/currentSelection'
  ],
  function() {
    'use strict';

    describe('Options Controller', function () {

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

      var optionsCtrl,
          rootScope,
          scope,
          $q,
          $httpBackend,
          $filter,
          data,
          currentSelectionService;

      // Initialize the controller and a mock scope
      beforeEach(
        inject
        (
          function (
            $controller,
            _$rootScope_,
            _$q_,
            _$injector_,
            _$filter_,
            _$httpBackend_,
            _Logs_,
            _moment_,
            _CurrentSelection_,
            _Store_
          )
          {
            rootScope = _$rootScope_;
            scope = rootScope.$new();
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            $filter = _$filter_;
            currentSelectionService = _CurrentSelection_,
            data = {
              logData: {
                periods: {
                  startTime: 1425596400000,
                  endTime: 1426164091944
                }
              },
              teams: [{
                name: 'Stefan team',
                teamId: 'b3915de1-f29c-4609-a67f-73aaef529902',
                adapterId: '502161e0-7b2c-11e4-8c29-061c2777aa3c'
              }]
            };
            rootScope.fixStyles = function()
            {
              return null;
            };
            rootScope.notifier = {
              error: function ()
              {
                return 'Error...';
              }
            },
            rootScope.ui = {
              dashboard: {
                load: "Laden..."
              },
              teamup: {
                refreshing: 'refreshen...'
              }
            },
            rootScope.statusBar = {
              off: function ()
              {
                return null;
              },
              display: function (message)
              {
                return message;
              }
            },
            rootScope.app = {
              resources: testConfig.userResources,
              domainPermission: {
                clients: true
              }
            },
              optionsCtrl = $controller('options', {
              $rootScope: rootScope,
              $scope: scope,
              data: data,
              $filter: $filter,
              CurrentSelection: currentSelectionService
            });
          }
        )
      );

      var response = {
        "ringing-timeout": 20,
        "sms": true,
        "voicemail-detection-menu": false
      };

      it('Should check if the settings exist', function () {
        var vm = optionsCtrl;
        var url = testConfig.host + 'team/' + rootScope.app.resources.teamUuids[0] + '/teamTelephoneSettings';

        $httpBackend.expectGET(url).respond(200, response);

        var currentOptions = vm.scenarios;

        $httpBackend.flush();

        expect(currentOptions.voicemailDetection).toEqual(response["voicemail-detection-menu"]);
      });

      it('Should check if ringing timeout could be only a number', function () {
        var vm = optionsCtrl;
        var currentOptions = {
          voicemailDetection: false,
          sms: true,
          ringingTimeOut: "dsadsa"
        };
        var url = testConfig.host + 'team/' + rootScope.app.resources.teamUuids[0] + '/teamTelephoneSettings';

        $httpBackend.expectGET(url).respond(200, response);

        vm.save(currentOptions);

        $httpBackend.flush();

        expect(vm.error).toEqual(true);
      });

      it('Should check if ringing timeout could be empty', function () {
        var vm = optionsCtrl;
        var currentOptions = {
          voicemailDetection: false,
          sms: true,
          ringingTimeOut: "21"
        };
        var url = testConfig.host + 'team/' + rootScope.app.resources.teamUuids[0] + '/teamTelephoneSettings';

        $httpBackend.expectGET(url).respond(200, response);

        vm.save(currentOptions);

        $httpBackend.flush();

        expect(vm.error).toEqual(true);
      });

      it('Should check if ringing timeout could be empty', function () {
        var vm = optionsCtrl;
        var currentOptions = {
          voicemailDetection: false,
          sms: true,
          ringingTimeOut: "25"
        };

        var finalOptions = {
          "ringing-timeout": parseInt("25"),
          "sms-on-missed-call": true,
          "sms-on-new-team-voicemail": true,
          "voicemail-detection-menu": false
        };

        var url = testConfig.host + 'team/' + rootScope.app.resources.teamUuids[0] + '/teamTelephoneSettings';

        $httpBackend.expectGET(url).respond(200, finalOptions);
        $httpBackend.expectGET(url).respond(200, finalOptions);

        vm.save(currentOptions);

        //vm.save

        $httpBackend.flush();

        expect(vm.error).toEqual(true);
      });

      it('Should check if team-telephone settings could be saved', function () {
        var vm = optionsCtrl;
        var currentOptions = {
          voicemailDetection: false,
          sms: true,
          ringingTimeOut: "25"
        };

        var finalOptions = {
          "ringing-timeout": parseInt("25"),
          "sms-on-missed-call": true,
          "sms-on-new-team-voicemail": true,
          "voicemail-detection-menu": false
        };

        var url = testConfig.host + 'team/' + rootScope.app.resources.teamUuids[0] + '/teamTelephoneSettings';

        $httpBackend.expectGET(url).respond(200, finalOptions);
        $httpBackend.expectPUT(url, finalOptions).respond(200);

        vm.save(currentOptions);

        $httpBackend.flush();

        expect(vm.error).toEqual(false);
      });
    });
  }
);
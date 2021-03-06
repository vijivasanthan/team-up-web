define(
  [
    'angular-mocks',
    'app',
    'services/settings',
    'services/store'
  ],
  function()
  {
    'use strict';

    describe('Settings service',
      function ()
      {
        beforeEach(
          module(
            'services',
            'ngResource'
          ));

        afterEach(inject(function($httpBackend)
        {
          $httpBackend.verifyNoOutstandingExpectation();
          $httpBackend.verifyNoOutstandingRequest();
        }));

        var $q,
          $resource,
          $httpBackend,
          settingsService,
          rootScope;
          //storeService;

        beforeEach(
          inject
          (
            function (
              _Settings_,
              _$q_,
              _$resource_,
              _$httpBackend_,
              _$rootScope_
              //_Store__
            )
            {
              settingsService = _Settings_;
              $q = _$q_;
              $resource = _$resource_;
              $httpBackend = _$httpBackend_;
              rootScope = _$rootScope_;
              rootScope.ui = {
                login: {
                  alert_wrongUserPass: 'Onjuiste gebruikersnaam of wachtwoord!'
                },
                teamup: {
                  noBackend: function(email)
                  {
                    var text = "Het is niet gelukt om verbinding te maken met de server.<br />"
                    text += "Als u problemen blijft ervaren, kunt u een  <a href='mailto:" + email;
                    text += "?subject=Melding van een probleem met TeamUp / TeamTelefoon";
                    text += "&body=Beste%20support%2C%0A%0AHelaas%20ervaar%20ik%20problemen%20met%20TeamTelefoon.";
                    text += "%20Ik%20krijg%20de%20melding%20%u201CHet%20is%20niet%20gelukt%20om%20verbinding";
                    text += "%20te%20maken%20met%20de%20server.%u201D%0A%0AKunt%20u%20mij%20hiermee%20helpen";
                    text += "%3F%0A%0AMet%20vriendelijke%20groet%2C%0A%0A%5Buw%20naam";
                    text += "%5D%0A%5Buw%20team%5D%0A%5Buw%20organisatie%5D%20";
                    text += "'>email</a> sturen naar onze support afdeling."

                    return text;
                  },
                  statusCodeNotRegonized: "Status-code is niet bekend.",
                }
              }
            }
          )
        );

        it('Should return valid is true, because test.ask-cs and dev.ask-cs are both possibilities ',
          function()
          {
            var result = seperateBackEndTest(
              testConfig.userResources.uuid,
              testConfig.userResources.passWord,
                [
                "http://lala.ask-cs.com/",
                "https://backend.ask-cs.nl/",
                "http://test.ask-cs.com/",
                "http://dev.ask-cs.com/"
                ],
              [0, 404, 200, 200]
            );

            expect(
              result.valid
            ).toBe(
              true
            );
          }
        );

        it('Should return http://test.ask-cs.com/, because it s the first backend in the order. dev.ask-cs and test.ask-cs are both positive possibilities ',
          function()
          {
            var backEnds = [
              "http://lala.ask-cs.com/",
              "https://backend.ask-cs.nl/",
              "http://test.ask-cs.com/",
              "http://dev.ask-cs.com/"
            ];
            var result = seperateBackEndTest(
              testConfig.userResources.uuid,
              testConfig.userResources.passWord,
              backEnds,
              [0, 404, 200, 200]
            );

            expect(
              backEnds[result.index]
            ).toBe(
              "http://test.ask-cs.com/"
            );
          }
        );

        it('Should return the error message for statuscode 404.',
          function()
          {
            var result = seperateBackEndTest(
              testConfig.userResources.uuid,
              'thisIsMyWrongPassword',
              [
                "http://lala.ask-cs.com/",
                "http://test.ask-cs.com/",
                "https://backend.ask-cs.nl/"
              ],
              [0, 503, 404]
            );

            expect(
              result.errorMessage
            ).toBe(
              rootScope.ui.login.alert_wrongUserPass
            );
          }
        );

        it('Should return a valid is true, because status undefined is equal to 200', function ()
        {
          var results = [
            {status: undefined},
            {status: 0},
            {status: 706},
            {status: 503},
            {status: 607},
          ];
          var result = settingsService.validate(results);
          expect(result.valid).toBe(true);
        })

        it('Should return system not available, because all defined hosts are timing out', function ()
        {
          var results = [
            {status: 503},
            {status: 503},
            {status: 503},
          ];
          var result = settingsService.getResultOnStatusCode(results);

          expect(result.errorMessage)
            .toBe(rootScope.ui.teamup.noBackend('support@ask-cs.com'));
        })

        it('Should return status code not recognized', function ()
        {
          var results = [
            {status: 607},
            {status: 607},
            {status: 607},
          ];
          var result = settingsService.getResultOnStatusCode(results);

          expect(result.errorMessage)
            .toBe(rootScope.ui.teamup.statusCodeNotRegonized);
        })

        it('Should return the error message for wrong password', function ()
        {
          var results = [
            {status: 503},
            {status: 0},
            {status: 404},
            {status: 503},
            {status: 607},
          ];
          var result = settingsService.getResultOnStatusCode(results);
          expect(result.errorMessage)
            .toBe(rootScope.ui.login.alert_wrongUserPass);
        })

        it('Should return http://test.ask-cs.com/ by the getter of the service, because it s the first backend in the order. dev.ask-cs and test.ask-cs are both positive possibilities ',
          function()
          {
            var backEnds = [
              "http://lala.ask-cs.com/",
              "https://backend.ask-cs.nl/",
              "http://test.ask-cs.com/",
              "http://dev.ask-cs.com/"
            ];
            seperateBackEndTest(
              testConfig.userResources.uuid,
              testConfig.userResources.passWord,
              backEnds,
              [0, 404, 200, 200]
            );

            expect(
              settingsService.getBackEnd()
            ).toBe(
              "http://test.ask-cs.com/"
            );
          }
        );

        function seperateBackEndTest(userName, passWord, backEnds, statusCodes)
        {
          var userName = userName;
          var password = passWord;
          var backEnds = backEnds;
          var partUrl = 'login?pass=' + password + '&uuid=' + userName;
          var response = {};
          var statusCodes = statusCodes;
          var finalResult = null;

          backEnds.forEach(function (backEnd, i)
          {
            $httpBackend.expectGET(backEnd + partUrl)
              .respond(statusCodes[i], response);
          });

          settingsService.initBackEnd(backEnds, userName, password)
            .then(function(result)
            {
              finalResult = result;
            });

          $httpBackend.flush();
          return finalResult;
        }
      }
    );
  }
);
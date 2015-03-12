define(
  [
    'angular-mocks',
    'app',
    'underscore',
    'controllers/logs',
    'modals/logs'
  ],
  function() {
    'use strict';

    // You can have multiple describe functions, each with its own tests
    describe('Logs Controller', function () {

      // Current structure uses one module per category,
      // on which the controllers/directives/services/filters are bound.
      // These are defined and loaded in app.js
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

      var logCtrl,
          rootScope,
          scope,
          $q,
          $httpBackend,
          $filter,
          data,
          logsService,
          everyoneId = 'all';

      // Initialize the controller and a mock scope
      beforeEach(
        inject
        (
          function (
            $controller,
            _$rootScope_,
            _$q_,
            _$resource_,
            _$injector_,
            _$filter_,
            _$httpBackend_,
            _Logs_
          )
          {
            rootScope = _$rootScope_;
            scope = rootScope.$new();
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            logsService = _Logs_;
            $filter = _$filter_;
            data = {
              logData: {
                periods: {
                  startTime: 1425475373000,
                  endTime: 1425993773000
                }
              },
              teams: [{
                name: 'Henk team',
                teamId: 'eea1401e-833e-4647-b446-fe5ea2f6cd4b',
                adapterId: '38d8a700-8509-11e4-b1da-061c2777aa3c'
              }]
            };
            rootScope.fixStyles = function()
            {
              return null;
            };
            rootScope.ui = {
              dashboard: {
                everyone: 'Iedereen'
              }
            };
            rootScope.app = {
              resources: {
                  "uuid": "henkie",
                    "userName": "henkie",
                    "passwordHash": "4e8cc74b2e654b94acd1aea8fc654760",
                    "firstName": "Henk",
                    "lastName": "van R00ijen",
                    "phone": "+31650458799",
                    "email": "henkie@henkie.nl",
                    "states": [
                    {
                      "uuid": 100,
                      "name": "Reachability",
                      "value": "possibly_reachable",
                      "share": true
                    },
                    {
                      "uuid": 104,
                      "name": "Location",
                      "value": "51.9205,4.4545",
                      "share": true
                    },
                    {
                      "uuid": 102,
                      "name": "Availability",
                      "value": "available",
                      "share": true
                    }
                  ],
                    "teamUuids": [
                    "eea1401e-833e-4647-b446-fe5ea2f6cd4b"
                  ],
                    "role": "1",
                    "function": null,
                    "birthDate": 636764400000,
                    "address": {
                    "street": "Heemraadssingel",
                      "no": "89",
                      "zip": null,
                      "city": "Rotterdam",
                      "country": "Nederland",
                      "latitude": 51.9205,
                      "longitude": 4.4545
                  },
                  "extraInfo": {
                    "photoUUID": "ab859243-0471-4598-a5c5-43f2696e9f13"
                  },
                  "fullName": "Henk van R00ijen",
                    "apnskey": "b551dca7cb3e3c8c006b0da335f8c2fde9019828801ef50a4472f35776d24b46",
                    "gcmkey": "APA91bHquo0ikrNXW74wzijq0okPAMBceJgBN8U4mmnVJf9QsAI2qEZjGHu5cVqzqDPzYeyE6Pma-k2HvQ3mU2E7StPU85WGsZrm0QMTCPxNLF3lzxlxoeCyCT4d_hB-A3X-0tRG8P-tQyNMAhZaCpA9u4rh4i5ZJA",
                    "$promise": {},
                  "$resolved": true
                }
            }
            logCtrl = $controller('logs', {
              $rootScope: rootScope,
              $scope: scope,
              data: data,
              $filter: $filter,
              Logs: logsService
            });
          }
        )
      );

      var getOptions = function()
      {
        var teamPhoneAdapterData = _.findWhere(logCtrl.data.teams, {teamId: logCtrl.current});
        return {
          startTime: logCtrl.data.logData.periods.startTime,
          endTime: logCtrl.data.logData.periods.endTime,
          adapterId: teamPhoneAdapterData.adapterId || _.uniqueId()
        };
      };

      it('Should check what the current selector id must be', function () {
        //var currentTeam = (rootScope.app.resources.teamUuids)[0];
        expect(logCtrl.current).toEqual(everyoneId);
      });

      it('Should check what the default daterange is', function () {
        expect(logCtrl.daterange).toEqual('04-03-2015 / 10-03-2015');
      });

      it('Should check if it will fetch logs by team or all', function () {
        var logs = null,
            options = getOptions();

        $httpBackend.expect(
                'GET',
                localConfig.host + 'ddr?endTime=' + options.endTime +
                 '&startTime=' + options.startTime,
                null
              ).respond(200);

        logsService.fetch(options)
          .then(
            function(fetchedLogs)
            {
              logs = fetchedLogs;
            }
        );

        $httpBackend.flush();
        expect(logs).toEqual('04-03-2015 / 10-03-2015');
      });



      //Check if logs hetzelfde zijn

      //it('Should check what the default daterange is', function () {
      //
      //
      //  expect(logCtrl.daterange).toEqual('04-03-2015 / 10-03-2015');
      //});

      //$httpBackend.expect(
      //  'GET',
      //  localConfig.host + '/ddr?adapterId=' + options.adapterId + '&startTime=' + options.startTime +
      //  '&endTime=' + options.endTime,
      //  null
      //).respond(409);



      //it("Should check if the logged user can't create a new member with the same teamlid-code",
      //  function()
      //  {
      //    var result = null,
      //        userId = 'henkie',
      //        pincode = 8701,
      //        currentUser = true;
      //        //expectedResult = 'pincode not found';
      //
      //    $httpBackend.expect(
      //      'GET',
      //      'http://dev.ask-cs.com/node/' + userId + '/pincode_exists' +
      //       '?pincode=' + pincode + '&returnExistsWhenAssignedToUuid=' + currentUser,
      //      null
      //    ).respond(409);
      //
      //    profile
      //      .pincodeExists(userId, pincode, currentUser)
      //      .then(
      //      function(checkResult)
      //      {
      //        result = checkResult;
      //      },
      //      function(error)
      //      {
      //        result = error;
      //      }
      //    );
      //
      //    $httpBackend.flush();
      //    expect(result).toBe(false);
      //  }
      //);
    });
  }
);
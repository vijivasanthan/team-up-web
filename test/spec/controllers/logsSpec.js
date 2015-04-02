define(
  [
    'angular-mocks',
    'app',
    'lodash',
    'controllers/logs',
    'modals/logs',
    'services/moment'
  ],
  function() {
    'use strict';

    describe('Logs Controller', function () {

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
          moment,
          everyoneId = 'all';

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
            _moment_
          )
          {
            rootScope = _$rootScope_;
            scope = rootScope.$new();
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            logsService = _Logs_;
            $filter = _$filter_;
            moment = _moment_;
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
            rootScope.ui = {
              dashboard: {
                everyone: 'Iedereen'
              }
            };
            rootScope.app = {
              resources: testConfig.userResources
            },
            logCtrl = $controller('logs', {
              $rootScope: rootScope,
              $scope: scope,
              data: data,
              $filter: $filter,
              Logs: logsService,
              moment: moment
            });
          }
        )
      );

      var getOptions = function()
      {
        var teamPhoneAdapterData = _.findWhere(logCtrl.data.teams, {teamId: rootScope.app.resources.teamUuids[0]});
        return {
          startTime: logCtrl.data.logData.periods.startTime,
          endTime: logCtrl.data.logData.periods.endTime,
          adapterId: teamPhoneAdapterData.adapterId || _.uniqueId()
        };
      };

      it('Should check what the current selector id must be', function () {
        expect(logCtrl.current).toEqual(everyoneId);
      });

      it('Should check what the default daterange is', function () {
        expect(logCtrl.daterange).toEqual('06-03-2015 / 12-03-2015');
      });

      it('Should check if it will fetch logs by team', function () {
        var logsByTeam = null,
            options = getOptions(),
            url = testConfig.host + 'ddr?adapterId=' + options.adapterId + '&endTime=' + options.endTime +
              '&startTime=' + options.startTime,
            response = [
              {
                "adapterId": "502161e0-7b2c-11e4-8c29-061c2777aa3c",
                "accountId": "093e753b-9d17-4c17-ae9b-73b08b988d73",
                "fromAddress": "+31102250130",
                "toAddressString": "{\"+31858884607\":\"\"}",
                "ddrTypeId": "5390d362e4b02c61014547e4",
                "quantity": 1,
                "start": 1425979511000,
                "duration": 15000,
                "sessionKeys": [
                  "08176804-15c6-4a1b-8ba9-e6b38141f6d8"
                ],
                "status": "RECEIVED",
                "statusPerAddress": {
                  "+31102250130": "RECEIVED",
                  "+31858884607": "FINISHED"
                },
                "additionalInfo": {
                  "message": "http://test.ask-cs.com/scenario/parse/teamup-test_scenario_teamup-StefanTeamScenario/ce89be2c-e8c0-45e6-a397-5f63ebc30807",
                  "sessionKey": {
                    "+31102250130": "08176804-15c6-4a1b-8ba9-e6b38141f6d8"
                  },
                  "trackingToken": "7328043f-c67a-4cb1-8dbe-75b4d2376582"
                },
                "accountType": null,
                "totalCost": 0,
                "fromAgentId": "zdaan",
                "toAgentIds": [],
                "_id": "54feb877e4b08647e3f4c468"
              }
            ];

        $httpBackend.expectGET(url).respond(200, response);

        logsService.fetch(options)
          .then(
            function(fetchedLogs)
            {
              logsByTeam = fetchedLogs;
            },
            function(error)
            {
              console.log('error', error);
            }
        );

        $httpBackend.flush();
        expect(logsByTeam.logs[0].adapterId).toEqual(options.adapterId);
      });
    });
  }
);
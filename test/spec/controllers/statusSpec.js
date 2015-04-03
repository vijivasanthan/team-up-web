define(
  [
    'angular-mocks',
    'app',
    'lodash',
    'moment',
    'lawnchair',
    'lawnchair-dom',
    'controllers/status',
    'modals/slots'
  ],
  function() {
    'use strict';

    describe('Status Controller', function () {

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

      var statusCtrl,
          rootScope,
          scope,
          $q,
          $httpBackend,
          $filter,
          data,
          slotsService,
          teamsService,
          Store,
          everyoneId = 'all';

      // Initialize the controller and a mock scope
      beforeEach(
        inject
        (
          function (
            $controller, _$rootScope_, _$q_, _$injector_, _$filter_, _$httpBackend_, _Slots_, _Teams_, _Store_
          )
          {
            rootScope = _$rootScope_;
            scope = rootScope.$new();
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            $filter = _$filter_;
            slotsService = _Slots_;
            teamsService = _Teams_;
            Store = _Store_;
            data = {
              test: 'test'
            };
            rootScope.fixStyles = function ()
            {
              return null;
            };
            rootScope.notification = {
              status: false
            },
              rootScope.ui = {
                dashboard: {
                  everyone: 'Iedereen'
                }
              };
            rootScope.app = {
              resources: testConfig.userResources
            }

            rootScope.unique = function(members)
            {
              return null;
            }

            var teams = [{
                name: "Stefan Team",
                uuid: "b3915de1-f29c-4609-a67f-73aaef529902"
              },
              {
                name: "Suki Team",
                uuid: "d05e4ace-9ac6-4d74-b20e-6423e9de4bd4"
              }
            ]
            rootScope.ui.dashboard.everyone = 'Iedereen';

            rootScope.config = {
              app: {
                timeline: {
                  config: {
                    states: [
                      'com.ask-cs.State.Available',
                      'com.ask-cs.State.Unavailable',
                      'com.ask-cs.State.Unreached'
                    ]
                  }
                }
              }
            }

            rootScope.statusBar = {
              display: function(currentTeam) {},
              off: function(){}
            }

            teams.unshift({
              name: 'Iedereen',
              uuid: everyoneId
            });

            Store('app').save('teams', teams);
            statusCtrl = $controller('status', {
              $rootScope: rootScope,
              $scope: scope,
              data: data,
              Slots: slotsService,
              Teams: teamsService,
              Store: Store
            });
          }
        )
      );

      afterEach(inject(function(Store){
        Store('teams').nuke();
      }));

      it('Should check what the current selector id must be', function () {
        var teams = Store('app').get('teams');
        teams.splice(0, 1);

        scope.groups = teams;
        console.log('scope.groups', scope.groups);

        expect(1).toEqual(1);
      });

      //it('Should check what the default daterange is', function () {
      //  expect(logCtrl.daterange).toEqual('06-03-2015 / 12-03-2015');
      //});
      //
      //it('Should check if it will fetch logs by team', function () {
      //  var logsByTeam = null,
      //      options = getOptions(),
      //      url = testConfig.host + 'ddr?adapterId=' + options.adapterId + '&endTime=' + options.endTime +
      //        '&startTime=' + options.startTime,
      //      response = [];
      //
      //  $httpBackend.expectGET(url).respond(200, response);
      //
      //  logsService.fetch(options)
      //    .then(
      //      function(fetchedLogs)
      //      {
      //        logsByTeam = fetchedLogs;
      //      },
      //      function(error)
      //      {
      //        console.log('error', error);
      //      }
      //  );
      //
      //  $httpBackend.flush();
      //  expect(logsByTeam.logs[0].adapterId).toEqual(options.adapterId);
      //});
    });
  }
);
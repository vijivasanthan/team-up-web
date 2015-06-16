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
              test: 'test',
              members: {
                all: 123
              },
              membersReachability: {
                "asilva": [],
                "jlima": [
                  {
                    "ref": 41,
                    "start": 1434319200,
                    "state": "com.ask-cs.State.Available",
                    "end": 1434495600
                  }
                ],
                "henkie": [],
                "cdinator": []
              }
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
              resources: testConfig.userResources,
              domainPermission: {
                clients: true
              }
            },
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

      //TODO $scope.getGroupReachability(); unexpexted request, call on the run
      it('Check if slots are available for the testgroup', function() {
        var teamId = rootScope.app.resources.teamUuids[0];
        var now = Math.floor(moment().valueOf() / 1000);
        var response = {
            "marja": [],
            "antoinette": [],
            "anja": [],
            "henkie": [],
            "marleen": [],
            "erwin": [],
            "hennie": []
          };
        var url = testConfig.host + 'network/' + teamId + '/member/slots2?end=' + (now + 60) + '&start=' + now;
        var finalResult = null;
        scope.current = {
          group: teamId
        };

        //first flush the slots call on the run, before firing a new new call

        $httpBackend.expectGET(url).respond(response);

        slotsService.MemberReachabilitiesByTeam(teamId, now)
          .then(
            function(result)
            {
              finalResult = result.members;
            }
          );

        $httpBackend.flush();
        expect(finalResult).toEqual(response);
      });
    });
  }
);
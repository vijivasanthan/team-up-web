define(
  ['../../controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'agenda', [
        '$rootScope',
        '$scope',
        '$q',
        '$window',
        '$location',
        'Dater',
        '$timeout',
        'Store',
        'Teams',
        'Clients',
        'TeamUp',
        'Session',
        'Slots',
        'data',
        'ipCookie',
        'moment',
        function ($rootScope, $scope, $q, $window, $location, Dater, $timeout, Store,
                  Teams, Clients, TeamUp, Session, Slots, data, ipCookie, moment)
        {
          $rootScope.notification.status = false;

          $rootScope.fixStyles();

          $scope.self = this;

          $scope.data = data.timeline;
          //$scope.currentUser = $rootScope.app.resources;

          $scope.current = {
            layouts: {
              user: true,
              group: true,
              members: (data.user.uuid != $rootScope.app.resources.uuid)
            },
            day: moment().format('DDD'),
            week: moment().week(),
            month: Dater.current.month(),
            year: Dater.current.year(),
            group: $scope.data.groupId,
            division: 'all'
          };

          $scope.periods = Dater.getPeriods();
          $scope.periodsNext = Dater.getPeriods(true);

          var cookieKey = 'infoTimeline' + $rootScope.app.resources.uuid,
              setCookie = function(infoCheck)
              {
                ipCookie(cookieKey, infoCheck, {expires: 365});
                $rootScope.infoAvailibility = infoCheck;
              };

          $rootScope.infoAvailibility = ipCookie(cookieKey);

          if(_.isUndefined($rootScope.infoAvailibility))
          {
            setCookie(true);
          }

          $rootScope.disableInfoAvailibility = function() {
            setCookie(false);
          };

          $scope.slot = {};

          var stamps = {
            start: moment({ hour:0, minute:0 }).weekday(1).unix() * 1000,
            end: moment({ hour:0, minute:0 }).weekday(8).unix() * 1000
          };

          var timelineCfg = config.app.timeline;

          $scope.timeline = {
            id: 'mainTimeline',
            main: true,
            user: {
              id: data.user.uuid,
              role: data.user.role,
              fullName: data.user.firstName + ' ' + data.user.lastName,
              teamUuids: data.user.teamUuids
            },
            current: $scope.current,
            options: {
              start: stamps.start,
              end: stamps.end,
              min: stamps.start,
              max: stamps.end
            },
            range: {
              start: stamps.start,
              end: stamps.end
            },
            scope: {
              day: false,
              week: true,
              month: false
            },
            config: {
              bar: timelineCfg.config.bar,
              layouts: timelineCfg.config.layouts,
              wishes: timelineCfg.config.wishes,
              legenda: {},
              legendarer: timelineCfg.config.legendarer,
              states: timelineCfg.config.states,
              divisions: timelineCfg.config.divisions,
              densities: timelineCfg.config.densities
            }
          };

          if ($.browser.msie && $.browser.version == '8.0')
          {
            $scope.timeline.options = {
              start: $scope.periods.days[Dater.current.today()].last.timeStamp,
              end: $scope.periods.days[Dater.current.today() + 7].last.timeStamp,
              min: $scope.periods.days[Dater.current.today()].last.timeStamp,
              max: $scope.periods.days[Dater.current.today() + 7].last.timeStamp
            };
          }

          _.each(config.app.statesall, function (state, index)
          {
            $scope.timeline.config.legenda[index] = true
          });

          $scope.timeline.config.legenda.groups = {
            more: true,
            even: true,
            less: true
          };

          $scope.daterange = Dater.readable.date($scope.timeline.range.start) + ' / ' +
          Dater.readable.date($scope.timeline.range.end);

          $timeout(function ()
          {
            $scope.states = {};

            _.each($scope.timeline.config.states, function (state, key)
            {
              $scope.states[key] = state.label;
            });

          });

          $scope.groups = data.teams;

          $scope.divisions = $scope.timeline.config.divisions;

          if ($scope.timeline.config.divisions.length > 0)
          {
            if ($scope.divisions[0].id !== 'all')
            {
              $scope.divisions.unshift({
                id: 'all',
                label: 'Alle divisies'
              });
            }

            $scope.groupPieHide = {};

            _.each($scope.divisions, function (division)
            {
              $scope.groupPieHide[division.id] = false
            });
          }


          $scope.resetViews = function ()
          {
            $scope.views = {
              slot: {
                add: false,
                edit: false
              },
              group: false,
              wish: false,
              member: false
            };
          };

          $scope.resetViews();

          $rootScope.$on('resetPlanboardViews', $scope.resetViews);

          $scope.toggleSlotForm = function ()
          {
            if ($scope.views.slot.add)
            {
              $rootScope.planboardSync.start();

              $scope.resetInlineForms();
            }
            else
            {
              $rootScope.planboardSync.clear();

              $rootScope.$broadcast('slotInitials');

              $scope.resetViews();

              $scope.views.slot.add = true;
            }

            $scope.$broadcast('showDuration');
          };

          $scope.refreshCurrentTimeline = function()
          {
            $scope.resetInlineForms();
            $rootScope.$broadcast('resetTimeline');
          };

          $scope.resetInlineForms = function ()
          {
            $scope.slot = {};

            $scope.original = {};

            $scope.resetViews();
          };

          $scope.redirectOwnTimeline = function()
          {
            $location.path('/team-telefoon/agenda/' + $rootScope.app.resources.uuid);
          };

          //$scope.sendShortageMessage = function (slot)
          //{
          //  $rootScope.statusBar.display($rootScope.ui.agenda.preCompilingStortageMessage);
          //
          //  Store('environment').save('escalation', {
          //    group: slot.group,
          //    start: {
          //      date: slot.start.date,
          //      time: slot.start.time
          //    },
          //    end: {
          //      date: slot.end.date,
          //      time: slot.end.time
          //    },
          //    diff: slot.diff
          //  });
          //
          //  $location.path('/messages').search({ escalate: true }).hash('compose');
          //};
        }
      ]
    );
  }
);

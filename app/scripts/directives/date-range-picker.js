define(
  ['directives/directives', 'config'],
  function (directives, config) {
    'use strict';

    directives.directive(
      'daterangepicker',
      [
        '$rootScope', 'moment',
        function ($rootScope, moment) {
          return {
            restrict: 'A',

            link: function postLink(scope, element, attrs) {
              // var startDate = Date.create().addDays(-6),
              //     endDate   = Date.create();
              //element.val(startDate.format('{MM}-{dd}-{yyyy}') + ' / ' + endDate.format('{MM}-{dd}-{yyyy}'));

              var options = {
                startDate:      moment().startOf('day'),
                endDate:        moment().startOf('day'),
                format:         'DD-MM-YYYY',
                separator:      ' / ',
                minDate:        false,
                maxDate:        false,
                changed:        false,
                cleared:        false,
                showDropdowns:  false,
                dateLimit:      false,
                locale: {
                  applyLabel:     $rootScope.ui.teamup.apply,
                  cancelLabel:    $rootScope.ui.teamup.cancel,
                  fromLabel:      $rootScope.ui.teamup.from,
                  toLabel:        $rootScope.ui.teamup.to,
                  weekLabel:      'W',
                  customRangeLabel: $rootScope.ui.planboard.customDates,
                  daysOfWeek:     moment.weekdaysMin(),
                  monthNames:     moment.months(),
                  firstDay:       0
                },
                ranges: {}
              };

              options.ranges[$rootScope.ui.planboard.daterangerToday] = [
                moment().startOf('day').toDate(),
                moment().endOf('day').toDate()
              ];

              options.ranges[$rootScope.ui.planboard.daterangerTomorrow] = [
                moment().add(1, 'days').startOf('day').toDate(),
                moment().add(1, 'days').endOf('day').toDate()
              ];

              options.ranges[$rootScope.ui.planboard.daterangerYesterday] = [
                moment().subtract(1, 'days').startOf('day').toDate(),
                moment().subtract(1, 'days').endOf('day').toDate()
              ];

              options.ranges[$rootScope.ui.planboard.daterangerNext3Days] = [
                moment().add(1, 'days').startOf('day').toDate(),
                moment().add(3, 'days').endOf('day').toDate()
              ];
              options.ranges[$rootScope.ui.planboard.daterangerNext7Days] = [
                moment().add(1, 'days').startOf('day').toDate(),
                moment().add(7, 'days').endOf('day').toDate()
              ];

              element.daterangepicker(
                options,
                function (start, end) {
                  scope.$apply(
                    function () {

                      // Check for moment object and convert to Date object
                      // (bootstrap-daterangepicker uses moment)
                      if(start._isAMomentObject && end._isAMomentObject){
                        start = start.toDate();
                        // bootstrap-daterangepicker uses end of day,
                        // make it the beginning using moment's function
                        end = (end.endOf('day')).toDate();
                      }

                      var diff = end.getTime() - start.getTime();

                      scope.timeline.scope = {
                        day: false,
                        week: false,
                        month: false
                      };

                      // Scope is a day
                      if (diff <= 86400000) {
                        scope.timeline.scope.day = true;
                      }
                      // Scope is less than a week
                      else if (diff < 604800000) {
                        scope.timeline.scope.week = true;
                      }
                      // Scope is more than a week
                      else if (diff > 604800000) {
                        scope.timeline.scope.month = true;
                      }

                      var periods = {
                        start: start,
                        end: end
                      };

                      scope.timeline.range = periods;

                      var broadcastId = (attrs.daterangepicker == 'task-planboard')
                        ? 'timelinerTasks'
                        : 'timeliner';

                      $rootScope.$broadcast(broadcastId, periods);
                    }
                  );
                }
              );

              // Set data toggle
              element.attr('data-toggle', 'daterangepicker');

              // TODO: Investigate if its really needed!!
              // element.daterangepicker({ autoclose: true });
            }
          };
        }
      ])
  }
);

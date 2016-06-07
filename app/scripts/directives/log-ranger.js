define(
  ['directives/directives'],
  function (directives) {
    'use strict';

    directives.directive(
    'logRanger',
    [
      '$rootScope', 'moment',
      function ($rootScope, moment) {
        return {
          restrict: 'A',
          link: function postLink (scope, element)
          {
            var options = {
              startDate:      moment().subtract(6, 'day').toDate(),
              endDate:        Date.today(),
              format:         'DD-MM-YYYY',
              separator:      ' / ',
              minDate:        false,
              maxDate:        false,
              changed:        false,
              cleared:        false,
              showDropdowns:  false,
              dateLimit:      false,
              locale: {
                //todayLabel:     $rootScope.ui.planboard.daterangerToday,
                //yesterdayLabel: $rootScope.ui.planboard.daterangerYesterday,
                applyLabel:     $rootScope.ui.teamup.apply,
                cancelLabel:    $rootScope.ui.teamup.cancel,
                fromLabel:      $rootScope.ui.teamup.from,
                toLabel:        $rootScope.ui.teamup.to,
                weekLabel:      'W',
                customRangeLabel: $rootScope.ui.planboard.customDates,
                daysOfWeek:     moment.weekdaysMin(),
                monthNames:     moment.months(),
                firstDay:       1
              },
              ranges: {}
            };

            options.ranges[$rootScope.ui.planboard.daterangerToday] = [
              new Date.today(),
              new Date.today().addDays(1)
            ];

            options.ranges[$rootScope.ui.planboard.daterangerYesterday] = [
              moment().subtract(1, 'day').toDate(),
              new Date.today()
            ];

            options.ranges[$rootScope.ui.planboard.daterangerLast7Days] = [
              moment().subtract(7, 'day').toDate(),
              new Date.today()
            ];

            element.daterangepicker(
              options,
              function (start, end)
              {
                scope.$apply(
                  function ()
                  {
                    // Check for moment object and convert to Date object
                    // (bootstrap-daterangepicker uses moment)
                    if(start._isAMomentObject && end._isAMomentObject){
                      start = start.toDate();
                      // bootstrap-daterangepicker uses end of day,
                      // make it the beginning using moment's function
                      //end = (end.startOf('day')).toDate();
                      end = end.toDate();
                    }

                    $rootScope.$broadcast(
                      'getLogRange',
                      {
                        startTime: start.getTime(),
                        endTime: end.getTime()
                      }
                    );
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
    ]);
});

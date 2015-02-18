define(
  ['directives/directives'],
  function (directives) {
    'use strict';

    directives.directive(
    'logRanger',
    [
      '$rootScope',
      function ($rootScope) {
        return {
          restrict: 'A',

          link: function postLink (scope, element, attrs, controller)
          {
            var options = {
              startDate:      Date.today(),
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
                applyLabel:     'Toepassen',
                cancelLabel:    'Annuleren',
                fromLabel:      'van',
                toLabel:        'tot',
                weekLabel:      'W',
                customRangeLabel: 'Aangepaste periode',
                daysOfWeek:     Date.CultureInfo.shortestDayNames,
                monthNames:     Date.CultureInfo.monthNames,
                firstDay:       0
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
                      end = (end.startOf('day')).toDate();
                    }

                    $rootScope.$broadcast(
                      'getLogRange',
                      {
                        start: start.getTime(),
                        end: end.getTime()
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

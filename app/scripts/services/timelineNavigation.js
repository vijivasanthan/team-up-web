define(
  ['services/services'],
  function(services)
  {
    'use strict';

    services.factory(
      'TimelineNavigation',
      [
        '$rootScope', '$window', 'moment',
        function($rootScope, $window, moment)
        {
          // constructor \\
          var timelineNavigationService = function()
          {
          };

          (function ()
          {
            this.setScope = setScope;
            this.nextScope = nextScope;
            this.previousScope = previousScope;

	          /**
             * Set the scope of the timeline in one of the three ['day', 'week', 'month']
             * @param period current period ['day', 'week', 'month']
             * @param dates current dates example: {day: 12, week: 34, year: 2016}
             * @returns {{periods: {day: boolean, week: boolean, month: boolean}, range: *}}
	           */
            function setScope(period, dates)
            {
              var scope, range;
              var periods    = {
                day: false,
                week: false,
                month: false
              };
              //format the daterange to milliseconds
              var rangedDate = moment(
                dates.day + " " +
                dates.month + " " +
                dates.year,
                "DDD-MM-YYYY")
                .valueOf();

              //switch periods and set the right daterange
              switch(period)
              {
                case 'day':
                  range = {
                    start: + moment(rangedDate).startOf('day'),
                    end: + moment(rangedDate).endOf('day').add(1, 'ms')
                  };
                  break;

                case 'week':
                  range = {
                    start: + moment(rangedDate).startOf('week'),
                    end: + moment(rangedDate).endOf('week').add(1, 'ms')
                  };
                  break;

                case 'month':
                  range = {
                    start: + moment(rangedDate).startOf('month'),
                    end: + moment(rangedDate).endOf('month').add(1, 'ms')
                  };
                  break;
              }

              periods[period] = true;
              return {
                periods: periods,
                range: range
              }
            }

	          /**
             * Set next scope [day, week, month]
             * @param periods
             * @param dates
             * @returns {{dates: *, periods: *}}
	           */
            function nextScope(periods, dates)
            {
              console.error("next ->");
              var thisYear = moment().year(),
                  range = null;

              if(periods.day)
              {
                if (dates.year === thisYear)
                {
                  if (dates.day != moment().endOf('year').dayOfYear())
                  {
                    dates.day++;

                    range = {
                        start: +moment().dayOfYear(dates.day).startOf('day'),
                        end: +moment().dayOfYear(dates.day).endOf('day').add(1, 'ms')
                      };
                  }
                  else
                  {
                    dates.year = thisYear + 1;
                    dates.day = 1;
                    range = {
                        start: +moment().year(dates.year).dayOfYear(dates.day).startOf('day'),
                        end: +moment().year(dates.year).dayOfYear(dates.day).endOf('day').add(1, 'ms')
                      };
                  }
                }
              }
              else if (periods.week)
              {
                if (dates.year == thisYear)
                {
                  if (dates.week == 1 && dates.month == 12)
                  {
                    // deal with situation that last days in the end of the year share the first week with starting days in the next year.
                    dates.week = 53;
                  }

                  if (dates.week != 53)
                  {
                    dates.week++;

                    range = {
                        start: +moment().week(dates.week).startOf('week'),
                        end: +moment().week(dates.week).endOf('week').add(1, 'ms')
                      };
                  }
                  else
                  {
                    dates.year = thisYear + 1;

                    dates.week = 1;

                    range = {
                        start: +moment().year(dates.year).week(dates.week).startOf('week'),
                        end: +moment().year(dates.year).week(dates.week).endOf('week').add(1, 'ms')
                      };
                  }
                }
                else
                {
                  if (dates.week != 53)
                  {
                    dates.week++;

                    range = {
                        start: +moment().year(dates.year).week(dates.week).startOf('week'),
                        end: +moment().year(dates.year).week(dates.week).endOf('week').add(1, 'ms')
                      };
                  }
                }
              }
              else if (periods.month)
              {
                if (dates.year == thisYear)
                {
                  if (dates.month != 12)
                  {
                    dates.month++;

                    range = {
                        start: +moment().month(dates.month - 1).startOf('month'),
                        end: +moment().month(dates.month - 1).endOf('month').add(1, 'ms')
                      };
                  }
                  else
                  {
                    dates.year = thisYear + 1;

                    dates.month = 1;

                    range = {
                        start: +moment().year(dates.year).month(dates.month - 1).startOf('month'),
                        end: +moment().year(dates.year).month(dates.month - 1).endOf('month').add(1, 'ms')
                      };
                  }
                }
                else
                {
                  if (dates.month != 12)
                  {
                    dates.month++;

                    range = {
                        start: +moment().year(dates.year).month(dates.month - 1).startOf('month'),
                        end: +moment().year(dates.year).month(dates.month - 1).endOf('month').add(1, 'ms')
                      };
                  }
                }
              }

              return {
                dates: dates,
                periods: periods,
                range: range
              };
            }

            function previousScope(periods, dates)
            {
              console.error("previous ->");
              var thisYear = moment().year(),
                  range = null;

              if (periods.day)
              {
                if (dates.year === thisYear + 1)
                {
                  if (dates.day === 1)
                  {
                    dates.year = thisYear;

                    dates.day = moment().endOf('year').dayOfYear();

                    range =
                      {
                        start: +moment().dayOfYear(dates.day).startOf('day'),
                        end: +moment().dayOfYear(dates.day).endOf('day').add(1, 'ms')
                      };
                  }
                  else
                  {
                    dates.day--;

                    range =
                      {
                        start: +moment().year(dates.year).dayOfYear(dates.day).startOf('day'),
                        end: +moment().year(dates.year).dayOfYear(dates.day).endOf('day').add(1, 'ms')
                      };
                  }
                }
                else
                {
                  if (dates.day != 1)
                  {
                    dates.day--;

                    range =
                      {
                        start: +moment().dayOfYear(dates.day).startOf('day'),
                        end: +moment().dayOfYear(dates.day).endOf('day').add(1, 'ms')
                      };
                  }
                }
              }
              else if (periods.week)
              {
                if (dates.year === thisYear + 1)
                {
                  if (dates.week === 1)
                  {
                    dates.year = thisYear;

                    dates.week = 52;

                    range =
                      {
                        start: +moment().week(dates.week).startOf('week'),
                        end: +moment().week(dates.week).endOf('week').add(1, 'ms')
                      };
                  }
                  else
                  {
                    dates.week--;

                    range =
                      {
                        start: +moment().year(dates.year).week(dates.week).startOf('week'),
                        end: +moment().year(dates.year).week(dates.week).endOf('week').add(1, 'ms')
                      };
                  }
                }
                else
                {
                  if (dates.week != 1)
                  {
                    dates.week--;

                    range =
                      {
                        start: +moment().week(dates.week).startOf('week'),
                        end: +moment().week(dates.week).endOf('week').add(1, 'ms')
                      };
                  }
                  else if (dates.month == 12)
                  {
                    // TODO double check if can be removed and remove this block
                    dates.week = 53;
                    dates.week--;

                    range =
                      {
                        start: +moment().week(dates.week).startOf('week'),
                        end: +moment().week(dates.week).endOf('week').add(1, 'ms')
                      };
                  }
                }
              }
              else if (periods.month)
              {
                if (dates.year === thisYear + 1)
                {
                  if (dates.month === 1)
                  {
                    dates.year = thisYear;

                    dates.month = 12;

                    range =
                      {
                        start: +moment().month(dates.month - 1).startOf('month'),
                        end: +moment().month(dates.month - 1).endOf('month').add(1, 'ms')
                      };
                  }
                  else
                  {
                    dates.month--;

                    range =
                      {
                        start: +moment().year(dates.year).month(dates.month - 1).startOf('month'),
                        end: +moment().year(dates.year).month(dates.month - 1).endOf('month').add(1, 'ms')
                      };
                  }
                }
                else
                {
                  if (dates.month != 1)
                  {
                    dates.month--;

                    range =
                      {
                        start: +moment().month(dates.month - 1).startOf('month'),
                        end: +moment().month(dates.month - 1).endOf('month').add(1, 'ms')
                      };
                  }
                }
              }

              return {
                dates: dates,
                range: range,
              }
            }

          }).call(timelineNavigationService.prototype);

          return new timelineNavigationService;
        }
      ]
    );
  }
);
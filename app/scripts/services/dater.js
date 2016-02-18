define(
  ['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory(
      'Dater',
      [
        '$rootScope', 'Store', 'moment',
        function ($rootScope, Store, moment)
        {
          return {
            current: {
              today: function () {
                return moment().dayOfYear();
              },

              week: function () {
                return moment().week();
              },

              month: function () {
                return moment().month() + 1; // moment's month is 0-indexed
              },

              year: function () {
                return moment().format('YYYY');
              }
            },

            readable: {
              date: function (date)
              {
                return moment(new Date(date)).format(config.app.formats.date);
              }
            },
            //TODO timezones
            convert: {
              absolute: function (date, time, flag)
              {
                var dates, result, offset;

                if(typeof date == "undefined"){
                  return;
                }

                // TODO: Find a more dynamic way (in case of other timezones)
                offset = moment.tz(date +' '+ time, 'DD-MM-YYYY HH:mm', 'Europe/Amsterdam').format('Z');

                try{
                  dates = date.split('-');
                  result = new Date(Date.parse(dates[2] + '-' + dates[1] + '-' + dates[0] + 'T' + time + offset)).getTime();
                }catch(err){
                  console.warn(err);
                }

                return (flag) ? result / 1000 : result;
              }
            },

            calculate: {
              diff: function (range)
              {
                return new Date(range.end).getTime() - new Date(range.start).getTime()
              }
            },

            /**
             * Get the current year
             */
            getThisYear: function ()
            {
              return moment().format('YYYY');
            },
            /**
             * Get the current month
             */
            getThisMonth: function () {
              return moment().format('M');
            },

            getMonthTimeStamps: function ()
            {
              var months = {},
                year = this.getThisYear();

              for (var i = 0; i < 12; i++)
              {
                var firstDay = new Date(year, i).moveToFirstDayOfMonth(),
                  lastDay = new Date(year, i).moveToLastDayOfMonth().addDays(1),
                  month = {
                    first: {
                      day: firstDay,
                      timeStamp: firstDay.getTime()
                    },
                    last: {
                      day: lastDay,
                      timeStamp: lastDay.getTime()
                    },
                    totalDays: Date.getDaysInMonth(year, i)
                  };

                months[i + 1] = month;
              }

              return months;
            },

            getWeekTimeStamps: function ()
            {
              var nweeks = [],
                weeks = {},
                nextMonday,
                year = this.getThisYear(),
                firstDayInYear = new Date(year, 0).moveToFirstDayOfMonth(),
                firstMondayOfYear = new Date(year, 0).moveToFirstDayOfMonth().last().sunday().addWeeks(0),
                firstMonday = new Date(firstMondayOfYear);

              for (var i = 0; i < 53; i++)
              {
                if (i == 0)
                {
                  nextMonday = firstMondayOfYear.addWeeks(1);
                }
                else
                {
                  nextMonday = new Date(nweeks[i - 1]).addWeeks(1);
                }

                nweeks.push(new Date(nextMonday));
              }

              nweeks.unshift(firstMonday);

              var firstMondayofNextYear = new Date(nweeks[51].addWeeks(1));

              for (var i = 0; i < 55; i++)
              {
                weeks[i + 1] = {
                  first: {
                    day: nweeks[i],
                    timeStamp: new Date(nweeks[i]).getTime()
                  },
                  last: {
                    day: nweeks[i + 1],
                    timeStamp: new Date(nweeks[i + 1]).getTime()
                  }
                }
              }

              delete weeks[54];
              delete weeks[55];

              return weeks;
            },

            getDayTimeStamps: function ()
            {
              var nextDay,
                ndays = [],
                days = {},
                year = this.getThisYear(),
                firstDayInYear = new Date(year, 0).moveToFirstDayOfMonth();

              for (var i = 0; i < 366; i++)
              {
                if (i == 0)
                {
                  nextDay = firstDayInYear;
                }
                else
                {
                  nextDay = new Date(ndays[i - 1]).addDays(1);
                }

                ndays.push(new Date(nextDay));
              }

              for (var i = 0; i < 366; i++)
              {
                days[i + 1] = {
                  first: {
                    day: ndays[i],
                    timeStamp: new Date(ndays[i]).getTime()
                  },
                  last: {
                    day: ndays[i + 1],
                    timeStamp: new Date(ndays[i + 1]).getTime()
                  }
                };
              }

              if (!days[366].timeStamp)
              {
                delete days[366];

                days.total = 365;
              }
              else
              {
                days.total = 366;
              }

              return days;
            },

            registerPeriods: function ()
            {
              var periods = Store('app').get('periods') || '{}';

              Store('app').save(
                'periods', {
                  months: this.getMonthTimeStamps(),
                  weeks: this.getWeekTimeStamps(),
                  days: this.getDayTimeStamps()
                });
            },

            getPeriods: function ()
            {
              return Store('app').get('periods');
            },

            formatDate: function (date)
            {
              return moment(date)
                .format('DD-MM-YYYY');
            },

            formatDateMobile: function (date)
            {
              return moment(this.convert.absolute(date, 0))
                .format('YYYY-MM-DD');
            },

            translateToDutch: function (date)
            {
              var conversions = {
                // days
                Monday: 'maandag',
                tuesday: 'dinsdag',
                wednesday: 'woensdag',
                thursday: 'donderdag',
                friday: 'vrijdag',
                saturday: 'zaterdag',
                sunday: 'zondag',
                // months
                january: 'januari',
                february: 'februari',
                march: 'maart',
                april: 'april',
                may: 'mei',
                june: 'juni',
                july: 'juli',
                august: 'augustus',
                september: 'september',
                october: 'oktober',
                november: 'november',
                december: 'december'
              };

              if (date)
              {
                _.each(conversions, function (conversion, index)
                {
                  date = date.replace(new RegExp(index, 'gi'), conversion)
                });

                return date;
              }
            }
          }
        }
      ]);
  }
);

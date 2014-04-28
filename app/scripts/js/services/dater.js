'use strict';


angular.module('WebPaige.Services.Dater', ['ngResource'])


/**
 * Dater service (Wrapper on Date)
 */
.factory('Dater', 
[
  '$rootScope', 'Storage', 
  function ($rootScope, Storage)
  {  
    return {

      current:
      {
        today: function ()
        {
          return Date.today().getDayOfYear() + 1;
        },

        week: function ()
        {
          /**
           * IE library does not exist bug
           */
          
          if (new Date().getWeek())
          {
            return new Date().getWeek();
          }
          else
          {
            console.log('Date getWeek does not exist !');
          }
        },

        month: function ()
        {
          return new Date().getMonth() + 1;
        },

        year: function ()
        {
          return new Date().toString('yyyy');
        }
      },

      readable: 
      {
        date: function (date)
        {
          return  new Date(date).toString($rootScope.config.formats.date);
        }
      },

      convert:
      {
        absolute: function (date, time, flag)
        {
          var dates   = date.split('-'),
              result  = new Date(Date.parse(dates[2] + 
                                      '-' + 
                                      dates[1] + 
                                      '-' + 
                                      dates[0] + 
                                      ' ' + 
                                      time)).getTime();
          
          return (flag) ? result / 1000 : result;
        }
      },

      calculate:
      {
        diff: function (range)
        {
          return new Date(range.end).getTime() - new Date(range.start).getTime()
        }
      },

      /**
       * Get the current month
       */
      getThisMonth: function ()
      {
        return new Date().toString('M');
      },

      /**
       * Get the current year
       */
      getThisYear: function ()
      {
        return new Date().toString('yyyy');
      },

      /**
       * Get begin and end timestamps of months
       * in the current year
       */
      getMonthTimeStamps: function (year)
      {
        var months  = {};

        for (var i = 0; i < 12; i++)
        {
          var firstDay  = new Date(year, i).moveToFirstDayOfMonth(),
              lastDay   = new Date(year, i).moveToLastDayOfMonth().addDays(1);

          months[i+1] = {
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
        }

        return months;
      },

      /**
       * Get begin and end timestamps of weeks
       */
      getWeekTimeStamps: function(year)
      {
        var nweeks    = [],
            weeks     = {},
            nextMonday;

        var firstDayInYear    = new Date(year, 0).moveToFirstDayOfMonth(),
            firstMondayOfYear = new Date(year, 0).moveToFirstDayOfMonth().last().sunday().addWeeks(0),
            firstMonday       = new Date(firstMondayOfYear);

        for (var i = 0; i < 54; i++)
        {
          if (i == 0)
          {
            nextMonday = firstMondayOfYear.addWeeks(1);
          }
          else
          {
            nextMonday = new Date(nweeks[i-1]).addWeeks(1);
          }

          nweeks.push(new Date(nextMonday));
        }

        nweeks.unshift(firstMonday);

        var firstMondayofNextYear = new Date(nweeks[54].addWeeks(1));

        for (var n = 0; n < 55; n++)
        {
          weeks[n+1] = {
            first: {
              day: nweeks[n],
              timeStamp: new Date(nweeks[n]).getTime()
            },
            last: {
              day: nweeks[n+1],
              timeStamp: new Date(nweeks[n+1]).getTime()
            }
          }
        }

        /**
         * Remove unnecessary periods
         */
        delete weeks[54];
        delete weeks[55];

        return weeks;
      },

      /**
       */
      getDayTimeStamps: function(year)
      {
        var nextDay,
            ndays = [],
            days  = {},
            firstDayInYear = new Date(year, 0).moveToFirstDayOfMonth();
        
        for (var i = 0; i < 366; i++)
        {
          if (i == 0)
          {
            nextDay = firstDayInYear;
          }
          else
          {
            nextDay = new Date(ndays[i-1]).addDays(1);
          }

          ndays.push(new Date(nextDay));
        }

        for (var n = 0; n < 366; n++)
        {
          days[n+1] = {
            first: {
              day: ndays[n],
              timeStamp: new Date(ndays[n]).getTime()
            },
            last: {
              day: ndays[n+1],
              timeStamp: new Date(ndays[n+1]).getTime()
            }
          };
        }

        /**
         * Remove not existing date
         */
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
        var periods     = angular.fromJson(Storage.get('periods') || '{}'),
            periodsNext = angular.fromJson(Storage.get('periodsNext') || '{}');

        var thisYear = this.getThisYear(),
            nextYear = Number(thisYear) + 1;

        Storage.add('periods', angular.toJson({
          months: this.getMonthTimeStamps(thisYear),
          weeks:  this.getWeekTimeStamps(thisYear),
          days:   this.getDayTimeStamps(thisYear)
        }));

        Storage.add('periodsNext', angular.toJson({
          months: this.getMonthTimeStamps(nextYear),
          weeks:  this.getWeekTimeStamps(nextYear),
          days:   this.getDayTimeStamps(nextYear)
        }));

      },

      getPeriods: function (next)
      {
        return angular.fromJson(Storage.get((!next) ? 'periods' : 'periodsNext'));
      },

      translateToDutch: function (date)
      {
        var conversions = {
          // days
          Monday:     'maandag',
          tuesday:    'dinsdag',
          wednesday:  'woensdag',
          thursday:   'donderdag',
          friday:     'vrijdag',
          saturday:   'zaterdag',
          sunday:     'zondag',
          // months
          january:    'januari',
          february:   'februari',
          march:      'maart',
          april:      'april',
          may:        'mei',
          june:       'juni',
          july:       'juli',
          august:     'augustus',
          september:  'september',
          october:    'oktober',
          november:   'november',
          december:   'december'
        };

        if (date)
        {
          angular.forEach(conversions, function (conversion, index)
          {
            date = date.replace(new RegExp(index, 'gi'), conversion)
          });

          return date;
        }

      }
    }
  }
]);
define(
  ['filters/filters', 'config'],
  function (filters, config)
  {
    'use strict';

    filters.filter(
      'escape',
      [
        function ()
        {
          return function (string)
          {
            if (! string || string.indexOf(".") == - 1)
            {
              return string;
            }

            return string.replace(".", "").replace("@", "");
          }
        }
      ]);

    filters.filter(
      'stateColor',
      [
        function ()
        {
          return function (states)
          {
            var ret = config.app.stateColors.none;

            angular.forEach(
              states, function (state)
              {
                /**
                 *    WORKING
                 *    OFFLINE
                 *    AVAILABLE
                 *    UNAVAILABLE
                 *    UNKNOWN
                 */
                if (angular.lowercase(state.name) == "availability" && state.share)
                {
                  if (angular.lowercase(state.value) == "available" || angular.lowercase(state.value) == "working")
                  {
                    ret = config.app.stateColors.availalbe;
                  }
                  else if (angular.lowercase(state.value) == "unavailable")
                  {
                    ret = config.app.stateColors.busy;
                  }
                  else if (angular.lowercase(state.value) == "offline")
                  {
                    ret = config.app.stateColors.offline;
                  }
                }
              });

            return ret;
          }
        }
      ]);

    filters.filter(
      'nicelyDate',
      [
        '$rootScope',
        function ($rootScope)
        {
          return function (date)
          {
            if (typeof date == 'string')
            {
              date = Number(date);
            }

            if (String(date).length == 10)
            {
              date *= 1000
            }

            return new Date(date).toString(config.app.formats.date);
          };
        }
      ]);

    filters.filter(
      'nicelyTime',
      [
        '$rootScope',
        function ($rootScope)
        {
          return function (date)
          {
            if (typeof date == 'string') date = Number(date);

            return new Date(date).toString(config.app.formats.time);
          };
        }
      ]);

    filters.filter(
      'translatePackage',
      [
        function ()
        {
          return function (selected)
          {
            if (selected)
            {
              var gem;

              angular.forEach(
                config.app.packages, function (pack)
                {
                  if (pack.id == selected) gem = pack;
                });

              return gem.label;
            }
          }
        }
      ]);

    filters.filter(
      'translateCountry',
      [
        function ()
        {
          return function (selected)
          {
            if (selected)
            {
              var gem;

              angular.forEach(
                config.app.countries, function (country)
                {
                  if (country.id == selected) gem = country;
                });

              return gem.label;
            }
          }
        }
      ]);

    filters.filter(
      'translateRegion',
      [
        function ()
        {
          return function (selected, country)
          {
            if (selected && country)
            {
              var gem;

              angular.forEach(
                config.app.regions[country], function (region)
                {
                  if (region.id == selected) gem = region;
                });

              return gem.label;
            }
          }
        }
      ]);

    filters.filter(
      'translateRole',
      [
        function ()
        {
          return function (role)
          {
            var urole;

            angular.forEach(
              config.app.roles, function (prole)
              {
                if (prole.id == role) urole = prole.label;
              });

            return urole;
          }
        }
      ]);

    filters.filter(
      'translateFunc',
      [
        function ()
        {
          return function (func)
          {
            var ufunc;

            angular.forEach(
              config.app.mfunctions, function (pfunc)
              {
                if (pfunc.id == func) ufunc = pfunc.label;
              });

            return ufunc;
          }
        }
      ]);

    filters.filter(
      'stateDataIcon',
      [
        function ()
        {
          return function (name, type)
          {
            var ret;

            angular.forEach(
              config.app.stateIcons, function (stateIcon)
              {
                if (angular.lowercase(stateIcon.name) == angular.lowercase(name))
                {
                  if (type == "data_icon")
                  {
                    ret = stateIcon.data_icon;
                  }
                  else if (type == "class_name")
                  {
                    ret = stateIcon.class_name;
                  }
                }
              });

            return ret;
          }
        }
      ]);

    filters.filter(
      'stateValue',
      [
        function ()
        {
          return function (state, type)
          {
            if (angular.lowercase(state.name) == "location")
            {
              var value = state.value;
              var match = value.match(/\((.*?)\)/);

              if (match == null)
              {
                return value;
              }
              else
              {
                var ll = match[1];

                value = value.replace(match[0], "");

                if (type == "data")
                {
                  return ll;
                }
                else
                {
                  return value;
                }
              }
            }
            else
            {
              return state.value;
            }
          }
        }
      ]);

    filters.filter(
      'rangeMainFilter',
      [
        'Dater',
        function (Dater)
        {
          var periods = Dater.getPeriods();

          return function (dates)
          {
            // console.log('dates ->', dates);

            if ((
                  new Date(dates.end).getTime() - new Date(dates.start).getTime()) == 86401000)
            {
              dates.start = new Date(dates.end).addDays(- 1);
            }

            var dates = {
                  start: {
                    real:  new Date(dates.start).toString('dddd, MMMM d'),
                    month: new Date(dates.start).toString('MMMM'),
                    day:   new Date(dates.start).toString('d')
                  },
                  end:   {
                    real:  new Date(dates.end).toString('dddd, MMMM d'),
                    month: new Date(dates.end).toString('MMMM'),
                    day:   new Date(dates.end).toString('d')
                  }
                },
                monthNumber = Date.getMonthNumberFromName(dates.start.month);

            if (
              (((Math.round(dates.start.day) + 1) == dates.end.day && dates.start.hour == dates.end.hour) ||
               dates.start.day == dates.end.day) && dates.start.month == dates.end.month)
            {
              return  dates.start.real +
                      ', ' +
                      Dater.getThisYear();
            }
            else if (dates.start.day == 1 && dates.end.day == periods.months[monthNumber + 1].totalDays)
            {
              return  dates.start.month +
                      ', ' +
                      Dater.getThisYear();
            }
            else
            {
              return  dates.start.real +
                      ' / ' +
                      dates.end.real +
                      ', ' +
                      Dater.getThisYear();
            }

          }
        }
      ]);

    filters.filter(
      'rangeMainWeekFilter',
      [
        'Dater',
        function (Dater)
        {
          var periods = Dater.getPeriods();

          return function (dates)
          {
            if (dates)
            {
              var dates = {
                start: new Date(dates.start).toString('dddd, MMMM d'),
                end:   new Date(dates.end).toString('dddd, MMMM d')
              };

              return  dates.start +
                      ' / ' +
                      dates.end +
                      ', ' +
                      Dater.getThisYear();
            }
          }
        }
      ]);

    filters.filter(
      'rangeInfoFilter',
      [
        'Dater',
        function (Dater)
        {
          var periods = Dater.getPeriods();

          return function (timeline)
          {
            var diff = new Date(timeline.range.end).getTime() - new Date(timeline.range.start).getTime();

            if (diff > (2419200000 + 259200000))
            {
              return 'Total selected days: ' + Math.round(diff / 86400000);
            }
            else
            {
              if (timeline.scope.day)
              {
                var hours = {
                  start: new Date(timeline.range.start).toString('HH:mm'),
                  end:   new Date(timeline.range.end).toString('HH:mm')
                };

                /**
                 *  00:00 fix => 24:00
                 */
                if (hours.end == '00:00') hours.end = '24:00';

                return  'Time: ' +
                        hours.start +
                        ' / ' +
                        hours.end;
              }
              else if (timeline.scope.week)
              {
                return  'Week number: ' +
                        timeline.current.week;
              }
              else if (timeline.scope.month)
              {
                return  'Month number: ' +
                        timeline.current.month +
                        ', Total days: ' +
                        periods.months[timeline.current.month].totalDays;
              }
            }
          };
        }
      ]);

    filters.filter(
      'rangeInfoWeekFilter',
      [
        'Dater',
        function (Dater)
        {
          var periods = Dater.getPeriods();

          return function (timeline)
          {
            if (timeline) return 'Week number: ' + timeline.current.week;
          };
        }
      ]);

    filters.filter(
      'i18n_spec',
      [
        '$rootScope',
        function ($rootScope)
        {
          return function (string, type)
          {
            var types = type.split(".");

            return ($rootScope.ui[types[0]][types[1]]).replace('$v', string);
          }
        }
      ]);

    filters.filter(
      'stateIcon',
      [
        function ()
        {
          return function (state)
          {
            switch (state)
            {
              case 'emotion':
                return "icon-face";
                break;
              case 'availability':
                return "icon-avail";
                break;
              case 'location':
                return "icon-location";
                break;
              case 'activity':
                return "icon-activity";
                break;
              case 'reachability':
                return "icon-reach";
                break;
              default:
                return "icon-info-sign";
            }
          }
        }
      ]);
  }
);

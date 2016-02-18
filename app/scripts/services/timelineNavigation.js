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
             * Set the scope/period of the timeline in one of the three ['day', 'week', 'month']
             * @param period current period ['day', 'week', 'month']
             * @param dates current dates example: {day: 12, week: 34, year: 2016}
             * @returns {{periods: {day: boolean, week: boolean, month: boolean}, range: *}}
             */
            function setScope(period, dates)
            {
              var range = null;
              var periods    = {
                day: false,
                week: false,
                month: false
              };
              //format the daterange to milliseconds
              var rangedDate = +moment(
                dates.day + "-" +
                dates.month + "-" +
                dates.year,
                "DDD-MM-YYYY");
              var rangedMomentObj = moment(rangedDate);

              //switch periods and set the right daterange
              switch(period)
              {
                case 'day':
                  range = {
                    start: +rangedMomentObj.startOf('day'),
                    end: +rangedMomentObj.endOf('day').add(1, 'ms')
                  };
                  break;

                case 'week':
                  range = {
                    start: +rangedMomentObj.startOf('week'),
                    end: +rangedMomentObj.endOf('week').add(1, 'ms')
                  };
                  break;

                case 'month':
                  range = {
                    start: +rangedMomentObj.startOf('month'),
                    end: +rangedMomentObj.endOf('month').add(1, 'ms')
                  };
                  break;
              }

              periods[period] = true;

              dates.day = moment(range.start).format("DDD");
              dates.week = moment(range.start).week();
              dates.month = (moment(range.start).month() + 1);
              dates.year = moment(range.start).year();

              return {
                periods: periods,
                range: range,
                dates: dates
              }
            }

	          /**
             * go to the next [day, week, month and maybe year]
             * @param periods the period who is currently selected
             * @param The current dates dived in {day of the year, week of the year, month, year}
             * @returns {{dates, periods, range}|*}
	           */
            function nextScope(periods, dates)
            {
              return getCurrentDatesByPeriod(periods, dates, 'add');
            }

            /**
             * go to the previous [day, week, month and maybe year]
             * @param periods the period who is currently selected
             * @param The current dates dived in {day of the year, week of the year, month, year}
             * @returns {{dates, periods, range}|*}
             */
            function previousScope(periods, dates)
            {
              return getCurrentDatesByPeriod(periods, dates, 'subtract');
            }

            function getCurrentDatesByPeriod(periods, dates, minusOrPlus)
            {
              var range = {start: null, end: null};
              var rangedDate = +moment(
                dates.day + "-" +
                dates.month + "-" +
                dates.year,
                "DDD-MM-YYYY");

              if(periods.day)
              {
                range.start = +moment(rangedDate)[minusOrPlus](1, 'd')
                  .startOf('day');
                range.end = +moment(rangedDate)[minusOrPlus](1, 'd').endOf('day')
                                                                    .add(1, 'ms');
              }
              else if(periods.week)
              {
                range.start = +moment(rangedDate)[minusOrPlus](1, 'w').startOf('week');
                range.end = +moment(rangedDate)[minusOrPlus](1, 'w').endOf('week')
                                                                    .add(1, 'ms');
              }
              else if(periods.month)
              {
                range.start = +moment(rangedDate)[minusOrPlus](1, 'M').startOf('month');
                range.end = +moment(rangedDate)[minusOrPlus](1, 'M').endOf('month')
                                                                    .add(1, 'ms');
              }
              else if(periods.year)
              {
                range.start = +moment(rangedDate)[minusOrPlus](1, 'y').startOf('year');
                range.end = +moment(rangedDate)[minusOrPlus](1, 'y').endOf('year')
                                                                    .add(1, 'ms');
              }

              dates.day = moment(range.start).format("DDD");
              dates.week = moment(range.start).week();
              dates.month = (moment(range.start).month() + 1);
              dates.year = moment(range.start).year();

              return {
                dates: dates,
                periods: periods,
                range: range
              };
            }

          }).call(timelineNavigationService.prototype);

          return new timelineNavigationService;
        }
      ]
    );
  }
);
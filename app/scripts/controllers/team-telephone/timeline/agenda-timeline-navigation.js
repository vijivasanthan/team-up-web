define(
  ['../../controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'agenda-timeline-navigation',
      [
        '$rootScope', '$scope', '$window', 'moment',
        function ($rootScope, $scope, $window, moment)
        {
          /**
           * Day & Week & Month toggle actions
           */

          // both 'zoom' and 'applyRange' taken from chaps links.Timeline
          // TODO: feature request for vis.js or refactor
          var zoom = function(zoomFactor, zoomAroundDate){
            var currentRange = $scope.self.timeline.getWindow();
            var start = currentRange.start;
            var end = currentRange.end;


            // prevent zoom factor larger than 1 or smaller than -1 (larger than 1 will
            // result in a start>=end )
            if (zoomFactor >= 1) {
              zoomFactor = 0.9;
            }
            if (zoomFactor <= -1) {
              zoomFactor = -0.9;
            }

            // adjust a negative factor such that zooming in with 0.1 equals zooming
            // out with a factor -0.1
            if (zoomFactor < 0) {
              zoomFactor = zoomFactor / (1 + zoomFactor);
            }

            // zoom start Date and end Date relative to the zoomAroundDate
            var startDiff = parseFloat(start.valueOf() - zoomAroundDate.valueOf());
            var endDiff = parseFloat(end.valueOf() - zoomAroundDate.valueOf());

            // calculate new dates
            var newStart = new Date(start.valueOf() - startDiff * zoomFactor);
            var newEnd   = new Date(end.valueOf() - endDiff * zoomFactor);

            applyRange(newStart, newEnd, zoomAroundDate);

          };

          var applyRange = function(start, end, zoomAroundDate)
          {

            // calculate new start and end value
            var startValue = start.valueOf();
            var endValue = end.valueOf();
            var interval = (endValue - startValue);

            // determine maximum and minimum interval
            var options = {};
            var year = 1000 * 60 * 60 * 24 * 365;
            var intervalMin = $rootScope.StandBy.config.timeline.options.intervalMin;
            if (intervalMin < 10) {
              intervalMin = 10;
            }
            var intervalMax = Number(options.intervalMax) || 10000 * year;
            if (intervalMax > 10000 * year) {
              intervalMax = 10000 * year;
            }
            if (intervalMax < intervalMin) {
              intervalMax = intervalMin;
            }

            // determine min and max date value
            var min = options.min ? options.min.valueOf() : undefined;
            var max = options.max ? options.max.valueOf() : undefined;
            if (min != undefined && max != undefined) {
              if (min >= max) {
                // empty range
                var day = 1000 * 60 * 60 * 24;
                max = min + day;
              }
              if (intervalMax > (max - min)) {
                intervalMax = (max - min);
              }
              if (intervalMin > (max - min)) {
                intervalMin = (max - min);
              }
            }

            // prevent empty interval
            if (startValue >= endValue) {
              endValue += 1000 * 60 * 60 * 24;
            }

            // prevent too small scale
            // TODO: IE has problems with milliseconds
            if (interval < intervalMin) {
              var diff = (intervalMin - interval);
              var f = zoomAroundDate ? (zoomAroundDate.valueOf() - startValue) / interval : 0.5;
              startValue -= Math.round(diff * f);
              endValue   += Math.round(diff * (1 - f));
            }

            // prevent too large scale
            if (interval > intervalMax) {
              var diff = (interval - intervalMax);
              var f = zoomAroundDate ? (zoomAroundDate.valueOf() - startValue) / interval : 0.5;
              startValue += Math.round(diff * f);
              endValue   -= Math.round(diff * (1 - f));
            }

            // prevent to small start date
            if (min != undefined) {
              var diff = (startValue - min);
              if (diff < 0) {
                startValue -= diff;
                endValue -= diff;
              }
            }

            // prevent to large end date
            if (max != undefined) {
              var diff = (max - endValue);
              if (diff < 0) {
                startValue += diff;
                endValue += diff;
              }
            }

            // apply new dates
            $scope.self.timeline.setWindow({
              start: new Date(startValue),
              end: new Date(endValue)
            });
          };

          $scope.timelineScoper = function (period)
          {
            $scope.timeline.current.day = $scope.current.day;
            $scope.timeline.current.week = $scope.current.week;
            $scope.timeline.current.month = $scope.current.month;

            $scope.timeline.current.year = moment().year();

            switch (period)
            {
              case 'day':
                $scope.timeline.scope = {
                  day: true,
                  week: false,
                  month: false
                };

                $scope.timeliner.load(
                  {
                    start: +moment().startOf('day'),
                    end: +moment().endOf('day').add(1, 'ms')
                  });
                break;

              case 'week':
                $scope.timeline.scope = {
                  day: false,
                  week: true,
                  month: false
                };

                $scope.timeliner.load(
                  {
                    start: +moment().startOf('week'),
                    end: +moment().endOf('week').add(1, 'ms')
                  });
                break;

              case 'month':
                $scope.timeline.scope = {
                  day: false,
                  week: false,
                  month: true
                };

                $scope.timeliner.load(
                  {
                    start: +moment().startOf('month'),
                    end: +moment().endOf('month').add(1, 'ms')
                  });
                break;
            }
          };


          /**
           * Go one period in past
           */
          $scope.timelineBefore = function ()
          {
            var thisYear = moment().year();

            if ($scope.timeline.scope.day)
            {
              if ($scope.timeline.current.year === thisYear + 1)
              {
                if ($scope.timeline.current.day === 1)
                {
                  $scope.timeline.current.year = thisYear;

                  $scope.timeline.current.day = moment().endOf('year').dayOfYear();

                  $scope.timeliner.load(
                    {
                      start: +moment().dayOfYear($scope.timeline.current.day).startOf('day'),
                      end: +moment().dayOfYear($scope.timeline.current.day).endOf('day').add(1, 'ms')
                    });
                }
                else
                {
                  $scope.timeline.current.day--;

                  $scope.timeliner.load(
                    {
                      start: +moment().year($scope.timeline.current.year).dayOfYear($scope.timeline.current.day).startOf('day'),
                      end: +moment().year($scope.timeline.current.year).dayOfYear($scope.timeline.current.day).endOf('day').add(1, 'ms')
                    });
                }
              }
              else
              {
                if ($scope.timeline.current.day != 1)
                {
                  $scope.timeline.current.day--;

                  $scope.timeliner.load(
                    {
                      start: +moment().dayOfYear($scope.timeline.current.day).startOf('day'),
                      end: +moment().dayOfYear($scope.timeline.current.day).endOf('day').add(1, 'ms')
                    });
                }
              }
            }
            else if ($scope.timeline.scope.week)
            {
              if ($scope.timeline.current.year === thisYear + 1)
              {
                if ($scope.timeline.current.week === 1)
                {
                  $scope.timeline.current.year = thisYear;

                  $scope.timeline.current.week = 52;

                  $scope.timeliner.load(
                    {
                      start: +moment().week($scope.timeline.current.week).startOf('week'),
                      end: +moment().week($scope.timeline.current.week).endOf('week').add(1, 'ms')
                    });
                }
                else
                {
                  $scope.timeline.current.week--;

                  $scope.timeliner.load(
                    {
                      start: +moment().year($scope.timeline.current.year).week($scope.timeline.current.week).startOf('week'),
                      end: +moment().year($scope.timeline.current.year).week($scope.timeline.current.week).endOf('week').add(1, 'ms')
                    });
                }
              }
              else
              {
                if ($scope.timeline.current.week != 1)
                {
                  $scope.timeline.current.week--;

                  $scope.timeliner.load(
                    {
                      start: +moment().week($scope.timeline.current.week).startOf('week'),
                      end: +moment().week($scope.timeline.current.week).endOf('week').add(1, 'ms')
                    });
                }
                else if ($scope.timeline.current.month == 12)
                {
                  // TODO double check if can be removed and remove this block
                  $scope.timeline.current.week = 53;
                  $scope.timeline.current.week--;

                  $scope.timeliner.load(
                    {
                      start: +moment().week($scope.timeline.current.week).startOf('week'),
                      end: +moment().week($scope.timeline.current.week).endOf('week').add(1, 'ms')
                    });
                }
              }
            }
            else if ($scope.timeline.scope.month)
            {
              if ($scope.timeline.current.year === thisYear + 1)
              {
                if ($scope.timeline.current.month === 1)
                {
                  $scope.timeline.current.year = thisYear;

                  $scope.timeline.current.month = 12;

                  $scope.timeliner.load(
                    {
                      start: +moment().month($scope.timeline.current.month - 1).startOf('month'),
                      end: +moment().month($scope.timeline.current.month - 1).endOf('month').add(1, 'ms')
                    });
                }
                else
                {
                  $scope.timeline.current.month--;

                  $scope.timeliner.load(
                    {
                      start: +moment().year($scope.timeline.current.year).month($scope.timeline.current.month - 1).startOf('month'),
                      end: +moment().year($scope.timeline.current.year).month($scope.timeline.current.month - 1).endOf('month').add(1, 'ms')
                    });
                }
              }
              else
              {
                if ($scope.timeline.current.month != 1)
                {
                  $scope.timeline.current.month--;

                  $scope.timeliner.load(
                    {
                      start: +moment().month($scope.timeline.current.month - 1).startOf('month'),
                      end: +moment().month($scope.timeline.current.month - 1).endOf('month').add(1, 'ms')
                    });
                }
              }
            }
          };


          /**
           * Go one period in future
           */
          $scope.timelineAfter = function ()
          {
            var thisYear = moment().year();

            if ($scope.timeline.scope.day)
            {
              if ($scope.timeline.current.year === thisYear)
              {
                /**
                 * Total days in a month can change so get it start periods cache
                 */
                if ($scope.timeline.current.day != moment().endOf('year').dayOfYear())
                {
                  $scope.timeline.current.day++;

                  $scope.timeliner.load(
                    {
                      start: +moment().dayOfYear($scope.timeline.current.day).startOf('day'),
                      end: +moment().dayOfYear($scope.timeline.current.day).endOf('day').add(1, 'ms')
                    });
                }
                else
                {
                  $scope.timeline.current.year = thisYear + 1;

                  $scope.timeline.current.day = 1;

                  $scope.timeliner.load(
                    {
                      start: +moment().year($scope.timeline.current.year).dayOfYear($scope.timeline.current.day).startOf('day'),
                      end: +moment().year($scope.timeline.current.year).dayOfYear($scope.timeline.current.day).endOf('day').add(1, 'ms')
                    });
                }
              }
              else
              {
                $scope.timeline.current.year = thisYear + 1;

                $scope.timeline.current.day++;

                $scope.timeliner.load(
                  {
                    start: +moment().year($scope.timeline.current.year).dayOfYear($scope.timeline.current.day).startOf('day'),
                    end: +moment().year($scope.timeline.current.year).dayOfYear($scope.timeline.current.day).endOf('day').add(1, 'ms')
                  });
              }
            }
            else if ($scope.timeline.scope.week)
            {
              if ($scope.timeline.current.year == thisYear)
              {
                if ($scope.timeline.current.week == 1 && $scope.timeline.current.month == 12)
                {
                  // deal with situation that last days in the end of the year share the first week with starting days in the next year.
                  $scope.timeline.current.week = 53;
                }

                if ($scope.timeline.current.week != 53)
                {
                  $scope.timeline.current.week++;

                  $scope.timeliner.load(
                    {
                      start: +moment().week($scope.timeline.current.week).startOf('week'),
                      end: +moment().week($scope.timeline.current.week).endOf('week').add(1, 'ms')
                    });
                }
                else
                {
                  $scope.timeline.current.year = thisYear + 1;

                  $scope.timeline.current.week = 1;

                  $scope.timeliner.load(
                    {
                      start: +moment().year($scope.timeline.current.year).week($scope.timeline.current.week).startOf('week'),
                      end: +moment().year($scope.timeline.current.year).week($scope.timeline.current.week).endOf('week').add(1, 'ms')
                    });
                }
              }
              else
              {
                if ($scope.timeline.current.week != 53)
                {
                  $scope.timeline.current.week++;

                  $scope.timeliner.load(
                    {
                      start: +moment().year($scope.timeline.current.year).week($scope.timeline.current.week).startOf('week'),
                      end: +moment().year($scope.timeline.current.year).week($scope.timeline.current.week).endOf('week').add(1, 'ms')
                    });
                }
              }
            }
            else if ($scope.timeline.scope.month)
            {
              if ($scope.timeline.current.year == thisYear)
              {
                if ($scope.timeline.current.month != 12)
                {
                  $scope.timeline.current.month++;

                  $scope.timeliner.load(
                    {
                      start: +moment().month($scope.timeline.current.month - 1).startOf('month'),
                      end: +moment().month($scope.timeline.current.month - 1).endOf('month').add(1, 'ms')
                    });
                }
                else
                {
                  $scope.timeline.current.year = thisYear + 1;

                  $scope.timeline.current.month = 1;

                  $scope.timeliner.load(
                    {
                      start: +moment().year($scope.timeline.current.year).month($scope.timeline.current.month - 1).startOf('month'),
                      end: +moment().year($scope.timeline.current.year).month($scope.timeline.current.month - 1).endOf('month').add(1, 'ms')
                    });
                }
              }
              else
              {
                if ($scope.timeline.current.month != 12)
                {
                  $scope.timeline.current.month++;

                  $scope.timeliner.load(
                    {
                      start: +moment().year($scope.timeline.current.year).month($scope.timeline.current.month - 1).startOf('month'),
                      end: +moment().year($scope.timeline.current.year).month($scope.timeline.current.month - 1).endOf('month').add(1, 'ms')
                    });
                }
              }
            }
          };

          /**
           * Go to this week
           */
          $scope.timelineThisWeek = function ()
          {
            if ($scope.timeline.current.week != moment().week())
            {

              $scope.timeline.current.week = moment().week();

              $scope.timeliner.load(
                {
                  start: +moment().startOf('week'),
                  end: +moment().endOf('week').add(1, 'ms')
                });

              $scope.timeline.range = {
                start: moment().startOf('week').toISOString(),
                end: moment().endOf('week').add(1, 'ms').toISOString()
              };
            }
          };


          /**
           * Go one week in past
           */
          $scope.timelineWeekBefore = function ()
          {
            if ($scope.timeline.current.week != 1)
            {
              $scope.timeline.current.week--;

              $scope.timeliner.load(
                {
                  start: +moment().week($scope.timeline.current.week).startOf('week'),
                  end: +moment().week($scope.timeline.current.week).endOf('week').add(1, 'ms')
                });
            }

            $scope.timeline.range = {
              start: moment().week($scope.timeline.current.week).startOf('week').toISOString(),
              end: moment().week($scope.timeline.current.week).endOf('week').add(1, 'ms').toISOString()
            };
          };


          /**
           * Go one week in future
           */
          $scope.timelineWeekAfter = function ()
          {
            if ($scope.timeline.current.week != 53)
            {
              $scope.timeline.current.week++;

              $scope.timeliner.load(
                {
                  start: +moment().week($scope.timeline.current.week).startOf('week'),
                  end: +moment().week($scope.timeline.current.week).endOf('week').add(1, 'ms')
                });
            }

            $scope.timeline.range = {
              start: moment().week($scope.timeline.current.week).startOf('week').toISOString(),
              end: moment().week($scope.timeline.current.week).endOf('week').add(1, 'ms').toISOString()
            };
          };


          /**
           * Timeline zoom in
           */
          $scope.timelineZoomIn = function ()
          {
            $scope.self.timeline.zoom(config.app.timeline.config.zoom, Date.now());
          };


          /**
           * Timeline zoom out
           */
          $scope.timelineZoomOut = function ()
          {
            $scope.self.timeline.zoom(-config.app.timeline.config.zoom, Date.now());
          };


          /**
           * Redraw timeline on window resize
           */
          $window.onresize = function ()
          {
            $scope.self.timeline.redraw();
          };

          $scope.fullWidth = function ()
          {
            $scope.self.timeline.redraw();
          }
        }
      ]
    );
  }
);

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

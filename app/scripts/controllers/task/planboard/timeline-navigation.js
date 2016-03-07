define(
  ['../../controllers', 'config'],
  function(controllers, config)
  {
    'use strict';

    controllers.controller(
      'timeline-navigation',
      [
        '$rootScope', '$scope', '$window', 'TimelineNavigation',
        function($rootScope, $scope, $window, TimelineNavigation)
        {

          // both 'zoom' and 'applyRange' taken from chaps links.Timeline
          // TODO: feature request for vis.js or refactor
          var zoom = function(zoomFactor, zoomAroundDate)
          {
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
            var intervalMin = $rootScope.config.app.timeline.options.intervalMin;
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

          $scope.timelineScoper = function(period)
          {
            var scope = TimelineNavigation
              .setScope(
                period,
                $scope.timeline.current
              );

            setCurrentDates(scope.dates);
            $scope.timeline.scope = scope.periods;
            $scope.timeliner.render(scope.range);

          };

          $scope.timelineBefore = function()
          {
            var scope = TimelineNavigation
              .previousScope(
                $scope.timeline.scope,
                $scope.timeline.current
              );

            setCurrentDates(scope.dates);
            $scope.timeliner.render(scope.range);
          };

          /**
           * Go one period in future
           */
          $scope.timelineAfter = function()
          {
            var scope = TimelineNavigation
              .nextScope(
                $scope.timeline.scope,
                $scope.timeline.current
              );

            setCurrentDates(scope.dates);
            $scope.timeline.scope         = scope.periods;

            $scope.timeliner.render(scope.range);
          };

          /**
           * Timeline zoom in
           */
          $scope.timelineZoomIn = function()
          {
            zoom(config.app.timeline.config.zoom, Date.now());
          };

          /**
           * Timeline zoom out
           */
          $scope.timelineZoomOut = function()
          {
            zoom(-config.app.timeline.config.zoom, Date.now());
          };

          $window.onresize = function()
          {
            $scope.self.timeline.redraw()
          };

          $scope.fullWidth = function()
          {
            $scope.self.timeline.redraw()
          }

          /**
           * Set the current dates to the timeline current, day, week, month and year
           * @param currentDates
           */
          function setCurrentDates(currentDates)
          {
            $scope.timeline.current.day   = currentDates.day;
            $scope.timeline.current.week  = currentDates.week;
            $scope.timeline.current.month = currentDates.month;
            $scope.timeline.current.year  = currentDates.year;
          }
        }
      ]);
  }
);
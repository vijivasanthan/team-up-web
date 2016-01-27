define(
  ['../../controllers', 'config'],
  function(controllers, config)
  {
    'use strict';

    controllers.controller(
      'agenda-timeline-navigation',
      [
        '$rootScope', '$scope', '$window', 'moment', 'TimelineNavigation',
        function($rootScope, $scope, $window, moment, TimelineNavigation)
        {
          /**
           * Toggle by period of [day, week, month]
           * @param period
           */
          $scope.timelineScoper = function(period)
          {
            $scope.timeline.current.day   = $scope.current.day;
            $scope.timeline.current.week  = $scope.current.week;
            $scope.timeline.current.month = $scope.current.month;
            $scope.timeline.current.year  = moment().year();

            var scope = TimelineNavigation
              .setScope(
                period,
                $scope.timeline.current
              );

            $scope.timeline.scope = scope.periods;
            $scope.timeliner.load(scope.range);
          };

          /**
           * Go one period in past
           */
          $scope.timelineBefore = function()
          {
            var scope = TimelineNavigation
                          .previousScope(
                            $scope.timeline.scope,
                            $scope.timeline.current
                          );

            $scope.timeline.current.day   = scope.dates.day;
            $scope.timeline.current.week  = scope.dates.week;
            $scope.timeline.current.month = scope.dates.month;
            $scope.timeline.current.year  = scope.dates.year;

            $scope.timeliner.load(scope.range);
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

            $scope.timeline.current.day   = scope.dates.day;
            $scope.timeline.current.week  = scope.dates.week;
            $scope.timeline.current.month = scope.dates.month;
            $scope.timeline.current.year  = scope.dates.year;
            $scope.timeline.scope         = scope.periods;

            $scope.timeliner.load(scope.range);
          };

          /**
           * Timeline zoom in
           */
          $scope.timelineZoomIn = function()
          {
            $scope.self.timeline.zoom(config.app.timeline.config.zoom, Date.now());
          };

          /**
           * Timeline zoom out
           */
          $scope.timelineZoomOut = function()
          {
            $scope.self.timeline.zoom(- config.app.timeline.config.zoom, Date.now());
          };

          /**
           * Redraw timeline on window resize
           */
          $window.onresize = function()
          {
            $scope.self.timeline.redraw();
          };

          $scope.fullWidth = function()
          {
            $scope.self.timeline.redraw();
          }
        }
      ]
    );
  }
);

/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Planboard', [])

/**
 * Planboard controller
 */
  .controller('planboard',[
    '$rootScope', '$scope', '$location', 'Dater', 'Storage',
    function ($rootScope, $scope, $location, Dater, Storage)
    {


      console.log('clients ->', angular.fromJson(Storage.get('ClientGroups')));

      $scope.teams = angular.fromJson(Storage.get('Teams'));


      /**
       * View setter
       */
      function setView (hash)
      {
        $scope.views = {
          teams:  false,
          clients:false
        };

        $scope.views[hash] = true;
      }


      /**
       * Switch between the views and set hash accordingly
       */
      $scope.setViewTo = function (hash)
      {
        $scope.$watch(hash, function ()
        {
          $location.hash(hash);

          setView(hash);
        });
      };


      /**
       * Default view
       */
      $scope.setViewTo('teams');

      var data = {
        "user": [
          {
            "count": 0,
            "end": 1378681200,
            "recursive": true,
            "start": 1378504800,
            "text": "com.ask-cs.State.Available",
            "type": "availability",
            "wish": 0
          },
          {
            "count": 0,
            "end": 1378850400,
            "recursive": true,
            "start": 1378720800,
            "text": "com.ask-cs.State.Available",
            "type": "availability",
            "wish": 0
          }
        ],
        "synced": 1378384322609,
        "periods": {
          "start": 1378332000000,
          "end": 1378936800000
        }
      };

      // console.log('data ->', angular.toJson(data));

      console.log('this week ->', Number(Date.today()));


      /**
       * Pass the self
       */
      $scope.self = this;


      /**
       * Pass time slots data
       */
      $scope.data = data;


      /**
       * Get groups and settings
       */
//      var groups  	= Storage.local.groups(),
//        settings 	= Storage.local.settings();


      /**
       * Pass current
       */
      $scope.current = {
        layouts: {
          user:     true,
          group:    false,
          members:  false
        },
        /**
         * Fix for timeline scope to day
         */
        day:      Dater.current.today() + 1,
        week:     Dater.current.week(),
        month:    Dater.current.month(),
        // group:    settings.app.group,
        division: 'all'
      };


      /**
       * Pass periods
       */
      Dater.registerPeriods();

      $scope.periods = Dater.getPeriods();


      /**
       * Reset and init slot container which
       * is used for adding or changing slots
       */
      $scope.slot = {};


      /**
       * Set defaults for timeline
       */
      $scope.timeline = {
        id: 'mainTimeline',
        main: true,
        user: {
          id: 	$rootScope.app.resources.uuid,
          role: $rootScope.app.resources.role
        },
        current: $scope.current,
        /**
         * Initial start up is next 7 days
         */
        options: {
          start:  $scope.periods.days[Dater.current.today()].last.day,
          end:    $scope.periods.days[Dater.current.today() + 7].last.day,
          min:  	$scope.periods.days[Dater.current.today()].last.day,
          max:    $scope.periods.days[Dater.current.today() + 7].last.day
        },
        range: {
          start:  $scope.periods.days[Dater.current.today()].last.day,
          end:    $scope.periods.days[Dater.current.today() + 7].last.day
        },
        scope: {
          day:    false,
          week:   true,
          month:  false
        },
        config: {
          bar:        $rootScope.config.timeline.config.bar,
          layouts:    $rootScope.config.timeline.config.layouts,
          wishes:     $rootScope.config.timeline.config.wishes,
          legenda:    {},
          legendarer: $rootScope.config.timeline.config.legendarer,
          states:     $rootScope.config.timeline.config.states,
          divisions:  $rootScope.config.timeline.config.divisions,
          densities:  $rootScope.config.timeline.config.densities
        }
      };


      /**
       * IE8 fix for inability of - signs in date object
       */
      if ($.browser.msie && $.browser.version == '8.0')
      {
        $scope.timeline.options = {
          start:  $scope.periods.days[Dater.current.today()].last.timeStamp,
          end:    $scope.periods.days[Dater.current.today() + 7].last.timeStamp,
          min:    $scope.periods.days[Dater.current.today()].last.timeStamp,
          max:    $scope.periods.days[Dater.current.today() + 7].last.timeStamp
        };
      }


      /**
       * Legend defaults
       */
      angular.forEach($rootScope.config.timeline.config.states, function (state, index)
      {
        $scope.timeline.config.legenda[index] = true;
      });


      /**
       * Timeline group legend default configuration
       */
      $scope.timeline.config.legenda.groups = {
        more: true,
        even: true,
        less: true
      };


      /**
       * Prepare timeline range for date ranger widget
       */
      $scope.daterange =  Dater.readable.date($scope.timeline.range.start) + ' / ' +
        Dater.readable.date($scope.timeline.range.end);





    }

  ]);

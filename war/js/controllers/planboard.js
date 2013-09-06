/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Planboard', [])

/**
 * Planboard controller
 */
  .controller('planboard',[
    '$rootScope', '$scope', '$location', 'Dater',
    function ($rootScope, $scope, $location, Dater)
    {

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


      // var data = {"user":[{"count":0,"end":1378681200,"recursive":true,"start":1378504800,"text":"com.ask-cs.State.Available","type":"availability","wish":0},{"count":0,"end":1378850400,"recursive":true,"start":1378720800,"text":"com.ask-cs.State.Available","type":"availability","wish":0}],"groupId":"a2408ffc-69b5-1030-a3ab-005056bc7e66","aggs":[{"id":"a2408ffc-69b5-1030-a3ab-005056bc7e66","division":{"id":"knrm.StateGroup.BeschikbaarNoord","label":"Noord"},"data":[{"diff":10,"end":1378346400,"start":1378332000,"wish":1},{"diff":9,"end":1378351800,"start":1378346400,"wish":1},{"diff":8,"end":1378353600,"start":1378351800,"wish":1},{"diff":5,"end":1378357200,"start":1378353600,"wish":1},{"diff":3,"end":1378375200,"start":1378357200,"wish":1},{"diff":2,"end":1378389600,"start":1378375200,"wish":1},{"diff":3,"end":1378393200,"start":1378389600,"wish":1},{"diff":5,"end":1378396800,"start":1378393200,"wish":1},{"diff":6,"end":1378398600,"start":1378396800,"wish":1},{"diff":7,"end":1378400400,"start":1378398600,"wish":1},{"diff":10,"end":1378407600,"start":1378400400,"wish":1},{"diff":11,"end":1378429200,"start":1378407600,"wish":1},{"diff":10,"end":1378430100,"start":1378429200,"wish":1},{"diff":11,"end":1378432800,"start":1378430100,"wish":1},{"diff":10,"end":1378440000,"start":1378432800,"wish":1},{"diff":6,"end":1378443600,"start":1378440000,"wish":1},{"diff":4,"end":1378447200,"start":1378443600,"wish":1},{"diff":3,"end":1378450800,"start":1378447200,"wish":1},{"diff":4,"end":1378483200,"start":1378450800,"wish":1},{"diff":5,"end":1378485000,"start":1378483200,"wish":1},{"diff":6,"end":1378486800,"start":1378485000,"wish":1},{"diff":7,"end":1378494000,"start":1378486800,"wish":1},{"diff":8,"end":1378497600,"start":1378494000,"wish":1},{"diff":7,"end":1378530000,"start":1378497600,"wish":1},{"diff":6,"end":1378533600,"start":1378530000,"wish":1},{"diff":5,"end":1378569600,"start":1378533600,"wish":1},{"diff":4,"end":1378573200,"start":1378569600,"wish":1},{"diff":5,"end":1378598400,"start":1378573200,"wish":1},{"diff":4,"end":1378616400,"start":1378598400,"wish":1},{"diff":3,"end":1378634400,"start":1378616400,"wish":1},{"diff":4,"end":1378641600,"start":1378634400,"wish":1},{"diff":5,"end":1378659600,"start":1378641600,"wish":1},{"diff":6,"end":1378670400,"start":1378659600,"wish":1},{"diff":7,"end":1378677600,"start":1378670400,"wish":1},{"diff":8,"end":1378692000,"start":1378677600,"wish":1},{"diff":7,"end":1378699200,"start":1378692000,"wish":1},{"diff":4,"end":1378702800,"start":1378699200,"wish":1},{"diff":3,"end":1378706400,"start":1378702800,"wish":1},{"diff":2,"end":1378738800,"start":1378706400,"wish":1},{"diff":3,"end":1378740600,"start":1378738800,"wish":1},{"diff":4,"end":1378746000,"start":1378740600,"wish":1},{"diff":6,"end":1378749600,"start":1378746000,"wish":1},{"diff":7,"end":1378753200,"start":1378749600,"wish":1},{"diff":6,"end":1378760400,"start":1378753200,"wish":1},{"diff":9,"end":1378764000,"start":1378760400,"wish":1},{"diff":10,"end":1378778400,"start":1378764000,"wish":1},{"diff":9,"end":1378785600,"start":1378778400,"wish":1},{"diff":7,"end":1378789200,"start":1378785600,"wish":1},{"diff":3,"end":1378825200,"start":1378789200,"wish":1},{"diff":4,"end":1378827000,"start":1378825200,"wish":1},{"diff":5,"end":1378830600,"start":1378827000,"wish":1},{"diff":6,"end":1378832400,"start":1378830600,"wish":1},{"diff":9,"end":1378839600,"start":1378832400,"wish":1},{"diff":10,"end":1378850400,"start":1378839600,"wish":1},{"diff":11,"end":1378864800,"start":1378850400,"wish":1},{"diff":10,"end":1378872000,"start":1378864800,"wish":1},{"diff":7,"end":1378875600,"start":1378872000,"wish":1},{"diff":4,"end":1378879200,"start":1378875600,"wish":1},{"diff":3,"end":1378913400,"start":1378879200,"wish":1},{"diff":4,"end":1378915200,"start":1378913400,"wish":1},{"diff":6,"end":1378917000,"start":1378915200,"wish":1},{"diff":7,"end":1378918800,"start":1378917000,"wish":1},{"diff":10,"end":1378929600,"start":1378918800,"wish":1},{"diff":9,"end":1378936800,"start":1378929600,"wish":1}],"ratios":{"less":0,"even":0,"more":100},"durations":{"less":0,"even":0,"more":604800,"total":604800}},{"id":"a2408ffc-69b5-1030-a3ab-005056bc7e66","division":{"id":"knrm.StateGroup.BeschikbaarZuid","label":"Zuid"},"data":[{"diff":9,"end":1378346400,"start":1378332000,"wish":1},{"diff":8,"end":1378351800,"start":1378346400,"wish":1},{"diff":7,"end":1378353600,"start":1378351800,"wish":1},{"diff":4,"end":1378357200,"start":1378353600,"wish":1},{"diff":2,"end":1378389600,"start":1378357200,"wish":1},{"diff":3,"end":1378393200,"start":1378389600,"wish":1},{"diff":5,"end":1378396800,"start":1378393200,"wish":1},{"diff":6,"end":1378398600,"start":1378396800,"wish":1},{"diff":7,"end":1378400400,"start":1378398600,"wish":1},{"diff":10,"end":1378407600,"start":1378400400,"wish":1},{"diff":11,"end":1378429200,"start":1378407600,"wish":1},{"diff":10,"end":1378430100,"start":1378429200,"wish":1},{"diff":11,"end":1378432800,"start":1378430100,"wish":1},{"diff":10,"end":1378440000,"start":1378432800,"wish":1},{"diff":6,"end":1378443600,"start":1378440000,"wish":1},{"diff":4,"end":1378447200,"start":1378443600,"wish":1},{"diff":3,"end":1378450800,"start":1378447200,"wish":1},{"diff":4,"end":1378483200,"start":1378450800,"wish":1},{"diff":5,"end":1378485000,"start":1378483200,"wish":1},{"diff":6,"end":1378486800,"start":1378485000,"wish":1},{"diff":7,"end":1378494000,"start":1378486800,"wish":1},{"diff":8,"end":1378497600,"start":1378494000,"wish":1},{"diff":7,"end":1378530000,"start":1378497600,"wish":1},{"diff":6,"end":1378533600,"start":1378530000,"wish":1},{"diff":5,"end":1378569600,"start":1378533600,"wish":1},{"diff":4,"end":1378573200,"start":1378569600,"wish":1},{"diff":5,"end":1378591200,"start":1378573200,"wish":1},{"diff":6,"end":1378598400,"start":1378591200,"wish":1},{"diff":5,"end":1378616400,"start":1378598400,"wish":1},{"diff":4,"end":1378641600,"start":1378616400,"wish":1},{"diff":5,"end":1378659600,"start":1378641600,"wish":1},{"diff":6,"end":1378670400,"start":1378659600,"wish":1},{"diff":7,"end":1378677600,"start":1378670400,"wish":1},{"diff":8,"end":1378692000,"start":1378677600,"wish":1},{"diff":7,"end":1378699200,"start":1378692000,"wish":1},{"diff":4,"end":1378702800,"start":1378699200,"wish":1},{"diff":3,"end":1378706400,"start":1378702800,"wish":1},{"diff":2,"end":1378738800,"start":1378706400,"wish":1},{"diff":3,"end":1378740600,"start":1378738800,"wish":1},{"diff":4,"end":1378746000,"start":1378740600,"wish":1},{"diff":6,"end":1378749600,"start":1378746000,"wish":1},{"diff":7,"end":1378753200,"start":1378749600,"wish":1},{"diff":6,"end":1378760400,"start":1378753200,"wish":1},{"diff":9,"end":1378764000,"start":1378760400,"wish":1},{"diff":10,"end":1378778400,"start":1378764000,"wish":1},{"diff":9,"end":1378785600,"start":1378778400,"wish":1},{"diff":7,"end":1378789200,"start":1378785600,"wish":1},{"diff":3,"end":1378825200,"start":1378789200,"wish":1},{"diff":4,"end":1378827000,"start":1378825200,"wish":1},{"diff":5,"end":1378830600,"start":1378827000,"wish":1},{"diff":6,"end":1378832400,"start":1378830600,"wish":1},{"diff":9,"end":1378839600,"start":1378832400,"wish":1},{"diff":10,"end":1378850400,"start":1378839600,"wish":1},{"diff":11,"end":1378864800,"start":1378850400,"wish":1},{"diff":10,"end":1378872000,"start":1378864800,"wish":1},{"diff":7,"end":1378875600,"start":1378872000,"wish":1},{"diff":4,"end":1378879200,"start":1378875600,"wish":1},{"diff":3,"end":1378893600,"start":1378879200,"wish":1},{"diff":2,"end":1378913400,"start":1378893600,"wish":1},{"diff":3,"end":1378915200,"start":1378913400,"wish":1},{"diff":5,"end":1378917000,"start":1378915200,"wish":1},{"diff":6,"end":1378918800,"start":1378917000,"wish":1},{"diff":9,"end":1378929600,"start":1378918800,"wish":1},{"diff":8,"end":1378936800,"start":1378929600,"wish":1}],"ratios":{"less":0,"even":0,"more":100},"durations":{"less":0,"even":0,"more":604800,"total":604800}}],"synced":1378384322609,"periods":{"start":1378332000000,"end":1378936800000}};

      var data = {"user":[{"count":0,"end":1378681200,"recursive":true,"start":1378504800,"text":"com.ask-cs.State.Available","type":"availability","wish":0},{"count":0,"end":1378850400,"recursive":true,"start":1378720800,"text":"com.ask-cs.State.Available","type":"availability","wish":0}],"groupId":"a2408ffc-69b5-1030-a3ab-005056bc7e66","synced":1378384322609,"periods":{"start":1378332000000,"end":1378936800000}};

      console.log('data ->', angular.toJson(data));


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

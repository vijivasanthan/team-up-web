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



      var teams   = angular.fromJson(Storage.get('Teams')),
          clients = angular.fromJson(Storage.get('ClientGroups'));

      $scope.data = {
        teams: {
          list:    [],
          members: {}
        },
        clients: {
          list:    [],
          members: {}
        },
        user: [
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
        members: [],
        synced: Number(Date.today()),
        periods: {
          start: Number(Date.today()),
          end:   Number(Date.today()) + (7 * 24 * 60 * 60 * 1000)
        }
      };

      angular.forEach(teams, function (team)
      {
        var members = angular.fromJson(Storage.get(team.uuid));

        if (members.length > 0)
        {
          $scope.data.teams.list.push({
            uuid: team.uuid,
            name: team.name
          });

          $scope.data.teams.members[team.uuid] = [];

          angular.forEach(members, function (member)
          {
            var avatar = '<div class="roundedPicSmall memberStateNone" ' +
              'id="img_willemnales" ' +
              'style="float: left; background-image: url(http://teamup.acs-services.appspot.com//teamup/team/member/willemnales/photo);"></div>';

            var name = avatar + '<div style="float: left; margin: 15px 0 0 5px; font-size: 14px;">' + member.firstName + ' ' + member.lastName + '</div>';

            $scope.data.teams.members[team.uuid].push( name );
          });
        }
      });

      angular.forEach(clients, function (client)
      {
        var members = angular.fromJson(Storage.get(client.id));

        if (members.length > 0)
        {
          $scope.data.clients.list.push({
            uuid: client.id,
            name: client.name
          });

          $scope.data.clients.members[client.id] = [];

          angular.forEach(members, function (member)
          {
            var avatar = '<div class="roundedPicSmall memberStateNone" ' +
              'id="img_willemnales" ' +
              'style="float: left; background-image: url(http://teamup.acs-services.appspot.com//teamup/team/member/willemnales/photo);"></div>';

            var name = avatar + '<div style="float: left; margin: 15px 0 0 5px; font-size: 14px;">' + member.firstName + ' ' + member.lastName + '</div>';

            $scope.data.clients.members[client.id].push( name );
          });
        }
      });


      function switchData ()
      {
        switch ($scope.section)
        {
          case 'teams':
            $scope.list     = $scope.data.teams.list;
            $scope.current  = $scope.data.teams.list[0].uuid;
            break;
          case 'clients':
            $scope.list     = $scope.data.clients.list;
            $scope.current  = $scope.data.clients.list[0].uuid;
            break;
        }

        $scope.changeCurrent($scope.current);
      }

      $scope.changeCurrent = function ()
      {
        angular.forEach($scope.data[$scope.section].list, function (node)
        {
          if (node.uuid == $scope.current)
          {
            $scope.currentName = node.name;
          }
        });

        $scope.data.section = $scope.section;

        $scope.data.members = $scope.data[$scope.section].members[$scope.current];

        $rootScope.$broadcast('timeliner', {
          start: Number(Date.today()),
          end:   Number(Date.today()) + (7 * 24 * 60 * 60 * 1000)
        });

        // console.log('$scope.data ->', $scope.data.members);
      };




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

          $scope.section = hash;

          switchData();

          setView(hash);
        });
      };


      /**
       * Default view
       */
      $scope.setViewTo('teams');



      /*
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
        "synced": Number(Date.today()),
        "periods": {
          "start": Number(Date.today()),
          "end":   Number(Date.today()) + (7 * 24 * 60 * 60 * 1000)
        }
      };

      // console.log('data ->', angular.toJson(data));

      console.log('this week ->', Number(Date.today()));
      */


      /**
       * Pass the self
       */
      $scope.self = this;


      /**
       * Pass time slots data
       */
      // $scope.data = data;


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

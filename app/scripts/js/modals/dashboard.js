/*jslint node: true */
/*global angular */
/*global $ */
/*global error */
'use strict';


angular.module('WebPaige.Modals.Dashboard', ['ngResource'])


/**
 * Dashboard modal
 */
.factory('Dashboard',
[
	'$rootScope', '$resource', '$config', '$q', 'Storage', 'Slots', 'Dater', 'Announcer',
	function ($rootScope, $resource, $config, $q, Storage, Slots, Dater, Announcer)
	{
    /**
     * TODO: Still being used?
     */
    var Dashboard = $resource(
      'http://knrm.myask.me/rpc/client/p2000.php',
      {
      },
      {
        p2000: {
          method: 'GET',
          params: {},
          isArray: true
        }
      }
    );


    /**
     * TODO: Still being used?
     */
    var Backend = $resource(
      $config.host + '/capcodes',
      {},
      {
        capcodes: {
          method: 'GET',
          params: {},
          isArray: true
        }
      }
    );
		

		/**
		 * Get group aggs for pie charts
		 */
		Dashboard.prototype.pies = function ()
		{
			var deferred  = $q.defer(),
					groups    = angular.fromJson(Storage.get('groups')),
					settings  = Storage.local.settings().app.widgets.groups,
					calls     = [];

			if (settings.length === 0) console.warn('no settings');

      angular.forEach(groups, function(group)
			{
        if (settings[group.uuid] && settings[group.uuid].status)
        {
          if ($rootScope.config.timeline.config.divisions.length == 0)
          {
            calls.push(Slots.pie({
              id:         group.uuid,
              name:       group.name,
              division:   'both'
            }));
          }
          else
          {
            if (settings[group.uuid].divisions)
            {
              angular.forEach($rootScope.config.timeline.config.divisions, function (division)
              {
                if (division.id !== 'all')
                {
                  calls.push(Slots.pie({
                    id:         group.uuid,
                    name:       group.name,
                    division:   division.id
                  }));
                }
              });
            }
            else
            {
              calls.push(Slots.pie({
                id:         group.uuid,
                name:       group.name,
                division:   'both'
              }));
            }
          }
        }
			});

			$q.all(calls)
			.then(function (results)
			{
				$rootScope.statusBar.off();

				deferred.resolve(results);
			});

			return deferred.promise;
		};


    Dashboard.prototype.getCapcodes = function ()
    {
      var deferred = $q.defer();

      function concatCode (code)
      {
        var _code = '';

        angular.forEach(code, function (_c) { _code += _c; });

        return Number(_code);
      }

      Backend.capcodes(null,
        function (results)
        {
          var codes = [];

          angular.forEach(results, function (res)
          {
            codes.push(concatCode(res));
          });

          deferred.resolve(codes);
        },
        function (error)
        {
          deferred.resolve({error: error});
        }
      );

      return deferred.promise;
    };


		/**
     * TODO: Still being used since harcoded in controller itself?
		 * Get p2000 announcements
		 */
		Dashboard.prototype.p2000 = function ()
		{
			var deferred = $q.defer();

			$rootScope.statusBar.display($rootScope.ui.dashboard.gettingAlarms);

      if ($rootScope.config.profile.smartAlarm)
      {
        $.ajax({
          url: $rootScope.config.profile.p2000.url,
          dataType: 'json',
          success: function (results)
          {
            $rootScope.statusBar.off();

            var processed = Announcer.process(results, true);

            deferred.resolve(
              {
                alarms: 	processed,
                synced:   new Date().getTime()
              });
          },
          error: function ()
          {
            deferred.resolve({error: error});
          }
        });

      }
      else
      {


        Dashboard.prototype.getCapcodes().
          then(function (capcodes)
          {
            $.ajax({
              url: $config.profile.p2000.url + '?code=' + capcodes,
              dataType: 'jsonp',
              success: function (results)
              {
                $rootScope.statusBar.off();

                var processed = Announcer.process(results);

                deferred.resolve(
                  {
                    alarms: 	processed,
                    synced:   new Date().getTime()
                  });
              },
              error: function ()
              {
                deferred.resolve({error: error});
              }
            });
          });


      }

			return deferred.promise;
		};


		return new Dashboard();
	}
]);
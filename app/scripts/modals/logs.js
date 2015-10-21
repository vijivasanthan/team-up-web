define(['services/services', 'config'],
  function (services, config)
  {

    'use strict';

    services.factory(
      'Logs',
      [
        '$resource',
        '$q',
        '$filter',
        '$injector',
        'moment',
        'Settings',
        function ($resource, $q, $filter, $injector, moment, Settings)
        {
          // /ddr?adapterId= &fromAddress= &typeId= &status= &startTime= &endTime= &offset= &limit= &shouldGenerateCosts= &shouldIncludeServiceCosts=
          var Logs = function() {};

          Logs.prototype.get = function ()
          {
            return $resource(
              Settings.getBackEnd() + 'ddr',
              {},
              {
                get: {
                  method: 'GET',
                  params: {},
                  isArray: true
                }
              }
            )
          };

          var normalize = function (logs)
          {
            var refined = [];

            var strip = function (number)
            {
              return (/@/.test(number)) ? number.split('@')[0] : number;
            };

            var howLong = function (period)
            {
              if (period && period != 0)
              {
                var duration = moment.duration(period);

                var doubler = function (num)
                {
                  return (String(num).length == 1) ? '0' + String(num) : num;
                };

                return {
                  presentation: ((duration.hours() == 0) ? '00' : doubler(duration.hours())) + ':' +
                  ((duration.minutes() == 0) ? '00' : doubler(duration.minutes())) + ':' +
                  doubler(duration.seconds()),
                  stamp: period
                }
              }
              else
              {
                return {
                  presentation: '00:00:00',
                  stamp: 0
                }
              }
            };

            var trackingID = null;

            angular.forEach(
              logs,
              function (log)
              {
                var additionalInfo = angular.fromJson(log.additionalInfo);

                var trackingToken = additionalInfo ?
                  ((additionalInfo.hasOwnProperty('trackingToken')) ?
                    additionalInfo.trackingToken :
                    log.start) :
                  log.start;

                var tracked = (trackingToken == trackingID) ?
                  (additionalInfo ?
                    ((additionalInfo.hasOwnProperty('trackingToken')) ? true : false) :
                    false) : false;

                trackingID = trackingToken;

                var record = {
                  adapterId: log.adapterId,
                  trackingToken: trackingToken,
                  tracked: tracked,
                  from: strip(log.fromAddress),
                  started: {
                    date: $filter('date')(log.start, 'medium'),
                    stamp: log.start
                  }
                };

                angular.forEach(
                  log.statusPerAddress,
                  function (status)
                  {
                    record.status = status
                  }
                );

                angular.forEach(
                  angular.fromJson(log.toAddressString),
                  function (message, number)
                  {
                    record.to = strip(number)
                  }
                );

                record.duration = howLong(log.duration);

                refined.push(record);
              }
            );

            var groups = _.groupBy(refined, 'trackingToken');

            _.each(
              refined,
              function (log)
              {
                if (typeof log.trackingToken != 'number')
                {
                  log.records = [];

                  _.each(
                    groups[log.trackingToken],
                    function (token)
                    {
                      log.records.push(
                        {
                          from: token.from,
                          started: {
                            date: token.started.date,
                            stamp: token.started.stamp
                          },
                          status: token.status,
                          to: token.to,
                          duration: {
                            presentation: token.duration.presentation,
                            stamp: token.duration.stamp
                          }
                        }
                      );
                    }
                  );
                }
              }
            );

            _.each(
              refined,
              function (log)
              {
                log.records && log.records.reverse();

                if (log.records)
                {
                  log.from = log.records[0].from;
                  log.started.date = log.records[0].started.date;
                  log.started.stamp = log.records[0].started.stamp;
                  log.status = log.records[0].status;
                  log.to = log.records[0].to;
                  log.duration.presentation = log.records[0].duration.presentation;
                  log.duration.stamp = log.records[0].duration.stamp;

                  log.records.shift();
                }
              }
            );

            var indexed = _.indexBy(refined, 'trackingToken');

            var uniques = [];

            _.each(
              indexed,
              function (token)
              {
                uniques.push(token)
              }
            );

            $filter('orderBy')(uniques, 'started.stamp');

            return uniques;
          };

          Logs.prototype.fetch = function (options)
          {
            var deferred = $q.defer(),
                _options = {
                  startTime: options.startTime || new Date.today().addDays(-7).getTime(),
                  endTime: options.endTime || new Date.now().getTime(),
                  adapterId: (options.adapterId != 'all')
                    ? options.adapterId
                    : null
                };
            var resource = Logs.prototype.get();
            resource.get(
              _options,
              function (result)
              {
                var returned = {
                  logs: normalize(result),
                  synced: moment.valueOf(),
                  periods: {
                    startTime: _options.startTime,
                    endTime:  _options.endTime
                  }
                };
                deferred.resolve(returned);
              },
              function (error)
              {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };

          /**
           * TODO Depricated
           * Get logs per team or all, depends on the role of the user
           * @returns {*}
           */
          Logs.prototype.fetchAllTeams = function ()
          {
            var TeamUp = $injector.get('TeamUp'),
                Store = $injector.get('Store'),
                $rootScope = $injector.get('$rootScope'),
                CurrentSelection = $injector.get('CurrentSelection'),
                deferred = $q.defer(),
                teams = Store('app').get('teams'),
                adapterCalls = [];

            //TODO give every team agent a adapterId
            _.each(teams, function(team)
            {
              var call = $q.defer();
              adapterCalls.push(call.promise);

              TeamUp._('teamPhone',
                {second: team.uuid})
                .then(
                function(result)
                {
                  call.resolve({
                    name: team.name,
                    teamId: team.uuid,
                    adapterId: result.adapter
                  });
                }
              );
            });

            $q.all(adapterCalls)
              .then(
              function(teams)
              {
                var options = {
                  endTime: new Date.now().getTime(),
                  startTime: new Date.today().addDays(- 6).getTime(),
                  adapterId: 'all'
                };

                var teamPhoneData = _.findWhere(teams, {teamId: CurrentSelection.getTeamId()});

                /*
                  Check if the team of the user has a adapterId, if not give a _.uniqueId()
                */
                options.adapterId  = teamPhoneData.adapterId || _.uniqueId();

                /*
                  In case of a _.uniqueId() there are no logs found, if the adapterId seems null
                  all the logs will be show from the given range
                */
                Logs.prototype.fetch(options)
                  .then(
                  function(logs)
                  {
                    deferred.resolve({
                      logData: logs,
                      teams: teams
                    });
                  }
                );
              }
            );

            return deferred.promise;
          };

          return new Logs;
        }
      ]
    );
  }
);


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
        function ($resource, $q, $filter)
        {
          console.log('logModal loaded');
          // /ddr?adapterId= &fromAddress= &typeId= &status= &startTime= &endTime= &offset= &limit= &shouldGenerateCosts= &shouldIncludeServiceCosts=
          var Logs = $resource(
            config.app.host + '/ddr',
            {},
            {
              get: {
                method: 'GET',
                params: {},
                isArray: true
              }
            }
          );

          //console.log(config.app.host);

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

          Logs.prototype.fetch = function (periods)
          {
            var deferred = $q.defer();

            if (!periods)
            {
              periods = {
                end: new Date.now().getTime(),
                start: new Date.today().addDays(-7).getTime()
              }
            }

            Logs.get(
              {
                startTime: periods.start,
                endTime: periods.end
              },
              function (result)
              {
                var returned = {
                  logs: normalize(result),
                  synced: Date.now().getTime(),
                  periods: periods
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

          return new Logs;
        }
      ]
    );
  }
);


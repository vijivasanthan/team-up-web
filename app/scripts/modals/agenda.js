define(['services/services'], function (services)
{
  'use strict';

  services.factory(
    'Planboard',
    [
      '$rootScope',
      '$resource',
      '$q',
      '$filter',
      '$config',
      'Log',
      'TeamUp',
      'Store',
      function ($rootScope, $resource, $q, $filter, $config, Log, TeamUp, Store)
      {
        var Planboard = $resource();

        var duration = (function ()
        {
          var now = new Date(),
            span = $rootScope.app.config.planboard.duration;

          return {
            start: Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0) / 1000),
            middle: Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate() + span / 2, 0, 0, 0) / 1000),
            end: Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate() + span, 0, 0, 0) / 1000)
          }
        })();

        var normalize = function (periods)
        {
          var stamped = function (period)
          {
            var stamp;

            _.each(['start', 'end'], function (part)
            {
              if (!_.isUndefined(period[part]))
              {
                stamp = Math.floor(period[part] * 1000);

                period[part] = {
                  _stamp: period[part],
                  stamp: stamp,
                  short: $filter('date')(stamp, 'short'),
                  fullDate: $filter('date')(stamp, 'fullDate')
                };
              }
            });

            if (period.hasOwnProperty('wish') && period.hasOwnProperty('diff'))
            {
              var current = period.wish + period.diff,
                state = (function ()
                {
                  var label;

                  if (current < period.wish)
                  {
                    label = 'Less'
                  }
                  else if (current > period.wish)
                  {
                    label = 'More';
                  }
                  else
                  {
                    label = 'Even';
                  }

                  return label;
                })();

              _.assign(period, {current: current, state: state});
            }
          };

          if (_.isArray(periods))
          {
            _.each(periods, function (period)
            {
              stamped(period);
            });
          }
          else
          {
            _.each(periods, function (_periods)
            {
              _.each(_periods, function (period)
              {
                stamped(period);
              });
            });
          }

          return periods;
        };

        Planboard.prototype.availability = function (userID)
        {
          var deferred = $q.defer(),
            params = {
              second: userID,
              start: duration.start,
              end: duration.end
            };

          try
          {
            StandBy._('availability', params).then(function (result)
            {
              normalize(result);

              Store('planboard').save('availability.' + userID, result);

              deferred.resolve(result);
            });
          } catch (e)
          {
            Log.error('Something went wrong with getting the availability call for:', userID, e);
          }

          return deferred.promise;
        };

        Planboard.prototype.availabilities = function ()
        {
          var deferred = $q.defer(),
            queue = [],
            availabilities = {},
            unique = Store('network').get('unique');

          $rootScope.missioned(unique.length);

          try
          {
            _.each(unique, function (member)
            {
              queue.push(
                StandBy._('availability', {
                  second: member.uuid,
                  start: duration.start,
                  end: duration.end
                }).then(function (results)
                {
                  $rootScope.ticked();

                  normalize(results);

                  Store('planboard').save('member.' + member.uuid, results);

                  availabilities[member.uuid] = results;
                }));
            });

            $q.all(queue).then(function ()
            {
              Store('planboard').save('availabilities', availabilities);

              deferred.resolve(availabilities);
            }.bind(availabilities));
          } catch (e)
          {
            Log.error('Something went wrong with getting member availabilities call:', e);
          }

          return deferred.promise;
        };

        Planboard.prototype.current = function (memberID)
        {
          var planning = Store('planboard').get('member.' + memberID);

          var current;

          if (_.isUndefined(planning[0]))
          {
            current = {text: 'Empty planning.'}
          }
          else
          {
            var now = Date.now();

            current = _.assign(planning[0], {current: ((planning[0].start.stamp <= now && planning[0].end.stamp >= now))});
          }

          return current;
        };

        Planboard.prototype.split = function (availabilities)
        {
          var summary = {
            today: _.filter(availabilities, function (availability)
            {
              return (availability.end.stamp < duration.middle);
            }),
            tomorrow: []
          };

          // console.log(' ->', availabilities, duration, summary);
        };

        Planboard.prototype.cluster = function (groupID)
        {
          var deferred = $q.defer();

          try
          {
            StandBy._(
              'cluster',
              {
                second: groupID,
                start: duration.start,
                end: duration.end
              }
            ).then(
              function (result)
              {
                normalize(result);

                Store('planboard').save('cluster.' + groupID, result);

                deferred.resolve(result);
              }
            );
          } catch (e)
          {
            Log.error('Something went wrong with getting clusters call for group:', groupID, e);
          }

          return deferred.promise;
        };

        Planboard.prototype.clusters = function ()
        {
          var deferred = $q.defer(),
            calls = [],
            clusters = {},
            groups = Store('network').get('groups');

          $rootScope.missioned(groups.length);

          try
          {
            _.each(groups, function (group)
            {
              calls.push(
                StandBy._('cluster', {
                  second: group.uuid,
                  start: duration.start,
                  end: duration.end
                }).then(function (results)
                {
                  $rootScope.ticked();

                  normalize(results);

                  Store('planboard').save('cluster.' + group.uuid, results);

                  clusters[group.uuid] = results;
                }));
            });

            $q.all(calls).then(function ()
            {
              Store('planboard').save('clusters', clusters);

              deferred.resolve(clusters);
            }.bind(clusters));
          } catch (e)
          {
            Log.error('Something went wrong with getting group clusters call:', e);
          }

          return deferred.promise;
        };

        return new Planboard();
      }
    ]
  );
});

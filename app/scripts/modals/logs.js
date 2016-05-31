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
          //typeId 5390d362e4b02c61014547e3 = purchase phonenumber
          var Logs = function() {};

          Logs.prototype.get = function ()
          {
            return $resource(
              Settings.getBackEnd() + 'ddr',
              {},
              {
                get: {
                  method: 'GET',
                  params: {
                    typeId: '5390d362e4b02c61014547e4,5390d362e4b02c61014547e5'
                  },
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
                  id: log._id,
                  adapterId: log.adapterId,
                  trackingToken: trackingToken,
                  tracked: tracked,
                  from: strip(log.fromAddress),
                  caller: 'client',
                  started: {
                    date: $filter('date')(log.start, 'medium'),
                    stamp: log.start
                  },
                  groupId: log.parentId || log._id,
                  parent: (!log.parentId),
                  childs: []
                };

                //if(record.id === "56f29acae4b019382c6df4e8" || record.groupId === "56f29acae4b019382c6df4e8")
                //{
                //  console.error("log ->", log);
                //  console.error("record ->", record);
                //}

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

            var indexed = _.keyBy(refined, 'trackingToken');

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

        /**
           * Group parent-child calls
           * @param logs A array with log objects
           * @returns {*} logs A array with log objects,
           * some of them could have some child objects
           */
          function groupByCall(logs)
          {
            var data = {
              logs: null,
              hasGroupedLogs: false
            };

            //group all calls by groupId
            var groupCalls = _.groupBy(
              angular.copy(logs),
              'groupId'
            );

            data.hasGroupedLogs = logs.length;

            //filter out all the parentcalls
            logs = _.filter(logs, function (log) {
              return (log.parent);
            });
            data.hasGroupedLogs = (data.hasGroupedLogs != logs.length);

            _.each(logs, function (log)
            {
              // check grouped calls by groupId
              // They need a length over 1,
              // because the first one is the parent
              if(groupCalls[log.groupId].length > 1)
              {
                //save the childscalls in the parentobject
                log.childs = groupCalls[log.groupId];
                //filter the childs by time ascending
                log.childs = $filter('orderBy')(log.childs, 'started.stamp');
                //total index length of the childcalls
                var logIndexLength = log.childs.length - 1;
                //The final status of the callsequence
                log.status = log.childs[logIndexLength].status;
                //The final number of the callsequence
                log.to = log.childs[logIndexLength].to;

                //get all the duration timestamps of the child calls
                //var totalDuration = _.map(log.childs, function (child) {
                //  return child.duration.stamp;
                //});
                ////count the total duration of the childcalls
                //totalDuration = _.reduce(totalDuration, function (previousValue, currentValue) {
                //  return previousValue + currentValue;
                //});

                //The duration of the call is the total length of how long the caller has been calling to teamtelefoon.
                //The first child log is always the one to the teamtelefoon
                log.duration = howLong(log.childs[0].duration.stamp);//set the parsed to timestring duration
              }
            });

            data.logs = logs;
            return data;
          }

          function howLong(period)
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
          }

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
            var teamMembersNames = null;

            if(options.adapterId && options.members)
            {
              options.members.push(options.currentTeam);
              var teamMembersNames = _.keyBy(options.members, 'phone');
            }

            resource.get(
              _options,
              function (result)
              {
                result = normalize(result);
                if(options.adapterId)
                {
                  _.each(result, function (log)
                  {
                    if(teamMembersNames[log.from])
                    {
                      log.from = teamMembersNames[log.from]['fullName'];
                      log.caller = 'member';
                    }
                    if(teamMembersNames[log.to]) log.to = teamMembersNames[log.to]['fullName'];
                  })
                }
                var logData = groupByCall(result);

                var returned = {
                  logs: logData.logs,
                  synced: moment.valueOf(),
                  hasGroupedLogs: logData.hasGroupedLogs,
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

                var teamPhoneData = _.find(teams, {teamId: CurrentSelection.getTeamId()});

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


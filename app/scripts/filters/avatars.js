define(
  ['filters/filters', 'config'],
  function (filters, config)
  {
    'use strict';

    // TODO: Depreciated!
    filters.filter(
      'escape',
      [
        function ()
        {
          return function (string)
          {
            return (! string || string.indexOf('.') == - 1) ?
                   string :
                   string.replace('.', '').replace('@', '');
          }
        }
      ]
    );

    filters.filter(
      'translateReachabilityState',
      [
        '$rootScope',
        function ($rootScope)
        {
          return function (currentState)
          {
            switch (currentState)
            {
              case "REACHABLE":
                return $rootScope.ui.teamup.stateValue.reachable;
                break;
              case "POSSIBLY_REACHABLE":
                return $rootScope.ui.teamup.stateValue.possibly_reachable;
                break;
              case "UNREACHABLE":
                return $rootScope.ui.teamup.stateValue.unreachable;
                break;
            }
          }
        }
      ]
    );

    filters.filter(
      'stateReachable',
      [
        function ()
        {
          return function (states)
          {
            var stateValues = _.pluck(states, 'value');

            return (stateValues.indexOf('REACHABLE') >= 0)
          }
        }
      ]
    );

    // Determine the color of circle based on the state
    filters.filter(
      'stateColor',
      [
        function ()
        {
          return function (states)
          {
            var result = config.app.stateColors.none;

            var stateValues = _.pluck(states, 'value');

            if(stateValues.indexOf('available') >= 0)
            {
              result = config.app.stateColors.availalbe;
              if(stateValues.indexOf('on_the_phone') >= 0)
              {
                result = config.app.stateColors.busy;
              }
            }
            else if (stateValues.indexOf('unavailable') >= 0
              || stateValues.indexOf('working') >= 0)
            {
              result = config.app.stateColors.busy;
            }
            else if(stateValues.indexOf('offline') >= 0 || stateValues.indexOf('unknown') >= 0)
            {
              result = config.app.stateColors.offline;
            }

            return result;
          }
        }
      ]
    );

    filters.filter(
      'membersWithoutTeam',
      [
        function ()
        {
          return function(allMembers)
          {
            var membersWithoutTeams = null;

            if(allMembers)
            {
              membersWithoutTeams = _.filter(allMembers, function(member) {
                return (! member.teamUuids.length) ? member : '';
              });
            }

            return membersWithoutTeams;
          };
        }
      ]
    );

    filters.filter(
      'membersInTeam',
      [
        function ()
        {
          return function(allMembers)
          {
            if(allMembers)
            {
              return _.filter(allMembers, function(member)
              {
                //console.log('member', member);

                return (member.teamUuids.length) ? member : '';
              });
            }
          };
        }
      ]
    );

    // Convert date
    filters.filter(
      'nicelyDate',
      [
        function ()
        {
          return function (date)
          {
            if (typeof date == 'string')
            {
              date = Number(date);
            }

            if (String(date).length == 10)
            {
              date *= 1000
            }

            return new Date(date).toString(config.app.formats.date);
          };
        }
      ]
    );

    // Convert time
    filters.filter(
      'nicelyTime',
      [
        function ()
        {
          return function (date)
          {
            if (typeof date == 'string') date = Number(date);

            return new Date(date).toString(config.app.formats.time);
          };
        }
      ]
    );

    // Translate role
    filters.filter(
      'translateRole',
      [
        function ()
        {
          return function (role)
          {
            var userRole;

            angular.forEach(
              config.app.roles,
              function (_role)
              {
                if (_role.id == role)
                {
                  userRole = _role.label;
                }
              }
            );

            return userRole;
          }
        }
      ]
    );

    /**
     * Translate the status of the logs
     */
    filters.filter(
      'translateStatusLogs',
      [
        '$rootScope',
        function ($rootScope)
        {
          return function (status)
          {
            var translatedStatus = null;

            switch(status)
            {
              case 'SENT':
                translatedStatus = $rootScope.ui.logs.status.sent;
                break;
              case 'RECEIVED':
                translatedStatus = $rootScope.ui.logs.status.received;
                break;
              case 'FINISHED':
                translatedStatus = $rootScope.ui.logs.status.finished;
                break;
              case 'DELIVERED':
                translatedStatus = $rootScope.ui.logs.status.delivered;
                break;
              case 'MISSED':
                translatedStatus = $rootScope.ui.logs.status.missed;
                break;
              case 'ERROR':
                translatedStatus = $rootScope.ui.logs.status.error;
                break;
              default:
                console.log("the status of the log isn't found-> ", status);
            }

            return translatedStatus.toUpperCase();
          }
        }
      ]
    );

    // Translate user (working) function
    filters.filter(
      'translateFunc',
      [
        function ()
        {
          return function (func)
          {
            var userFunction;

            angular.forEach(
              config.app.mfunctions,
              function (_func)
              {
                if (_func.id == func) userFunction = _func.label;
              });

            return userFunction;
          }
        }
      ]
    );

    // Show the correct icon based on the state's name
    filters.filter(
      'stateDataIcon',
      [
        function ()
        {
          return function (name, type)
          {
            var result;

            angular.forEach(
              config.app.stateIcons,
              function (stateIcon)
              {
                if (angular.lowercase(stateIcon.name) == angular.lowercase(name))
                {
                  if (type == 'data_icon')
                  {
                    result = stateIcon.data_icon;
                  }
                  else if (type == 'class_name')
                  {
                    result = stateIcon.class_name;
                  }
                }
              });

            return result;
          }
        }
      ]
    );

    // Format state value
    filters.filter(
      'stateValue',
      [
        function ()
        {
          return function (state, type)
          {
            if (angular.lowercase(state.name) == 'location')
            {
              var value = state.value,
                  match = value.match(/\((.*?)\)/);

              if (match == null)
              {
                return value;
              }
              else
              {
                return (type == 'data') ?
                       match[1] :
                       value.replace(match[0], '');
              }
            }
            else
            {
              return state.value;
            }
          }
        }
      ]
    );

    // Agenda periods
    filters.filter(
      'rangeMainFilter',
      [
        'Dater', 'moment',
        function (Dater, moment) {

          return function (dates) {
            if ((new Date(dates.end).getTime() - new Date(dates.start).getTime()) == 86401000) {
              dates.start = moment(dates.end).subtract(1, 'days').toDate();
            }

            var cFirst = function (str) {
              return str.charAt(0).toUpperCase() + str.substr(1);
            };

            var ndates = {
              start: {
                real: cFirst(Dater.translateToDutch(moment(new Date(dates.start)).format('dddd D MMMM'))),
                month: cFirst(Dater.translateToDutch(moment(new Date(dates.start)).format('MMMM'))),
                day: cFirst(Dater.translateToDutch(moment(new Date(dates.start)).format('D'))),
                year: moment(new Date(dates.start)).format('YYYY')
              },
              end: {
                real: cFirst(Dater.translateToDutch(moment(new Date(dates.end)).format('dddd D MMMM'))),
                month: cFirst(Dater.translateToDutch(moment(new Date(dates.end)).format('MMMM'))),
                day: cFirst(Dater.translateToDutch(moment(new Date(dates.end)).format('D'))),
                year: moment(new Date(dates.end)).format('YYYY')
              }
            };

            var _dates = {
                start: {
                  real: moment(new Date(dates.start)).format('dddd D MMMM'),
                  month: moment(new Date(dates.start)).format('MMMM'),
                  day: moment(new Date(dates.start)).format('D')
                },
                end: {
                  real: moment(new Date(dates.end)).format('dddd D MMMM'),
                  month: moment(new Date(dates.end)).format('MMMM'),
                  day: moment(new Date(dates.end)).format('D')
                }
              },
              monthNumber = moment(new Date(dates.start)).month();

            if ((((Math.round(_dates.start.day) + 1) == _dates.end.day && _dates.start.hour == _dates.end.hour) || _dates.start.day == _dates.end.day) &&
              _dates.start.month == _dates.end.month) {
              return  ndates.start.real +
                ', ' +
                ndates.start.year;
            }
            else if (_dates.start.day == 1 && _dates.end.day == moment().month(monthNumber).endOf('month').date()) {
              return  ndates.start.month +
                ', ' +
                ndates.start.year;
            }
            else {
              return  ndates.start.real +
                ', ' +
                ndates.start.year +
                ' / ' +
                ndates.end.real +
                ', ' +
                ndates.end.year;
            }

          }
        }
      ]
    );

    // Agenda periods
    filters.filter(
      'rangeMainWeekFilter',
      [
        'Dater',
        function (Dater)
        {
          return function (dates)
          {
            if (dates)
            {
              var _dates = {
                start: new Date(dates.start).toString('dddd, MMMM d'),
                end: new Date(dates.end).toString('dddd, MMMM d')
              };

              return  _dates.start +
                      ' / ' +
                      _dates.end +
                      ', ' +
                      Dater.getThisYear();
            }
          }
        }
      ]);

    // Agenda periods
    filters.filter(
      'rangeInfoFilter',
      [
        'Dater', '$rootScope',
        function (Dater, $rootScope)
        {
          var periods = Dater.getPeriods();

          return function (timeline)
          {
            var diff = new Date(timeline.range.end).getTime() - new Date(timeline.range.start).getTime();

            if (diff > (2419200000 + 259200000))
            {
              return 'Total selected days: ' + Math.round(diff / 86400000);
            }
            else
            {
              if (timeline.scope.day)
              {
                var hours = {
                  start: new Date(timeline.range.start).toString('HH:mm'),
                  end: new Date(timeline.range.end).toString('HH:mm')
                };

                /**
                 *  00:00 fix => 24:00
                 */
                if (hours.end == '00:00') hours.end = '24:00';

                return  $rootScope.ui.planboard.time +
                        hours.start +
                        ' / ' +
                        hours.end;
              }
              else if (timeline.scope.week)
              {
                return  $rootScope.ui.planboard.weekNumber +
                        timeline.current.week;
              }
              else if (timeline.scope.month)
              {
                return  $rootScope.ui.planboard.monthNumber +
                        timeline.current.month +
                        ',' + $rootScope.ui.planboard.totalDays +
                        periods.months[timeline.current.month].totalDays;
              }
            }
          };
        }
      ]
    );

    // Agenda periods
    filters.filter(
      'rangeInfoWeekFilter',
      [
        function ()
        {
          return function (timeline)
          {
            if (timeline)
            {
              return 'Week number: ' + timeline.current.week;
            }
          };
        }
      ]
    );

    // Internalisation
    filters.filter(
      'i18n_spec',
      [
        '$rootScope',
        function ($rootScope)
        {
          return function (string, type)
          {


            var types = type.split('.');
            var ret;
            if (types[1] == 'stateValue')
            {
              var statesTrans = $rootScope.ui[types[0]][types[1]];
              angular.forEach(
                statesTrans, function (v, k)
                {
                  if (k == string)
                  {
                    ret = v;
                  }
                });
              return ret;
            }
            ret = ($rootScope.ui[types[0]][types[1]]).replace('$v', string);
            if (typeof ret == 'undefined')
            {
              ret = string;
            }

            return ret;
          }
        }
      ]
    );

    // TODO: Cehck whether it is used or combine witht he other one?
    filters.filter(
      'stateIcon',
      [
        function ()
        {
          return function (state)
          {
            switch (state)
            {
              case 'emotion':
                return 'icon-face';
                break;

              case 'availability':
                console.log('123', 123);
                return 'icon-avail';
                break;

              case 'location':
                return 'icon-location';
                break;

              case 'activity':
                return 'icon-activity';
                break;

              case 'reachability':
                return 'icon-reach';
                break;

              default:
                return 'icon-info-sign';
            }
          }
        }
      ]
    );

    // Avatars
    filters.filter(
      'avatar',
      [
        'Session', 'Store', 'Settings',
        function (Session, Store, Settings)
        {
          return function (id, type, size)
          {
            var session = Session.get();

            if (session && id)
            {
              var path;

              switch (type)
              {
                case 'team':
                  path = 'team/member/';
                  break;

                case 'client':
                  path = 'client/';
                  break;

                case 'avatar':
                  path = 'images/';
                  break;

                case 'image':
                  path = 'images/';
                  break;
              }

              var avatarChanged = function (id)
              {
                var changedTimes = 0;

                angular.forEach(
                  Store('app').get('avatarChangeRecord'),
                  function (avatarId)
                  {
                    if (avatarId == id)
                    {
                      changedTimes ++;
                    }
                  }
                );

                return parseInt(changedTimes, 10);
              };

              // TODO: Better use a special parameter to specify the avatar is changed.
              var newsize = parseInt(size, 10) + parseInt(avatarChanged(id), 10);

              if (type == 'avatar' || type == 'image')
              {
                var _url = Settings.getBackEnd() +
                           path +
                           id +
                           '?sid=' + session;

//                if (type == 'avatar')
//                {
//                  _url += '&width=' + newsize + '&height=' + newsize;
//                }

                return _url;
              }
              else
              {
                return Settings.getBackEnd() +
                       config.app.namespace +
                       path +
                       id +
                       '/photo?width=' + newsize + '&height=' + newsize + '&sid=' +
                       session;
              }
            }
          }
        }
      ]
    );

    // Get more information about client / member
    filters.filter(
      'getObjAttr',
      [
        '$rootScope',
        function ($rootScope)
        {
          return function (id, usertype, itemName)
          {
            if (usertype == 'client')
            {
              var client = $rootScope.getClientByID(id);

              if (client == null || typeof client == 'undefined')
              {
                return '';
              }

              if (itemName == 'name')
              {
                return client.firstName +
                       ' ' +
                       client.lastName;
              }
              else if (itemName == 'address')
              {
                return client.address.street +
                       ' ' +
                       client.address.no +
                       ', ' +
                       client.address.zip +
                       ' ' +
                       client.address.city;
              }
              else if (itemName == 'latlong')
              {
                if (typeof client.address.latitude == 'undefined' ||
                    typeof client.address.longitude == 'undefined' ||
                    (client.address.longitude == 0 && client.address.latitude == 0)
                  )
                {
                  return client.address.street +
                         ' ' +
                         client.address.no +
                         ', ' +
                         client.address.zip +
                         ' ,' +
                         client.address.city;
                }
                else
                {
                  return client.address.latitude +
                         ',' +
                         client.address.longitude;
                }
              }
            }
            else if (usertype == 'member')
            {
              if (id == null)
              {
                return '';
              }

              var member = $rootScope.getTeamMemberById(id);

              if (itemName == 'name')
              {
                return member.firstName +
                       ' ' +
                       member.lastName;
              }
              else if (itemName == 'states')
              {
                return member.states;
              }
            }
            else if (usertype == 'clientGroup')
            {
              if (id == null)
              {
                return '';
              }

              if (itemName == 'name')
              {
                return $rootScope.getClientGroupName(id);
              }
            }
            else
            {
              return 'no name';
            }

          }
        }
      ]
    );

    // Get a target out of a collection based on the id
    filters.filter(
      'getByUuid',
      function ()
      {
        return function (input, uuid)
        {
          var i = 0;

          var len = input.length;

          for (; i < len; i ++)
          {
            if (input[i].uuid == uuid)
            {
              return input[i];
            }
          }

          return null;
        }
      }
    );

    // Date reversing
    filters.filter(
      'dateReverse',
      [
        '$filter',
        function ($filter)
        {
          return function (date, pattern)
          {
            var timestamp = new Date(date).getTime();

            return $filter('date')(timestamp, pattern);
          }
        }
      ]
    );


    // Date reversing
    filters.filter(
      'formatTaskState',
      [
        function ()
        {
          return function (state)
          {
            if (state)
            {
              return config.app.taskStates[state];
            }
          }
        }
      ]
    );


    filters.filter(
      'interpolate',
      [
        function ()
        {
          return function (text)
          {
            text = String(text).replace(/\%RELEASED\%/mg, config.app.released);

            return String(text).replace(/\%VERSION\%/mg, config.app.version);
          }
        }
      ]
    );

    /**
     * Strip html tags
     */
    filters.filter(
      'stripHtml',
      [

        function ()
        {
          return function (string)
          {
            if (string)
            {
              return string.split('>')[1].split('<')[0];
            }
          }
        }
      ]
    );

    /**
     * Convert user uuid to name
     */
    filters.filter(
      'convertUserIdToName',
      [
        'Store',
        function (Store)
        {
          var members = Store('network').get('unique');

          return function (id)
          {
            if (members == null || typeof members[id] == "undefined")
            {
              return id;
            }
            else
            {
              return members[id].resources.firstName + ' ' + members[id].resources.lastName;
            }
          };
        }
      ]
    );


  }
);

define(
  ['filters/filters', 'config'],
  function (filters, config) {
    'use strict';

    filters.filter(
      'convertToDateObj',
      [
        function () {
          return function (date) {
            return Date(date);
          }
        }
      ])


    /**
     * Translate roles
     */
      .filter(
      'translateRole',
      [
        function () {
          return function (role) {
            var urole;

            angular.forEach(
              config.roles,
              function (prole) {
                if (prole.id == role) {
                  urole = prole.label;
                }
                else if (role == 0) {
                  urole = 'Super admin';
                }
              }
            );

            return urole;
          }
        }
      ])


    /**
     * Translate division ids to names
     */
      .filter(
      'translateDivision',
      [
        function () {
          return function (divid) {
            var filtered;

            angular.forEach(
              config.timeline.config.divisions,
              function (division) {
                if (division.id == divid) {
                  filtered = division.label;
                }
              }
            );

            return filtered;
          }
        }
      ])


    /**
     * Main range filter
     */
      .filter(
      'rangeMainFilter',
      [
        'Dater',
        function (Dater) {
          var periods = Dater.getPeriods();

          return function (dates) {
            if ((new Date(dates.end).getTime() - new Date(dates.start).getTime()) == 86401000) {
              dates.start = new Date(dates.end).addDays(-1);
            }

            var cFirst = function (str) {
              return str.charAt(0).toUpperCase() + str.substr(1);
            };

            var ndates = {
              start: {
                real: cFirst(Dater.translateToDutch(new Date(dates.start).toString('dddd d MMMM'))),
                month: cFirst(Dater.translateToDutch(new Date(dates.start).toString('MMMM'))),
                day: cFirst(Dater.translateToDutch(new Date(dates.start).toString('d'))),
                year: new Date(dates.start).toString('yyyy')
              },
              end: {
                real: cFirst(Dater.translateToDutch(new Date(dates.end).toString('dddd d MMMM'))),
                month: cFirst(Dater.translateToDutch(new Date(dates.end).toString('MMMM'))),
                day: cFirst(Dater.translateToDutch(new Date(dates.end).toString('d'))),
                year: new Date(dates.end).toString('yyyy')
              }
            };

            var dates = {
                start: {
                  real: new Date(dates.start).toString('dddd d MMMM'),
                  month: new Date(dates.start).toString('MMMM'),
                  day: new Date(dates.start).toString('d')
                },
                end: {
                  real: new Date(dates.end).toString('dddd d MMMM'),
                  month: new Date(dates.end).toString('MMMM'),
                  day: new Date(dates.end).toString('d')
                }
              },
              monthNumber = Date.getMonthNumberFromName(dates.start.month);

            if ((((Math.round(dates.start.day) + 1) == dates.end.day && dates.start.hour == dates.end.hour) || dates.start.day == dates.end.day) &&
              dates.start.month == dates.end.month) {
              return  ndates.start.real +
                ', ' +
                ndates.start.year;
            }
            else if (dates.start.day == 1 && dates.end.day == periods.months[monthNumber + 1].totalDays) {
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
      ])


    /**
     * Main range week filter
     */
      .filter(
      'rangeMainWeekFilter',
      [
        'Dater',
        function (Dater) {
          return function (dates) {
            if (dates) {
              var cFirst = function (str) {
                return str.charAt(0).toUpperCase() + str.substr(1);
              };

              var newDates = {
                start: cFirst(Dater.translateToDutch(new Date(dates.start).toString('dddd d MMMM'))),
                end: cFirst(Dater.translateToDutch(new Date(dates.end).toString('dddd d MMMM')))
              };

              return  newDates.start +
                ' / ' +
                newDates.end +
                ', ' +
                Dater.getThisYear();
            }
            else {
              return false;
            }
          }
        }
      ])


    /**
     * Range info filter
     */
      .filter(
      'rangeInfoFilter',
      [
        '$rootScope', 'Dater',
        function ($rootScope, Dater) {
          var periods = Dater.getPeriods();

          return function (timeline) {
            var diff = new Date(timeline.range.end).getTime() - new Date(timeline.range.start).getTime();

            if (diff > (2419200000 + 259200000)) {
              return $rootScope.ui.planboard.rangeInfoTotalSelectedDays + Math.round(diff / 86400000);
            }
            else {
              if (timeline.scope.day) {
                var hours = {
                  start: new Date(timeline.range.start).toString('HH:mm'),
                  end: new Date(timeline.range.end).toString('HH:mm')
                };

                /**
                 *  00:00 fix => 24:00
                 */
                if (hours.end == '00:00') hours.end = '24:00';

                return  $rootScope.ui.planboard.rangeInfoTime +
                  hours.start +
                  ' / ' +
                  hours.end;
              }
              else if (timeline.scope.week) {
                return  $rootScope.ui.planboard.rangeInfoWeekNumber +
                  timeline.current.week;
              }
              else if (timeline.scope.month) {
                return  $rootScope.ui.planboard.rangeInfoMonth +
                  timeline.current.month +
                  $rootScope.ui.planboard.rangeInfoTotalDays +
                  periods.months[timeline.current.month].totalDays;
              }
            }
          };
        }
      ])


    /**
     * Range info week filter
     */
      .filter(
      'rangeInfoWeekFilter',
      [
        '$rootScope',
        function ($rootScope) {
          return function (timeline) {
            if (timeline) {
              return $rootScope.ui.planboard.rangeInfoWeekNumber + timeline.current.week;
            }
          };
        }
      ])


    /**
     * TODO: POSSIBLE BUG? Maybe not replace bar- ?
     * TODO: Implement state conversion from config later on!
     * Convert ratios to readable formats
     */
      .filter(
      'convertRatios',
      [
        '$rootScope',
        function ($rootScope) {
          return function (stats) {
            var ratios = '';

            angular.forEach(
              stats,
              function (stat) {
                var state = stat.state.replace(/^bar-+/, '');

                switch (state) {
                  case 'Available':
                    state = $rootScope.ui.states.available;
                    break;
                  case 'Unavailable':
                    state = $rootScope.ui.states.notAvailable;
                    break;
                  case 'SchipperVanDienst':
                    state = $rootScope.ui.states.captain;
                    break;
                  case 'BeschikbaarNoord':
                    state = $rootScope.ui.states.availableNorth;
                    break;
                  case 'BeschikbaarZuid':
                    state = $rootScope.ui.states.availableSouth;
                    break;
                  case 'Unreached':
                    state = $rootScope.ui.states.notReached;
                    break;
                  case 'NoPlanning':
                    state = $rootScope.ui.states.eligible;
                    break;
                }

                ratios += stat.ratio.toFixed(1) + '% ' + state + ', ';
              }
            );

            return ratios.substring(0, ratios.length - 2);
          };
        }
      ])


    /**
     * Calculate time difference
     */
      .filter(
      'calculateDeltaTime',
      [
        '$rootScope',
        function ($rootScope) {
          return function (stamp) {
            var delta = Math.abs(stamp - Date.now().getTime()) / 1000;

            var days = Math.floor(delta / 86400);
            delta -= days * 86400;

            var hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;

            var minutes = Math.floor(delta / 60) % 60;

            var output = '';

            if (days != 0) {
              output += days;
            }

            if (hours != 0) {
              if (days != 0) {
                output += $rootScope.ui.dashboard.time.days + ' : '
              }

              output += hours;
            }

            if (minutes != 0) {
              if (hours != 0) {
                output += $rootScope.ui.dashboard.time.hours + ' : '
              }

              output += minutes + $rootScope.ui.dashboard.time.minutes
            }

            if (hours == 0 && minutes == 0) {
              output += ' ' + $rootScope.ui.dashboard.time.days
            }

            return output;
          };
        }
      ]
    )

    /**
     * Calculate time in days
     */
      .filter(
      'calculateTimeInDays',
      function () {
        return function (stamp) {
          var day = 1000 * 60 * 60 * 24,
            hour = 1000 * 60 * 60,
            days = 0,
            hours = 0,
            stamp = stamp * 1000,
            hours = stamp % day,
            days = stamp - hours;

          return  Math.floor(days / day);
        };
      }
    )


    /**
     * Calculate time in hours
     */
      .filter(
      'calculateTimeInHours',
      function () {
        return function (stamp) {
          var day = 1000 * 60 * 60 * 24,
            hour = 1000 * 60 * 60,
            days = 0,
            hours = 0,
            stamp = stamp * 1000,
            hours = stamp % day,
            days = stamp - hours;

          return  Math.floor(hours / hour);
        };
      }
    )


    /**
     * Calculate time in minutes
     */
      .filter(
      'calculateTimeInMinutes',
      function () {
        return function (stamp) {
          var day = 1000 * 60 * 60 * 24,
            hour = 1000 * 60 * 60,
            minute = 1000 * 60,
            days = 0,
            hours = 0,
            minutes = 0,
            stamp = stamp * 1000,
            hours = stamp % day,
            days = stamp - hours,
            minutes = stamp % hour;

          return  Math.floor(minutes / minute);
        };
      }
    )


    /**
     * Convert eve urls to ids
     */
      .filter(
      'convertEve',
      [
        function () {
          return function (url) {
            if (/\//.test(url)) {
              if (config.profile.smartAlarm) {
                return url;
              }

              var eve = url;

              eve = (typeof url != "undefined") ? url.split("/") : ["", url, ""];

              return eve[eve.length - 2];
            }
            else {
              return url
            }
          };
        }
      ]
    )


    /**
     * Convert user uuid to name
     */
      .filter(
      'convertUserIdToName',
      [
        'Store',
        function (Store) {
          var members = Store('network').get('unique');

          return function (id) {
            if (members == null || typeof members[id] == "undefined") {
              return id;
            }
            else {
              return members[id].resources.firstName + ' ' + members[id].resources.lastName;
            }
          };
        }
      ])


    /**
     * Convert timeStamps to dates
     */
      .filter(
      'nicelyDate',
      [
        '$rootScope',
        function ($rootScope) {
          return function (date) {
            if (typeof date == 'string') date = Number(date);

            return new Date(date).toString($rootScope.StandBy.config.formats.datetimefull);
          };
        }
      ])


    /**
     * TODO: Not used probably!
     * Combine this either with nicelyDate or terminate!
     * Convert timeStamp to readable date and time
     */
      .filter(
      'convertTimeStamp',
      function () {
        return function (stamp) {
          console.warn(typeof stamp);

          return new Date(stamp).toString('dd-MM-yyyy HH:mm');
        };
      }
    )


    /**
     * TODO: Still used?
     * No title filter
     */
      .filter(
      'noTitle',
      function () {
        return function (title) {
          return (title == "") ? "- No Title -" : title;
        }
      }
    )


    /**
     * TODO: Finish it!
     * Strip span tags
     */
      .filter(
      'stripSpan',
      function () {
        return function (string) {
          return string.match(/<span class="label">(.*)<\/span>/);
        }
      }
    )


    /**
     * Strip html tags
     */
      .filter(
      'stripHtml',
      function () {
        return function (string) {
          if (string) {
            return string.split('>')[1].split('<')[0];
          }
        }
      }
    )


    /**
     * Convert group id to name
     */
      .filter(
      'groupIdToName',
      [
        'Store',
        function (Store) {
          return function (id, comma) {
            var groups = angular.fromJson(Store('network').get('groups')),
              names = '';

            for (var i in groups) {
              if (groups[i].uuid == id) {
                if (comma) {
                  names += ', ';
                }

                names += groups[i].name;
              }
            }

            // if (names[0] == ',' && names[1] == '')
            return names;
          }
        }
      ])


    /**
     * Convert division id to name
     */
      .filter(
      'divisionIdToName',
      [
        '$rootScope',
        function ($rootScope) {
          return function (id) {
            var divisions = $rootScope.StandBy.config.timeline.config.divisions;

            for (var i in divisions) {
              if (divisions[i].id == id) return divisions[i].label;
            }
          }
        }
      ])


    /**
     * TODO: Unknown filter
     */
      .filter(
      'i18n_spec',
      [
        '$rootScope',
        function ($rootScope) {
          return function (string, type) {
            var types = type.split("."),
              ret = $rootScope.ui[types[0]][types[1]],
              ret = ret.replace('$v', string);

            return ret;
          }
        }
      ])


    /**
     * Truncate group titles for dashboard pie widget
     */
      .filter(
      'truncateGroupTitle',
      [
        'Strings',
        function (Strings) {
          return function (title) {
            return Strings.truncate(title, 20, true);
          }
        }
      ])


    /**
     * Make first letter capital
     */
      .filter(
      'toTitleCase',
      [
        'Strings',
        function (Strings) {
          return function (txt) {
            return Strings.toTitleCase(txt);
          }
        }
      ])


    /**
     * Count messages in box
     */
      .filter(
      'countBox',
      function () {
        return function (box) {
          var total = 0;

          angular.forEach(
            box, function (bulk) {
              total = total + bulk.length;
            });

          return total;
        }
      }
    )


    /**
     * Convert offsets array to nicely format in scheduled jobs
     */
      .filter(
      'nicelyOffsets',
      [
        'Dater', 'Offsetter',
        function (Dater, Offsetter) {
          return function (data) {
            var offsets = Offsetter.factory(data),
              compiled = '';

            angular.forEach(
              offsets,
              function (offset) {
                compiled += '<div style="display:block; margin-bottom: 5px;">';

                compiled += '<span class="badge">' + offset.time + '</span>&nbsp;';

                if (offset.mon) compiled += '<span class="text-muted"><small><i> maandag,</i></small></span>';
                if (offset.tue) compiled += '<span class="text-muted"><small><i> dinsdag,</i></small></span>';
                if (offset.wed) compiled += '<span class="text-muted"><small><i> woensdag,</i></small></span>';
                if (offset.thu) compiled += '<span class="text-muted"><small><i> donderdag,</i></small></span>';
                if (offset.fri) compiled += '<span class="text-muted"><small><i> vrijdag,</i></small></span>';
                if (offset.sat) compiled += '<span class="text-muted"><small><i> zaterdag,</i></small></span>';
                if (offset.sun) compiled += '<span class="text-muted"><small><i> zondag,</i></small></span>';

                compiled = compiled.substring(0, compiled.length - 20);

                compiled = compiled += '</i></small></span>';

                compiled += '</div>';

                compiled = compiled.substring(0, compiled.length);
              }
            );

            return compiled;

            // return $sce.trustAsHtml(compiled);
          }
        }
      ])


    /**
     * Convert array of audience to a nice list
     */
      .filter(
      'nicelyAudience',
      [
        'Store',
        function (Store) {
          return function (data) {
            if (data) {
              var members = Store('network').get('unique'),
                groups = Store('network').get('groups'),
                audience = [];

              angular.forEach(
                data, function (recipient) {
                  var name;

                  if (members[recipient]) {
                    name = members[recipient].name;
                  }
                  else {
                    angular.forEach(
                      groups, function (group) {
                        if (group.uuid == recipient) name = group.name;
                      });
                  }

                  audience += name + ', ';
                });

              return audience.substring(0, audience.length - 2);
            }
          }
        }
      ])


    /**
     * Convert array of audience to a nice list
     */
      .filter(
      'convertToObject',
      [
        function () {
          return function (arr) {
            if (arr) {
              var obj = {};

              angular.forEach(
                arr,
                function (item, index) {
                  obj[index] = item
                }.bind(obj)
              );

              return obj;
            }
          }
        }
      ])


    /**
     * Filter non-functional users
     */
      .filter(
      'filterSupers',
      [
        function () {
          return function (users) {
            if (users) {
              var filtered = [];

              angular.forEach(
                users,
                function (user) {
                  if (user.resources &&
                    (user.resources.role != 0 && user.resources.role != 4)
                    ) {
                    filtered.push(user);
                  }
                }
              );

              return filtered;
            }
          }
        }
      ])


      .filter(
      'avatar',
      [
        'Session', 'Store', '$rootScope',
        function (Session, Store, $rootScope) {
          return function (id, type, size, avatarId) {
            var session = Session.get();

            if (session && id) {
              var path;

              switch (type)
              {
                case 'team':
                  path = '/team/member/';
                  break;

                case 'client':
                  path = '/client/';
                  break;

                case 'avatar':
                  path = 'images/';
                  break;

                case 'user':
                  path = '/user/avatar/';
                  break;

                case 'image':
                  path = '/images/';
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
                var _url = config.host +
                           path +
                           id +
                           '?sid=' + session;


                return _url;
              }
              else if (avatarId){
                return config.host +
                       path +
                       id +
                       '/photo?width=' + newsize + '&height=' + newsize + '&sid=' +
                       session + '&id=' + avatarId;
              }
              else
              {
                if($rootScope.StandBy.config.profile.defaultProfilePicture){
                  return $rootScope.StandBy.config.profile.defaultProfilePicture;
                }

                return config.host +
                       path +
                       id +
                       '/photo?width=' + newsize + '&height=' + newsize + '&sid=' +
                       session;
              }
            }
          }
        }
      ]);


  }
);

define(
  ['filters/filters', 'config'],
  function (filters)
  {
    'use strict';

    filters.filter(
      'convertToDateObj',
      [
        function ()
        {
          return function (date)
          {
            return new Date(date);
          }
        }
      ]);


    //filter array on empty values and seperate the values by a comma and create a string of the array
    filters.filter
    (
      'commaSeperated',
      [
        function ()
        {
          return function (arr)
          {
            return _.compact(arr).join(', ');
          }
        }
      ]
    );

    /**
     * TODO what if there are a single or two values
     * Filter false and null values and join it into a string
     * comma seperated, the ending is between all values and the last one
     * example: $filter('commaSeperatedWithEnding')(['hen', 'Henk', 'Henkieee'], 'en'); //hen, Henk en Henkieee
     */
    filters.filter
    (
      'commaSeperatedWithEnding',
        function ()
        {
          return function (arr, ending, cb)
          {
            var _arr = _.compact(arr),
                result = null;

            if(_arr.length == 1)
            {
              result = _arr[0];
            }
            else if(_arr.length == 2)
            {
              var last = _arr.pop();
              result = _arr[0] + ' ' + ending + ' ' + _arr[1];
            }
            else
            {
              var last = _arr.pop();
              result = _arr.join(', ') + ' ' + ending + ' ' + last;
            }
            return (! cb)
              ? result
              : cb(result);
          }
        }
    );

    /**
     * Add teamname by a teamid
     */
    filters.filter
    (
      'getTeamNameById',
      function ($rootScope, Store, $filter)
      {
        return function (teamsUuids, searchTeams)
        {
          var userTeams = [];
          if(! _.isUndefined(teamsUuids) && ! _.isNull(teamsUuids))
          {
            var teams = (searchTeams && searchTeams.length)
                ? searchTeams
                : Store('app').get('teams');

            if(teamsUuids.length)
            {
              userTeams = _.map(teamsUuids, function (teamId)
              {
                var team = _.find(teams, {uuid: teamId});
                return team && team.name || $rootScope.ui.teamup.noTeamNameFound;
              });
            }
          }
          return  userTeams.length && $filter('commaSeperated')(userTeams)
            || $rootScope.ui.teamup.noTeam;
        }
      }
    );

    filters.filter
    (
      'trusted_html',
      [
        '$sce',
        function ($sce)
        {
          return function (text)
          {
            return $sce.trustAsHtml(text);
          };
        }
      ]
    )

    filters.filter
    (
      'trusted_url',
      [
        '$sce',
        function ($sce)
        {
          return function (text)
          {
            return $sce.trustAsResourceUrl(text);
          };
        }
      ]
    )

      // /**
      //  * Translate roles
      //  */
      //   .filter(
      //   'translateRole',
      //   [
      //     function () {
      //       return function (role) {
      //         var urole;

      //         angular.forEach(
      //           config.roles,
      //           function (prole) {
      //             if (prole.id == role) {
      //               urole = prole.label;
      //             }
      //             else if (role == 0) {
      //               urole = 'Super admin';
      //             }
      //           }
      //         );

      //         return urole;
      //       }
      //     }
      //   ])


    /**
     * Translate division ids to names
     */
      .filter(
      'translateDivision',
      [
        function ()
        {
          return function (divid)
          {
            var filtered = null;

            angular.forEach(
              $rootScope.config.app.timeline.config.divisions,
              function (division)
              {
                if (division.id == divid)
                {
                  filtered = division.label;
                }
              }
            );

            return filtered;
          }
        }
      ])

    /**
     * Calculate time difference
     */
      .filter(
      'calculateDeltaTime',
      [
        '$rootScope',
        function ($rootScope)
        {
          return function (stamp, secondStamp)
          {
            var _secondStamp = secondStamp || Date.now().getTime();

            var delta = Math.abs(stamp - _secondStamp) / 1000;

            var days = Math.floor(delta / 86400);
            delta -= days * 86400;

            var hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;

            var minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;

            var seconds = Math.floor(delta % 60);

            var output = '';

            if (days != 0)
            {
              output += days;
              if (hours == 0)
              {
                output += $rootScope.ui.dashboard.time.days;
              }
            }

            if (hours != 0)
            {
              if (days != 0)
              {
                output += $rootScope.ui.dashboard.time.days + ' : '
              }

              output += hours;
              if (minutes == 0)
              {
                output += $rootScope.ui.dashboard.time.hours;
              }
            }

            if (minutes != 0)
            {
              if (hours != 0)
              {
                output += $rootScope.ui.dashboard.time.hours + ' : '
              }

              output += minutes + $rootScope.ui.dashboard.time.minutes;
            }

            if (hours == 0 && minutes == 0)
            {
              output += seconds + $rootScope.ui.dashboard.time.seconds;
            }

            return output;
          };
        }
      ]
    )

    /**
     * Convert timeStamps to dates
     */
      .filter(
      'nicelyDate',
      [
        '$rootScope', 'moment',
        function ($rootScope, moment)
        {
          return function (date)
          {
            if (typeof date == 'string') date = Number(date);

            return moment(date).format($rootScope.config.app.formats.datetimefull);
          };
        }
      ])

      .filter(
      'getGroupNameById',
      [
        'Store',
        function (Store)
        {
          return function (id)
          {
            var teams = Store('app').get('teams'),
                currentTeam = _.find(teams, {uuid: id});
            return currentTeam && currentTeam.name
          }
        }
      ])

    /**
     * Convert group id to name
     */
      .filter(
      'groupIdToName',
      [
        'Store',
        function (Store)
        {
          return function (id, comma)
          {
            var groups = angular.fromJson(Store('app').get('teams')),
              names = '';

            for (var i in groups)
            {
              if (groups[i].uuid == id)
              {
                if (comma)
                {
                  names += ', ';
                }

                names += groups[i].name;
              }
            }
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
        function ($rootScope)
        {
          return function (id)
          {
            var divisions = $rootScope.config.app.timeline.config.divisions;

            for (var i in divisions)
            {
              if (divisions[i].id == id) return divisions[i].label;
            }
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
        function (Strings)
        {
          return function (txt)
          {
            return Strings.toTitleCase(txt);
          }
        }
      ])

    /**
     * Translate date string to
     */
    .filter(
    'formatDateTimeZone',
    [
      'Dater', 'moment',
      function (Dater, moment)
      {
        return function (date)
        {
          var _date = null;

          if(! _.isUndefined(date))
          {
            _date = Dater.formatDateMobile(date);
            _date = moment(_date).format('MM/DD/YY');
          }

          return _date || date;
        }
      }
    ]);




    // /**
    //  * Count messages in box
    //  */
    //   .filter(
    //   'countBox',
    //   function () {
    //     return function (box) {
    //       var total = 0;

    //       angular.forEach(
    //         box, function (bulk) {
    //           total = total + bulk.length;
    //         });

    //       return total;
    //     }
    //   }
    // )


    // /**
    //  * Convert offsets array to nicely format in scheduled jobs
    //  */
    //   .filter(
    //   'nicelyOffsets',
    //   [
    //     'Dater', 'Offsetter',
    //     function (Dater, Offsetter) {
    //       return function (data) {
    //         var offsets = Offsetter.factory(data),
    //           compiled = '';

    //         angular.forEach(
    //           offsets,
    //           function (offset) {
    //             compiled += '<div style="display:block; margin-bottom: 5px;">';

    //             compiled += '<span class="badge">' + offset.time + '</span>&nbsp;';

    //             if (offset.mon) compiled += '<span class="text-muted"><small><i> maandag,</i></small></span>';
    //             if (offset.tue) compiled += '<span class="text-muted"><small><i> dinsdag,</i></small></span>';
    //             if (offset.wed) compiled += '<span class="text-muted"><small><i> woensdag,</i></small></span>';
    //             if (offset.thu) compiled += '<span class="text-muted"><small><i> donderdag,</i></small></span>';
    //             if (offset.fri) compiled += '<span class="text-muted"><small><i> vrijdag,</i></small></span>';
    //             if (offset.sat) compiled += '<span class="text-muted"><small><i> zaterdag,</i></small></span>';
    //             if (offset.sun) compiled += '<span class="text-muted"><small><i> zondag,</i></small></span>';

    //             compiled = compiled.substring(0, compiled.length - 20);

    //             compiled = compiled += '</i></small></span>';

    //             compiled += '</div>';

    //             compiled = compiled.substring(0, compiled.length);
    //           }
    //         );

    //         return compiled;

    //         // return $sce.trustAsHtml(compiled);
    //       }
    //     }
    //   ])


    // /**
    //  * Convert array of audience to a nice list
    //  */
    //   .filter(
    //   'nicelyAudience',
    //   [
    //     'Store',
    //     function (Store) {
    //       return function (data) {
    //         if (data) {
    //           var members = Store('network').get('unique'),
    //             groups = Store('network').get('groups'),
    //             audience = [];

    //           angular.forEach(
    //             data, function (recipient) {
    //               var name;

    //               if (members[recipient]) {
    //                 name = members[recipient].name;
    //               }
    //               else {
    //                 angular.forEach(
    //                   groups, function (group) {
    //                     if (group.uuid == recipient) name = group.name;
    //                   });
    //               }

    //               audience += name + ', ';
    //             });

    //           return audience.substring(0, audience.length - 2);
    //         }
    //       }
    //     }
    //   ])


    // /**
    //  * Convert array of audience to a nice list
    //  */
    //   .filter(
    //   'convertToObject',
    //   [
    //     function () {
    //       return function (arr) {
    //         if (arr) {
    //           var obj = {};

    //           angular.forEach(
    //             arr,
    //             function (item, index) {
    //               obj[index] = item
    //             }.bind(obj)
    //           );

    //           return obj;
    //         }
    //       }
    //     }
    //   ])


    // /**
    //  * Filter non-functional users
    //  */
    //   .filter(
    //   'filterSupers',
    //   [
    //     function () {
    //       return function (users) {
    //         if (users) {
    //           var filtered = [];

    //           angular.forEach(
    //             users,
    //             function (user) {
    //               if (user.resources &&
    //                 (user.resources.role != 0 && user.resources.role != 4)
    //                 ) {
    //                 filtered.push(user);
    //               }
    //             }
    //           );

    //           return filtered;
    //         }
    //       }
    //     }
    //   ])


    //   .filter(
    //   'avatar',
    //   [
    //     'Session', 'Store', '$rootScope',
    //     function (Session, Store, $rootScope) {
    //       return function (id, type, size, avatarId) {
    //         var session = Session.get();

    //         if (session && id) {
    //           var path;

    //           switch (type)
    //           {
    //             case 'team':
    //               path = '/team/member/';
    //               break;

    //             case 'client':
    //               path = '/client/';
    //               break;

    //             case 'avatar':
    //               path = 'images/';
    //               break;

    //             case 'user':
    //               path = '/user/avatar/';
    //               break;

    //             case 'image':
    //               path = '/images/';
    //               break;
    //           }

    //           var avatarChanged = function (id)
    //           {
    //             var changedTimes = 0;

    //             angular.forEach(
    //               Store('app').get('avatarChangeRecord'),
    //               function (avatarId)
    //               {
    //                 if (avatarId == id)
    //                 {
    //                   changedTimes ++;
    //                 }
    //               }
    //             );

    //             return parseInt(changedTimes, 10);
    //           };

    //           // TODO: Better use a special parameter to specify the avatar is changed.
    //           var newsize = parseInt(size, 10) + parseInt(avatarChanged(id), 10);

    //           if (type == 'avatar' || type == 'image')
    //           {
    //             var _url = config.host +
    //                        path +
    //                        id +
    //                        '?sid=' + session;


    //             return _url;
    //           }
    //           else if (avatarId){
    //             return config.host +
    //                    path +
    //                    id +
    //                    '/photo?width=' + newsize + '&height=' + newsize + '&sid=' +
    //                    session + '&id=' + avatarId;
    //           }
    //           else
    //           {
    //             if($rootScope.StandBy.config.profile.defaultProfilePicture){
    //               return $rootScope.StandBy.config.profile.defaultProfilePicture;
    //             }

    //             return config.host +
    //                    path +
    //                    id +
    //                    '/photo?width=' + newsize + '&height=' + newsize + '&sid=' +
    //                    session;
    //           }
    //         }
    //       }
    //     }
    //   ]);


  }
);

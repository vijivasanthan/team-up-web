define(
  ['app', 'config', 'locals'],
  function (app, config, locals)
  {
    'use strict';

    app.run(
      [
        '$rootScope',
        '$location',
        '$timeout',
        'Session',
        'Store',
        '$window',
        'Teams',
        'Offline',
        'States',
        'Browsers',
        'Dater',
        'TeamUp',
        function (
          $rootScope, $location, $timeout, Session, Store, $window, Teams, Offline, States, Browsers, Dater, TeamUp
          )
        {
          // TODO: Remove later on (Needed for timeline info filters)
          if (! Dater.getPeriods())
          {
            Dater.registerPeriods();
          }

          new Offline();

          $rootScope.$on(
            'connection',
            function ()
            {
              console.log(
                (! arguments[1]) ?
                'connection restored :]' + Date.now() :
                'connection lost :[' + Date.now()
              );
            }
          );

          angular.element('#notification').css({display: 'block'});

          Session.check();


          $rootScope.config = config;
          $rootScope.ui = locals.ui[config.app.lang];


          $rootScope.app = $rootScope.app || {};
          $rootScope.app.resources = Store('app').get('resources');

          /**
           * Status-Bar
           */
          $rootScope.loading = {
            status: false,
            message: 'Loading..'
          };

          $rootScope.statusBar =
          {
            display: function (message)
            {
              $rootScope.loading = {
                status: true,
                message: message
              };
            },

            off: function () { $rootScope.loading.status = false }
          };


          /**
           * Notification
           */
          $rootScope.notification = {
            status: false,
            type: '',
            message: ''
          };

          $rootScope.notifier =
          {
            init: function (status, type, message)
            {
              $rootScope.notification.status = true;

              if ($rootScope.browser.mobile && status == true)
              {
                $window.alert(message);
              }
              else
              {
                $rootScope.notification = {
                  status: status,
                  type: type,
                  message: message
                };
              }
            },

            success: function (message, permanent)
            {
              this.init(true, 'alert-success', message);

              if (! permanent) this.destroy();
            },

            error: function (message, permanent)
            {
              this.init(true, 'alert-danger', message);

              if (! permanent) this.destroy();
            },

            destroy: function ()
            {
              setTimeout(
                function ()
                {
                  $rootScope.notification.status = false;
                }, 5000);
            }
          };

          $rootScope.notifier.init(false, '', '');


          /**
           * Fix styles
           */
            // TODO: Turn it to a jQuery plugin
          $rootScope.fixStyles = function ()
          {
            var tabHeight = angular.element('.tabs-left .nav-tabs').height();

            $.each(
              angular.element('.tab-content').children(),
              function ()
              {
                var $this = angular.element(this).attr('id'),
                    contentHeight = angular.element('.tabs-left .tab-content #' + $this).height();

                if (tabHeight > contentHeight)
                {
                  angular.element('.tabs-left .tab-content #' + $this)
                    .css(
                    {
                      height: angular.element('.tabs-left .nav-tabs').height() + 6
                    }
                  );
                }
                else if (contentHeight > tabHeight)
                {
                  // angular.element('.tabs-left .nav-tabs').css( { height: contentHeight } );
                }
              });

            if ($.os.mac || $.os.linux)
            {
              angular.element('.nav-tabs-app li a span')
                .css(
                {
                  paddingTop: '10px',
                  marginBottom: '0px'
                }
              );
            }
          };


          // Get team member by id (shared)
          $rootScope.getTeamMemberById = function (memberId)
          {
            if (memberId == null)
            {
              return null;
            }

            var member;

            angular.forEach(
              Store('app').get('teams'),
              function (team)
              {
                angular.forEach(
                  Store('app').get(team.uuid),
                  function (_member)
                  {
                    if (_member.uuid == memberId)
                    {
                      member = _member;
                      return;
                    }
                  }
                );
              }
            );

            if (typeof member == 'undefined')
            {
              member = {
                uuid: memberId,
                firstName: memberId,
                lastName: ''
              };
            }

            member.fullName = member.firstName +
                              ' ' +
                              member.lastName;

            return member;
          };

          // Get client by id (shared)
          $rootScope.getClientByID = function (clientId)
          {
            var result;

            angular.forEach(
              Store('app').get('clients'),
              function (client)
              {
                if (clientId == client.uuid)
                {
                  result = client;

                  // TODO: return is needed here?
                  return;
                }
              }
            );

            if (result == null)
            {
              angular.forEach(
                Store('app').get('ClientGroups'),
                function (group)
                {
                  angular.forEach(
                    Store('app').get(group.id),
                    function (client)
                    {
                      if (client.uuid = clientId)
                      {
                        result = client;

                        // TODO: return is needed here?
                        return;
                      }
                    }
                  );
                }
              );
            }

            return result;
          };

          // Get group name by id (shared)
          $rootScope.getClientGroupName = function (groupId)
          {
            var groups = Store('app').get('ClientGroups');
            var ret = groupId;

            angular.forEach(
              groups,
              function (g)
              {
                if (g.id == groupId)
                {
                  ret = g.name;
                }
              }
            );

            return ret;
          };

          // Get team name by id (shared)
          $rootScope.getTeamName = function (teamId)
          {
            var teams = Store('app').get('teams');
            var ret = teamId;

            angular.forEach(
              teams,
              function (t)
              {
                if (t.uuid == teamId)
                {
                  ret = t.name;
                }
              }
            );

            return ret;
          };

          /**
           * Here we need to find the clients for this team member,
           * 1> get the team,
           * 2> find the groups belong to this team,
           * 3> get all the clients under the group
           */
            // TODO: It is only called from planboard controller. Maybe move it to there?
            // FIXME: It breaks down when the selected groups has no clientGroup on adding slot on timeline
          $rootScope.getClientsByTeam = function (teamIds)
          {
            var clients = [],
                clientIds = [];

            angular.forEach(
              teamIds,
              function (teamId)
              {
                angular.forEach(
                  Store('app').get('teamGroup_' + teamId),
                  function (teamGroup)
                  {
                    var members = Store('app').get(teamGroup.id);

                    if (members.length > 0)
                    {
                      angular.forEach(
                        members,
                        function (member)
                        {
                          // console.log('member ->', member);

                          if (clientIds.indexOf(member.uuid) == - 1)
                          {
                            clientIds.push(member.uuid);

                            clients.push(
                              {
                                uuid: member.uuid,
                                name: member.firstName + ' ' + member.lastName
                              }
                            );
                          }
                        }
                      );
                    }

                  }
                );
              });

            return clients;
          };

          /**
           * Here we need to find the team members that can actually take this client
           * 1> get the team link to this client group ,
           * 2> get the members in the team.
           */
            // TODO: It is only called from planboard controller. Maybe move it to there?
          $rootScope.getMembersByClient = function (clientGroup)
          {
            var members = [],
                memberIds = [];

            angular.forEach(
              Store('app').get('teams'),
              function (team)
              {
                angular.forEach(
                  Store('app').get('teamGroup_' + team.uuid),
                  function (teamGrp)
                  {
                    if (clientGroup == teamGrp.id)
                    {
                      angular.forEach(
                        Store('app').get(team.uuid),
                        function (member)
                        {
                          if (memberIds.indexOf(member.uuid) == - 1)
                          {
                            memberIds.push(member.uuid);

                            members.push(
                              {
                                uuid: member.uuid,
                                name: member.firstName + ' ' + member.lastName
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            );

            return members;
          };

          // TODO: Combine login and logout together
          $rootScope.logout = function ()
          {
            angular.element('.navbar').hide();

            angular.element('#footer').hide();

            var loginData = Store('app').get('loginData');

            TeamUp._('logout')
              .then(
              function (result)
              {
                if (result.error)
                {
                  console.warn('error ->', result);
                }
                else
                {
                  Session.clear();

                  Store('app').nuke();

                  Store('app').save('loginData', loginData);

                  $window.location.href = 'logout.html';
                }
              }
            );
          };

          // TODO: Remove adding 1 pixel fix from url, implement a session related id in url
          // Trick browser for avatar url change against caching
          $rootScope.avatarChange = function (avatarId)
          {
            var list = Store('app').get('avatarChangeRecord');

            if (! angular.isArray(list))
            {
              list = [];
            }

            list.push(avatarId);
            Store('app').save('avatarChangeRecord', list);
          };

          // TODO: Investigate on this!
          // Know how many times user changed the avatar from upload function.
          $rootScope.getAvatarChangeTimes = function (id)
          {
            var changedTimes = 0;
            var list = Store('app').get('avatarChangeRecord');

            angular.forEach(
              list,
              function (avatarId)
              {
                if (avatarId == id)
                {
                  changedTimes ++;
                }
              });
            return changedTimes;
          };

          // TODO: Investigate on this!
          // Translate the error message
          // Extract the team and group id from error message and trans them into the name
          $rootScope.transError = function (errorMessage)
          {
            // assume all the words are devided by the space
            var arr = errorMessage.split(" ");
            var ret = errorMessage;

            angular.forEach(
              arr,
              function (word)
              {
                if (word.indexOf('_cg') > - 1)
                {
                  // might be the group id , try to search it , replace it with name if we found it
                  ret = ret.replace(word, $rootScope.getClientGroupName(word));
                }
                else if (word.indexOf('_team') > - 1)
                {
                  // might be the team id , try to search it , replace it with name if we found it
                  ret = ret.replace(word, $rootScope.getTeamName(word));
                }
              });

            return ret;
          };

        }
      ]
    );
  }
);
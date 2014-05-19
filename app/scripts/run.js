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
        function ($rootScope, $location, $timeout, Session, Store, $window, Teams, Offline, States, Browsers, Dater)
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


          Session.check();


          $rootScope.config = config;
          $rootScope.ui = locals.ui[config.app.lang];


          $rootScope.app = $rootScope.app || {};
          $rootScope.app.resources = Store('app').get('resources');


          /**
           * Status-Bar
           */
          $rootScope.loading = {
            status:  false,
            message: 'Loading..'
          };

          $rootScope.statusBar =
          {
            display: function (message)
            {
              $rootScope.loading = {
                status:  true,
                message: message
              };
            },

            off: function () { $rootScope.loading.status = false }
          };


          /**
           * Notification
           */
          $rootScope.notification = {
            status:  false,
            type:    '',
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
                  status:  status,
                  type:    type,
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
            var tabHeight = $('.tabs-left .nav-tabs').height();

            $.each(
              $('.tab-content').children(),
              function ()
              {
                var $this = $(this).attr('id'),
                    contentHeight = $('.tabs-left .tab-content #' + $this).height();

                if (tabHeight > contentHeight)
                {
                  $('.tabs-left .tab-content #' + $this).css(
                    {
                      height: $('.tabs-left .nav-tabs').height() + 6
                    });
                }
                else if (contentHeight > tabHeight)
                {
                  // $('.tabs-left .nav-tabs').css( { height: contentHeight } );
                }
              });

            if ($.os.mac || $.os.linux)
            {
              $('.nav-tabs-app li a span').css(
                {
                  paddingTop:   '10px',
                  marginBottom: '0px'
                }
              );
            }
          };


          /**
           * Shared functions
           */
          $rootScope.getTeamMemberById = function (memberId)
          {
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
                  });
              });

            if (typeof member == "undefined")
            {
              member = {
                uuid:      memberId,
                firstName: memberId,
                lastName:  ''
              };
            }

            return member;
          };

          $rootScope.getClientByID = function (clientId)
          {
            var ret;

            angular.forEach(
              Store('app').get('clients'),
              function (client)
              {
                if (clientId == client.uuid)
                {
                  ret = client;
                  return;
                }
              });

            if (ret == null)
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
                        ret = client;
                        return;
                      }
                    });

                });
            }

            return ret;
          };

          /**
           * Here we need to find the clients for this team member,
           * 1> get the team,
           * 2> find the groups belong to this team,
           * 3> get all the clients under the group
           */
          // TODO: It is only called from planboard controller. Maybe move it to there?
          $rootScope.getClientsByTeam = function (teamIds)
          {
            var clients = [],
                clientIds = [];

            console.log('teamIds ->', teamIds);

            angular.forEach(
              teamIds,
              function (teamId)
              {
                console.log('TID ->', teamId);

                angular.forEach(
                  Store('app').get('teamGroup_' + teamId),
                  function (teamGroup)
                  {
                    console.log('teamGroup ->', teamGroup);
                    console.log('length ->', Store('app').get(teamGroup.id).length);

                    angular.forEach(
                      Store('app').get(teamGroup.id),
                      function (member)
                      {
                        console.log('member ->', member);

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
            var members = [];
            var memberIds = [];

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
                        });
                    }
                  });
              });

            return members;
          };

          $rootScope.getAvatarURL = function (userId)
          {
            var ret = '';

            angular.forEach(
              Store('app').get('avatarUrls'),
              function (avatar)
              {
                if (avatar.userId == userId)
                {
                  ret = avatar.url;
                }
              }
            );

            return ret;
          };
        }
      ]
    );
  }
);
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
        '$filter',
        'Teams',
        'Offline',
        'States',
        'Browsers',
        'Dater',
        'TeamUp',
        'Permission',
        '$route',
        'Pincode',
        '$injector',
        function ($rootScope, $location, $timeout, Session, Store, $window, $filter, Teams, Offline, States, Browsers,
                  Dater, TeamUp, Permission, $route, Pincode, $injector)
        {
          //$window.onerror = function (errorMsg, url, lineNumber)
          //{
          //  console.log('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
          //
          //  var err = new Error();
          //
          //  console.log('Error stack ', err);
          //
          //  trackGa('send', 'exception', {
          //    exDescription: errorMsg + ' Script: ' + url + ' Line: ' + lineNumber,
          //    exFatal: false
          //  });
          //};

          var navBar = angular.element('.navbar'),
              footer = angular.element('#footer');

          new Offline();

          $rootScope.$on(
            'connection',
            function ()
            {
              console.log(
                (!arguments[1]) ?
                'connection restored :]' + Date.now() :
                'connection lost :[' + Date.now()
              );
            }
          );

          /**
           * Check if the location is available without session
           * Check session on all other locations
           * @param location
           */
          $rootScope.checkLocation = function(location)
          {
            var videoRegex = /video\/([A-Za-z0-9-_/#]+)/g;

            switch (true)
            {
              case videoRegex.test(location):
                break;
              default:
                if(false == Session.check())
                {
                  $location.path("/login");
                }
            }
          };

          $rootScope.checkLocation($location.path());

          $rootScope.config = config;
          $rootScope.config.app.init();
          $rootScope.ui = locals.ui[config.app.lang];

          /**
          * test if localStorage is reachable
          */
            try
            {
              localStorage.test = 'test';
            }
            catch (e)
            {
              navBar.hide();
              footer.hide();

              return false;
            }

          $rootScope.app = $rootScope.app || {};
          $rootScope.app.resources = Store('app').get('resources');
          $rootScope.app.domainPermission =  Store('app').get('permissionProfile');

          angular.element('#notification').css({display: 'block'});

          // TODO: Remove later on (Needed for timeline info filters)
          if (!Dater.getPeriods())
          {
            Dater.registerPeriods();
          }

          // TODO: Lose this later onw with VisJS/MomentJS navigation
          if (Store('app').get('periods') == null || Store('app').get('periods').value == null)
          {
            Dater.registerPeriods();
          }

          /**
           * Timeline states
           */
          if (_.isEmpty($rootScope.config.app.timeline.states))
          {
            $rootScope.config.app.timeline.config.states = $rootScope.config.app.statesall;
            delete $rootScope.config.app.timeline.config.states['com.ask-cs.State.Unreached'];
          }

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

            off: function ()
            {
              $rootScope.loading.status = false
            }
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

              $rootScope.notification = {
                status: status,
                type: type,
                message: message
              };
            },

            success: function (message, permanent)
            {
              this.init(true, 'alert-success', message);

              if (!permanent) this.destroy();
            },

            error: function (message, permanent)
            {
              this.init(true, 'alert-danger', message);

              if (!permanent) this.destroy();
            },

            destroy: function ()
            {
              $timeout(
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
                      minHeight: angular.element('.tabs-left .nav-tabs').height() + 6
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

            angular.element('.modal').hide();
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
                      return false;
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

          /**
           * Info logged user without a team
           */
          $rootScope.infoUserWithoutTeam = function()
          {
            if(! $rootScope.app.resources.teamUuids.length)
            {
              var info = ($rootScope.app.resources.role > 1)
                ? $rootScope.ui.teamup.teamMemberNoTeam
                : $rootScope.ui.teamup.coordinatorNoTeam;

              $rootScope.notifier.error(
                info,
                true
              );
            }
          };

          // Get teams of a member
          $rootScope.getTeamsofMembers = function (memberId)
          {
            if (memberId == null)
            {
              return null;
            }

            var currentTeams = [];

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
                      currentTeams.push(team);
                    }
                  }
                );
              }
            );

            return currentTeams;
          };

          // Get client by id (shared)
          $rootScope.getClientByID = function (clientId)
          {
            var result = null;

            angular.forEach(
              Store('app').get('clients'),
              function (client)
              {
                if (clientId == client.uuid)
                {
                  result = client;

                  // TODO: return is needed here?
                  return false;
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
                      if (client && client.uuid == clientId)
                      {
                        result = client;

                        // TODO: return is needed here?
                        return false;
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

          /**
           * Update the states of the logged user localStorage
           * @param member
           */
          $rootScope.checkUpdatedStatesLoggedUser = function (member)
          {
            if ($rootScope.app.resources.uuid == member.uuid
              && !_.isEqual($rootScope.app.resources.states, member.states))
            {
              $rootScope.app.resources.states = member.states;
              Store('app').save('resources', $rootScope.app.resources);
            }
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
            // TODO: TODO change the clients.push FullName and name is the same
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

                          if (clientIds.indexOf(member.uuid) == -1)
                          {
                            clientIds.push(member.uuid);

                            clients.push(
                              {
                                uuid: member.uuid,
                                firstName: member.firstName,
                                lastName: member.lastName,
                                fullName: member.firstName + ' ' + member.lastName,
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
                          if (memberIds.indexOf(member.uuid) == -1)
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
            navBar.hide();

            footer.hide();

            var loginData = Store('app').get('loginData');

            TeamUp._('logout')
              .then(
              function (result)
              {
                if (result && result.error)
                {
                  console.warn('error ->', result);
                }
                else
                {
                  Session.clear();

                  Store('app').nuke();

                  Store('app').save('loginData', {
                    username: loginData.username
                  });

                  $window.location.href = 'index.html';
                }
              }
            );
          };

          /**
           * Changed avatarpic after a change
           * @param type The parent of the avatarpic team/profile/client
           * @param id The uuid of the user
           */
          $rootScope.showChangedAvatar = function (type, id)
          {
            var url = $filter('avatar')(id, type, '80'),
              elements = [];

            if (type == 'team')
            {
              //check if id is equal with the logged user id
              if (id == $rootScope.app.resources.uuid)
              {
                elements.push('.profile-avatar');
              }
              elements.push('.team-avatar');
            }
            else
            {
              elements.push('.client-avatar');
            }

            angular.forEach(elements, function (element)
            {
              angular.element(element).css({
                'background': 'url(' + url + ')',
                'background-size': 'cover'
              });
            });
          };

          // TODO: Remove adding 1 pixel fix from url, implement a session related id in url
          // Trick browser for avatar url change against caching
          $rootScope.avatarChange = function (avatarId)
          {
            var list = Store('app').get('avatarChangeRecord');

            if (!angular.isArray(list))
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
                  changedTimes++;
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
                if (word.indexOf('_cg') > -1)
                {
                  // might be the group id , try to search it , replace it with name if we found it
                  ret = ret.replace(word, $rootScope.getClientGroupName(word));
                }
                else if (word.indexOf('_team') > -1)
                {
                  // might be the team id , try to search it , replace it with name if we found it
                  ret = ret.replace(word, $rootScope.getTeamName(word));
                }
              });

            return ret;
          };

          //TODO add to service
          $rootScope.resetPhoneNumberChecker = function ()
          {
            $rootScope.phoneNumberParsed = {};
          };

          $rootScope.resetPhoneNumberChecker();

          $rootScope.parsePhoneNumber = function (checked, index)
          {
            if (checked != '')
            {
              var className = (!_.isUndefined(index))
                ? '.inputPhoneNumber' + index
                : '.inputPhoneNumber';

              if (checked && checked.length > 0)
              {
                var result, all;

                result = all = phoneNumberParser(checked, 'NL');

                $rootScope.phoneNumberParsed.result = true;

                if (result)
                {
                  var error = $rootScope.ui.validation.phone.notValid,
                    invalidCountry = $rootScope.ui.validation.phone.invalidCountry,
                    message;

                  if (result.error)
                  {
                    $rootScope.phoneNumberParsed = {
                      result: false,
                      message: error
                    };
                  }
                  else
                  {
                    if (!result.validation.isPossibleNumber)
                    {
                      switch (result.validation.isPossibleNumberWithReason)
                      {
                        case 'INVALID_COUNTRY_CODE':
                          message = invalidCountry;
                          break;
                        case 'TOO_SHORT':
                          message = error + $rootScope.ui.validation.phone.tooShort;
                          break;
                        case 'TOO_LONG':
                          message = error + $rootScope.ui.validation.phone.tooLong;
                          break;
                      }

                      $rootScope.phoneNumberParsed = {
                        result: false,
                        message: message
                      };
                    }
                    else
                    {
                      if (!result.validation.isValidNumber)
                      {
                        $rootScope.phoneNumberParsed = {
                          result: false,
                          message: error
                        };
                      }
                      else
                      {
                        if (!result.validation.isValidNumberForRegion)
                        {
                          $rootScope.phoneNumberParsed = {
                            result: false,
                            message: invalidCountry
                          };
                        }
                        else
                        {
                          var numberType;

                          switch (result.validation.getNumberType)
                          {
                            case 'FIXED_LINE':
                              numberType = $rootScope.ui.validation.phone.fixedLine;
                              break;
                            case 'MOBILE':
                              numberType = $rootScope.ui.validation.phone.mobile;
                              break;
                            case 'FIXED_LINE_OR_MOBILE':
                              numberType = $rootScope.ui.validation.phone.mobileOrFixedLine;
                              break;
                          }

                          $rootScope.phoneNumberParsed = {
                            result: true,
                            message: $rootScope.ui.validation.phone.message +
                            result.validation.phoneNumberRegion +
                            $rootScope.ui.validation.phone.as +
                            numberType,
                            format: result.formatting.e164
                          };

                          angular.element(className)
                            .val(result.formatting.e164)
                            .removeClass('error');
                        }
                      }
                    }
                  }
                }

                $rootScope.phoneNumberParsed.all = all;
              }
              else
              {
                $rootScope.phoneNumberParsed.result = true;

                delete $rootScope.phoneNumberParsed.message;

                angular.element(className)
                  .removeClass('error');
              }
            }
          };

          //force route to reload even if the new url is equal as the current url
          $rootScope.directToChatLink = function(url)
          {
              $window.location.href = url;
              $route.reload();
          };

          $rootScope.pincodeExists = function (pincode, userId, assignedId)
          {
            Pincode.pincodeExists(
              pincode,
              $rootScope.pincodeExistsValidation,
              $rootScope.checkPincode,
              userId,
              assignedId
            ).then(
              function (data)
              {
                $rootScope.pincodeExistsValidation = data.pincodeExistsValidation;
                $rootScope.pincodeExistsValidationMessage = data.pincodeExistsValidationMessage;
                $rootScope.checkPincode = data.check;
              }
            );
          };

          $rootScope.unique = function (collection)
          {
            var filter = function (result) {
              return result.role > 0 && result.role < 4;
            };

            return _.indexBy(_.filter(
              _.map(_.indexBy(collection, function (node) {
                  return node.uuid;
                }),
                function (member) {
                  return member;
                }
              ),
              filter
            ), function (member) {
              return member.uuid;
            });
          };

          var clickChatBtn = function()
          {
            $timeout(function() {
              var el = document.getElementById('chat-btn');
              angular.element(el).triggerHandler('click');
            }, 0);
          };

          var getRandomString = function()
          {
            return Math.random()// Generate random number, eg: 0.123456
              .toString(36)// Convert  to base-36 : "0.4fzyo82mvyr"
              .slice(-8);// Cut off last 8 characters : "yo82mvyr"
          };

          var filterUrl = function(url)
          {
            return  $filter('trusted_url')(url);
          };

          $rootScope.startVideoCall = function(receiver, roomId)
          {
            var room = roomId || getRandomString();
            var user = receiver || 'anonymous';
            var Message = $injector.get('Message');
            var url = 'http://webrtc.ask-cs.com/?room=' + room; //'http://webrtc.ask-cs.com/?room=' + room; //http://localhost:9001/?room=
            var message = $rootScope.ui.message.webTRCWebLink + url;
            var CurrentSelection = $injector.get('CurrentSelection');

            Message.save(message, CurrentSelection.getTeamId())
              .then(function(result)
              {
                $rootScope.video = {
                  url: filterUrl(url)
                }
                $rootScope.video.src = $rootScope.video.url;

                var content = angular.element('#message-content');
                $("iframe").contents().find('#leave').hide();

                //Check if chat/video message area is already opened
                if(content.hasClass('ng-hide'))
                {
                  content.removeClass('ng-hide');
                  clickChatBtn();
                }
              });
          };

          $rootScope.closeVideoCall = function()
          {
            $rootScope.video.src = false;
            $rootScope.video.url = filterUrl('about:blank');

            clickChatBtn();

            $rootScope.notifier.success($rootScope.ui.video.stop);
          };

          $rootScope.hangup = null;

          function displayMessage (evt) {
            var message;
            console.log('evt.data', evt.data);
            console.log('evt.origin', evt.origin);

            $rootScope.hangup = evt.data;
            $rootScope.$apply();

            if(!_.isNull($rootScope.hangup))
            {
              $rootScope.closeVideoCall();
            }
            //if (evt.origin !== "http://localhost:9001") {
            //  $scope.message = "You are not worthy";
            //}
            //else {
            //  $scope.message = "I got " + evt.data + " from " + evt.origin;
            //}
          }

          if (window.addEventListener) {
            // For standards-compliant web browsers
            window.addEventListener("message", displayMessage, false);
          }
          else {
            window.attachEvent("onmessage", displayMessage);
          }
        }
      ]
    );
  }
);

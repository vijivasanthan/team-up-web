define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'messagesCtrl',
      [
        '$scope',
        '$rootScope',
        '$q',
        '$location',
        '$route',
        '$filter',
        '$timeout',
        'Teams',
        'TeamUp',
        'CurrentSelection',
        'moment',
        function ($scope, $rootScope, $q, $location, $route, $filter,
                  $timeout, Teams, TeamUp, CurrentSelection, moment)
        {
          // TODO: Move this to config
          // TODO: Find a better way for refreshing chat messages
          var REFRESH_CHAT_MESSAGES = 2000; // * 60;
          var REFRESH_CHAT_MESSAGES_WHEN_CLOSE = 5000; // * 60;
          var SECONDS_A_WEEK = 60 * 60 * 24 * 7 * 1000;

          $scope.messages = [];
          $scope.messagesShow = [];

          $scope.latestMsgTime = 0;

          // Initiate refreshers in the background
          $rootScope.$on(
            'loadChatsCurrentTeam', function (event, args)
            {
              if (angular.isArray($rootScope.app.resources.teamUuids))
              {
                $scope.chatTeamId = CurrentSelection.getTeamId();
                if ($scope.chatTeamId && ! $scope.toggleChat)
                {
                  $timeout($scope.checkMessage, REFRESH_CHAT_MESSAGES_WHEN_CLOSE);
                }
              }
            });

          // Prepare message for view
          $scope.formatMessage = function (messages)
          {
            var chatMembers = [],
              urlify = function(body)
              {
                var urlRegex = /(https?:\/\/[^\s]+)/g,
                  htmlRegex = /index.html#([A-Za-z0-9-_/#]+)/g;

                if(urlRegex.test(body))
                {
                  body = body.replace(urlRegex, function(url) {
                    url = url.split('=');
                    var roomId = url[url.length - 1];
                    //href="index.html#/video/' + roomId + '"
                    //'<a href="index.html#/video/' + roomId + '">' + 'Klik' + '</a>'
                    //'<a ng-click="click()" >' + 'Klik' + '</a>';
                     return '<a href="index.html#/team?video=' + roomId + '">Klik</a>';
                  });
                }
                else if(htmlRegex.test(body))
                {
                  body = replaceUrl(body, htmlRegex);
                }

                return body;

              };

            var replaceUrl = function(text, regex)
            {
              return text.replace(regex, function(url) {
                return '<a href="' + url + '">' + 'Klik' + '</a>';
              });
            };

            angular.forEach(
              messages,
              function (message, i)
              {
                var msgExist = $filter('getByUuid')($scope.messages, message.uuid);

                if (msgExist)
                {
                  return;
                }

                var minDate = $filter('nicelyDate')(parseInt(message.sendTime));

                if (i > 0 && minDate == $filter('nicelyDate')(parseInt(messages[i - 1].sendTime)))
                {
                  minDate = '';
                }

                var msg = {
                  date: minDate,
                  role: '',
                  member: {},
                  senderName: '',
                  sendTime: parseInt(message.sendTime),
                  body: message.body,
                  msgRole: '',
                  senderUuid: message.senderUuid,
                  teamId: $scope.chatTeamId,
                  uuid: message.uuid,
                  type: message.type,
                  title: message.title
                };

                var member = $rootScope.getTeamMemberById(message.senderUuid);

                if (message.senderUuid == $scope.$root.app.resources.uuid || ! message.senderUuid)
                {
                  msg.role = 'own';
                  msg.msgRole = 'messageOwn'
                  msg.member = $scope.$root.app.resources;
                  msg.senderName = msg.member.firstName + ' ' + msg.member.lastName;
                }
                else
                {
                  msg.role = 'other';
                  msg.msgRole = 'messageOther';
                  msg.member = member;
                  msg.senderName = member && member.firstName + ' ' + member.lastName || $rootScope.ui.teamup.undefinedTeamMember;
                }

                // parse the message body if necessary
                if (msg.type == 'REPORT_NEW')
                {
                  var msgBody = JSON.parse(message.body);

                  if(msgBody && msgBody.clientUuid != null)
                  {
                    var client = $rootScope.getClientByID(msgBody.clientUuid);

                    if(client != null)
                    {
                      angular.extend(msgBody, {clientGroupId: client.clientGroupUuid});
                      msg.body = msgBody;
                      msg.title = $scope.ui.message.reportMessage + " " + client.firstName + " " + client.lastName;
                    }

                  }
                }
                //else
                //{
                //  //Check if there is a url and parse the url to a anchor tag
                //  msg.body = urlify(msg.body);
                //}

                //Maak als er hhtp in de body staat er een anchor link vab

                $scope.messages.push(msg);

                // limit the messages within one week
                var now = new Date();

                if ((now.getTime() - parseInt(message.sendTime)) <= SECONDS_A_WEEK)
                {
                  $scope.messagesShow.push(msg);
                }

                if (chatMembers.indexOf(message.senderUuid) == - 1)
                {
                  chatMembers.push(message.senderUuid);
                }
              }
            );

            $scope.loadChatMessages = false;
          };

          $scope.fetchMessagesByTeam = function()
          {
            $scope.latestMsgTime = ($scope.latestMsgTime - SECONDS_A_WEEK);
            $scope.loadChatMessages = true;
            $scope.messages = [];
            $scope.messagesShow = [];
          };

          // Polling message from the server every 2 or 5 seconds base on the chat tab status, open or close.
          $scope.renderMessage = function (latestMsgTime)
          {
            TeamUp._(
              'chats',
              { third: $scope.chatTeamId, since: $scope.latestMsgTime}
            ).then(
              function (messages)
              {
                messages = $filter('orderBy')(messages, 'sendTime');

                if ($scope.toggleChat)
                {
                  if(messages.length)
                  {
                    if($scope.latestMsgTime != messages[messages.length - 1].sendTime)
                    {
                      $scope.moveToBottom = true;
                    }

                    $scope.latestMsgTime = messages[messages.length - 1].sendTime;
                  }

                  $timeout($scope.renderMessage, REFRESH_CHAT_MESSAGES);
                }

                // scroll to the bottom of the chat window
                // TODO: Is this a handy way of doing this?
                if ($scope.moveToBottom)
                {
                  $timeout(
                    function ()
                    {
                      angular.element('#chat-content #messageField').focus();
                      angular.element('#chat-content .mainContent').animate({
                          'scrollTop': angular.element('#chat-content .mainContent')[0].scrollHeight},
                        'slow');
                      $scope.moveToBottom = false;
                    }, 50); // FIXME: Temporarily made it longer till there is a better solution
                }

                $scope.formatMessage(messages);
              },
              function (error) { console.log(error) }
            );
          };

          // Check whether there are new messages
          $scope.checkMessage = function (latestMsgTime)
          {
            TeamUp._(
              'chats',
              { third: $scope.chatTeamId, since: $scope.latestMsgTime}
            ).then(
              function (messages)
              {
                if (messages.error)
                {
                  $rootScope.notifier.error(messages.error.data);
                  return;
                }

                $scope.newCount = 0;
                angular.forEach(
                  messages, function (newMsg)
                  {
                    if (! $filter('getByUuid')($scope.messages, newMsg.uuid))
                    {
                      $scope.newCount ++;
                    }
                  });

                // if the message is not appied to the scope , then make the message count 0 .
                if ($scope.newCount == 0 || $scope.messages.length == 0)
                {
                  if ($scope.unReadCount == 0 || typeof $scope.unReadCount == 'undefined')
                  {
                    $scope.newCountShow = '';
                  }
                  else
                  {
                    $scope.newCountShow = "(" + $scope.unReadCount + ")";
                  }
                }
                else
                {
                  $scope.unReadCount = $scope.newCount + (typeof $scope.unReadCount == 'undefined' ?
                                                          0 :
                                                          $scope.unReadCount);
                  $scope.newCountShow = "(" + $scope.unReadCount + ")";
                }

                // flash the tab ?  TODO : turing the color here
                // you might need Jquery UI to make this work.
                $('#chat-btn').animate({ 'background-color': "yellow" }, "slow").animate({ 'background-color': "#1dc8b6" }, "slow");

                if (! $scope.toggleChat)
                {
                  // get the latest message
                  messages = $filter('orderBy')(messages, 'sendTime');
                  if ($scope.messages.length == 0 || (! $scope.newCount == 0 && ! $scope.newCount == ''))
                  {
                    $scope.formatMessage(messages);
                  }

                  $scope.latestMsgTime = messages[messages.length - 1].sendTime;

                  $timeout($scope.checkMessage, REFRESH_CHAT_MESSAGES_WHEN_CLOSE);
                }
              });
          };

          // Open the chat box and initiate loaders
          $scope.openChat = function()
          {
            $scope.toggleChat = ! $scope.toggleChat;

            setTeamsData();

            $scope.loadChatMessages = true;

            var msgs = $filter('orderBy')($scope.messages, 'sendTime'),
                latestMsgTime = 0;

            //Check if there are messages loaded before and
            //Check if those messages are from the current team
            if (msgs.length > 0
                && msgs[msgs.length - 1].teamId == $scope.chatTeamId)
            {
              $scope.latestMsgTime = msgs[msgs.length - 1].sendTime;
            }
            else
            {
              $scope.messages = [];
              $scope.messagesShow = [];
              var now = moment().utc().valueOf();
              $scope.latestMsgTime = now - SECONDS_A_WEEK;
            }

            if ($scope.chatTeamId)
            {
              if ($scope.toggleChat)
              {
                trackGa('send', 'event', 'Chat', 'User clicked to view the chat');

                $scope.renderMessage(latestMsgTime);

                $scope.newCountShow = '';
                $scope.unReadCount = 0;
                $scope.moveToBottom = true;
              }
              else
              {
                $timeout($scope.checkMessage, REFRESH_CHAT_MESSAGES_WHEN_CLOSE);
              }
            }
            else
            {
              console.log("login user doesn't belong to any team.")
            }
          };

          // Send a chat message
          $scope.sendMessage = function (newMessage)
          {
            if (typeof newMessage == 'undefined' || newMessage == '')
            {
              $rootScope.notifier.error($rootScope.ui.message.emptyMessageBody);

              return;
            }

            $rootScope.statusBar.display($rootScope.ui.message.sending);

            var current = new Date();

            TeamUp._(
              'message',
              { third: $scope.chatTeamId },
              {
                title: 'Van: TeamUp' + current.toString(config.app.formats.date),
                body: newMessage,
                sendTime: current.getTime()
              }).then(
              function ()
              {
                $rootScope.statusBar.off();
                $scope.newMessage = '';
                $scope.moveToBottom = true;
              },
              function (error)
              {
                $rootScope.notifier.error(error);
                $rootScope.statusBar.off();
              }
            );
          };

          /**
           * Get the teams of the users and set the current chat TeamId
           */
          function setTeamsData()
          {
            var loggedUserTeams = $rootScope.app.resources.teamUuids,
              currentTeamId = CurrentSelection.getTeamId();

            $scope.teams = Teams.getTeamNamesOfUser(loggedUserTeams);
            $scope.chatTeamId = (loggedUserTeams.indexOf(currentTeamId) >= 0)
              ? currentTeamId
              : loggedUserTeams[0];
          }

        }
      ]
    );
  }
);

define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'messagesCtrl',
      [
        '$scope', '$rootScope', '$q', '$location', '$route', '$filter', 'Teams', 'TeamUp',
        function ($scope, $rootScope, $q, $location, $route, $filter, Teams, TeamUp)
        {
          // TODO: Move this to config
          // TODO: Find a better way for refreshing chat messages          
          var REFRESH_CHAT_MESSAGES = 2000; // * 60;
          var REFRESH_CHAT_MESSAGES_WHEN_CLOSE = 5000; // * 60;
          var SECONDS_A_WEEK = 60 * 60 * 24 * 7 * 1000;

          $scope.messages = [];
          $scope.messagesShow = [];

          $scope.teamName = '';
          $scope.latestMsgTime = 0;

          // Initiate refreshers in the background
          $rootScope.$on(
            'taskFinishLoading', function (event, args)
            {
              if (angular.isArray($rootScope.app.resources.teamUuids))
              {
                $scope.teamName = $rootScope.getTeamName($rootScope.app.resources.teamUuids[0]);

                $scope.chatTeamId = $rootScope.app.resources.teamUuids[0];

                if ($scope.chatTeamId && ! $scope.toggleChat)
                {
                  // clearInterval($scope.autoCheckMonitorId);
                  // $scope.autoCheckMonitorId = setInterval($scope.checkMessage, REFRESH_CHAT_MESSAGES_WHEN_CLOSE);
                  setTimeout($scope.checkMessage, REFRESH_CHAT_MESSAGES_WHEN_CLOSE);
                }
              }
            });

          // Prepare message for view
          $scope.formatMessage = function (messages)
          {
            var chatMembers = [];
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
                  uuid: message.uuid,
                  type: message.type,
                  title: message.title,
                };

                var member = $rootScope.getTeamMemberById(message.senderUuid);

                if (message.senderUuid == $scope.$root.app.resources.uuid)
                {
                  msg.role = 'own';
                  msg.msgRole = 'messageOwn'
                  msg.member = $scope.$root.app.resources;
                  msg.senderName = msg.member.firstName + ' ' + msg.member.lastName;
                }
                else
                {
                  msg.role = 'other';
                  msg.msgRole = 'messageOther'
                  msg.member = member;
                  msg.senderName = member.firstName + ' ' + member.lastName;
                }

                // parse the message body if necessary
                if (msg.type == 'REPORT_NEW')
                {
                  var msgBody = JSON.parse(message.body);
                  var client = $rootScope.getClientByID(msgBody.clientUuid);
                  angular.extend(msgBody, {clientGroupId: client.clientGroupUuid});
                  msg.body = msgBody;
                  msg.title = $scope.ui.message.reportMessage+" "+client.firstName+" "+client.lastName;
                }

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
                if (messages.error)
                {
                  $rootScope.notifier.error(messages.error.data);
                  return;
                }
                // var msgDates = {};


                // sort the messages by sendTime
                //    			messages = $filter('orderBy')(messages,'sendTime','reverse');
                messages = $filter('orderBy')(messages, 'sendTime');

                $scope.formatMessage(messages);

                // scroll to the bottom of the chat window
                // TODO: Is this a handy way of doing this? 
                // try to do it only once. 

                if ($scope.moveToBottom)
                {
                  setTimeout(
                    function ()
                    {
                      angular.element('#chat-content #messageField').focus();
                      angular.element('#chat-content .mainContent').scrollTop(angular.element('#chat-content .mainContent')[0].scrollHeight);
                      $scope.moveToBottom = false;
                    }, 1000); // FIXME: Temporarily made it longer till there is a better solution 
                }


                if ($scope.toggleChat)
                {
                  $scope.latestMsgTime = messages[messages.length - 1].sendTime;
                  setTimeout($scope.renderMessage, REFRESH_CHAT_MESSAGES);
                }

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

                // if ($scope.messages.length == messages.length)
                // {
                //   console.log('No new messages.');
                //   return;
                // }
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
                  setTimeout($scope.checkMessage, REFRESH_CHAT_MESSAGES_WHEN_CLOSE);
                }
              });
          };

          // Open the chat box and initiate loaders
          $scope.openChat = function ()
          {
            $scope.toggleChat = ! $scope.toggleChat;

            var teamIds = $rootScope.app.resources.teamUuids;
            $scope.chatTeamId = teamIds[0];

            var msgs = $filter('orderBy')($scope.messages, 'sendTime');
            var latestMsgTime = 0;
            if (msgs.length > 0)
            {
              $scope.latestMsgTime = msgs[msgs.length - 1].sendTime;
            }

            if ($scope.chatTeamId)
            {
              if ($scope.toggleChat)
              {

                $scope.renderMessage(latestMsgTime);

                // clearInterval($scope.autoCheckMonitorId);
                // $scope.autoCheckMonitorId = setInterval($scope.renderMessage, REFRESH_CHAT_MESSAGES);

                $scope.newCountShow = '';
                $scope.unReadCount = 0;
                $scope.moveToBottom = true;
              }
              else
              {
                // clearInterval($scope.autoCheckMonitorId);
                // $scope.autoCheckMonitorId = setInterval($scope.checkMessage, REFRESH_CHAT_MESSAGES_WHEN_CLOSE);
                setTimeout($scope.checkMessage, REFRESH_CHAT_MESSAGES_WHEN_CLOSE);
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
              {},
              {
                title: 'Van: TeamUp' + current.toString(config.app.formats.date),
                body: newMessage,
                sendTime: current.getTime()
              }).then(
              function ()
              {
                // $scope.renderMessage();

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

        }
      ]
    );
  }
);
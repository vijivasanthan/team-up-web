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
          var REFRESH_CHAT_MESSAGES = 2000 * 10 ;
          var REFRESH_CHAT_MESSAGES_WHEN_CLOSE = 5000 * 10;
          var SECONDS_A_WEEK = 60 * 60 * 24 * 7 * 1000;

          $scope.messages = [];
          $scope.messagesShow = [];

          $scope.teamName = '';
          
          $rootScope.$on('taskFinishLoading',function(event,args){
              if(angular.isArray($rootScope.app.resources.teamUuids)){
                  $scope.teamName = $rootScope.getTeamName($rootScope.app.resources.teamUuids[0]);

                  $scope.chatTeamId = $rootScope.app.resources.teamUuids[0];
                  if($scope.chatTeamId && !$scope.toggleChat){
                      clearInterval($scope.autoCheckMonitorId);
                      $scope.autoCheckMonitorId = setInterval($scope.checkMessage, REFRESH_CHAT_MESSAGES_WHEN_CLOSE);
                  }
              }              
          });          

          $scope.renderMessage = function ()
          {
            TeamUp._(
              'chats',
              { third: $scope.chatTeamId }
            ).then(
              function (messages)
              {
                if (messages.error)
                {
                  $rootScope.notifier.error(messages.error.data);
                  return;
                }

                if ($scope.messages.length == messages.length)
                {
                  console.log('No new messages.');
                  return;
                }

                $scope.messages = [];

                // var msgDates = {};

                var chatMembers = [];

                // sort the messages by sendTime
                //    			messages = $filter('orderBy')(messages,'sendTime','reverse');
                messages = $filter('orderBy')(messages, 'sendTime');

                angular.forEach(
                  messages,
                  function (message, i)
                  {
                    var minDate = $filter('nicelyDate')(parseInt(message.sendTime));

                    if (i > 0 && minDate == $filter('nicelyDate')(parseInt(messages[i - 1].sendTime)))
                    {
                      minDate = '';
                    }

                    var msg = {
                      date:       minDate,
                      role:       '',
                      member:     {},
                      senderName: '',
                      sendTime:   parseInt(message.sendTime),
                      body:       message.body,
                      msgRole:    '',
                      senderUuid: message.senderUuid
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

                    $scope.messages.push(msg);

                    // limit the messages within one week 
                    var now = new Date();
                    if((now.getTime() - parseInt(message.sendTime)) <= SECONDS_A_WEEK){
                        $scope.messagesShow.push(msg);
                    }

                    if (chatMembers.indexOf(message.senderUuid) == - 1)
                    {
                      chatMembers.push(message.senderUuid);
                    }
                  }
                );

                // scroll to the bottom of the chat window
                // TODO: Is this a handy way of doing this?
                setTimeout(
                  function ()
                  {
                    angular.element('#chat-content #messageField').focus();

                    angular.element('#chat-content').scrollTop(angular.element('#chat-content')[0].scrollHeight);
                  }, 1000); // FIXME: Temporarily made it longer till there is a better solution

              },
              function (error) { console.log(error) }
            );
          };

          $scope.checkMessage = function(){
              TeamUp._(
                'chats',
                { third: $scope.chatTeamId }
              ).then(function(messages){
                  if (messages.error)
                  {
                    $rootScope.notifier.error(messages.error.data);
                    return;
                  }

                  if ($scope.messages.length == messages.length)
                  {
                    console.log('No new messages.');
                    return;
                  }

                  $scope.newCount = messages.length - $scope.messages.length;
                  if($scope.newCount > 0){
                      $scope.newCount = "("+$scope.newCount+")";
                  }
                  $scope.teamName = $scope.teamName;                  

                  // flash the tab ?  TODO : turing the color here
                  $('#chat-btn').animate({ 'background-color' : "yellow" }, "slow").animate({ 'background-color' : "#1dc8b6" }, "slow");

              });
          }

          $scope.openChat = function ()
          {
            $scope.toggleChat = ! $scope.toggleChat;

            var teamIds = $rootScope.app.resources.teamUuids;
            $scope.chatTeamId = teamIds[0];

            if($scope.chatTeamId){
                if  ($scope.toggleChat){
                    $scope.renderMessage();

                    clearInterval($scope.autoCheckMonitorId);              
                    $scope.autoCheckMonitorId = setInterval($scope.renderMessage, REFRESH_CHAT_MESSAGES);

                    $scope.newCount = '';
                }else {
                    clearInterval($scope.autoCheckMonitorId);
                    $scope.autoCheckMonitorId = setInterval($scope.checkMessage, REFRESH_CHAT_MESSAGES_WHEN_CLOSE);
                }
            }else{
                console.log("login user doesn't belong to any team.")
            }
            
          };


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
                body:     newMessage,
                sendTime: current.getTime()
              }).then(
              function ()
              {
                $scope.renderMessage();

                $rootScope.statusBar.off();
                $scope.newMessage = '';
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
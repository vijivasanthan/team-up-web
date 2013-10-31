/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Messages', [])


/**
 * Messages controller
 */
.controller('messagesCtrl', 
[
    '$scope', '$rootScope', '$q', '$location', '$route', 'Messages', 'Storage','$filter','Teams',
    function ($scope, $rootScope, $q, $location, $route, Messages, Storage ,$filter,Teams) 
    {
    	$scope.messages = [];
    	
    	$scope.imgHost = profile.host();
    	
    	$scope.renderMessage = function(teamId){
    		
    		
    		Messages.queryTeamMessage(teamId).then(function(messages){
    			
    			if(messages.error){
    				$rootScope.notifier.error(messages.error.data);
    				return;
    			}
    			
    			console.log(messages.length,$scope.messages.length);
    			if($scope.messages.length == messages.length){
    				console.log("No new messages.");
    				return;
    			}
    			
    			$scope.messages = [];
    			
    			var msgDates = {};
    			var chatMembers = [];
    			// sort the messages by sendTime
//    			messages = $filter('orderBy')(messages,'sendTime','reverse');
    			messages = $filter('orderBy')(messages,'sendTime');
    			
    			angular.forEach(messages,function(message, i){
    				
    				var minDate = $filter('nicelyDate')(parseInt(message.sendTime));
    				if(i > 0 && minDate == $filter('nicelyDate')(parseInt(messages[i-1].sendTime))){
    					minDate = '';
    				}
    					
    				var msg = {date : minDate, 
						role : "",
						member : {},
						senderName : "",
						sendTime: parseInt(message.sendTime),
						body: message.body,
						msgRole : "",
						senderUuid : message.senderUuid
    				}
    				
    				var member = $scope.$root.getTeamMemberById(message.senderUuid);
    				if(message.senderUuid == $scope.$root.app.resources.uuid){
    					msg.role = "own";
    					msg.msgRole = "messageOwn"
    					msg.member = $scope.$root.app.resources;
                        msg.senderName = msg.member.firstName+" "+msg.member.lastName;
    				}else{
    					msg.role = "other";
    					msg.msgRole = "messageOther"
    					msg.member = member;
       				    msg.senderName = member.firstName+" "+member.lastName;
    				}
    				
    				$scope.messages.add(msg);
    				
    				if(chatMembers.indexOf(message.senderUuid) == -1){
    					chatMembers.add(message.senderUuid);
    				}
    			});
    			
    			// load the avatar img
    			angular.forEach(chatMembers, function(mId,i){
    				console.log(mId);
    				var imgURL = $scope.imgHost+"/teamup/team/member/"+mId+"/photo";
    				Teams.loadImg(imgURL).then(function(result){
    					// console.log("loading pic " + imgURL);
    					
    					var imgId = mId.replace(".","").replace("@","");
    					if(result.status && (result.status == 404 || result.status == 403 || result.status == 500) ){
    						console.log("no pics " ,result);
    					}else{
    						$('#chat-content #img_'+imgId).css('background-image','url('+imgURL+')');
    					}
    					
    				},function(error){
    					console.log("error when load pic " + error);
    				});
    			});
    			
    			// scroll to the bottom of the chat window
    			setTimeout(function () {
			        $('#chat-content #messageField').focus();
			        $('#chat-content').scrollTop($('#chat-content')[0].scrollHeight);
			    }, 100);
    		},function(error){
    			console.log(error);
    		});
    	}
    	
    	$scope.openChat = function(){
    		$scope.toggleChat = !$scope.toggleChat;
    		
    		var teamIds = $scope.$root.app.resources.teamUuids;
    		if(teamIds && $scope.toggleChat){
    			var teamId = teamIds[0];
    			$scope.renderMessage(teamId);
    			$scope.chatTeamId = teamId;
    			
    			// start auto check chat mesage
    			$scope.autoCheckMonitorId =  setInterval(function(teamId){
    				$scope.renderMessage(teamId);
    		    },5000);
    			
    		}else{
    			// stop auto check chat mesage
    			clearInterval($scope.autoCheckMonitorId);
    		}
    		
    		
    	}
    	
    	$scope.sendMessage = function(newMessage){
    		if(typeof newMessage == "undefined" || newMessage == ""){
    			$rootScope.notifier.error($rootScope.ui.message.emptyMessageBody);
    			return;
    		}
    		$rootScope.statusBar.display($rootScope.ui.message.sending);
    		
    		var current = new Date();
    		var message = {title: "From Web-Paige" + current.toString($rootScope.config.formats.date),
    				body: newMessage,
    				sendTime : current.getTime()};
    		console.log(message);
    		Messages.sendTeamMessage(message).then(function(result){
    			$scope.renderMessage($scope.chatTeamId);
    			$rootScope.statusBar.off();
    			$scope.newMessage = "";    			
    			
    		},function(error){
    			$rootScope.notifier.error(error);
    			$rootScope.statusBar.off();
    		});
    		
    	}
    	
    	/**
    	 * to do : auto refreshing the chat message 
    	 * get the latest chat record , and only get the chat message after it (compare by the time stamp)
    	 * then add new itmes to the $scope.messages
    	 * 
    	 * concurrent issue
    	 * There could be concurrent issue for real chat usage 
    	 * get the data a little bit earlier then the latest record 
    	 * and compare the id to see if the message it already be rendered.   
    	 */
    	
    	/**
    	 * only do the global refresh when open the chat tap
    	 */
    }
])
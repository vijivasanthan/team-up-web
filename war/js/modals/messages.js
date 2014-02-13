/*jslint node: true */
/*global angular */'use strict';

angular.module('WebPaige.Modals.Messages', ['ngResource'])

/**
 * Messages model
 */
.factory('Messages', ['$rootScope', '$config', '$resource', '$q', 'Storage', '$http',
function($rootScope, $config, $resource, $q, Storage, $http) {
	var Messages = $resource($config.host + $config.namespace + '/team/teamMessage/', {
	}, {
		query : {
			method : 'GET',
			params : {
				action : '',
				// 0: 'dm'
				0 : 'all',
				status : 'READ',
				limit : 50,
				offset : 0
			},
			isArray : true
		},
		get : {
			method : 'GET',
			params : {}
		},
		send : {
			method : 'POST',			
		},
		save : {
			method : 'POST',
			params : {}
		},
		changeState : {
			method : 'POST',
			params : {
				action : 'changeState'
			}
		},
		remove : {
			method : 'POST',
			params : {
				action : 'deleteQuestions'
			}
		}
	});

	

	var TeamMessage = $resource($config.host + $config.namespace + '/team/teamMessage/:teamId', {}, {
		query : {
			method : 'GET',
			params : {},
			isArray : true
		},
	});

	Messages.prototype.queryTeamMessage = function(tId){
		var deferred = $q.defer();
		
		TeamMessage.query({
			teamId: tId
		},function(result){
			deferred.resolve(result);
		},function(error){
			deferred.resolve({
				error : error
			});
		});
		
		return deferred.promise;
	};

	Messages.prototype.sendTeamMessage = function(messageObj){
		var deferred = $q.defer();
		
		Messages.send(messageObj,function(result){
			deferred.resolve(result);
		},function(error){
			deferred.resolve({
				error : error
			});
		});
		
		return deferred.promise;
	};
	
	return new Messages;
}]); 
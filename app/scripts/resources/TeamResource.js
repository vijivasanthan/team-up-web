define(['services/services', 'config'], 
	function (services, config) {
		'use strict';
		services.factory('TeamResource', 
			[ '$rootScope', '$resource', '$q', '$filter', 
				function ($rootScope, $resource, $q, $filter) {
				   var hostUrl = config.app.host + config.app.namespace;
                   $rootScope.teamResourceActions = {
                       "create": {
                           "url": hostUrl + "/team",
                           "method": "POST"
                       },
                       "getTasks": {
                           "url": hostUrl + "/team/:teamUuid/tasks",
                           "method": "GET"
                       },
                       "action0": {
                           "url": hostUrl + "/team/tasks",
                           "method": "GET"
                       },
                       "action1": {
                           "url": hostUrl + "/team/tasks",
                           "method": "DELETE"
                       },
                       "action2": {
                           "url": hostUrl + "/team/:teamUuid/member/:memberUuid",
                           "method": "PUT"
                       },
                       "get": {
                           "url": hostUrl + "/team/:teamUuid",
                           "method": "GET"
                       },
                       "action3": {
                           "url": hostUrl + "/team/status/:teamUuid",
                           "method": "GET"
                       },
                       "action4": {
                           "url": hostUrl + "/team/callTeam/:memberUuid",
                           "method": "POST"
                       },
                       "action5": {
                           "url": hostUrl + "/team/:teamUuid/phone/:phone",
                           "method": "POST"
                       },
                       "getPhone": {
                           "url": hostUrl + "/team/:teamUuid/phone",
                           "method": "GET"
                       },
                       "saveMember": {
                           "url": hostUrl + "/team/:teamUuid/member",
                           "method": "POST"
                       },
                       "removeMember": {
                           "url": hostUrl + "/team/:teamUuid/removeMember",
                           "method": "PUT"
                       },
                       "unAssignClientGroups": {
                           "url": hostUrl + "/team/:teamUuid/unAssignClientGroups",
                           "method": "PUT"
                       },
                       "getClientGroups": {
                           "url": hostUrl + "/team/:teamUuid/clientGroups",
                           "method": "GET"
                       },
                       "saveClientGroups": {
                           "url": hostUrl + "/team/:teamUuid/clientGroups",
                           "method": "POST"
                       },
                       "updateClientGroups": {
                           "url": hostUrl + "/team/:teamUuid/updateClientGroups",
                           "method": "PUT"
                       },
                       "updateMembers": {
                           "url": hostUrl + "/team/:teamUuid/updateMembers",
                           "method": "PUT"
                       },
                       "action6": {
                           "url": hostUrl + "/team/teams",
                           "method": "GET"
                       },
                       "save": {
                           "url": hostUrl + "/team/:teamUuid",
                           "method": "PUT"
                       },
                       "delete": {
                           "url": hostUrl + "/team/:teamUuid",
                           "method": "DELETE"
                       },
                       "action7": {
                           "url": hostUrl + "/team",
                           "method": "GET"
                       },
                       "action8": {
                           "url": hostUrl + "/team/members",
                           "method": "GET"
                       }
                   };
                    var TeamResource = $resource(hostUrl + "/team/:teamUuid", {}, $rootScope.teamResourceActions
                    //"member": { method:"GET", url:hostUrl + "/team/member", },
					);
					return TeamResource;
				}
			]
		);
	}
);

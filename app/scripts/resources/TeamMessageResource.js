define(['services/services', 'config'], 
          function (services, config) {
          'use strict';
          services.factory('TeamMessageResource', 
               [ '$rootScope', '$resource', '$q', '$filter', '$http',
                    function ($rootScope, $resource, $q, $filter, $http) {
                         var hostUrl = config.app.host + config.app.namespace;
					$rootScope.teamMessageResourceActions = {
					 "create": {
						 "url": hostUrl + "/team/teamMessage",
						 "method": "POST"
					 },
					 "saveTeamMessage": {
						 "url": hostUrl + "/team/teamMessage/:teamUuid",
						 "method": "POST"
					 },
					 "getTeamMessage": {
						 "url": hostUrl + "/team/teamMessage/:teamUuid",
						 "method": "GET"
					 },
					 "query": {
						 "url": hostUrl + "/team/teamMessage",
						 "method": "GET"
					 }
					};
					var TeamMessageResource = $resource(hostUrl + "/team/teamMessage/:teamUuid", {}, $rootScope.teamMessageResourceActions);
					return TeamMessageResource;
                    }
               ]
               );
          }
      );

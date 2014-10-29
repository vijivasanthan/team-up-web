define(['services/services', 'config'], 
	function (services, config) {
		'use strict';
		services.factory('TaskResource', 
			[ '$rootScope', '$resource', '$q', '$filter', 
				function ($rootScope, $resource, $q, $filter) {
				   var hostUrl = config.app.host + config.app.namespace;
                    $rootScope.taskResourceActions = {
                        "getByTeam": {
                            "url": hostUrl + "/tasks/team/:teamUuid",
                            "method": "GET",
							firstParameter:"teamUuid",
							isArray:true
                        },
                        "mine": {
                            "url": hostUrl + "/tasks/mine",
                            "method": "GET",
                            isArray:true
                        },
                        "get": {
                            "url": hostUrl + "/tasks/:taskUuid",
                            "method": "GET",
							documentation:"Not broken on the backend. ;-)",
							firstParameter:"taskUuid"
                        },
                        "getField": {
                            "url": hostUrl + "/tasks/:taskUuid/:fieldName",
                            "method": "GET"
                        },
                        "save": {
                            "url": hostUrl + "/tasks/:taskUuid",
                            "method": "PUT",
							isSave:true
                        },
                        "saveField": {
                            "url": hostUrl + "/tasks/:taskUuid/:fieldName",
                            "method": "PUT"
                        },
                        "delete": {
                            "url": hostUrl + "/tasks/:taskUuid",
                            "method": "DELETE"
                        },
                        "action2": {
                            "url": hostUrl + "/tasks/team/:teamUuid/:memberUuid",
                            "method": "GET"
                        },
                        "create": {
                            "url": hostUrl + "/tasks",
                            "method": "POST"
                        }
                    };
					var TaskResource = $resource(hostUrl + "/tasks/:taskUuid", {}, $rootScope.taskResourceActions );
					return TaskResource;
				}
			]
		);
	}
);

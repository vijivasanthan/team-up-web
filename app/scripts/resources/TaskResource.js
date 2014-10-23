define(['services/services', 'config'], 
	function (services, config) {
		'use strict';
		services.factory('TaskResource', 
			[ '$rootScope', '$resource', '$q', '$filter', 
				function ($rootScope, $resource, $q, $filter) {
				   var hostUrl = config.app.host + config.app.namespace;
                    $rootScope.taskResourceActions = {
                        "action0": {
                            "url": hostUrl + "/tasks/team/:teamUuid",
                            "method": "GET"
                        },
                        "action1": {
                            "url": hostUrl + "/tasks/mine",
                            "method": "GET",
                            isArray:true,
                        },
                        "get": {
                            "url": hostUrl + "/tasks/:taskUuid",
                            "method": "GET"
                        },
                        "getField": {
                            "url": hostUrl + "/tasks/:taskUuid/:fieldName",
                            "method": "GET"
                        },
                        "save": {
                            "url": hostUrl + "/tasks/:taskUuid",
                            "method": "PUT"
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

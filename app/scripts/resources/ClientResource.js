define(['services/services', 'config'],
	function (services, config) {
		'use strict';
		services.factory('ClientResource',
			[ '$rootScope', '$resource', '$q', '$filter',
				function ($rootScope, $resource, $q, $filter) {
				   var hostUrl = config.app.host + config.app.namespace;
					var ClientResource = $resource(hostUrl + "client/:clientUuid/team/:teamUuid");
					return ClientResource;
				}
			]
		);
	}
);

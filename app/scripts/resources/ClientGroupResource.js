define(['services/services', 'config'],
          function (services, config) {
          'use strict';
          services.factory('ClientGroupResource',
               [ '$rootScope', '$resource', '$q', '$filter', '$http',
                    function ($rootScope, $resource, $q, $filter, $http) {
                         var hostUrl = config.app.host + config.app.namespace;
                        $rootScope.clientGroupResourceActions = {
                            "getTeams": {
                                "url": hostUrl + "clientGroup/:clientGroupUuid/teams",
                                "method": "GET"
                            },
                            "get": {
                                "url": hostUrl + "clientGroup/:clientGroupUuid",
                                "method": "GET"
                            },
                            "getReports": {
                                "url": hostUrl + "clientGroup/:clientGroupUuid/reports",
                                "method": "GET"
                            },
                            "getTasks": {
                                "url": hostUrl + "clientGroup/:clientGroupUuid/tasks",
                                "method": "GET"
                            },
                            "delete": {
                                "url": hostUrl + "clientGroup/:clientGroupUuid",
                                "method": "DELETE"
                            },
                            "create": {
                                "url": hostUrl + "clientGroup",
                                "method": "POST"
                            }
                        };
                        var ClientGroupResource = $resource(hostUrl + "clientGroup/:clientGroupUuid", {}, $rootScope.clientGroupResourceActions);
                        return ClientGroupResource;
                    }
               ]
               );
          }
      );

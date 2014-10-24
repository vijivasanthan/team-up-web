define(['controllers/controllers'], function(controllers) {
    'use strict';
    controllers.controller('adminCtrl', [
        '$rootScope',
        '$scope',
        '$q',
        '$location',
        '$route',
        '$routeParams',
        '$filter',
        '$modal',
        '$timeout',
        'ClientResource',
        'TeamResource',
        'TaskResource',
        'ClientGroupResource',
        'TeamMessageResource',

        function($rootScope, $scope, $q, $location, $route, $routeParams, $filter, $modal, $timeout, ClientResource, TeamResource, TaskResource, ClientGroupResource, TeamMessageResource) {

			$scope.resourceTypes = [
                //{ "label": "/avatar", "value": 'avatar', actions:["query"],},
                //{ "label": "/client", "value": 'client', actions:["query"], },
                {
                    label: "/client",
                    value: 'clients',
                    resource:ClientResource,
                    actions:[ { func:"query", isArray:true }, ],
                },
            ];

            function addActionsToOption(actions, option) {
                Object.keys(actions).forEach(function(key) {
                    var action = actions[key];
                    option.actions.push({func:key, method:action.method });
                });

                $scope.resourceTypes.push(option);
            }

            var clientGroupOption = {
                label: "/clientGroup",
                value: 'clientGroup',
                resource: ClientGroupResource,
                actions: [ ],
            };
            addActionsToOption($rootScope.clientGroupResourceActions, clientGroupOption);

            var taskOption = {
                label: "/tasks",
                value: 'tasks',
                resource:TaskResource,
                actions:[ ],
            };
            addActionsToOption($rootScope.taskResourceActions, taskOption);


            var teamMessageOption = {
                label: "/teamMessage",
                value: 'teamMessage',
                resource:TeamMessageResource,
                actions:[ ],
            };
            addActionsToOption($rootScope.teamMessageResourceActions, teamMessageOption);

            var teamOption = {
                label: "/team",
                value: 'team',
                resource:TeamResource,
                actions:[ ]
            };
            addActionsToOption($rootScope.teamResourceActions, teamOption);

            $scope.resourceType = $scope.resourceTypes[$scope.resourceTypes.length - 1];

            $scope.changedResourceType = function() {
                $scope.resourceType.action = $scope.resourceType.actions[0];
                $scope.changedAction();
            };

            $scope.changedAction = function() {
                var action = $scope.resourceType.action;
				$scope.parameter1 = null;
				$scope.resources = null;

                if(action.method == "GET") {
                    var fn = $scope.resourceType.resource[action.func];
                    //$scope.resources = $scope.resourceType.resource.query();
                    fn({}, function (data) {
                        if (typeof data.unshift === "function") {
                            $scope.resources = data;
                            $scope.uuidDestinationType = action.uuidDestinationType;
                            $scope.resource = null;
                        }
                        else {
                            $scope.resources = null;
                            $scope.uuidDestinationType = action.uuidDestinationType;
                            $scope.resource = data;
                        }
                    });
                }
            };

			$scope.showSingleResource = function(resource)
			{
				$scope.resource = resource;
				$scope.parameter1 = resource.uuid;
			}

			$scope.updateResource = function(resource)
			{
				$scope.resource = angular.copy(resource);
				resource.$save({taskUuid: resource.uuid}, successResult, errorResult);
				$scope.parameter1 = null;
			}

			function successResult(success)
			{
				$rootScope.notifier.success('succesresultaat ' + success.result);
				console.log('success-> ', success);
				console.log('resources ', $scope.resources);
			}

			function errorResult(error)
			{
				$rootScope.notifier.error('foutresultaat ' + error.result);
				console.log('error-> ', error);
			}

            $scope.changedResourceType();
        }
    ]);
});

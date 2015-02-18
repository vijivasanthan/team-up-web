define(['controllers/controllers'], function (controllers)
{
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

    function ($rootScope, $scope, $q, $location, $route, $routeParams, $filter, $modal, $timeout, ClientResource, TeamResource, TaskResource, ClientGroupResource, TeamMessageResource)
    {
      $scope.resourceTypes = [
        //{ "label": "/avatar", "value": 'avatar', actions:["query"],},
        //{ "label": "/client", "value": 'client', actions:["query"], },
        {
          label: "/client",
          value: 'clients',
          resource: ClientResource,
          actions: [{func: "query", isArray: true}]
        }
      ];

      function addActionsToOption(actions, option)
      {
        Object.keys(actions).forEach(function (key)
        {
          var action = actions[key];
          action.func = key;
          option.actions.push(action);
        });

        $scope.resourceTypes.push(option);
      }

      var clientGroupOption = {
        label: "/clientGroup",
        value: 'clientGroup',
        resource: ClientGroupResource,
        actions: [],
      };
      addActionsToOption($rootScope.clientGroupResourceActions, clientGroupOption);

      var taskOption = {
        label: "/tasks",
        value: 'tasks',
        resource: TaskResource,
        actions: []
      };
      addActionsToOption($rootScope.taskResourceActions, taskOption);


      var teamMessageOption = {
        label: "/teamMessage",
        value: 'teamMessage',
        resource: TeamMessageResource,
        actions: [],
      };
      addActionsToOption($rootScope.teamMessageResourceActions, teamMessageOption);

      var teamOption = {
        label: "/team",
        value: 'team',
        resource: TeamResource,
        actions: []
      };
      addActionsToOption($rootScope.teamResourceActions, teamOption);

      $scope.resourceType = $scope.resourceTypes[$scope.resourceTypes.length - 1];

      $scope.changedResourceType = function ()
      {
        $scope.resourceType.action = $scope.resourceType.actions[0];
        $scope.changedAction();
      };

      $scope.changedAction = function ()
      {
        $scope.parameter1 = null;
        $scope.resources = null;
        $scope.changedParameter();
      };

      $scope.changedParameter = function ()
      {
        fireBackendCall();
      };

      function fireBackendCall()
      {
        var action = $scope.resourceType.action;
        if (action.method == "GET")
        {
          var backendFunctionCall = $scope.resourceType.resource[action.func];
          var backendCallUrlParameters = {};
          if (action.firstParameter)
          {
            backendCallUrlParameters[action.firstParameter] = $scope.parameter1;
          }
          //$scope.resources = $scope.resourceType.resource.query();
          backendFunctionCall(backendCallUrlParameters, function (data)
          {

            console.log($scope.resourceType.resource);
            console.log($scope.resourceType.action);
            console.log(backendCallUrlParameters);
            if (typeof data.unshift === "function")
            {
              console.log(data);
              $scope.resources = data;
              $scope.uuidDestinationType = action.uuidDestinationType;
              $scope.resource = null;
            }
            else
            {
              $scope.resources = null;
              $scope.uuidDestinationType = action.uuidDestinationType;
              $scope.resource = data;
            }
          });
        }
      };

      $scope.showSingleResource = function (resource)
      {
        $scope.resource = resource;
        $scope.parameter1 = resource.uuid;
      }

      $scope.updateResource = function (resource)
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

      var scenarioData = {
        team: 'team_123',
        clientGroup: '',
        member: {
          username: 'member_username_123',
          firstName: 'member_firstName_123',
          lastName: 'member_lastName_123',
          phone: '1234567890',
          role: 'coordinator',
          birthDate: 545097600,
          function: 'doctor'
        }
      };

      $scope.createTeam = function ()
      {
        var teamName = {name: scenarioData.team},
          deffered = $q.defer();

        teamOption.resource.create({name: scenarioData.team}, function (result)
        {
          deffered.resolve(result);
        });

        return deffered.promise;
      }

      $scope.unassign = function ()
      {
        var currentTeam;

        $scope.createTeam()
          .then(
          function (team)
          {
            console.log('team ', team);
            $scope.getTeam(team.uuid);
            //$scope.deleteTeam(team.uuid);
          }
        );
      };

      $scope.getTeam = function (teamId)
      {
        var deffered = $q.defer();

        teamOption.resource.get({teamId: teamId})
          .then(
          function (team)
          {
            console.log('get Team ', team);
            deffered.resolve(team);
          }
        );

        return deffered.promise;
      };

      $scope.deleteTeam = function (teamId)
      {
        //http://test.ask-cs.com/teamup-test/team/83a6b6d0-0024-4c3a-9d9d-c6ad959
        teamOption.resource.delete({teamId: teamId});
      };

      //$scope.unassign();

      $scope.addMember = function ()
      {
        //				uuid: member.username,
        //					userName: member.username,
        //				passwordHash: MD5.parse(member.password),
        //				firstName: member.firstName,
        //				lastName: member.lastName,
        //				phone: member.phone,
        //				teamUuids: [member.team],
        //				role: member.role,
        //				birthDate: Dater.convert.absolute(member.birthDate, 0),
        //				function: member.function

      }

      $scope.createClient = function ()
      {

      }

      $scope.deleteScenarioData = function ()
      {
        //deleteClient

      }
    }
  ]);
});

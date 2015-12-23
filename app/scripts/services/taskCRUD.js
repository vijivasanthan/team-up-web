define(['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory('TaskCRUD',
      function ($rootScope,
                $location,
                $timeout,
                $filter,
                Store,
                TeamUp,
                Task,
                Clients,
                Profile,
                $q)
      {
        //constructor
        var taskCRUD = function ()
        {
        };

        //public methods
        (function ()
        {
          this.create = create;
          this.read = read;
          this.update = update;
          this.delete = _delete;
          this.teamClientLink = teamClientLink;
          this.chains = chains;
          this.queryMine = queryMine;
          this.queryByTeam = queryByTeam;
          this.getDetails = getDetails;
          this.confirmDeleteTaskMessage = confirmDeleteTaskMessage;
          this.assign = assign;
          this.unassign = unassign;

          /**
           * Create a task
           * @param task The newly created task
           * @returns {*}
           */
          function create(task)
          {
            return Task.create(task);
          }

          /**
           * Get task by id
           * @param taskId
           * @returns {*}
           */
          function read(taskId)
          {
            return Task.get(taskId);
          }

          /**
           * Update a task
           * @param The editable task
           * @returns {*} promise after updating the task
           */
          function update(task)
          {
            return Task.update(
              task.uuid,
              strip(_.clone(task))
            );
          }

          /**
           * Delete the task by the given id
           * @param taskId The id of the task
           * @returns {*|{method, params}}
           * @private
           */
          function _delete(taskId)
          {
            return Task.delete(taskId);
          }

          function strip(task)
          {
            _.each(
              [
                'statusLabel',
                'relatedClient',
                'plannedTaskDuration',
                'assignedTeamMember'
              ],
              function (eliminated)
              {
                delete task[eliminated]
              }
            );
            return task;
          }

          /**
           * get related clientgroups for teamid
           * @param currentTeamId
           */
          function teamClientLink(currentTeamId)
          {
            return TeamUp._(
              'teamClientGroupQuery',
              {second: currentTeamId}
            );
          }


          /**
           * get extra data for task details
           * @param task
           * @returns {*}
           */
          function getDetails(task)
          {
            var deferred = $q.defer();
            var promises = [
              Profile.fetchUserData(task.authorUuid)
            ];
            var assignedTask = false;

            if(task.assignedTeamUuid && task.assignedTeamMemberUuid)
            {
              assignedTask = true;
              promises.push(
                TeamUp._('teamGet',
                  {
                    second: task.assignedTeamUuid
                  })
              );
            }
            if(task.relatedClient.clientGroupUuid)
            {
              promises.push(TeamUp._('clientGroupGet',
                  {second: task.relatedClient.clientGroupUuid})
              );
            }

            $q.all(promises)
              .then(function (data)
              {
                task.author = data[0].firstName + ' ' + data[0].lastName;
                if(assignedTask) task.assignedTeamFullName = data[1].name;
                task.relatedClient.clientGroupName = data[data.length - 1].name;

                $timeout(
                  function ()
                  {
                    angular.element('#taskModal').modal('show');
                  }
                );

                deferred.resolve(task);
              });
            return deferred.promise;
          }

          /**
           * process and initialise task data
           * @param tasks
           * @param tasksClients
           * @returns {*}
           */
          function processTasks(tasks, tasksClients)
          {
            _.each(
              tasks,
              function (task)
              {
                task.statusLabel = config.app.taskStates[task.status];

                task.relatedClient = tasksClients[task.relatedClientUuid];
                if (task.relatedClient == null)
                {
                  task.relatedClient = {firstName: "*", lastName: $rootScope.ui.teamup.notFound};
                }

                task.relatedClient.fullName = task.relatedClient.firstName + ' ' + task.relatedClient.lastName;

                if (task.relatedClient.address != null)
                {
                  task.relatedClient.fullAddress = task.relatedClient.address.street +
                    ' ' +
                    task.relatedClient.address.no +
                    ', ' +
                    task.relatedClient.address.city;
                }
                else
                {
                  task.relatedClient.address = {
                    'address': {
                      'street': null,
                      'no': null,
                      'zip': null,
                      'city': null,
                      'country': null,
                      'latitude': 0,
                      'longitude': 0
                    }
                  };
                }

                task.plannedTaskDuration = {
                  difference: task.plannedEndVisitTime - task.plannedStartVisitTime
                };

                task.plannedTaskDuration.label = (task.plannedTaskDuration.difference / 1000 / 60 / 60 <= 24) ?
                $filter('date')(task.plannedStartVisitTime, 'd MMM y') +
                ' ' +
                $filter('date')(task.plannedStartVisitTime, 'EEEE') +
                ' ' +
                $filter('date')(task.plannedStartVisitTime, 'HH:mm') +
                ' - ' +
                $filter('date')(task.plannedEndVisitTime, 'HH:mm') +
                ' uur' :
                $filter('date')(task.plannedStartVisitTime, 'd MMM y') +
                ' ' +
                $filter('date')(task.plannedStartVisitTime, 'EEEE') +
                ' ' +
                $filter('date')(task.plannedStartVisitTime, 'HH:mm') +
                ' uur - ' +
                $filter('date')(task.plannedEndVisitTime, 'd MMM y') +
                ' ' +
                $filter('date')(task.plannedEndVisitTime, 'EEEE') +
                ' ' +
                $filter('date')(task.plannedEndVisitTime, 'HH:mm') +
                ' uur';

                if (task.assignedTeamMemberUuid != '')
                {
                  task.assignedTeamMember = $rootScope.getTeamMemberById(task.assignedTeamMemberUuid);
                }
              }
            );

            return tasks;
          }

          function chains()
          {
            var data = {},
              teams = Store('app').get('teams'),
              clients = Store('app').get('clients'),
              clientGroups = Store('app').get('ClientGroups');

            var group;

            _.each(
              teams,
              function (team)
              {
                group = Store('app').get('teamGroup_' + team.uuid)[0];

                data[team.uuid] = {
                  team: team,
                  members: Store('app').get(team.uuid)
                };
              }
            );
          }

          /**
           * Query the tasks of the logged member
           * @param returns only the tasks with statuses being set
           * ACTIVE : 1
           * PLANNING : 2
           * FINISHED: 3
           * CANCELLED: 4
           * Default: 1,2
           * @returns {*}
           */
          function queryMine(statuses)
          {
              var deferred = $q.defer(),
                data = {};

              Task.mine(statuses)
                .then(function (tasks) {
                  data.tasks = tasks;
                  return findUniqueClientsByTasks(tasks);
                })
                .then(function (tasksClients) {
                  console.log(tasksClients);
                  tasksClients = _.indexBy(tasksClients, 'uuid');
                  data.tasks = processTasks(data.tasks, tasksClients);
                  deferred.resolve(data.tasks);
                });

              return deferred.promise;
          }

          /**
           * Query the tasks of a single team
           * @param teamId the id of the team
           * @param returns only the tasks with statuses being set
           * ACTIVE : 1
           * PLANNING : 2
           * FINISHED: 3
           * CANCELLED: 4
           * Default: 1,2
           * @returns {*}
           */
          function queryByTeam(teamId, statuses)
          {
            var deferred = $q.defer(),
              data = {};

            Task.team(teamId, statuses)
              .then(function(tasks)
              {

                data.tasks = tasks;
                return findUniqueClientsByTasks(tasks);
              })
              .then(function (tasksClients) {
                tasksClients = _.indexBy(tasksClients, 'uuid');
                data.tasks = processTasks(data.tasks, tasksClients);
                deferred.resolve(data.tasks);
              });

            return deferred.promise;
          }

          function confirmDeleteTaskMessage()
          {
            $timeout(
              function ()
              {
                angular.element('#confirmTaskModal').modal('show');
              }
            );

          }


          //assign a task to a member
          function assign(task)
          {
            trackGa('send', 'event', 'Task-assign', $rootScope.app.resources.uuid, task.uuid);
            task.assignedTeamMemberUuid = $rootScope.app.resources.uuid;
            $location.path("/task/mytasks");
          }

          //unassign a task to a member
          function unassign(task)
          {
            trackGa('send', 'event', 'Task-unassign', $rootScope.app.resources.uuid, task.uuid);
            task.assignedTeamMemberUuid = null;
            task.assignedTeamUuid = null;
            delete task.author;
          }

          /**
           * get unique client uuids for tasks
           * @param tasks
           * @returns {*}
           */
          function findUniqueClientsByTasks(tasks)
          {
            tasks = _.sortBy(tasks, 'plannedStartVisitTime');
            var clientUuids = _.pluck(tasks, 'relatedClientUuid');
            var uniqueClients = _.uniq(clientUuids);
            return getTasksClients(uniqueClients);
          }

          /**
           * get client data
           * @param clients
           * @returns {Promise}
           */
          function getTasksClients(clients)
          {
            var promises = [];
            _.each(clients, function (clientId)
            {
              var promise = Clients.getClient(clientId);
              promises.push(promise);
            });

            return $q.all(promises);
          }

        }).call(taskCRUD.prototype);

        return new taskCRUD();
      });
  });
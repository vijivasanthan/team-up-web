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
          this.queryAll = queryAll;

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

          function mergeOnStatus(tasks)
          {
            var merged = {on: [], off: []};
            if (tasks.length > 0)
            {
              var grouped = _.groupBy(tasks, function (task)
              {
                return task.status
              });

              if (grouped[1] != null)
              {
                merged.on = merged.on.concat(grouped[1]);
              }
              if (grouped[2] != null)
              {
                merged.on = merged.on.concat(grouped[2]);
              }

              if (grouped[3] != null)
              {
                merged.off = merged.off.concat(grouped[3]);
              }
              if (grouped[4] != null)
              {
                merged.off = merged.off.concat(grouped[4]);
              }
            }

            return merged;
          }

          function processTasks(tasks)
          {
            _.each(
              tasks,
              function (task)
              {
                task.statusLabel = config.app.taskStates[task.status];

                task.relatedClient = $rootScope.getClientByID(task.relatedClientUuid);
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
            return Task.mine(statuses)
              .then(function(tasks)
              {
                console.log('my tasks', tasks);
                tasks = normalize(tasks);
                Store('app').save('myTasks2', tasks);
                return tasks;
              });
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
            return Task.team(teamId, statuses)
              .then(function(tasks)
              {
                tasks = normalize(tasks);
                Store('app').save('myTasks2', tasks);
                return tasks;
              });
          }

          /**
           * sort the tasks by plannedStartVisitTime and ad the right client
           * and teammember to the task object
           * merge it afterwards on status
           * @param tasks The requested tasks
           * @returns {*}
           */
          function normalize(tasks)
          {
            tasks = _.sortBy(tasks, 'plannedStartVisitTime');
            processTasks(tasks);
            return mergeOnStatus(tasks);
          }

          function queryAll()
          {
            var deferred = $q.defer(),
              calls = [],
              bulks = {},
              self = this;

            _.each(
              Store('app').get('teams'),
              function (team)
              {
                calls.push(
                  Task.team(team.uuid)
                  .then(
                    function (allTasks)
                    {
                      bulks[team.uuid] = allTasks;
                    }
                  )
                );
              }
            );

            $q.all(calls)
              .then(
                function ()
                {
                  var basket = [];

                  /**
                   * All tasks
                   * @type {Array}
                   */
                  _.each(
                    bulks,
                    function (tasks)
                    {
                      if (tasks.length > 0)
                      {
                        _.each(
                          tasks,
                          function (task)
                          {
                            basket.push(task);
                          }
                        );
                      }
                    }
                  );

                  var tasks = _.map(
                    _.indexBy(basket, function (node)
                    {
                      return node.uuid
                    }),
                    function (task)
                    {
                      return task
                    }
                  );

                  processTasks(tasks);

                  var merged = mergeOnStatus(tasks);

                  Store('app').save('allTasks2', merged);

                  deferred.resolve(merged);
                }.bind(bulks)
              );

            return deferred.promise;
          }

        }).call(taskCRUD.prototype);

        return new taskCRUD();
      });
  });
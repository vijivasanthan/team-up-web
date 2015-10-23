define(
  ['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory(
      'Task',
      [
        '$rootScope',
        '$resource',
        '$q',
        '$filter',
        'Store',
        'TeamUp',
        '$injector',
        function ($rootScope, $resource, $q, $filter, Store, TeamUp, $injector)
        {
          var Task = $resource();


          var processTasks = function (tasks)
          {
            _.each(
              tasks,
              function (task)
              {
                task.statusLabel = config.app.taskStates[task.status];
                if($rootScope.app.domainPermission.clients) {
                  task.relatedClient = $rootScope.getClientByID(task.relatedClientUuid);

                  console.log('task.relatedClient', task.relatedClient);
                  if (task.relatedClient == null)
                  {
                    task.relatedClient = {firstName: "*", lastName: $rootScope.ui.teamup.notFound, writable: true};
                  }

                  task.relatedClient.fullName = task.relatedClient.firstName + ' ' + task.relatedClient.lastName;
                  if (task.relatedClient.address != null) {
                    task.relatedClient.fullAddress = task.relatedClient.address.street +
                      ' ' +
                      task.relatedClient.address.no +
                      ', ' +
                      task.relatedClient.address.city;
                  }
                  else {
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
          };


          var strip = function (task)
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
          };


          Task.prototype.queryMine = function ()
          {
            return TeamUp._('taskMineQuery')
              .then(
              function (tasks)
              {
                tasks = _.sortBy(tasks, 'plannedStartVisitTime');

                processTasks(tasks);

                var merged = mergeOnStatus(tasks);

                Store('app').save('myTasks2', merged);

                return merged;
              }.bind(this)
            );
          };


          Task.prototype.queryAll = function ()
          {
            var deferred = $q.defer(),
              calls = [],
              bulks = {};

            _.each(
              Store('app').get('teams'),
              function (team)
              {
                calls.push(
                  TeamUp._(
                    'taskByTeam',
                    {fourth: team.uuid} // statuses: '1, 2, 3, 4'
                  ).then(
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
                 * All tasks of a team
                 * @type {Array}
                 */
                //var teamTasks = bulks[$rootScope.app.resources.teamUuids[0]];
                //
                //if (teamTasks.length > 0)
                //{
                //  _.each(
                //    teamTasks,
                //    function (task)
                //    {
                //      basket.push(task);
                //    }
                //  );
                //}

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
          };

          /**
           * Get the tasks for a single team
           * @param teamId The id of the team
           * @returns {*} tasks promises
           */
          Task.prototype.queryByTeam = function (teamId)
          {
            return TeamUp._(
              'taskByTeam',
              {fourth: teamId}
            ).then(
              function (tasks)
              {
                return tasks;
              }.bind(this)
            );
          };

          /**
           * Get a single task by id
           * @param taskId
           * @returns {*} the questioned task
           */
          Task.prototype.byId = function (taskId)
          {
            return TeamUp._(
              'taskById',
              {second: taskId}
            ).then(
              function (task)
              {
                return task;
              }.bind(this)
            );
          };

          /**
           * Get the tasks of a week
           * @param teamId the id of the team
           * @param weekNumber the number of the week
           * @returns {*} tasks promises
           */
          Task.prototype.getWeek = function (teamId, weekNumber, year)
          {
            return this.queryByTeam(teamId)
              .then(
              function (tasks)
              {

                tasks = _.filter(tasks, function (task)
                {
                  var moment = $injector.get('moment'),
                      taskStartTime = moment(task.plannedStartVisitTime);

                  return (taskStartTime.week() == weekNumber && taskStartTime.get('year') == year);
                });

                return tasks;
              }.bind(this)
            );
          };

          /**
           * Get all tasks from a date range
           * @param range Date range
           * @returns {*} Promise of tasks
           */
          //TODO Leon is creating some backend calls for deleting tasks by client/clientgroup/team/member
          Task.prototype.byRange = function (range)
          {
            return TeamUp._(
              'taskQuery',
              {fourth: teamId}
            ).then(
              function (tasks)
              {
                return tasks;
              }.bind(this)
            );
          };

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

          /**
           * Update a task
           * @param The editable task
           * @returns {*} promise after updating the task
           */
          Task.prototype.update = function (task)
          {
            return TeamUp._(
              'taskUpdate',
              {second: task.uuid},
              strip(_.clone(task))
            );
          };




          Task.prototype.chains = function ()
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

                // console.log('group ->', group);

                data[team.uuid] = {
                  team: team,
                  members: Store('app').get(team.uuid)
                };

                // if (_.isDe)
              }
            );

            // console.log('data ->', data);

          };

          /**
           * Query the tasks for login user and all other unsigned task in login user's team
           * and save it locally
           * @param teams
           */
          Task.prototype.getAllByTeamLoggedUser = function(teams)
          {
            // query my tasks
            TeamUp._("taskMineQuery").then(
              function (result)
              {
                Store('app').save('myTasks', result)
              }
            );

            // query unassigned tasks from each team
            var allTasks = [];

            angular.forEach(
              teams,
              function (team_obj)
              {
                TeamUp._(
                  "taskByTeam",
                  {fourth: team_obj.uuid}
                ).then(
                  function (result)
                  {
                    angular.forEach(
                      result,
                      function (taskObj)
                      {
                        var foundTask = $filter('getByUuid')(allTasks, taskObj.uuid);

                        if (foundTask == null)
                        {
                          allTasks.push(taskObj);
                        }
                      }
                    );
                    Store('app').save('allTasks', allTasks);
                  }
                );
              }
            );
          };

          Task.prototype.enhance = function ()
          {
            var taskGroups = ['myTasks', 'allTasks'];

            angular.forEach(
              taskGroups,
              function (label)
              {
                var group = Store('app').get(label);

                angular.forEach(
                  group,
                  function (task)
                  {
                    if (typeof(task) === 'object') {
                        var client = $rootScope.getClientByID(task.relatedClientUuid);

                        if (client != null) {
                          task.relatedClientName = client.firstName + ' ' + client.lastName;
                        }
                    }
                  }
                );

                Store('app').save(label, group);
              }
            );
          };

          return new Task;
        }
      ]
    );
  }
);

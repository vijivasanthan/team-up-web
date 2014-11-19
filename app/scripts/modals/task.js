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
        function ($rootScope, $resource, $q, $filter, Store, TeamUp)
        {
          var Task = $resource();


          var processTasks = function (tasks)
          {
            _.each(
              tasks,
              function (task)
              {
                task.statusLabel = config.app.taskStates[task.status];

                task.relatedClient = $rootScope.getClientByID(task.relatedClientUuid);
                if (task.relatedClient == null)
                {
                  task.relatedClient = {firstName: "*", lastName: "Niet gevonden"};
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
                    function (tasks)
                    {
                      bulks[team.uuid] = tasks;
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
                var teamTasks = bulks[$rootScope.app.resources.teamUuids[0]];

                if (teamTasks.length > 0)
                {
                  _.each(
                    teamTasks,
                    function (task)
                    {
                      basket.push(task);
                    }
                  );
                }

                /**
                 * All tasks
                 * @type {Array}
                 */
                //_.each(
                //  bulks,
                //  function (tasks)
                //  {
                //    if (tasks.length > 0)
                //    {
                //      _.each(
                //        tasks,
                //        function (task)
                //        {
                //          basket.push(task);
                //        }
                //      );
                //    }
                //  }
                //);

                var tasks = _.map(
                  _.indexBy(basket, function (node)
                  {
                    console.log('tasks', node);
                    return node.uuid
                  }),
                  function (task)
                  {
                    //console.log('tasks', task);
                    return task
                  }
                );

                console.log('tasks', tasks);

                tasks = _.sortBy(tasks, 'plannedStartVisitTime');

                processTasks(tasks);

                var merged = mergeOnStatus(tasks);
                console.log('merged', merged);
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
                  var taskStartTime = moment(task.plannedStartVisitTime);
                  return (taskStartTime.week() == weekNumber && taskStartTime.get('year') == year);
                });

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


          return new Task;
        }
      ]
    );
  }
);

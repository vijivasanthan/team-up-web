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
                task.status = {
                  id: task.status,
                  label: config.app.taskStates[task.status]
                };

                task.relatedClient = $rootScope.getClientByID(task.relatedClientUuid);

                task.relatedClient.fullName = task.relatedClient.firstName +
                                              ' ' +
                                              task.relatedClient.lastName;

                task.relatedClient.fullAddress = task.relatedClient.address.street +
                                                 ' ' +
                                                 task.relatedClient.address.no +
                                                 ', ' +
                                                 task.relatedClient.address.city;

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

          Task.prototype.queryMine = function ()
          {
            return TeamUp._('taskMineQuery')
              .then(
              function (tasks)
              {
                processTasks(tasks);

                Store('app').save('myTasks2', tasks);

                return tasks;
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
                    { fourth: team.uuid }
                  ).then(
                    function (tasks) { bulks[team.uuid] = tasks }
                  )
                );
              }
            );

            $q.all(calls)
              .then(
              function ()
              {
                var basket = [];

                _.each(
                  bulks,
                  function (tasks)
                  {
                    if (tasks.length > 0)
                    {
                      _.each(
                        tasks,
                        function (task) { basket.push(task) }
                      );
                    }
                  }
                );

                var tasks = _.map(
                  _.indexBy(basket, function (node) { return node.uuid }),
                  function (task) { return task }
                );

                processTasks(tasks);

                var grouped = _.groupBy(tasks, function (task) { return task.status.id }),
                    merged = {
                      on: grouped[1].concat(grouped[2]),
                      off: grouped[3].concat(grouped[4])
                    };

                Store('app').save('allTasks2', merged);

                deferred.resolve(merged);
              }.bind(bulks)
            );

            return deferred.promise;
          };

          return new Task;
        }
      ]
    );
  }
);
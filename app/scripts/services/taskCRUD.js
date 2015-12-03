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
                $q)
      {
        //constructor
        var taskCRUD = function ()
        {
        };

        //public methods
        (function ()
        {

          /**
           * Update a task
           * @param The editable task
           * @returns {*} promise after updating the task
           */
          this.update = function (task)
          {
            var self = this;
            return TeamUp._(
              'taskUpdate',
              {second: task.uuid},
              self.strip(_.clone(task))
            );
          };

          this.strip = function(task)
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

          /**
           * get related clientgroups for teamid
           * @param currentTeamId
           */
          this.teamClientLink = function (currentTeamId)
          {
            return TeamUp._(
              'teamClientGroupQuery',
              {second: currentTeamId}
            );
          };

          /**
           * get task data for taskid
           * @param taskId
           */
          this.taskData = function (taskId)
          {
            return TeamUp._(
              'taskById',
              {second: taskId}
            );
          }

          this.chains = function ()
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
              }
            );
          };

          this.queryMine = function ()
          {
            var self = this;
            return TeamUp._('taskMineQuery')
              .then(
                function (tasks)
                {
                  tasks = _.sortBy(tasks, 'plannedStartVisitTime');

                  self.processTasks(tasks);

                  var merged = self.mergeOnStatus(tasks);

                  Store('app').save('myTasks2', merged);

                  return merged;
                }.bind(this)
              );
          };

          this.queryAll = function ()
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

                  self.processTasks(tasks);

                  var merged = self.mergeOnStatus(tasks);

                  Store('app').save('allTasks2', merged);

                  deferred.resolve(merged);
                }.bind(bulks)
              );

            this.processTasks = function(tasks)
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
            };

            this.mergeOnStatus = function(tasks)
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
            };



            return deferred.promise;
          };

        }).call(taskCRUD.prototype);

        return new taskCRUD();
      });
  });
define(
  ['services/services', 'config'],
  function(services, config)
  {
    'use strict';

    services.factory(
      'Task',
      function($rootScope, $resource, $q, Settings)
      {
        var Task = $resource(
          Settings.getBackEnd() + config.app.namespace + 'tasks/:id/:teamId', {},
          {
            create: {method: 'POST', params: {}},
            read: {
              method: 'GET',
              params: {},
              transformResponse: function(data)
              {
                data = angular.fromJson(data);
                //TODO remove this if it's fixed in the backend
                //check if is no tasks is responded in a object
                return (data &&
                        data.result &&
                        data.result === "No tasks")
                  ? []//create empty array as response
                  : data;
              },
              isArray: true
            },
            update: {method: 'PUT', params: {}},
            delete: {method: 'DELETE', params: {}}
          });

        (function()
        {
          this.create = create;
          this.read   = read;
          this.update = update;
          this.delete = _delete;

            this.mine = mine;
            this.range = range;
            this.team = team;
            this.get = _get;

            /**
             * Create a task
             * @param task The newly created task
             * @returns {*}
             */
            function create(task)
            {
              return Task.create(
                null, task
              ).$promise;
            }

            /**
             * Read specific task(s)
             * @param params
             * @returns {*}
             */
            function read(params)
            {
              return $q(function (resolve)
              {
                Task.read(params,
                function (result)
                {
                  result = JSON.parse(angular.toJson(result));
                  resolve(result);
                })
              });
            }

            /**
             * Update a specific task
             * @param params
             * @returns {*}
             */
            function update(taskId, taskData)
            {
              return Task.update(
                {id: taskId},
                taskData
              ).$promise;
            }

            /**
             * Update a specific task
             * @param params
             * @returns {*}
             */
            function _delete(taskId)
            {
              return Task.delete({
                id: taskId
              }).$promise;
            }

            /**
             * Get all tasks of the logged user
             * @returns {*}
             */
            function mine(statuses)
            {
              return read({
                id: 'mine',
                "statuses": statuses || '1,2'
              });
            }

            /**
             * Get tasks by range
             * @param range object with key value
             * start and end
             * @returns {*}
             */
            function range(range)
            {
              return read({
                start: range.start,
                end: range.end
              });
            }

            /**
             * Get tasks by team
             * @param teamId The id of the team
             * @returns {*}
             */
            function team(teamId, statuses)
            {
              return read({
                "id": 'team',
                "teamId": teamId,
                "statuses": statuses || '1,2'
              });
            }

            /**
             * Get task by id
             * @param taskId The id of the task
             * @returns {*}
             */
            function _get(taskId)
            {
              return Task.get({
                id: taskId
              }).$promise;
            }

          }).call(Task.prototype);

          return new Task;
        }
    );
  }
);

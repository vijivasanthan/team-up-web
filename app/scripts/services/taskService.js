define(['services/services', 'config'],
  function (services, config) {
    'use strict';

    services.factory('TaskService',
      function ($rootScope,
                $location,
                $timeout,
                $filter,
                Store,
                TeamUp
      ) {
        // constructor \\
        var taskService = function () {
        };

        // public methods \\
        (function () {

          this.teamClientLink = function(currentTeamId, clientGroups)
          {
            return TeamUp._(
              'teamClientGroupQuery',
              {second: currentTeamId}
            );
          }

          this.taskData = function(taskId)
          {
            return TeamUp._(
              'taskById',
              {second: taskId}
            );
          }
        }).call(taskService.prototype);

        return new taskService();
      });
  })
;
define(['services/services', 'config'],
  function (services, config) {
    'use strict';

    services.factory('TaskCRUD',
      function ($rootScope,
                $location,
                $timeout,
                $filter,
                Store,
                TeamUp
      ) {
        //constructor
        var taskCRUD = function () {
        };

        //public methods
        (function () {

          /**
           * get related clientgroups for teamid
           * @param currentTeamId
           */
          this.teamClientLink = function(currentTeamId)
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
          this.taskData = function(taskId)
          {
            return TeamUp._(
              'taskById',
              {second: taskId}
            );
          }

        }).call(taskCRUD.prototype);

        return new taskCRUD();
      });
  })
;
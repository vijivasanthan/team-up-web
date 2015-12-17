define(
  ['../controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'taskDetail',
      function ($q, $timeout, TeamUp, Profile) {
        var self = this;

        self.getDetail = getDetail;
        self.currentTask = null;

        function getDetail(task)
        {
          _getTaskDetails(task)
            .then(function (taskData)
            {
              self.currentTask = taskData;
              console.log('self.currentTask', self.currentTask);
              $timeout(
                function ()
                {
                  angular.element('#taskModal').modal('show');
                }
              );
            });
        }

        function _getTaskDetails(task)
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
              console.log(data);
              task.author = data[0].firstName + ' ' + data[0].lastName;
              if(assignedTask) task.assignedTeamFullName = data[1].name;
              task.relatedClient.clientGroupName = data[data.length - 1].name;
              deferred.resolve(task);
            });
          return deferred.promise;
        }
      }
    );
  }
);

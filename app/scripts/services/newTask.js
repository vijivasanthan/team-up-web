define(['services/services', 'config'],
  function (services, config) {
    'use strict';

    services.factory('NewTask',
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

          //
          //this.value = 123;
          //this.setSomething = function(valueb){
          //    this.value = valueb;
          //}
          //
          //this.gets = function () {
          //  return this.value;
          //}
          //
          //this.gets2 = function () {
          //  var deferred = $q.defer();
          //  var self = this;
          //  setTimeout(function() {
          //    deferred.resolve({
          //      value: self.value
          //    });
          //  }, 2000);
          //
          //  return deferred.promise;
          //}

        }).call(taskService.prototype);

        return new taskService();
      });
  })
;
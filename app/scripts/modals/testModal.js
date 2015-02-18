define(['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory
    (
      'TestModal',
      [
        '$rootScope',
        '$resource',
        '$q',
        //'Store',
        function (
          $rootScope,
          $resource,
          $q
          //Store
        )
        {
          //var TestModal = function()
          //{
          //  this.provider = 'tester';
          //};
          //$resource(config.app.host + 'team/member/:user', {user: ''}, {

          var TestModal = $resource(config.app.host + 'acl', {}, {
            get: {
              method: 'GET',
              interceptor: {
                response: function (response)
                {
                  return response;
                }
              }
            }
          });

          TestModal.prototype = {
            getUserId: function(userName)
            {
              var deferred = $q.defer();

              TestModal.get({user: userName},
                function(response) {
                  deferred.resolve(response.data);
                },
                function (error) {
                  deferred.reject({error: error});
                }
              );

              return deferred.promise;
            },
            getPermissionProfile: function()
            {
              var deferred = $q.defer();

              TestModal.get(
                function(response) {
                  deferred.resolve(response.data);
                },
                function (error) {
                  deferred.reject({error: error});
                }
              );

              return deferred.promise;
            }
          };

          return new TestModal;
        }
      ]
    )
  }
);


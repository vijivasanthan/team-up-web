define(['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory
    (
      'Permission',
      [
        '$rootScope',
        '$resource',
        '$q',
        'Store',
        function ($rootScope, $resource, $q, Store)
        {
          var Permission = $resource(config.app.host + 'acl', {},
              {
                get: {
                  method: 'GET',
                  interceptor: {
                    response: function (response)
                    {
                      return response;
                    }
                  }
                },
                save: {
                  method: 'PUT',
                  params: {}
                }
              }
          ),//Only for test purposes
          profile = {
            teams: true,
            clients: true,
            tasks: true,
            clientReports: true,
            teamTelephone: true,
            chat: false
          };

          Permission.prototype.getProfile = function()
          {
            var deferred = $q.defer();

            Permission.get(
              function (response) {

                var profile = response.data;
                //create a access list
                angular.forEach(response.data, function(val, key) {
                  if(val == false)
                  {
                    delete profile[key];
                  }
                });

                Store('app').save('permissionProfile', profile);

                deferred.resolve(profile);
              },
              function (error) {
                deferred.resolve({error: error});
              });

            return deferred.promise;
          };

          //For testpurposes only
          Permission.prototype.saveProfile = function()
          {
            var deferred = $q.defer();

            Permission.save(profile,
              function (result) {
                deferred.resolve(result);
              },
              function (error) {
                deferred.resolve({error: error});
              });

            return deferred.promise;
          };

          //TODO not nessesary anymore
          Permission.prototype.checkPermission = function(accessNode)
          {
            var profile = Store('app').get('permissionProfile');

            _.filter(profile, function(valAccess, keyNode) {
              if(keyNode == accessNode)
              {
                return valAccess;
              }
            });
          };

          return new Permission;
        }
      ]
    )
  }
);


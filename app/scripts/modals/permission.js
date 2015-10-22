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
        '$location',
        'Settings',
        function ($rootScope, $resource, $q, Store, $location, Settings)
        {
          var Permission = function() {},
            profile = {
              teams: true,
              clients: true,
              tasks: true,
              clientReports: true,
              teamTelephoneBasic: true,
              chat: false
            };

          Permission.prototype.getResource = function ()
          {
            return $resource(Settings.getBackEnd() + 'acl', {},
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
            );
          }

          Permission.prototype.getDefaultProfile = function ()
          {
            var deferred = $q.defer(),
                permissionService = Permission.prototype.getResource();

            permissionService.get(
              function (response)
              {
                deferred.resolve(response.data);
              },
              function (error)
              {
                deferred.resolve({error: error});
              });

            return deferred.promise;
          };

          //For testpurposes only
          Permission.prototype.saveDefaultProfile = function ()
          {
            var deferred = $q.defer(),
              permissionService = Permission.prototype.getResource();

            permissionService.save(profile,
              function (result)
              {
                deferred.resolve(result);
              },
              function (error)
              {
                deferred.resolve({error: error});
              });

            return deferred.promise;
          };

          //TODO not nessesary anymore
          Permission.prototype.checkPermission = function (accessNode)
          {
            var profile = Store('app').get('permissionProfile');

            _.filter(profile, function (valAccess, keyNode)
            {
              if (keyNode == accessNode)
              {
                return valAccess;
              }
            });
          };

          /**
           * Checks the where the user has access to
           */
          Permission.prototype.getAccess = function (callback)
          {
            this.getDefaultProfile()
              .then(
              function (permissionProfile)
              {
                var permission = permissionProfile,
                  accessList = {};

                if ($rootScope.app.resources.teamUuids.length)
                {
                  _.each(permissionProfile, function (val, key)
                  {
                    if (val == false)
                    {
                      delete permission[key];
                    }
                  });

                  accessList = permission;
                }
                else
                {
                  _.each(permissionProfile, function (val, key)
                  {
                    permission[key] = false;
                  });
                }

                Store('app').save('permissionProfile', permission);
                $rootScope.app.domainPermission = permission;

                (callback && callback(permission));

                permissionLocation(accessList);
              }
            );
          };

          /**
           * Redirect the user to location of the permission
           * @param permissionProfile
           */
          var permissionLocation = function (permissionProfile)
          {
            if (_.has(permissionProfile, 'tasks'))
            {
              $location.path('/tasks2').hash('myTasks');
            }
            else if (_.has(permissionProfile, 'teamTelephoneBasic'))
            {
              $location.path('/team-telefoon/status').hash('');
            }
            else
            {
              ($rootScope.app.resources.role > 1)
                ? $location.path('/profile/' + $rootScope.app.resources.uuid).search({local: 'true'}).hash('profile')
                : $location.path('/manage').search({}).hash('teams');

              $rootScope.infoUserWithoutTeam();
            }
          };

          Permission.prototype.getUnFiltered = function ()
          {
            return profile;
          };

          Permission.prototype.setUnfiltered = function (newProfile)
          {
            profile = newProfile;
          };

          return new Permission;
        }
      ]
    )
  }
);


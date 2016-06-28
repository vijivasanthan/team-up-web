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
          };

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

	        /**
           * Checks to which locations the user is authorized
           * @returns {*} list of locations
           */
          Permission.prototype.getAccess = function ()
          {
            return this.getDefaultProfile()
                       .then(function(permissionProfile)
                             {
                               var hasTeams      = $rootScope.app.resources.teamUuids.length;
                               permissionProfile = Object.keys(permissionProfile)
                                                         .map(function(name)
                                                              {
                                                                return {
                                                                  name: name,
                                                                  permission: permissionProfile[name]
                                                                };
                                                              })
                                                         .filter(function(setting)
                                                                 {
                                                                   return (!! setting.permission);
                                                                 })
                                                         .reduce(function(list, setting)
                                                                 {
                                                                   list[setting.name] = (hasTeams)
                                                                     ? setting.permission
                                                                     : false;
                                                                   return list;
                                                                 }, {});
                               Store('app').save('permissionProfile', permissionProfile);
                               $rootScope.app.domainPermission = permissionProfile;
                               return permissionProfile;
                             }
                       );
          };

          /**
           * Redirect the user to location of the permission
           * @param permissionProfile
           */
          Permission.prototype.location = function(permissionProfile)
          {
            if (_.has(permissionProfile, 'tasks'))
            {
              $location.path('/task/mytasks');
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


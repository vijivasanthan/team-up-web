define(['services/services', 'config'], function (services, config) {
  'use strict';

  services.factory('Profile', function ($rootScope, $resource, $q, Slots, MD5, Store) {
    var Profile = $resource(config.app.host + 'node/:id/:section', {}, {
      get: {
        method: 'GET',
        params: { id: '', section: 'resource' }
      },
      save: {
        method: 'PUT',
        params: { section: 'resource' }
      },
      remove: {
        method: 'DELETE',
        params: {},
        isArray: true
      },
      role: {
        method: 'PUT',
        params: { section: 'role' },
        isArray: true
      },
      membership: {
        method: 'PUT',
        params: { id: '', section: 'membership' },
        isArray: true
      }
    });

    var PincodeExists = $resource(config.app.host + 'node/:id/pincode_exists', {}, {
      check: {
        method: 'GET',
        params: {}
      }
    });

    //$resource(url, [paramDefaults], [actions], options);
    var ChangePassword = $resource(config.app.host + 'teammember/:memberId/pass',
      {
        oldPass: '@oldPass',
        newPass: '@newPass'
      },
      {
      update: {
        method: 'PUT',
      }
    });

    var user = $resource(config.app.host + 'team/:teamId/member/:userId',  {}, {
      get: {
        method: 'GET',
        params: {}
      },
      save: {
        method: 'PUT',
        params: {}
      }
    });

    Profile.prototype.fetchUserData = function (userId)
    {
      return user.get({userId: userId},
        function (result)
        {
          if (userId == $rootScope.app.resources.uuid)
          {
            $rootScope.app.resources = result;
            Store('app').save('resources', $rootScope.app.resources);
          }
        }).$promise;
    };

    Profile.prototype.saveUserData = function (resources)
    {
      return user.save({
          teamId: resources.teamUuids[0],
          userId: resources.uuid
        }, resources).$promise;
    };

    Profile.prototype.userExists = function (username) {
      return UserExists.check({ username: username },
        function () {
          return true
        },
        function () {
          return false;
        }).$promise;
    };

    Profile.prototype.pincodeExists = function (id, pincode, assignedId)
    {
      //TODO validation check in controller
      if (pincode != '' || pincode.length > 0)
      {
        return PincodeExists.check({
            id: id,
            pincode: pincode,
            returnExistsWhenAssignedToUuid: assignedId
          },
          function () {
            return true;
          },
          function () {
            return false;
          }).$promise;
      }
    };

    Profile.prototype.changePassword = function (memberId, oldPass, newPass)
    {
      return ChangePassword.update(
        {
          memberId: memberId,
          oldPass: MD5(oldPass),
          newPass: MD5(newPass)
        },
        null).$promise;
    };

    Profile.prototype.get = function (id)
    {
      return Profile.get({id: id},
        function(result)
        {
          return result;
        }).$promise;
    };

    Profile.prototype.getWithSlots = function (id, localize, params)
    {
      var deferred = $q.defer();

      Profile.prototype.get(id, localize).then(function (resources) {
        Slots.user({
          user: id,
          start: params.start,
          end: params.end
        }).then(function (slots) {
          deferred.resolve(angular.extend(resources, {
            slots: slots,
            synced: new Date().getTime(),
            periods: {
              start: params.start * 1000,
              end: params.end * 1000
            }
          }));
        });
      });

      return deferred.promise;
    };

    Profile.prototype.getSlots = function (id, params)
    {
      var deferred = $q.defer();

      Slots.user({
        user: id,
        start: params.start / 1000,
        end: params.end / 1000
      }).then(function (slots) {
        deferred.resolve({
          slots: slots,
          synced: new Date().getTime(),
          periods: {
            start: params.start,
            end: params.end
          }
        });
      });

      return deferred.promise;
    };

    Profile.prototype.local = function () {
      return Store('app').get('resources');
    };

    Profile.prototype.save = function (id, resources)
    {
      return Profile
              .save({id: id}, resources)
              .$promise;
    };

    return new Profile;

  });
});

define(['services/services', 'config'], function (services, config)
{
  'use strict';

  services.factory('Profile', function ($rootScope, $resource, $q, Slots, MD5, Store, Settings)
  {

    var Profile = function ()
    {
    }

    //$resource(url, [paramDefaults], [actions], options);
    Profile.prototype.resourcePincode = function ()
    {
      return $resource(Settings.getBackEnd() + 'node/:id/pincode_exists', {}, {
        check: {
          method: 'GET',
          params: {}
        }
      });
    };

    Profile.prototype.resourceChangePassword = function ()
    {
      return $resource(Settings.getBackEnd() + 'teammember/:memberId/pass',
        {
          oldPass: '@oldPass',
          newPass: '@newPass'
        },
        {
          update: {
            method: 'PUT',
          }
        });
    };

    Profile.prototype.resourceProfile = function ()
    {
      return $resource(Settings.getBackEnd() + 'node/:id/:section', {}, {
        get: {
          method: 'GET',
          params: {id: '', section: 'resource'}
        },
        save: {
          method: 'PUT',
          params: {section: 'resource'}
        },
        remove: {
          method: 'DELETE',
          params: {},
          isArray: true
        },
        role: {
          method: 'PUT',
          params: {section: 'role'},
          isArray: true
        },
        membership: {
          method: 'PUT',
          params: {id: '', section: 'membership'},
          isArray: true
        }
      });
    };

    Profile.prototype.resourceUser = function ()
    {
      return $resource(Settings.getBackEnd() + 'team/:teamId/member/:userId', {}, {
        get: {
          method: 'GET',
          params: {}
        },
        save: {
          method: 'PUT',
          params: {}
        }
      });
    };

    Profile.prototype.fetchUserData = function (userId)
    {
      var user = Profile.prototype.resourceUser();
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
      var user = Profile.prototype.resourceUser();
      return user.save({
        teamId: resources.teamUuids[0],
        userId: resources.uuid
      }, resources).$promise;
    };

    Profile.prototype.changePassword = function (memberId, oldPass, newPass)
    {
      var changePassword = Profile.prototype.resourceChangePassword();
      return changePassword.update(
        {
          memberId: memberId,
          oldPass: MD5(oldPass),
          newPass: MD5(newPass)
        },
        null).$promise;
    };

    Profile.prototype.get = function (id)
    {
      var resource = Profile.prototype.resourceProfile();
      return resource.get({id: id},
        function (result)
        {
          return result;
        }).$promise;
    };

    Profile.prototype.save = function (id, resources)
    {
      var resource = Profile.prototype.resourceProfile();
      return resource
        .save({id: id}, resources)
        .$promise;
    };

    Profile.prototype.userExists = function (username)
    {
      var UserExists = $resource(config.app.host + 'user_exists', {}, {
        check: {
          method: 'GET',
          ignore: true,
          params: {username: ''}
        }
      });

      return UserExists.check({username: username},
        function (result)
        {
          return false;
        },
        function (error)
        {
          return true;
        }).$promise;
    };

    return new Profile;
    return new Profile;

    //Profile.prototype.pincodeExists = function (id, pincode, assignedId)
    //{
    //  //TODO validation check in controller
    //  if (pincode != '' || pincode.length > 0)
    //  {
    //    var pincode = Profile.prototype.resourcePincode();
    //    return pincode.check({
    //        id: id,
    //        pincode: pincode,
    //        returnExistsWhenAssignedToUuid: assignedId
    //      },
    //      function ()
    //      {
    //        return true;
    //      },
    //      function ()
    //      {
    //        return false;
    //      }).$promise;
    //  }
    //};

    //Profile.prototype.getWithSlots = function (id, localize, params)
    //{
    //  var deferred = $q.defer();
    //  var resource = Profile.prototype.resourceProfile();
    //
    //  resource.prototype.get(id, localize).then(function (resources)
    //  {
    //    Slots.user({
    //      user: id,
    //      start: params.start,
    //      end: params.end
    //    }).then(function (slots)
    //    {
    //      deferred.resolve(angular.extend(resources, {
    //        slots: slots,
    //        synced: new Date().getTime(),
    //        periods: {
    //          start: params.start * 1000,
    //          end: params.end * 1000
    //        }
    //      }));
    //    });
    //  });
    //
    //  return deferred.promise;
    //};

    //Profile.prototype.getSlots = function (id, params)
    //{
    //  var deferred = $q.defer();
    //
    //  Slots.user({
    //    user: id,
    //    start: params.start / 1000,
    //    end: params.end / 1000
    //  }).then(function (slots)
    //  {
    //    deferred.resolve({
    //      slots: slots,
    //      synced: new Date().getTime(),
    //      periods: {
    //        start: params.start,
    //        end: params.end
    //      }
    //    });
    //  });
    //
    //  return deferred.promise;
    //};

    //Profile.prototype.local = function ()
    //{
    //  return Store('app').get('resources');
    //};
  });
});

define(['services/services', 'config'], function (services, config) {
  'use strict';

  services.factory('Profile', function ($rootScope, $resource, $q, Groups, Slots, MD5, Store) {
    var Profile = $resource(config.host + '/node/:id/:section', {}, {
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

    var Register = $resource(config.host + '/register', {direct: 'true', module: 'default'}, {
      profile: {
        method: 'GET',
        params: {uuid: '', pass: '', name: '', phone: ''},
        isArray: true
      }
    });

    var UserExists = $resource(config.host + '/user_exists', {}, {
      check: {
        method: 'GET',
        params: {username: ''}
      }
    });

    var PincodeExists = $resource(config.host + '/node/:id/pincode_exists', {}, {
      check: {
        method: 'GET',
        params: {}
      }
    });

    var Resources = $resource(config.host + '/resources', {}, {
      get: {
        method: 'GET',
        params: {}
      },
      save: {
        method: 'POST',
        params: {},
        isArray: true
      }
    });

    Profile.prototype.register = function (profile) {
      var deferred = $q.defer();

      var uuid = profile.username.toLowerCase();

      Register.profile({
          uuid: uuid,
          pass: MD5(profile.password),
          name: String(profile.firstName + ' ' + profile.lastName),
          phone: profile.PhoneAddress || ''
        },
        function (registered) {
          Profile.prototype.role(uuid, profile.role.id).then(function (roled) {
            Profile.prototype.save(uuid, {
              firstName: profile.firstName,
              lastName: profile.lastName,
              EmailAddress: profile.EmailAddress,
              PostAddress: profile.PostAddress,
              PostZip: profile.PostZip,
              PostCity: profile.PostCity
            }).then(function (resourced) {
              var calls = [];

              _.each(profile.groups, function (group) {
                calls.push(
                  Groups.addMember(
                    {
                      id: uuid,
                      group: group
                    }));
              });

              $q.all(calls).then(function (grouped) {
                deferred.resolve({
                  registered: ($rootScope.StandBy.config.profile.smartAlarm) ? registered[0] : registered,
                  roled: roled,
                  resourced: resourced,
                  grouped: grouped
                });
              });
            }); // save profile
          }); // role
        },
        function (error) {
          deferred.resolve({error: error});
        }
      ); // register

      return deferred.promise;
    };

    Profile.prototype.userExists = function (username) {
      var deferred = $q.defer();

      if (username != '' || username.length > 0) {
        UserExists.check({ username: username },
          function () {
            deferred.resolve(true)
          },
          function () {
            deferred.resolve(false)
          });
      }

      return deferred.promise;
    };

    Profile.prototype.pincodeExists = function (id, pincode) {
      var deferred = $q.defer();

      if (pincode != '' || pincode.length > 0) {
        PincodeExists.check({
            id: id,
            pincode: pincode
          },
          function () {
            deferred.resolve(true)
          },
          function () {
            deferred.resolve(false)
          });
      }

      return deferred.promise;
    };

    Profile.prototype.role = function (id, role) {
      var deferred = $q.defer();

      Profile.role({ id: id }, role,
        function (result) {
          deferred.resolve(result);
        },
        function (error) {
          deferred.resolve({error: error});
        });

      return deferred.promise;
    };

    Profile.prototype.changePassword = function (passwords) {
      var deferred = $q.defer();

      Resources.save(null, {askPass: MD5(passwords.new1)},
        function (result) {
          deferred.resolve(result);
        },
        function (error) {
          deferred.resolve({error: error});
        });

      return deferred.promise;
    };

    Profile.prototype.membership = function (id, groups) {
      var deferred = $q.defer();

      Profile.membership({ id: id }, groups,
        function (result) {
          deferred.resolve(result);
        },
        function (error) {
          deferred.resolve({error: error});
        });

      return deferred.promise;
    };

    Profile.prototype.get = function (id, localize) {
      var deferred = $q.defer();

      Profile.get({id: id}, function (result) {
        result.role = (result.role || result.role == 0) ? result.role : 3;

        if (id == $rootScope.StandBy.resources.uuid)
          $rootScope.StandBy.resources = result;

        if (localize)
          Store('user').save('resources', result);

        deferred.resolve({resources: result});
      });

      return deferred.promise;
    };

    Profile.prototype.getWithSlots = function (id, localize, params) {
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

    Profile.prototype.getSlots = function (id, params) {
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
      return Store('user').get('resources');
    };

    Profile.prototype.save = function (id, resources) {
      var deferred = $q.defer();

      if (resources.firstName != undefined && resources.lastName != undefined)
        resources.name = resources.firstName + ' ' + resources.lastName;

      Profile.save({id: id}, resources,
        function (result) {
          deferred.resolve(result);
        },
        function (error) {
          deferred.resolve({error: error});
        });

      return deferred.promise;
    };

    Profile.prototype.remove = function (id) {
      var deferred = $q.defer();

      Profile.remove({id: id},
        function (result) {
          deferred.resolve(result);
        },
        function (error) {
          deferred.resolve({error: error});
        });

      return deferred.promise;
    };

    return new Profile;
  });
});
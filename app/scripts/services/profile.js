define(
  ['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory(
      'Profile',
      [
        '$rootScope', '$resource', '$q', 'Storage', 'Teams', 'MD5',
        function ($rootScope, $resource, $q, Storage, Teams, MD5)
        {
          var Profile = $resource(
              config.app.host + config.app.namespace + '/team/member/:memberId/',
              {},
              {
                get:  {
                  method: 'GET'
                },
                save: {
                  method: 'PUT'
                },
                role: {
                  method: 'PUT',
                  params: {
                    section: 'role'
                  }
                }
              }
          );

          var ProfileSave = $resource(
              config.app.host + config.app.namespace + '/team/:teamId/member/:memberId/',
              {},
              {
                save: {
                  method: 'PUT'
                }
              }
          );

          var ProfileImg = $resource(
              config.app.host + config.app.namespace + '/team/member/:memberId/photourl',
              {},
              {
                getURL: {
                  method:  'GET',
                  isArray: false
                }
              }
          );

          var Register = $resource(
              config.app.host + '/register',
              {
                direct: 'true',
                module: 'default'
              },
              {
                profile: {
                  method: 'GET',
                  params: {
                    uuid:  '',
                    pass:  '',
                    name:  '',
                    phone: ''
                  }
                }
              }
          );

          var Resources = $resource(
              config.app.host + '/resources',
              {},
              {
                get:  {
                  method: 'GET',
                  params: {}
                },
                save: {
                  method: 'POST',
                  params: {}
                }
              }
          );

          Profile.prototype.register = function (profile)
          {
            var deferred = $q.defer();

            Register.profile(
              {
                uuid:  profile.username,
                pass:  MD5(profile.password),
                name:  profile.name,
                phone: profile.PhoneAddress
              },
              function (registered)
              {
                Profile.prototype.role(profile.username, profile.role.id)
                  .then(
                  function (roled)
                  {
                    Profile.prototype.save(
                      profile.username, {
                        EmailAddress: profile.EmailAddress,
                        PostAddress:  profile.PostAddress,
                        PostZip:      profile.PostZip,
                        PostCity:     profile.PostCity
                      }).then(
                      function (resourced)
                      {
                        var calls = [];

                        angular.forEach(
                          profile.groups, function (group)
                          {
                            calls.push(
                              Groups.addMember(
                                {
                                  id:    profile.username,
                                  group: group
                                }));
                          });

                        $q.all(calls)
                          .then(
                          function (grouped)
                          {
                            deferred.resolve(
                              {
                                registered: registered,
                                roled:      roled,
                                resourced:  resourced,
                                grouped:    grouped
                              });
                          });

                      });

                  });
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };

          Profile.prototype.role = function (id, role)
          {
            var deferred = $q.defer();

            Profile.role(
              {
                id: id
              },
              role,
              function (result)
              {
                deferred.resolve(result);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };

          Profile.prototype.changePassword = function (passwords)
          {
            var deferred = $q.defer();

            Resources.save(
              null,
              {
                askPass: MD5(passwords.new1)
              },
              function (result)
              {
                deferred.resolve(result);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };

          Profile.prototype.get = function (id, localize)
          {
            var deferred = $q.defer();

            Profile.get(
              {
                memberId: id
              },
              function (result)
              {
                if (id == $rootScope.app.resources.uuid) $rootScope.app.resources = result;

                if (localize) Storage.add('resources', angular.toJson(result));

                deferred.resolve({resources: result});
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };

          Profile.prototype.local = function () { return angular.fromJson(Storage.get('resources')) };

          Profile.prototype.save = function (id, resources)
          {
            var deferred = $q.defer();

            ProfileSave.save(
              {
                teamId:   resources.teamUuids[0],
                memberId: id
              },
              resources,
              function (result)
              {
                deferred.resolve(result);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };

          Profile.prototype.loadUploadURL = function (id)
          {
            var deferred = $q.defer();

            ProfileImg.getURL(
              {
                memberId: id
              },
              function (result)
              {
                deferred.resolve(result);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };

          return new Profile;
        }
      ]
    );
  }
);
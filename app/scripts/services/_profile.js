define(
  ['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory(
      'Profile',
      [
        '$rootScope', '$resource', '$q', 'Storage',
        function ($rootScope, $resource, $q, Storage)
        {
//          var Profile = $resource(
//              config.app.host + config.app.namespace + '/team/member/:memberId/',
//              {},
//              {
//                get:  {
//                  method: 'GET'
//                }
//              }
//          );

          var Profile = $resource();

//          var ProfileSave = $resource(
//              config.app.host + config.app.namespace + '/team/:teamId/member/:memberId/',
//              {},
//              {
//                save: {
//                  method: 'PUT'
//                }
//              }
//          );


          // TODO: Investigate whether if this call exits ?!
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


//          Profile.prototype.get = function (id, localize)
//          {
//            var deferred = $q.defer();
//
//            Profile.get(
//              {
//                memberId: id
//              },
//              function (result)
//              {
//                if (id == $rootScope.app.resources.uuid) $rootScope.app.resources = result;
//
//                if (localize) Storage.add('resources', angular.toJson(result));
//
//                deferred.resolve({resources: result});
//              },
//              function (error) { deferred.resolve({error: error}) }
//            );
//
//            return deferred.promise;
//          };


//          Profile.prototype.local = function () { return angular.fromJson(Storage.get('resources')) };


//          Profile.prototype.save = function (id, resources)
//          {
//            var deferred = $q.defer();
//
//            ProfileSave.save(
//              {
//                teamId:   resources.teamUuids[0],
//                memberId: id
//              },
//              resources,
//              function (result)
//              {
//                deferred.resolve(result);
//              },
//              function (error) { deferred.resolve({error: error}) }
//            );
//
//            return deferred.promise;
//          };


          /**
           * This function only exits in this service so its turned off
           */
//          Profile.prototype.loadUploadURL = function (id)
//          {
//            var deferred = $q.defer();
//
//            ProfileImg.getURL(
//              {
//                memberId: id
//              },
//              function (result)
//              {
//                deferred.resolve(result);
//              },
//              function (error) { deferred.resolve({error: error}) }
//            );
//
//            return deferred.promise;
//          };


          return new Profile;
        }
      ]
    );
  }
);
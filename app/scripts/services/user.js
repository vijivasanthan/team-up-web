define(
  ['services/services', 'config'],
  function (services, config)
  {
    'use strict';



    services.factory('User',
      [
        '$resource', '$q', '$location', 'Storage', '$rootScope',
        function ($resource, $q, $location, Storage, $rootScope)
        {
          var self = this;


          var User = $resource();


          var Login = $resource(
              config.app.host + config.app.namespace+'/login',
            {
            },
            {
              process: {
                method: 'GET',
//	        params: {username:'', passwordHash:''}
                params: {uuid:'', pass:''}
              }
            }
          );


          var Logout = $resource(
              config.app.host + 'logout',
            {
            },
            {
              process: {
                method: 'GET',
                params: {},
                isArray: true
              }
            }
          );


          var MemberInfo = $resource(
              config.app.host + config.app.namespace + '/team/member',
            {
            },
            {
              get: {
                method: 'GET',
                params: {}
              }
            }
          );


          var Reset = $resource(
              config.app.host + '/passwordReset',
            {
            },
            {
              password: {
                method: 'GET',
                params: {uuid: '', path:''}
              }
            }
          );

          // var changePassword = $resource(config.app.host+'/passwordReset',
          //   {uuid: uuid,
          //    pass: newpass,
          //    key: key});


          /**
           * TODO
           * RE-FACTORY
           *
           * User login
           */
          User.prototype.password = function (uuid)
          {
            var deferred = $q.defer();

            Reset.password(
              {
                uuid: uuid.toLowerCase(),
                path: $location.absUrl()
              },
              function (result)
              {
                if (angular.equals(result, []))
                {
                  deferred.resolve("ok");
                }
                else
                {
                  deferred.resolve(result);
                };
              },
              function (error)
              {
                deferred.resolve(error);
              }
            );

            return deferred.promise;
          };


          /**
           * User login
           */
          User.prototype.login = function (username, passwordHash)
          {
            var deferred = $q.defer();

            Login.process({uuid : username , pass : passwordHash },
              function (result)
              {
                if (angular.equals(result, []))
                {
                  deferred.reject("Something went wrong with login!");
                }
                else
                {
                  deferred.resolve(result);
                };
              },
              function (error)
              {
                deferred.resolve(error);
              }
            );

            return deferred.promise;
          };


          /**
           * RE-FACTORY
           * change user password
           */
          User.prototype.changePass = function (uuid, newpass, key)
          {
            var deferred = $q.defer();

            /**
             * RE-FACTORY
             */
            changePassword.get(
              function (result)
              {
                deferred.resolve(result);
              },
              function (error)
              {
                deferred.resolve(error);
              }
            );

            return deferred.promise;
          }


          /**
           * User logout
           */
          User.prototype.logout = function ()
          {
            var deferred = $q.defer();

            Logout.process(null,
              function (result)
              {
                deferred.resolve(result);
              },
              function (error)
              {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };


          /**
           * Get user resources
           */
          User.prototype.memberInfo = function ()
          {
            var deferred = $q.defer();

            MemberInfo.get(null,
              function (result)
              {
                if (angular.equals(result, []))
                {
                  deferred.reject("User has no resources!");
                }
                else
                {
                  Storage.add('resources', angular.toJson(result));

                  deferred.resolve(result);
                }
              },
              function (error)
              {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };

          return new User;
        }
      ]);




  }
);
define(['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory('Password',
      function ($rootScope,
                $location,
                $q,
                $injector,
                TeamUp,
                Settings,
                Profile,
                MD5)
      {
        //interface of all public methods and properties
        return {
          change: change,
          forgot: forgot
        };

        //// Methods \\\\

        /**
         * Change the password
         * @param data username, key and the new pass
         * @returns {*}
         */
        function change(data)
        {
          var deferred = $q.defer(),
              options = {
                uuid: data.userName,
                type: getType(),
                key: data.keyPassword,
                pass: MD5(data.newPassword)
              };

          $rootScope
            .statusBar
            .display($rootScope.ui.profile.changePass);

          initBackEnd(config.app.host, options)
            .then(function(result)
            {
              console.error('result', result);
              if(result && result.data)
              {
                var errorCode,
                  error = (result.data.errorCode)
                  ? $rootScope.ui.teamup.errorCode[result.data.errorCode] || result.data.errorMessage
                  : $rootScope.ui.profile.keyUsernameWrong;
                deferred.reject(error)
              }
              else deferred.resolve($rootScope.ui.profile.passChanged);
            });
          return deferred.promise;
        }

        /**
         *
         * @param userName the username from
         * the user who forgot his or her password
         * @returns {*}
         */
        function forgot(userName)
        {
          var deferred = $q.defer();

          $rootScope
            .statusBar
            .display($rootScope.ui.profile.forgot_password);

          (! userName)
            ? deferred
                .reject($rootScope.ui.validation.userName.valid)
            : initBackEnd(config.app.host, {
                uuid: userName.toLowerCase(),
                path: $location.absUrl(),
                type: getType()
              })
              .then(function(result)
              {
                (result.error)
                  ? deferred.reject('De gebruikersnaam is niet gevonden')
                  : deferred.resolve($rootScope.ui.profile.forgotPassInfoSend);
              });
          return deferred.promise;
        }

        /**
         * Return the type of app the user is using at this moment
         * @returns {string}
         */
        function getType()
        {
          return ($rootScope.app.domainPermission.tasks)
            ? 'TeamUp'
            : 'TeamTelephone';
        }

        /**
         * Check the different backends, because there isn't
         * a default backend selected before the login
         * @param backEnds
         * @param params
         * @returns {*}
         */
        function initBackEnd (backEnds, params)
        {
          var deferred = $q.defer(),
            promises = [],
            requestCall = function(backEndDir, params)
            {
              var $resource = $injector.get('$resource'),
                  request = $resource(backEndDir + 'passwordReset/', {}, {
                    get: {
                      method: 'GET',
                      params: {}
                    }
                  });
              return request.get(params).$promise;
            };

          //create http requests with the different backends
          _.each(backEnds, function (backEndDir)
          {
            var request = requestCall(backEndDir, params);
            promises.push(request);
          });

          //Resolve all promises even if there are rejections
          Settings.aSync(promises, function error(results)
            {},
            function success(results)
            {
              var result = Settings.getResultOnStatusCode(results);
              Settings.setBackEnd(backEnds[result.index]);
              deferred.resolve(result);
            });
          return deferred.promise;
        }
      });
  });
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
        return {
          change: change,
          forgot: forgot
        };

        //// Methods \\\\
        function change(data)
        {
          var deferred = $q.defer(),
              error = null;
          var backEnd = Settings.setBackEnd('http://192.168.128.7:8080/');

          $rootScope
            .statusBar
            .display($rootScope.ui.profile.changePass);

          if(! data.newPassword || ! data.repeatPassword)
          {
            error = $rootScope.ui.profile.pleaseFill;
          }
          else if(data.newPassword !== data.repeatPassword)
          {
            error = $rootScope.ui.profile.passNotMatch;
          }

          (error)
            ? deferred.reject(error)
            : initBackEnd(config.app.host, {
              uuid: data.userName,
              key: data.keyPassword,
              pass: MD5(data.newPassword)
            })
            .then(function(result)
            {
              console.error('result.data', result);
              (result && result.data)
                ? deferred.reject(result.data.errorMessage)
                : deferred.resolve($rootScope.ui.profile.passChanged);
              //data: Object
              //error: true
              //errorCode: 39
              //errorMessage: "The given resetKey is invalid"
            });

          return deferred.promise;
        }

        function forgot(userName)
        {
          var deferred = $q.defer();
          var backEnd = Settings.setBackEnd('http://192.168.128.7:8080/');

          $rootScope
            .statusBar
            .display($rootScope.ui.profile.forgot_password);

          (! userName)
            ? deferred
                .reject($rootScope.ui.validation.userName.valid)
            : initBackEnd(config.app.host, {
                uuid: userName,
                path: $location.absUrl(),
                type: 'teamtelephone'
              })
            .then(function(result)
            {
              console.error('result', result);
              (result.error)
                ? deferred.reject('De gebruikersnaam is niet gevonden')
                : deferred.resolve($rootScope.ui.profile.forgotPassInfoSend);
            });
          return deferred.promise;
        }

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
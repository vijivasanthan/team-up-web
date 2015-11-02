define(['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory('Password',
      function ($rootScope,
                $location,
                $q,
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

          $rootScope
            .statusBar
            .display('Wachtwoord veranderen');

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
            : deferred.resolve(true);//save new password

          $rootScope.statusBar.off();
          return deferred.promise;
        }

        function forgot(userName)
        {
          var deferred = $q.defer();

          $rootScope
            .statusBar
            .display('Wachtwoord vergeten');

          (! userName)
            ? deferred
                .reject($rootScope.ui.validation.userName.valid)
            : deferred
                .resolve('Er is een email verzonden met de nodige informatie');
          //Er is een email verzonden met de nodige informatie
          //check if userName exist

          $rootScope.statusBar.off();
          return deferred.promise;
        }
      });
  });
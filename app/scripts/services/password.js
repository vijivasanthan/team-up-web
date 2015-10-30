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

          if(data.newPassword && data.repeatPassword)
          {
            error = $rootScope.ui.profile.pleaseFill;
          }
          else if(data.newPassword === data.repeatPassword)
          {
            error = $rootScope.ui.profile.passNotMatch;
          }

          if(error)
          {
            deferred.reject(error);
            $rootScope.statusBar.off();
          }
          else
          {
            //save new password
            deferred.resolve(true);
          }

          return deferred.promise;
        }

        function forgot(userName)
        {
          var deferred = $q.defer();

          $rootScope
            .statusBar
            .display('Wachtwoord vergeten');

          if(! userName)
          {
            deferred.reject($rootScope.ui.validation.userName.valid);
          }
          else
          {
            //Er is een email verzonden met de nodige informatie
            deferred
              .resolve('Er is een email verzonden met de nodige informatie');
            //check if userName exist
          }
          return deferred.promise;
        }
      });
  });
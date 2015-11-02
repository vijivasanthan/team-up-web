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
            : deferred
              .resolve($rootScope.ui.profile.passChanged);
              //save new password

          $rootScope.statusBar.off();
          return deferred.promise;
        }

        function forgot(userName)
        {
          var deferred = $q.defer();

          $rootScope
            .statusBar
            .display($rootScope.ui.profile.forgot_password);

          (! userName)
            ? deferred
                .reject($rootScope.ui.validation.userName.valid)
            : deferred
                .resolve($rootScope.ui.profile.forgotPassInfoSend);
          //check if userName exist

          $rootScope.statusBar.off();
          return deferred.promise;
        }
      });
  });
define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'password',
      function ($routeParams, Login, Password)
      {
        var self = this;

        //properties
        self.views = {
          forgot: false,
          change: false
        };

        //methods
        self.forgot = forgot;
        self.change = change;
        self.init = init;
        //initialisation
        self.init();

        /**
         * Password forgotten
         */
        function forgot(passwordData)
        {
          var promise = Password.forgot(
            passwordData.username
          );
          promiseResult(promise);
        }

        /**
         * Changed password
         */
        function change(passwordData)
        {
          console.error('self.forgotForm', self.forgotForm);

          if(self.forgotForm.$valid)
          {
            var _passwordData = {
              keyPassword: $routeParams.key,
              userName: $routeParams.uuid,
              newPassword: passwordData.new,
              repeatPassword: passwordData.repeat
            };

            self.passwordForgotForm.$setPristine();
            self.passwordForgotForm.$setUntouched();
            self.passwordForgotForm.$submitted = false;
            self.passwordForgotForm.$setValidity();

            var promise = Password.change(_passwordData);
            promiseResult(promise);
          }
        }

        /**
         * Handle the result of the promise
         * @param promise
         */
        function promiseResult(promise)
        {
          promise
            .then(function(result)
            {
              notify('success', result);
              resetForms();

            },
            function (error)
            {
              notify('error', error);
            });
        }

        /**
         * Reset models and validation form
         */
        function resetForms()
        {
          self.username = null;
          self.new = null;
          self.repeat = null;
          //if(angular.isDefined(self.passwordForgotForm))
          //{
          //  passwordForgotForm.$setPristine();
          //  passwordForgotForm.$setUntouched();
          //  passwordForgotForm.$submitted = false;
          //  passwordForgotForm.$setValidity();
          //}
        }

        /**
         * Notify the user, he or she is aware of the situation
         * @param type
         * @param message
         */
        function notify(type, message)
        {
          self.success = null;
          self.error = null;
          self[type] = {
            show: true,
            message: message
          };
        }

        /**
         * Inititalisation
         */
        function init()
        {
          console.error('$routeParams', $routeParams);
          ($routeParams &&
          $routeParams.uuid &&
          $routeParams.key)
            ? self.views.change = true
            : self.views.forgot = true;
        }
      }
    );
  }
);
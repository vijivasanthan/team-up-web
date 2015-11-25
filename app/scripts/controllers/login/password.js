define(
  ['../controllers'],
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
        //initialize
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
          //check if the form is valid otherwise,
          // keep it from doing a request
          if(self.forgotForm.$valid)
          {
            var _passwordData = {
              keyPassword: $routeParams.key,
              userName: $routeParams.uuid,
              newPassword: passwordData.new,
              repeatPassword: passwordData.repeat
            };
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
         * Reset models and validation from the forms
         */
        function resetForms()
        {
          self.username = null;
          self.new = null;
          self.repeat = null;
          if(angular.isDefined(self.forgotForm))
          {
            self.forgotForm.$setPristine();
            self.forgotForm.$setUntouched();
            self.forgotForm.$submitted = false;
            self.forgotForm.$setValidity();
          }
        }

        /**
         * Notify the user, he or she is aware of the situation
         * @param type Success or Error type
         * @param message The success or errormessage
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
         * Inititalisation which form should be shown
         * the password forgot form or the change password
         */
        function init()
        {
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
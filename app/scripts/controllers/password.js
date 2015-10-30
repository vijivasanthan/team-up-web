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
        function forgot()
        {
          Password.forgot(self.username)
            .then(function(result)
            {
              //email onderweg
              notify('success', 'email onderweg');
            }, function (error)
            {
              notify('error', error);
            });
        }

        /**
         * Changed password
         */
        function change()
        {
          var passwordData = {
            keyPassword: $routeParams.key,
            newPassword: self.new,
            repeatPassword: self.repeat
          };
          Password.change(passwordData)
            .then(
            null,
            function (error)
            {
              notify('error', 'errorrr');
            });
        }

        /**
         * Notify the user, he or she is aware of the situation
         * @param type
         * @param message
         */
        function notify(type, message)
        {
          self.error = null;
          self.success = null;
          console.error('type', type);
          self[type] = {
            show: true,
            message: message
          }
        }

        /**
         * Inititalisation
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
define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'password',
      function ($routeParams, Login)
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

        self.init();

        //$scope.alert = {
        //  login: {
        //    display: false,
        //    type: '',
        //    message: ''
        //  },
        //  forgot: {
        //    display: false,
        //    type: '',
        //    message: ''
        //  }
        //};

        function forgot()
        {

        }

        function change()
        {

        }

        function init()
        {
          ($routeParams &&
          $routeParams.uuid &&
          $routeParams.key)
            ? self.views.change = true
            : self.views.forgot = true;
        }


        this.login = function ()
        {
          this.error = Login.validate(this.loginData);

          if (!this.error)
          {
            var loginData = Login.reSaveInitials(this.loginData),
              self = this;

            Login
              .authenticate(loginData.userName, loginData.password)
              .then(null, function (error)
              {
                self.error = error;
              });
          }
        };

        this.init = function ()
        {
          this.error = Login.checkSessionTimeout();

          if (!this.error)
          {
            this.loginData = Login.getInitials();

            if (this.loginData && this.loginData.password)
            {
              this.login();
            }
          }
        }.call(this);
      }
    );
  }
);
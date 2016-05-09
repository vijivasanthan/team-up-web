define(
  ['../controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'login',
      function (Login)
      {
        this.login = function ()
        {
          this.error = Login.validate(this.loginData);

          if (!this.error)
          {
            var loginData = Login.reSaveInitials(this.loginData),
              self = this;

            Login
              .authenticate(loginData.userName, loginData.password)
              .then(null,
                    function (error)
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
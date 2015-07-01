define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Rejections',
      [
        '$rootScope',
        'TeamUp',
        'Session',
        '$injector',
        '$q',
        function ($rootScope, TeamUp, Session, $injector, $q)
        {
          return {
            reSetSession : function(loginData, config)
            {
              var deferred = $q.defer();

              TeamUp._(
                'login',
                {
                  uuid: loginData.username,
                  pass: loginData.password
                }
              ).then(
                function (result)
                {
                  var http = $injector.get('$http'),
                    _config = config;

                  Session.set(result['X-SESSION_ID']);

                  _config.headers = {
                    'X-SESSION_ID': Session.get()
                  };

                  $rootScope.showChangedAvatar('team', loginData.username);

                  deferred.resolve(http(_config));
                }
              );

              //send the request again with the new session
              return deferred.promise;
            },
            sessionTimeOut: function()
            {
              var location = $injector.get('$location');

              location.path('/logout');
              window.location.href = 'logout.html';
              localStorage.setItem('sessionTimeout', '');
            },
            trowError: function (error)
            {
              var errorCode = error.errorCode.toString() || "0";
              $rootScope.notifier.error($rootScope.ui.teamup.errorCode[errorCode]);
              console.log('error -> ', error.errorMessage);
            }
          };
        }
      ]
    );
  }
);
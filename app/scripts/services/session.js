define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Session',
      [
        '$rootScope', '$http', 'Store',
        function ($rootScope, $http, Store)
        {
          return {
            check: function ()
            {
              var session = Store('app').get('session');

              if (session)
              {
                this.set(session.id);

                return true;
              }
              else
              {
                return false;
              }
            },

            cookie: function ()
            {
              var values,
                  pairs = document.cookie.split(";");

              for (var i = 0; i < pairs.length; i ++)
              {
                values = pairs[i].split("=");

                if (values[0].trim() == "WebPaige.session") return angular.fromJson(values[1]);
              }
            },

            get: function (session)
            {
              this.check(session);
              this.set(session.id);

              return session.id;
            },

            set: function (sessionId)
            {
              var session = {
                id:   sessionId,
                time: new Date()
              };

              Store('app').save('session', session);

              $rootScope.session = session;

              $http.defaults.headers.common['X-SESSION_ID'] = $rootScope.session.id;

              return session;
            },

            clear: function ()
            {
              $rootScope.session = null;

              $http.defaults.headers.common['X-SESSION_ID'] = null;
            }
          }
        }
      ]);

  }
);



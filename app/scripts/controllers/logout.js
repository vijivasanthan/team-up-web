define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'logout',
      [
        '$rootScope', '$scope', '$window', 'Session', 'Store', 'TeamUp',
        function ($rootScope, $scope, $window, Session, Store, TeamUp)
        {
          $('.navbar').hide();
          $('#footer').hide();

          var logindata = Store('app').get('logindata');

          TeamUp._('logout')
            .then(
            function (result)
            {
              if (result.error)
              {
                console.warn('error ->', result);
              }
              else
              {
                Store('app').nuke();

                Store('app').save('logindata', logindata);

                $window.location.href = 'logout.html';
              }
            }
          );
        }
      ]
    );
  }
);
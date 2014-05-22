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
          angular.element('.navbar').hide();
          angular.element('#footer').hide();

          var loginData = Store('app').get('loginData');

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
                Session.clear();

                Store('app').nuke();

                Store('app').save('loginData', loginData);

                $window.location.href = 'logout.html';
              }
            }
          );
        }
      ]
    );
  }
);
define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'login',
      [
        '$rootScope',
        '$location',
        '$q',
        '$scope',
        'Session',
        'Teams',
        'Clients',
        'Store',
        '$routeParams',
        'TeamUp',
        'Dater',
        function ($rootScope, $location, $q, $scope, Session, Teams, Clients, Store, $routeParams, TeamUp, Dater)
        {
          // TODO: Soon not needed!
          Dater.registerPeriods();

          if ($location.path() == '/logout')
          {
            angular.element('body')
              .css(
              {
                'backgroundColor': '#1dc8b6',
                'backgroundImage': 'none'
              }
            );
          }

          if ($routeParams.uuid && $routeParams.key)
          {
            $scope.views = { changePass: true };

            $scope.changepass = {
              uuid: $routeParams.uuid,
              key:  $routeParams.key
            };
          }
          else
          {
            $scope.views = {
              login:  true,
              forgot: false
            };
          }

          $scope.alert = {
            login:  {
              display: false,
              type:    '',
              message: ''
            },
            forgot: {
              display: false,
              type:    '',
              message: ''
            }
          };

          if (! Store('app').get('app'))
          {
            Store('app').save('app', '{}');
          }

          angular.element('.navbar')
            .hide();

          angular.element('#footer')
            .hide();

          angular.element('#watermark')
            .hide();

          angular.element('body')
            .css({ 'backgroundColor': '#1dc8b6' });

          var loginData = Store('app').get('loginData');

          if (loginData && loginData.remember) $scope.loginData = loginData;

          $scope.login = function ()
          {
            angular.element('#alertDiv')
              .hide();

            if (! $scope.loginData || ! $scope.loginData.username || ! $scope.loginData.password)
            {
              $scope.alert = {
                login: {
                  display: true,
                  type:    'alert-error',
                  message: $rootScope.ui.login.alert_fillfiled
                }
              };

              angular.element('#login button[type=submit]')
                .text($rootScope.ui.login.button_login)
                .removeAttr('disabled');

              return false;
            }

            angular.element('#login button[type=submit]')
              .text($rootScope.ui.login.button_loggingIn)
              .attr('disabled', 'disabled');

            Store('app').save(
              'loginData',
              {
                username: $scope.loginData.username,
                password: $scope.loginData.password,
                remember: $scope.loginData.remember
              }
            );

            auth($scope.loginData.username, MD5.parse($scope.loginData.password));
          };

          var auth = function (uuid, pass)
          {
            TeamUp._(
              'login',
              {
                uuid: uuid,
                pass: pass
              }
            ).then(
              function (result)
              {
                if (result.status == 400 ||
                    result.status == 403 ||
                    result.status == 404)
                {
                  $scope.alert = {
                    login: {
                      display: true,
                      type:    'alert-error',
                      message: $rootScope.ui.login.alert_wrongUserPass
                    }
                  };

                  angular.element('#login button[type=submit]')
                    .text($rootScope.ui.login.button_loggingIn)
                    .removeAttr('disabled');

                  return false;
                }
                else if (result.status == 0)
                {
                  $scope.alert = {
                    login: {
                      display: true,
                      type:    'alert-error',
                      message: $rootScope.ui.login.alert_network
                    }
                  };

                  angular.element('#login button[type=submit]')
                    .text($rootScope.ui.login.button_loggingIn)
                    .removeAttr('disabled');

                  return false;
                }
                else
                {
                  Session.set(result['X-SESSION_ID']);

                  preLoader();
                }
              }
            )
          };

          // TODO: Move this to somewhere later on!
          function queryMembersNotInTeams ()
          {
            TeamUp._('teamMemberFree')
              .then(
              function (result) { Store('app').save('members', result) }
            );
          }

          var preLoader = function ()
          {
            angular.element('#login')
              .hide();

            angular.element('#download')
              .hide();

            angular.element('#preloader')
              .show();

            progress(20, $rootScope.ui.login.loading_User);

            TeamUp._('user')
              .then(
              function (resources)
              {
                if (resources.error)
                {
                  console.warn('error ->', resources);
                }
                else
                {
                  $rootScope.app.resources = resources;

                  Store('app').save('resources', resources);

                  progress(40, $rootScope.ui.login.loading_Teams);

                  Teams.query(true, {})
                    .then(
                    function (teams)
                    {
                      queryMembersNotInTeams();

                      if (teams.error)
                      {
                        console.warn('error ->', teams);
                      }

                      progress(60, $rootScope.ui.login.loading_clientGroups);

                      Teams.queryClientGroups(teams)
                        .then(
                        function ()
                        {
                          progress(80, $rootScope.ui.login.loading_clientGroups);

                          TeamUp._('clientsQuery')
                            .then(
                            function ()
                            {
                              Clients.query(false, {})
                                .then(
                                function ()
                                {
                                  progress(100, $rootScope.ui.login.loading_everything);

                                  Teams.query()
                                    .then(
                                    function ()
                                    {
                                      $location.path('/tasks');

                                      setTimeout(
                                        function ()
                                        {
                                          angular.element('.navbar')
                                            .show();

                                          angular.element('body')
                                            .css({ 'background': 'url(../images/bg.jpg) repeat' });

                                          if (! $rootScope.browser.mobile)
                                          {
                                            angular.element('#footer')
                                              .show();
                                          }
                                        }, 100);
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              }
            );
          };

          var progress = function (ratio, message)
          {
            angular.element('#preloader .progress .bar')
              .css({ width: ratio + '%' });

            angular.element('#preloader span')
              .text(message);
          };
        }
      ]);
  }
);
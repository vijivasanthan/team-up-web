define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'login',
      [
        '$rootScope',
        '$location',
        '$q',
        '$scope',
        'Settings',
        'Session',
        'Teams',
        'Clients',
        'Store',
        '$routeParams',
        'TeamUp',
        'Dater',
        '$filter',
        'MD5',
        'Permission',
        function ($rootScope, $location, $q, $scope, Settings, Session, Teams, Clients, Store, $routeParams, TeamUp, Dater, $filter, MD5,
                  Permission)
        {

          var setBackgroundColor = function ()
          {
            angular.element('body')
              .css(
              {
                'backgroundColor': '#1dc8b6',
                'backgroundImage': 'none'
              }
            );
          };

          try
          {
            localStorage.test = 'test';
          }
          catch (e)
          {
            var urlPrivateMode = 'http://support.apple.com/nl-nl/ht6366',
              template = '<p>' + $rootScope.ui.teamup.checkLocalStorage + '</p>';

            template += "<a href='" + urlPrivateMode + "'>";
            template += urlPrivateMode + '</a>';

            setBackgroundColor();

            angular.element('#login')
              .html('')
              .append(template);

            return false;
          }

          // TODO: Soon not needed!
          Dater.registerPeriods();


          if ($location.path() == '/logout')
          {
            setBackgroundColor();
          }

          if ($routeParams.uuid && $routeParams.key)
          {
            $scope.views = {changePass: true};

            $scope.changepass = {
              uuid: $routeParams.uuid,
              key: $routeParams.key
            };
          }
          else
          {
            $scope.views = {
              login: true,
              forgot: false
            };
          }

          $scope.alert = {
            login: {
              display: false,
              type: '',
              message: ''
            },
            forgot: {
              display: false,
              type: '',
              message: ''
            }
          };

          if (!Store('app').get('app'))
          {
            Store('app').save('app', '{}');
          }
          else
          {
            var periods = Store('app').get('periods'),
              loginData = Store('app').get('loginData');

            Store('app').nuke();
            Store('app').save('periods', periods);
            Store('app').save('loginData', loginData);
          }

          angular.element('.navbar').hide();
          angular.element('#footer').hide();
          angular.element('#watermark').hide();
          angular.element('body').css({'backgroundColor': '#1dc8b6'});

          var localLoginData = Store('app').get('loginData');

          //Check if there is loginData local
          if (localLoginData)
          {
            //if there is a username, show it
            $scope.loginData = {};
            $scope.loginData.username = localLoginData.username;

            //if there is a local encrypted password, show a random string
            //and select the remember login
            if (localLoginData.password)
            {
              $scope.loginData.password = 1234;
              $scope.loginData.remember = true;
            }
          }


          $scope.login = function ()
          {
            angular.element('#alertDiv').hide();

            if (!$scope.loginData || !$scope.loginData.username || !$scope.loginData.password)
            {
              $scope.alert = {
                login: {
                  display: true,
                  type: 'alert-error',
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

            //Checks if there is already a password, otherwise encrypt the given password
            var password = ($scope.loginData.password == '1234' && localLoginData.password)
              ? localLoginData.password
              : MD5($scope.loginData.password);

            var newLoginData = {
              username: $scope.loginData.username
            };

            //Check if the user want to save his password and add it to the local storage
            if ($scope.loginData.remember == true)
            {
              newLoginData.password = password;
            }

            Store('app').save('loginData', newLoginData);

            auth($scope.loginData.username, password);
          };

          /**
           * Check if there is a password locally and autologin
           */
          if (localLoginData.password)
          {
            $scope.login();
          }

          /**
           * Authenticate the user who tries to login
           * Thereby the backend directory will be set,
           * by authenticating the log atempt
           * If the result is not a statuscode 0, 505, 400, 401 or 404
           * the user is permitted to login and a session is stored
           * @param uuid Username
           * @param pass Password
           */
          var auth = function (uuid, pass)
          {
            Settings
              .initBackEnd(config.app.host, uuid, pass)
              .then(
              function (result)
              {
                if (result.valid === false && result.errorMessage)
                {
                  $scope.alert = {
                    login: {
                      display: true,
                      type: 'alert-error',
                      message: result.errorMessage
                    }
                  };
                  angular.element('#login button[type=submit]')
                    .text($rootScope.ui.login.button_login)
                    .removeAttr('disabled');
                  return false;
                }
                else if (result.valid === true)
                {
                  Session.set(result['X-SESSION_ID']);
                  preLoader();
                }
              });
          };

          /**
           * Preload logged userdata, all team names and id's
           * and the ACL to give the user the right permissions
           */
          var preLoader = function ()
          {
            angular.element('#login').hide();
            angular.element('#download').hide();
            angular.element('#preloader').show();

            progress(33, $rootScope.ui.login.loading_User);

            TeamUp._('user')
              .then(function (resources)
              {
                if (resources.error)
                {
                  console.warn('error ->', resources);
                }
                else
                {
                  $rootScope.app.resources = resources;
                  Store('app').save('resources', $rootScope.app.resources);
                  progress(66, $rootScope.ui.login.loading_teams);
                  return Teams.getAllLocal()
                }
              })
              .then(function (teams)
              {
                progress(100, $rootScope.ui.login.loading_everything);
                trackGa('send', 'event', 'Login', 'User login', 'team uuid ' + $rootScope.app.resources.teamUuids[0]);
                //update the avatar once, because the resources were not set when the directive was loaded
                $rootScope.showChangedAvatar('team', $rootScope.app.resources.uuid);
                //TODO for testpurposes only
                //Permission.saveProfile();

                Permission.getAccess();

                setTimeout(
                  function ()
                  {
                    angular.element('.navbar').show();
                    angular.element('body').addClass('background');

                    if (!$rootScope.browser.mobile)
                    {
                      angular.element('#footer').show();
                    }
                  }, 100);
              });
          };

          /**
           * The progressbar will show which data is loading at the moment
           * @param ratio Shows on a scale of one till hundred, how much data is already loaded
           * @param message
           */
          var progress = function (ratio, message)
          {
            angular.element('#preloader .progress .bar').css({width: ratio + '%'});
            angular.element('#preloader span').text(message);
          };

          if (localStorage.hasOwnProperty('sessionTimeout'))
          {
            localStorage.removeItem('sessionTimeout');

            $scope.alert = {
              login: {
                display: true,
                type: 'alert-error',
                message: $rootScope.ui.teamup.sessionTimeout
              }
            };
          }
        }
      ]);
  }
);
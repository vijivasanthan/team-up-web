/*jslint node: true */
/*global angular */
'use strict';

angular.module('WebPaige.Controllers.Login', [])

/**
 * Login controller
 */
.controller('login',
[ '$rootScope', '$location', '$q', '$scope', 'Session', 'User', 'Teams', 'Messages', 'Storage', '$routeParams', 'Settings', 'Profile', 'MD5', 
        function($rootScope, $location, $q, $scope, Session, User, Teams, Messages, Storage, $routeParams, Settings, Profile, MD5) {
            var self = this;

            /**
             * Set default views
             */
            if ($routeParams.uuid && $routeParams.key) {
                $scope.views = {
                    changePass : true
                };

                $scope.changepass = {
                    uuid : $routeParams.uuid,
                    key : $routeParams.key
                }
            } else {
                $scope.views = {
                    login : true,
                    forgot : false
                };
            }
            
            /**
             * Set default alerts
             */
            $scope.alert = {
              login: {
                display:  false,
                type:     '',
                message:  ''
              },
              forgot: {
                display:  false,
                type:     '',
                message:  ''
              }
            };
            
            /**
             * Init rootScope app info container
             */
            if (!Storage.session.get('app')) Storage.session.add('app', '{}');
            
            /**
             * TODO
             * Lose this jQuery stuff later on!
             * 
             * Jquery solution of toggling between login and app view
             */
            $('.navbar').hide();
            $('#footer').hide();
            $('#watermark').hide();
            $('body').css({
              'backgroundColor': '#1dc8b6'
            });

            /**
             * TODO
             * use native JSON functions of angular and Store service
             */
            var logindata = angular.fromJson(Storage.get('logindata'));

            if (logindata && logindata.remember) $scope.logindata = logindata;
            
            /**
             * TODO
             * Remove unneccessary DOM manipulation
             * Use cookies for user credentials
             * 
             * Login trigger
             */
            $scope.login = function()
            {
              $('#alertDiv').hide();

              if (!$scope.logindata ||
                  !$scope.logindata.username || 
                  !$scope.logindata.password)
              {
                $scope.alert = {
                  login: {
                    display: true,
                    type:    'alert-error',
                    message: $rootScope.ui.login.alert_fillfiled
                  }
                };

                $('#login button[type=submit]')
                  .text($rootScope.ui.login.button_login)
                  .removeAttr('disabled');

                return false;     
              }

              $('#login button[type=submit]')
                .text($rootScope.ui.login.button_loggingIn)
                .attr('disabled', 'disabled');

              Storage.add('logindata', angular.toJson({
                username: $scope.logindata.username,
                password: $scope.logindata.password,
                remember: $scope.logindata.remember
              }));

              self.auth( $scope.logindata.username, MD5($scope.logindata.password ));
            };

            /**
             * Authorize user
             */
            self.auth = function (uuid, pass)
            {
              User.login(uuid.toLowerCase(), pass)
              .then(function (result)
                {
                if (result.status == 400)
                {
                  $scope.alert = {
                    login: {
                      display: true,
                      type: 'alert-error',
                      message: $rootScope.ui.login.alert_wrongUserPass
                    }
                  };

                  $('#login button[type=submit]')
                    .text($rootScope.ui.login.button_loggingIn)
                    .removeAttr('disabled');

                  return false;
                }
                else
                {
                  Session.set(result["X-SESSION_ID"]);

                  self.preloader();
                }
                });
            };
            
            
        } 
]);
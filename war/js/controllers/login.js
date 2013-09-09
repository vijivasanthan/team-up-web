/*jslint node: true */
/*global angular */
'use strict';

angular.module('WebPaige.Controllers.Login', [])

/**
 * Login controller
 */
.controller('login',
[ '$rootScope', '$location', '$q', '$scope', 'Session', 'User', 'Teams', 'Clients', 'Storage', '$routeParams', 'Settings', 'Profile', 'MD5', 
        function($rootScope, $location, $q, $scope, Session, User, Teams, Clients, Storage, $routeParams, Settings, Profile, MD5) {
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
                if (result.status == 400 || result.status == 403)
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
            
            
            /**
             * TODO
             * What happens if preloader stucks?
             * Optimize preloader and messages
             * 
             * Initialize preloader
             */
            self.preloader = function()
            {
              $('#login').hide();
              $('#download').hide();
              $('#preloader').show();

              self.progress(20, $rootScope.ui.login.loading_User);
              
              // preload the user's info 
              User.memberInfo()
              .then(function (resources)
              {
                if (resources.error)
                {
                  console.warn('error ->', resources);
                }
                else
                {
                  $rootScope.app.resources = resources;

                  self.progress(40, $rootScope.ui.login.loading_Teams);
                  
                  // preload the teams and members
                  Teams.query(true,{})
                  .then(function (teams)
                  {
                    console.log("got teams ");
                    
                    if (teams.error)
                    {
                      console.warn('error ->', teams);
                    }
                    
                    console.log("start to query team-clientgroup relation async ");
                    
                    self.progress(60, $rootScope.ui.login.loading_clientGroups);
                    // preload the clientGroups for each team
                    Teams.queryClientGroups(teams)
                    .then(function(){
                        console.log("got clientGroups belong to the teams ");
                        
                        self.progress(80, $rootScope.ui.login.loading_clientGroups);
                        
                        Clients.queryAll()
                        .then(function(){
                            console.log("got all clients in or not in the client groups ");
                            
                            Clients.query(false,{})
                            .then(function(){
                                console.log("got all grous and the clients in the groups ");
                                
                                finalize();
                            },function(error){
                                deferred.resolve({error: error});
                            })
                            
                            
                        },function(error){
                            deferred.resolve({error: error});
                        });
                        
                        
                    },function(error){
                        deferred.resolve({error: error});
                    });
                    
                    
                  },function (error){
                      deferred.resolve({error: error});
                  });
                }
              });
            };
            
            /**
             * Finalize the preloading
             */
            function finalize ()
            {
              // console.warn( 'settings ->',
              //               'user ->', angular.fromJson($rootScope.app.resources.settingsWebPaige).user,
              //               'widgets ->', angular.fromJson($rootScope.app.resources.settingsWebPaige).app.widgets,
              //               'group ->', angular.fromJson($rootScope.app.resources.settingsWebPaige).app.group);

              self.progress(100, $rootScope.ui.login.loading_everything);

              self.redirectToTeamPage();

//              self.getMessages();

//              self.getMembers();    
            }
            
            /**
             * Redirect to dashboard
             */
            self.redirectToTeamPage = function ()
            {
              $location.path('/team');

              setTimeout(function ()
              {
                $('body').css({ 'background': 'none' });
                $('.navbar').show();
                // $('#mobile-status-bar').show();
                // $('#notification').show();
                if (!$rootScope.browser.mobile) $('#footer').show();
                $('#watermark').show();
                $('body').css({ 'background': 'url(../img/bg.jpg) repeat' });
              }, 100);
            };
            
            /**
             * Progress bar
             */
            self.progress = function (ratio, message)
            {
              $('#preloader .progress .bar').css({ width: ratio + '%' }); 
              $('#preloader span').text(message);    
            };
        } 
]);
define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'login',
      [ '$rootScope', '$location', '$q', '$scope', 'Session', 'User', 'Teams', 'Clients', 'Storage', '$routeParams', 'Settings', 'Profile', 'MD5',
        function (
          $rootScope,
          $location,
          $q,
          $scope,
          Session,
          User,
          Teams,
          Clients,
          Storage,
          $routeParams,
          Settings,
          Profile,
          MD5
          )
        {
          var self = this;

          // console.log('location ->', $location.path());

          if ($location.path() == '/logout')
          {
            $('body').css(
              {
                'backgroundColor': '#1dc8b6',
                'backgroundImage': 'none'
              });
          }

          /**
           * Set default views
           */
          if ($routeParams.uuid && $routeParams.key)
          {
            $scope.views = {
              changePass: true
            };

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

          /**
           * Set default alerts
           */
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

          /**
           * Init rootScope app info container
           */
          if (! Storage.session.get('app')) Storage.session.add('app', '{}');

          /**
           * TODO
           * Lose this jQuery stuff later on!
           *
           * Jquery solution of toggling between login and app view
           */
          $('.navbar').hide();
          $('#footer').hide();
          $('#watermark').hide();
          $('body').css(
            {
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
          $scope.login = function ()
          {
            $('#alertDiv').hide();

            if (! $scope.logindata || ! $scope.logindata.username || ! $scope.logindata.password)
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

            Storage.add(
              'logindata', angular.toJson(
                {
                  username: $scope.logindata.username,
                  password: $scope.logindata.password,
                  remember: $scope.logindata.remember
                }));

            self.auth($scope.logindata.username, MD5($scope.logindata.password));
          };

          /**
           * Authorize user
           */
          self.auth = function (uuid, pass)
          {
            User.login(uuid.toLowerCase(), pass)
              .then(
              function (result)
              {
                if (result.status == 400 || result.status == 403 || result.status == 404)
                {
                  $scope.alert = {
                    login: {
                      display: true,
                      type:    'alert-error',
                      message: $rootScope.ui.login.alert_wrongUserPass
                    }
                  };

                  $('#login button[type=submit]')
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

          var initAvatarUrls = function (members, type)
          {
            if (type == "team")
            {
              angular.forEach(
                members, function (mem)
                {
                  // load the avatr URL and store them into the local storage
                  var getAvatarUrl = $rootScope.config.host + $rootScope.config.namespace + "/team/member/" + mem.uuid + "/photo";
                  Teams.loadImg(getAvatarUrl).then(
                    function (res)
                    {
                      if (res.path)
                      {
                        Storage.avatar.addurl(mem.uuid, res.path);
                        console.log("Member Avatar path for " + mem.uuid + " - " + res.path);
                        console.log("get it from the storage " + Storage.avatar.geturl(mem.uuid));
                      }
                    });
                });
            }
            else if (type == "client")
            {
              angular.forEach(
                members, function (mem)
                {
                  // load the avatr URL and store them into the local storage
                  var getAvatarUrl = $rootScope.config.host + $rootScope.config.namespace + "/client/" + mem.uuid + "/photo";
                  Clients.loadImg(getAvatarUrl).then(
                    function (res)
                    {
                      if (res.path)
                      {
                        Storage.avatar.addurl(mem.uuid, res.path);
                        console.log("Client Avatar path for " + mem.uuid + " - " + res.path);
                        console.log("get it from the storage " + Storage.avatar.geturl(mem.uuid));
                      }
                    });
                });
            }

          };

          /**
           * TODO
           * What happens if preloader stucks?
           * Optimize preloader and messages
           *
           * Initialize preloader
           */
          self.preloader = function ()
          {
            $('#login').hide();
            $('#download').hide();
            $('#preloader').show();

            self.progress(20, $rootScope.ui.login.loading_User);

            // preload the user's info
            User.memberInfo()
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

                  self.progress(40, $rootScope.ui.login.loading_Teams);

                  // preload the teams and members
                  Teams.query(true, {})
                    .then(
                    function (teams)
                    {
                      console.log("got teams ", teams);

                      // try to get the members not in the teams Aync
                      console.log("got members not in any teams");
                      Teams.queryMembersNotInTeams().then(
                        function (result)
                        {
                          console.log("all members loaded (include the members not in any teams)", result);
                          initAvatarUrls(result, "team");
                        }, function (error)
                        {

                        });

                      if (teams.error)
                      {
                        console.warn('error ->', teams);
                      }

                      console.log("start to query team-clientgroup relation async ");

                      self.progress(60, $rootScope.ui.login.loading_clientGroups);
                      // preload the clientGroups for each team
                      Teams.queryClientGroups(teams)
                        .then(
                        function ()
                        {
                          console.log("got clientGroups belong to the teams ");

                          self.progress(80, $rootScope.ui.login.loading_clientGroups);

                          Clients.queryAll()
                            .then(
                            function (res_clients)
                            {
                              console.log("got all clients in or not in the client groups ", res_clients);
                              initAvatarUrls(res_clients, "client");

                              Clients.query(false, {})
                                .then(
                                function ()
                                {
                                  console.log("got all grous and the clients in the groups ");

                                  finalize();
                                }, function (error)
                                {
                                  deferred.resolve({error: error});
                                })

                            }, function (error)
                            {
                              deferred.resolve({error: error});
                            });

                        }, function (error)
                        {
                          deferred.resolve({error: error});
                        });

                    }, function (error)
                    {
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

            setTimeout(
              function ()
              {
                $('body').css({ 'background': 'none' });
                $('.navbar').show();
                // $('#mobile-status-bar').show();
                // $('#notification').show();
                if (! $rootScope.browser.mobile) $('#footer').show();
                $('#watermark').show();
                $('body').css({ 'background': 'url(../images/bg.jpg) repeat' });
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

  }
);
define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'login',
      [
        '$rootScope', '$location', '$q', '$scope', 'Session', 'Teams', 'Clients', 'Store', '$routeParams', 'TeamUp',
        function ($rootScope, $location, $q, $scope, Session, Teams, Clients, Store, $routeParams, TeamUp)
        {
          var self = this;

          if ($location.path() == '/logout')
          {
            $('body').css(
              {
                'backgroundColor': '#1dc8b6',
                'backgroundImage': 'none'
              });
          }

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

          $('.navbar').hide();
          $('#footer').hide();
          $('#watermark').hide();
          $('body').css({ 'backgroundColor': '#1dc8b6' });

          var logindata = Store('app').get('logindata');

          if (logindata && logindata.remember) $scope.logindata = logindata;

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

            Store('app').save(
              'logindata',
              {
                username: $scope.logindata.username,
                password: $scope.logindata.password,
                remember: $scope.logindata.remember
              }
            );

            self.auth($scope.logindata.username, MD5.parse($scope.logindata.password));
          };

          self.auth = function (uuid, pass)
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
              }
            )
          };


          //          Taken from Storage module
          //          Storage.avatar.addurl(mem.uuid, res.path);
          //          var addAvatarURLtoStorage = function (id, avatarUrl)
          //          {
          //            var avatarUrls = angular.fromJson(getFromLocalStorage('avatarUrls'));
          //
          //            if (avatarUrls)
          //            {
          //              angular.forEach(
          //                avatarUrls, function (item)
          //                {
          //                  if (item.id == id)
          //                  {
          //                    item.url = avatarUrl;
          //                  }
          //                  else
          //                  {
          //                    var newItem = {'id': id, 'url': avatarUrl };
          //                    avatarUrls.add(newItem);
          //                  }
          //                });
          //            }
          //            else
          //            {
          //              avatarUrls = [
          //                {
          //                  'id':  id,
          //                  'url': avatarUrl
          //                }
          //              ];
          //            }
          //            addToLocalStorage('avatarUrls', angular.toJson(avatarUrls));
          //          };

          //          var initAvatarUrls = function (members, type)
          //          {
          //            if (type == "team")
          //            {
          //              angular.forEach(
          //                members,
          //                function (mem)
          //                {
          //                  var getAvatarUrl = $rootScope.config.host + $rootScope.config.namespace +
          //                                     "/team/member/" + mem.uuid + "/photo";
          //
          //                  Teams.loadImg(getAvatarUrl)
          //                    .then(
          //                    function (res)
          //                    {
          //                      if (res.path)
          //                      {
          //                        Storage.avatar.addurl(mem.uuid, res.path);
          //                      }
          //                    });
          //                }
          //              );
          //            }
          //            else if (type == "client")
          //            {
          //              angular.forEach(
          //                members, function (mem)
          //                {
          //                  var getAvatarUrl = $rootScope.config.host + $rootScope.config.namespace +
          //                                     "/client/" + mem.uuid + "/photo";
          //
          //                  Clients.loadImg(getAvatarUrl)
          //                    .then(
          //                    function (res)
          //                    {
          //                      if (res.path)
          //                      {
          //                        Storage.avatar.addurl(mem.uuid, res.path);
          //                      }
          //                    });
          //                });
          //            }
          //          };

          // TODO: Move this to somewhere later on!
          function queryMembersNotInTeams ()
          {
            TeamUp._('teamMemberFree')
              .then(
              function (result) { Store('app').save('members', result) }
            );
          }

          self.preloader = function ()
          {
            $('#login').hide();
            $('#download').hide();
            $('#preloader').show();

            self.progress(20, $rootScope.ui.login.loading_User);

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

                  self.progress(40, $rootScope.ui.login.loading_Teams);

                  Teams.query(true, {})
                    .then(
                    function (teams)
                    {
                      queryMembersNotInTeams();

                      if (teams.error)
                      {
                        console.warn('error ->', teams);
                      }

                      self.progress(60, $rootScope.ui.login.loading_clientGroups);

                      Teams.queryClientGroups(teams)
                        .then(
                        function ()
                        {
                          self.progress(80, $rootScope.ui.login.loading_clientGroups);

                          TeamUp._('clientsQuery')
                            .then(
                            function (res_clients)
                            {
                              // initAvatarUrls(res_clients, "client");

                              Clients.query(false, {})
                                .then(
                                function ()
                                {
                                  self.progress(100, $rootScope.ui.login.loading_everything);

                                  $location.path('/team');

                                  setTimeout(
                                    function ()
                                    {
                                      $('.navbar').show();
                                      $('body').css({ 'background': 'url(../images/bg.jpg) repeat' });
                                      if (! $rootScope.browser.mobile) $('#footer').show();
                                    }, 100);
                                });
                            });
                        });
                    });
                }
              });
          };

          self.progress = function (ratio, message)
          {
            $('#preloader .progress .bar').css({ width: ratio + '%' });
            $('#preloader span').text(message);
          };
        }
      ]);
  }
);
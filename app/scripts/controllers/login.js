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
        'Profile',
        'User',
        'Environment',
        'Network',
        '$filter',
        function (
          $rootScope, $location, $q, $scope, Session, Teams, Clients, Store, $routeParams, TeamUp, Dater, Profile, User, Environment, Network, $filter
          )
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

          if (! Store('app').get('app'))
          {
            Store('app').save('app', '{}');
          }

          angular.element('.navbar').hide();
          angular.element('#footer').hide();
          angular.element('#watermark').hide();
          angular.element('body').css({ 'backgroundColor': '#1dc8b6' });

          var loginData = Store('app').get('loginData');

          if (loginData && loginData.remember) $scope.loginData = loginData;

          $scope.login = function ()
          {
            var periods = Store('app').get('periods');
            var periodsNext = Store('app').get('periodsNext');

            angular.element('#alertDiv').hide();

            if (! $scope.loginData || ! $scope.loginData.username || ! $scope.loginData.password)
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

            Store('app').save('periods', periods);
            Store('app').save('periodsNext', periodsNext);

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
                var status = 0;
                if (result.status)
                {
                  status = result.status;
                }
                else if (result.error && result.error.status)
                {
                  status = result.error.status;
                }
                if (status == 400 ||
                    status == 403 ||
                    status == 404)
                {
                  $scope.alert = {
                    login: {
                      display: true,
                      type: 'alert-error',
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
                      type: 'alert-error',
                      message: $rootScope.ui.login.alert_network
                    }
                  };

                  angular.element('#login button[type=submit]')
                    .text($rootScope.ui.login.button_loggingIn)
                    .removeAttr('disabled');

                  return false;
                }
                else if (result.error)
                {
                  $scope.alert = {
                    login: {
                      display: true,
                      type: 'alert-error',
                      message: $rootScope.ui.login.alert_wrongUserPass
                    }
                  };

                  angular.element('#login button[type=submit]')
                    .text($rootScope.ui.login.button_loggingIn)
                    .removeAttr('disabled');

                  console.log("Pay attention, this might caused by the Log module");
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
            TeamUp._('teamMemberFree').then(
              function (result) { Store('app').save('members', result) }
            );
          }

          // Query the tasks for login user and all other unsigned task in login user's team
          function queryTasks (teams)
          {
            // query my tasks
            TeamUp._("taskMineQuery").then(
                function (result) {
                  Store('app').save('myTasks', result)
                }
            );

            // query unassigned tasks from each team
            var allTasks = [];

            angular.forEach(
              teams,
              function (team_obj)
              {
                TeamUp._(
                  "taskByTeam",
                  {fourth: team_obj.uuid}
                ).then(
                  function (result)
                  {
                    angular.forEach(
                      result,
                      function (taskObj)
                      {
                        var foundTask = $filter('getByUuid')(allTasks, taskObj.uuid);

                        if (foundTask == null)
                        {
                          allTasks.push(taskObj);
                        }
                      }
                    );

                    Store('app').save('allTasks', allTasks);
                  }
                );
              }
            );
          }

          /**
           * add teams to the logged user localStorage
           */
          function updateLoggedUserTeams()
          {
            var userResources = Store('app').get('resources'),
                teamsUser = _.pluck($scope.$root.getTeamsofMembers(userResources.uuid), 'uuid');

            userResources.teamUuids = teamsUser;

            $rootScope.app.resources = userResources;
            Store('app').save('resources', userResources);
          }

          function enhanceTasks ()
          {
            var taskGroups = ['myTasks', 'allTasks'];

            angular.forEach(
              taskGroups,
              function (label)
              {
                var group = Store('app').get(label);

                angular.forEach(
                  group,
                  function (task)
                  {
					if(typeof(task) === 'object')
					{
						var client = $rootScope.getClientByID(task.relatedClientUuid);

						if(client != null)
						{
							task.relatedClientName = client.firstName + ' ' + client.lastName;
						}
						else
						{
							console.log('client ', task.relatedClientUuid, task);
						}
					}
                  }
                );

                Store('app').save(label, group);
              }
            );
          }

          var preLoader = function ()
          {
            angular.element('#login').hide();

            angular.element('#download').hide();

            angular.element('#preloader').show();

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

                  Store('app').save('resources', $rootScope.app.resources);

                  progress(40, $rootScope.ui.login.loading_Teams);

                  Teams.query(true, {})
                    .then(
                    function (teams)
                    {
                      queryMembersNotInTeams();

                      queryTasks(teams);

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
                            function (allClients)
                            {
                              // Save all clients into the localStorage
                              Store('app').save('clients', allClients);

                              Clients.query(false, {})
                                .then(
                                function ()
                                {
                                  progress(100, $rootScope.ui.login.loading_everything);

                                  // TODO: Blend it in the modal!
                                  enhanceTasks();


                                  standbyLogin()
                                    .then(
                                    function ()
                                    {

                                      Teams.query()
                                        .then(
                                        function ()
                                        {
                        //update localStorage logged user
                        updateLoggedUserTeams();

                        $location.path('/tasks2');

                                          setTimeout(
                                            function ()
                                            {
                                              angular.element('.navbar').show();
                                              angular.element('body').css({ 'background': 'url(../images/bg.jpg) repeat' });

                                              if (! $rootScope.browser.mobile)
                                              {
                                                angular.element('#footer').show();
                                              }
                                            }, 100);
                                        }
                                      );
                                    }
                                  )
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

          function standbyLogin(){
            var deferred = $q.defer();
            console.log("about to get user resources");
            User.resources().then(function (resources) {
              console.log(resources);
              console.log("about to setup env");
              Environment.setup().then(function () {
                console.log("about to get groups");
                Network.groups().then(function (groups) {
                  console.log(groups);
                  console.log("about to get population");
                  Network.population().then(function () {
                    deferred.resolve();
                    configure(resources, groups);
                  });
                });
              });
            });

            return deferred.promise;
          }

          function configure(resources, groups) {
            var settings = angular.fromJson(resources.settingsWebPaige) || {},
              sync = false,
              parenting = false,
              defaults = $rootScope.StandBy.config.defaults.settingsWebPaige;

            var _groups = function (groups) {
              var _groups = {};
              _.each(groups, function (group) {
                _groups[group.uuid] = {
                  status: true,
                  divisions: false
                };
              });

              return _groups;
            };

            if (settings != null || settings != undefined) {
              if (settings.user) {
                if (settings.user.language) {
                  $rootScope.changeLanguage(angular.fromJson(resources.settingsWebPaige).user.language);
                  defaults.user.language = settings.user.language;
                } else {
                  $rootScope.changeLanguage($rootScope.StandBy.config.defaults.settingsWebPaige.user.language);
                  sync = true;
                }
              } else {
                sync = true;
              }

              if (settings.app) {
                if (settings.app.widgets) {
                  if (settings.app.widgets.groups) {
                    var oldGroupSetup = false;

                    if (!jQuery.isEmptyObject(settings.app.widgets.groups)) {
                      _.each(settings.app.widgets.groups, function (value) {
                        if (typeof value !== 'object' || value == {})
                          oldGroupSetup = true;
                      });
                    } else {
                      oldGroupSetup = true;
                    }

                    if (oldGroupSetup) {
                      defaults.app.widgets.groups = _groups(groups);
                      sync = true;
                    } else {
                      defaults.app.widgets.groups = settings.app.widgets.groups;
                    }
                  } else {
                    defaults.app.widgets.groups = _groups(groups);
                    sync = true;
                  }
                } else {
                  defaults.app.widgets = { groups: _groups(groups) };
                  sync = true;
                }

                if (settings.app.group && settings.app.group != undefined) {
                  var exists = true;

                  _.each(groups, function (_group) {
                    var firstGroup = new RegExp(settings.app.group);

                    if (!firstGroup.test(_group.uuid)) {
                      if (!exists) exists = false;
                    } else {
                      exists = true;
                    }
                  });

                  if (!exists) sync = true;
                } else {
                  parenting = true;
                  sync = true;
                }
              } else {
                defaults.app = {
                  widgets: {
                    groups: _groups(groups)
                  }
                };

                sync = true;
              }
            } else {
              defaults = {
                user: $rootScope.StandBy.config.defaults.settingsWebPaige.user,
                app: {
                  widgets: {
                    groups: _groups(groups)
                  },
                  group: groups[0].uuid
                }
              };
              sync = true;
            }

            if (sync) {
              if (parenting) {
                Groups.parents().then(function (_parent) {
                  if (_parent != null) {
                    defaults.app.group = _parent;
                  }
                  else {
                    defaults.app.group = groups[0].uuid;
                  }

                  Settings.save(resources.uuid, defaults).then(function () {
                    User.resources().then(function (got) {
                      $rootScope.StandBy.resources = got;
                      finalize();
                    });
                  });
                });
              } else {
                defaults.app.group = groups[0].uuid;

                Settings.save(resources.uuid, defaults).then(function () {
                  User.resources().then(function (got) {
                    $rootScope.StandBy.resources = got;
                    finalize();
                  });
                });
              }
            } else {
              try {
                ga('send', 'pageview', {
                  'dimension1': resources.uuid,
                  'dimension2': $rootScope.StandBy.environment.domain
                });

                ga('send', 'event', 'Login', resources.uuid);
              } catch (err) {
                // console.warn('Google analytics library!', err);
              }

            }
          }

          var progress = function (ratio, message)
          {
            angular.element('#preloader .progress .bar').css({ width: ratio + '%' });
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

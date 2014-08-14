define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'profileCtrl',
      [
        '$rootScope',
        '$scope',
        '$q',
        '$location',
        '$window',
        '$route',
        'data',
        'Store',
        'Teams',
        'Dater',
        '$filter',
        'TeamUp',
        '$timeout',
        function ($rootScope, $scope, $q, $location, $window, $route, data, Store, Teams,
                  Dater, $filter, TeamUp, $timeout)
        {
          $rootScope.fixStyles();

          $scope.self = this;

          $scope.roles = config.app.roles;
          $scope.mfuncs = config.app.mfunctions;

          $scope.data = data;

          // TODO: Still needed?
          $scope.noImgURL = config.app.noImgURL;

          $scope.profilemeta = data;
          $scope.profilemeta.birthday = $filter('nicelyDate')(data.birthDate);

          $scope.currentRole = $scope.profilemeta.role;

          // TODO: Investigate whether they are in use!
          $scope.imgHost = config.app.host;
          $scope.ns = config.app.namespace;

          var teams = [];
          $scope.selectTeams = Store('app').get('teams');

          angular.forEach(
            $scope.profilemeta.teamUuids,
            function (teamId)
            {
              angular.forEach(
                $scope.selectTeams,
                function (team)
                {
                  if (team.uuid == teamId)
                  {
                    teams.push(team);
                  }
                }
              );
            }
          );

          if (teams.length == 0)
          {
            angular.forEach(
              $scope.selectTeams,
              function (team)
              {
                if (team.uuid == sessionStorage.getItem(data.uuid + '_team'))
                {
                  teams.push(team);
                }
              }
            );
          }

          $scope.teams = teams;

          $scope.forms = {
            add: false,
            edit: false
          };

          setView($location.hash());

          function setView (hash)
          {
            $scope.views = {
              profile: false,
              edit: false,
              editImg: false
            };

            $scope.views[hash] = true;

            $scope.views.user = (($rootScope.app.resources.uuid == $route.current.params.userId));
          }

          $scope.setViewTo = function (hash)
          {
            $scope.$watch(
              $location.hash(),
              function ()
              {
                $location.hash(hash);

                setView(hash);
              }
            );
          };

          // Save a profile
          $scope.save = function (resources)
          {
            // let user know that user need to re-relogin if the login-user's role is changed.
            if ($scope.currentRole != resources.role && $rootScope.app.resources.uuid == resources.uuid)
            {
              if (! confirm($rootScope.ui.profile.roleChangePrompt))
              {
                return;
              }
            }

            // check if the member is belong to any team, warn user to put his/herself to a team
            if (resources.teamUuids == null || typeof resources.teamUuids[0] == 'undefined')
            {
              resources.teamUuids = [];

              if ($scope.teams.length == 0)
              {
                //resources.teamUuids.push($scope.selectTeams[0].uuid);
                resources.teamUuids.push(sessionStorage.getItem(resources.uuid + '_team'));
              }
              else
              {
                resources.teamUuids.push($scope.teams[0].uuid);
              }
              if (resources.teamUuids[0] == null)
              {
                $rootScope.notifier.error($rootScope.ui.profile.specifyTeam);
                return;
              }
            }

            $rootScope.statusBar.display($rootScope.ui.profile.saveProfile);

            // deal with birthday
            try
            {
              resources.birthDate = Dater.convert.absolute(resources.birthday, 0);
            }
            catch (error)
            {
              console.log(error);
              $rootScope.notifier.error($rootScope.ui.teamup.birthdayError);

              return;
            }

            delete resources.birthday;

            TeamUp._(
              'profileSave',
              {
                second: resources.teamUuids[0],
                fourth: resources.uuid
              },
              resources
            ).then(
              function (result)
              {
                if (result.error)
                {
                  $rootScope.notifier.error('Error with saving profile information.');
                  console.warn('error ->', result);
                }
                else
                {
                  $rootScope.statusBar.display($rootScope.ui.profile.refreshing);

                  TeamUp._(
                    'profileGet',
                    {
                      third: $route.current.params.userId
                    },
                    null,
                    function (resources)
                    {
                      if ($route.current.params.userId == $rootScope.app.resources.uuid)
                      {
                        $rootScope.app.resources = result;

                        Store('app').save('resources', resources);
                      }
                    }
                  ).then(
                    function (data)
                    {
                      if (data.error)
                      {
                        $rootScope.notifier.error('Error with getting profile data.');
                        console.warn('error ->', data);
                      }
                      else
                      {
                        $rootScope.notifier.success($rootScope.ui.profile.dataChanged);

                        $scope.data = data;

                        $rootScope.statusBar.off();

                        $scope.setViewTo('profile');

                        // put back the birthday for display after update the member.
                        resources.birthday = $filter('nicelyDate')(resources.birthDate);

                        // will logout if the role is changed for the user him/her-self.
                        if ($scope.currentRole != resources.role && $rootScope.app.resources.uuid == $route.current.params.userId)
                        {
                          $rootScope.nav("logout");
                        }

                        // refresh the teams in the background
                        angular.forEach(
                          resources.teamUuids, function (teamId)
                          {
                            // FIXME: Message is not absent in localization file so turned off
                            // $rootScope.statusBar.display($rootScope.ui.profile.refreshTeam);

                            Teams.query(
                              false,
                              { uuid: teamId }
                            ).then(
                              function () { $rootScope.statusBar.off() }
                            );
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          };

          $scope.editProfile = function () { setView('edit') };

          // Change an avatar
          $scope.editImg = function ()
          {
            $scope.uploadURL = $scope.imgHost + $scope.ns + "/team/member/" + $route.current.params.userId + "/photo?square=true";
            $scope.setViewTo('editImg');
          };

          $scope.confirmDeleteProfile = function ()
          {
            $timeout(
              function ()
              {
                angular.element('#confirmProfileModal').modal('show');
              }
            );
          };

          // Remove a profile completely
          $scope.deleteProfile = function ()
          {
            angular.element('#confirmProfileModal').modal('hide');

            $rootScope.statusBar.display($rootScope.ui.teamup.deletingMember);

            TeamUp._(
              'memberDelete',
              { third: $scope.profilemeta.uuid }
            ).then(
              function (result)
              {
                if (result.uuid)
                {
                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);

                  angular.forEach(
                    $scope.profilemeta.teamUuids, function (teamId, i)
                    {
                      $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                      Teams.query(
                        false,
                        { 'uuid': teamId }
                      ).then(
                        function () { $rootScope.statusBar.off() }
                      );
                    });

                  TeamUp._('teamMemberFree')
                    .then(
                    function (result)
                    {
                      Store('app').save('members', result);

                      $rootScope.statusBar.off();
                    },
                    function (error) { console.log(error) }
                  );
                }
              }, function (error) { console.log(error) }
            );
          };
        }
      ]
    );
  }
);
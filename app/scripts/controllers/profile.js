define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'profileCtrl',
      [
        '$rootScope', '$scope', '$q', '$location', '$window', '$route', 'data', 'Storage', 'Teams', 'Dater',
        '$filter', 'TeamUp',
        function ($rootScope, $scope, $q, $location, $window, $route, data, Storage, Teams, Dater, $filter, TeamUp)
        {
          $rootScope.fixStyles();

          $scope.self = this;

          $scope.imgHost = profile.host();
          $scope.ns = profile.ns();

          $scope.roles = $rootScope.config.roles;
          $scope.mfuncs = $rootScope.config.mfunctions;

          $scope.data = data;
          $scope.noImgURL = $rootScope.config.noImgURL;

          $scope.profilemeta = data;
          $scope.profilemeta.birthday = $filter('nicelyDate')(data.birthDate);

          $scope.currentRole = $scope.profilemeta.role;

          var teams = [];
          var storage_teams = angular.fromJson(Storage.get("Teams"));

          angular.forEach(
            $scope.profilemeta.teamUuids, function (teamId)
            {
              angular.forEach(
                storage_teams, function (team)
                {
                  if (team.uuid == teamId)
                  {
                    teams.push(team);
                  }
                });
            });

          if (teams.length == 0)
          {
            angular.forEach(
              storage_teams, function (team)
              {
                if (team.uuid == sessionStorage.getItem(data.uuid + "_team"))
                {
                  teams.push(team);
                }
              });
          }

          $scope.teams = teams;
          $scope.selectTeams = storage_teams;

          $scope.forms = {
            add:  false,
            edit: false
          };

          setView($location.hash());

          function setView (hash)
          {
            $scope.views = {
              profile: false,
              edit:    false,
              editImg: false
            };

            $scope.views[hash] = true;

            $scope.views.user = (($rootScope.app.resources.uuid == $route.current.params.userId));


            //            // load the avatar by ajax way
            //            var memberId = $route.current.params.userId;
            //            var imgURL = $scope.imgHost + $scope.ns + "/team/member/" + memberId + "/photourl";
            //
            //            Teams.loadImg(imgURL).then(
            //              function (result)
            //              {
            //                // console.log("loading pic " + imgURL);
            //
            //                var imgId = memberId.replace(".", "").replace("@", "");
            //
            //                if (result.status && (
            //                  result.status == 404 || result.status == 403 || result.status == 500))
            //                {
            //                  console.log("loading pic ", result);
            //                  $('#profile #img_' + imgId).css('background-image', 'url(' + $scope.noImgURL + ')');
            //                }
            //                else
            //                {
            //                  var realImgURL = $scope.imgHost.replace("\\:", ":") + result.path;
            //                  $('#profile #img_' + imgId).css('background-image', 'url(' + realImgURL + ')');
            //                }
            //              }, function (error) { console.log("error when load pic " + error) });


          }

          $scope.setViewTo = function (hash)
          {
            $scope.$watch(
              $location.hash(), function ()
              {
                $location.hash(hash);

                setView(hash);
              });
          };

          // console.log('userID ->', $route.current.params.userId, $rootScope.app.resources.uuid);

          $scope.save = function (resources)
          {
            $rootScope.statusBar.display($rootScope.ui.profile.saveProfile);

            if (resources.teamUuids == null || typeof resources.teamUuids[0] == 'undefined')
            {
              resources.teamUuids = [];
              if ($scope.teams.length == 0)
              {
                //resources.teamUuids.push($scope.selectTeams[0].uuid);
                resources.teamUuids.push(sessionStorage.getItem(resources.uuid + "_team"));
              }
              else
              {
                resources.teamUuids.push($scope.teams[0].uuid);
              }
            }

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
                fourth: id
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

                        Storage.add('resources', angular.toJson(resources));
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

                        $scope.setViewTo("profile");

                        // refresh the teams in the background
                        angular.forEach(
                          resources.teamUuids, function (teamId)
                          {
                            var routePara = { uuid: teamId };

                            // TODO: Message is not absent in localization file so turned off
                            // $rootScope.statusBar.display($rootScope.ui.profile.refreshTeam);

                            Teams.query(false, routePara)
                              .then(
                              function () { $rootScope.statusBar.off() }
                            );
                          });
                      }
                    });
                }
              });
          };


          $scope.editProfile = function () { setView('edit') };


//          $scope.editImg = function ()
//          {
//            $scope.uploadURL = $scope.imgHost + $scope.ns +
//                               "/team/member/" + $route.current.params.userId + "/photourl";
//
//            Teams.loadImg($scope.uploadURL)
//              .then(
//              function (result)
//              {
//                var imgHost = $scope.imgHost.replace("\\", "");
//
//                if (result.path)
//                {
//                  $scope.avatarURL = imgHost + result.path;
//                }
//
//                $scope.uploadURL = imgHost + $scope.ns +
//                                   "/team/member/" + $route.current.params.userId + "/photo";
//
//                $scope.setViewTo('editImg');
//              });
//          };


          $scope.deleteProfile = function ()
          {
            if (window.confirm($rootScope.ui.teamup.deleteConfirm))
            {
              $rootScope.statusBar.display($rootScope.ui.teamup.deletingMember);

              Teams.deleteMember($scope.profilemeta.uuid)
                .then(
                function (result)
                {
                  if (result.uuid)
                  {
                    $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);

                    angular.forEach(
                      $scope.profilemeta.teamUuids, function (teamId, i)
                      {
                        $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                        var routePara = {'uuid': teamId};
                        Teams.query(false, routePara)
                          .then(
                          function () { $rootScope.statusBar.off() }
                        );
                      });

                    Teams.queryMembersNotInTeams()
                      .then(
                      function ()
                      {
                        console.log("members not in any teams loaded ");
                        $rootScope.statusBar.off();
                      },
                      function (error) { console.log(error) }
                    );
                  }
                }, function (error) { console.log(error) });
            }
          };
        }
      ])
    ;
  }
);
define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'teamCtrl', [
        '$rootScope', '$scope', '$location', 'Teams', 'data', '$route', '$routeParams', 'Store', 'Dater', 'TeamUp',
        function ($rootScope, $scope, $location, Teams, data, $route, $routeParams, Store, Dater, TeamUp)
        {
          $rootScope.fixStyles();

          $scope.members = data.members;
          $scope.teams = data.teams;

          var params = $location.search();

          // TODO: Remove these ones too!
          $scope.imgHost = config.app.host;
          $scope.ns = config.app.ns;

          $scope.search = {
            query: ''
          };

          $scope.selection = {};

          $scope.data = data;

          $scope.roles = config.app.roles;
          $scope.mfuncs = config.app.mfunctions;

          var uuid, view;

          if (! params.uuid && ! $location.hash())
          {
            uuid = data.teams[0].uuid;
            view = 'team';

            $location.search(
              {
                uuid: data.teams[0].uuid
              }).hash('team');
          }
          else if (! params.uuid)
          {
            uuid = data.teams[0].uuid;
            view = $location.hash();

            $location.search(
              {
                uuid: data.teams[0].uuid
              });
          }
          else
          {
            uuid = params.uuid;
            view = $location.hash();
          }

          setTeamView(uuid);

          $scope.views = {
            team:      true,
            newTeam:   false,
            newMember: false,
            editTeam:  false
          };

          function setTeamView (id)
          {
            angular.forEach(
              data.teams,
              function (team)
              {
                if (team.uuid == id)
                {
                  $scope.team = team;
                }
              }
            );

            $scope.members = data.members[id];

            $scope.current = id;

            angular.forEach(
              $scope.members,
              function (member)
              {
                var imgURL = $scope.imgHost + $scope.ns +
                             "/team/member/" + member.uuid + "/photo?width=40&height=40";

                var imgId = member.uuid.replace(".", "").replace("@", "");
                $('.tab-content #img_' + imgId).css('background-image', 'url(' + imgURL + ')');

                // console.log('url, imgid ->', imgURL, imgId);

                //                TeamUp._(
                //                  'memberPhoto',
                //                  { third: member.uuid }
                //                ).then(
                //                  function (result)
                //                  {
                //                    console.log('result ->', result);
                //                    // console.log("loading pic " + imgURL);
                //
                ////                    var imgId = member.uuid.replace(".", "").replace("@", "");
                ////
                ////                    if (result.status && (result.status == 404 || result.status == 403 || result.status == 500))
                ////                    {
                ////                      console.log("no pics ", result);
                ////                    }
                ////                    else
                ////                    {
                ////                      var realImgURL = $scope.imgHost + result.path;
                ////                      $('.tab-content #img_' + imgId).css('background-image', 'url(' + realImgURL + ')');
                ////                    }
                //
                //                  },
                //                  function (error) { console.log("error when load pic " + error) }
                //                );

                //                var tempURL = $scope.imgHost + $scope.ns + "/team/member/" + member.uuid + "/photourl";
                //
                //                $scope.photoURL = tempURL;
                //
                //                Teams.loadImg(tempURL).then(
                //                  function (result)
                //                  {
                //                    console.log(result);
                //                  }
                //                );

              });


            $scope.team.phone = $rootScope.ui.teamup.loadingNumber;

            TeamUp._(
              'teamPhoneNumber',
              { second: $scope.team.uuid }
            ).then(
              function (result)
              {
                $scope.team.phone = result.phone;
              }
            );
          }

          $scope.requestTeam = function (current, switched)
          {
            setTeamView(current);

            $scope.$watch(
              $location.search(), function ()
              {
                $location.search(
                  {
                    uuid: current
                  });
              });
            if (switched)
            {
              if ($location.hash() != 'team')
              {
                $location.hash('team');
              }

              setView('team');
            }
          };

          var setView = function (hash)
          {
            $scope.views = {
              team:      false,
              newTeam:   false,
              newMember: false,
              editTeam:  false
            };

            $scope.views[hash] = true;
          };

          $scope.setViewTo = function (hash)
          {
            $scope.$watch(
              hash,
              function ()
              {
                $location.hash(hash);

                setView(hash);
              }
            );
          };

          setView(view);

          $scope.toggleSelection = function (group, master)
          {
            var flag = (master) ? true : false;

            angular.forEach(
              Store('app').get(group.uuid),
              function (member) { $scope.selection[member.uuid] = flag }
            );
          };

          $scope.editTeam = function (team)
          {
            $scope.teamEditForm = {
              name: team.name,
              uuid: team.uuid
            };

            $scope.views.editTeam = true;
          };

          $scope.cancelTeamEdit = function (team)
          {
            $scope.teamEditForm = {
              name: team.name,
              uuid: team.uuid
            };

            $scope.views.editTeam = false;
          };

          $scope.changeTeam = function (team)
          {
            if ($.trim(team.name) == '')
            {
              $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
              return;
            }

            $rootScope.statusBar.display($rootScope.ui.teamup.saveTeam);

            TeamUp._(
              'teamUpdate',
              { second: team.uuid },
              team
            ).then(
              function (result)
              {
                if (result.error)
                {
                  $rootScope.notifier.error("Error with saving team info : " + result.error);
                }
                else
                {
                  $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                  Teams.query(false, result)
                    .then(
                    function ()
                    {
                      $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                      $rootScope.statusBar.off();

                      $scope.team.name = team.name;
                      $scope.views.editTeam = false;
                    });
                }
              });
          };

          $scope.teamSubmit = function (team)
          {
            if (typeof team == 'undefined' || $.trim(team.name) == '')
            {
              $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
              return;
            }

            $rootScope.statusBar.display($rootScope.ui.teamup.saveTeam);

            TeamUp._(
              'teamAdd',
              { id: $rootScope.app.resources.uuid },
              team
            ).then(
              function (result)
              {
                if (result.error)
                {
                  $rootScope.notifier.error($rootScope.ui.teamup.teamSubmitError);
                }
                else
                {
                  $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                  Teams.query(false, result).then(
                    function (queryRs)
                    {
                      if (queryRs.error)
                      {
                        $rootScope.notifier.error($rootScope.ui.teamup.queryTeamError);
                        console.warn('error ->', queryRs);
                      }
                      else
                      {
                        $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                        $scope.closeTabs();

                        $scope.data = queryRs;

                        angular.forEach(
                          queryRs.teams, function (t_obj)
                          {
                            if (t_obj.uuid == result.uuid)
                            {
                              $scope.teams = queryRs.teams;

                              angular.forEach(
                                queryRs.teams, function (t)
                                {
                                  if (t.uuid == t_obj.uuid)
                                  {
                                    $scope.team = t;
                                  }
                                });

                              $scope.members = data.members[t_obj.uuid];

                              $scope.current = t_obj.uuid;

                              $scope.$watch(
                                $location.search(), function ()
                                {
                                  $location.search(
                                    {
                                      uuid: t_obj.uuid
                                    });
                                });
                            }
                          });
                      }

                      $rootScope.statusBar.off();

                    });
                }
              });
          };

          $scope.memberSubmit = function (member)
          {
            if (typeof member == 'undefined' || ! member.username || ! member.password || ! member.reTypePassword)
            {
              $rootScope.notifier.error($rootScope.ui.teamup.accountInfoFill);
              return;
            }

            if (member.password != member.reTypePassword)
            {
              $rootScope.notifier.error($rootScope.ui.teamup.passNotSame);
              return;
            }

            if (! member.team)
            {
              $rootScope.notifier.error($rootScope.ui.teamup.selectTeam);
              return;
            }

            $rootScope.statusBar.display($rootScope.ui.teamup.savingMember);

            TeamUp._(
              'memberAdd',
              null,
              {
                uuid:         member.username,
                userName:     member.username,
                passwordHash: MD5.parse(member.password),
                firstName:    member.firstName,
                lastName:     member.lastName,
                phone:        member.phone,
                teamUuids:    [member.team],
                role:         member.role,
                birthDate:    Dater.convert.absolute(member.birthDate, 0)
              }
            ).then(
              function (result)
              {
                // change the REST return to json.
                if (result.error)
                {
                  $rootScope.notifier.error($rootScope.ui.teamup.teamSubmitError + " : " + result.error);
                }
                else
                {
                  $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                  var routePara = {'uuid': result.teamId};

                  Teams.query(false, routePara)
                    .then(
                    function (queryRs)
                    {
                      if (queryRs.error)
                      {
                        $rootScope.notifier.error($rootScope.ui.teamup.queryTeamError);
                        console.warn('error ->', queryRs);
                      }
                      else
                      {
                        $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                        $scope.closeTabs();

                        $scope.data = queryRs;

                        angular.forEach(
                          queryRs.teams,
                          function (t_obj)
                          {
                            if (t_obj.uuid == routePara.uuid)
                            {
                              $scope.teams = queryRs.teams;

                              angular.forEach(
                                queryRs.teams, function (t)
                                {
                                  if (t.uuid == t_obj.uuid)
                                  {
                                    $scope.team = t;
                                  }
                                });

                              $scope.members = data.members[t_obj.uuid];

                              $scope.current = t_obj.uuid;

                              $scope.$watch(
                                $location.search(), function ()
                                {
                                  $location.search(
                                    {
                                      uuid: t_obj.uuid
                                    });
                                });
                            }
                          });
                      }

                      $rootScope.statusBar.off();
                    });
                }
              });
          };

          $scope.closeTabs = function ()
          {
            $scope.teamForm = {};

            $scope.memberForm = {};

            $scope.setViewTo('team');
          };

          $scope.editProfile = function (memberId, teamId)
          {
            sessionStorage.setItem(memberId + "_team", teamId);
          };

          $scope.noSharedStates = function (states)
          {
            var flag = true;
            var ret = true;

            angular.forEach(
              states,
              function (state)
              {
                if (state.share && flag)
                {
                  ret = false;
                  flag = false;
                }
              }
            );

            return ret;
          };

          $scope.deleteTeam = function ()
          {
            // console.log($scope.current);

            if (window.confirm($rootScope.ui.teamup.delTeamConfirm))
            {
              $rootScope.statusBar.display($rootScope.ui.teamup.deletingTeam);

              TeamUp._(
                'teamDelete',
                { second: $scope.current }
              ).then(
                function (result)
                {
                  if (result)
                  {
                    Teams.query(true, {}).then(
                      function (teams)
                      {
                        $scope.requestTeam(teams[0].uuid);

                        // locally refresh
                        angular.forEach(
                          $scope.teams, function (team, i)
                          {
                            if (team.uuid == result)
                            {
                              $scope.teams.splice(i, 1);
                            }
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
                      }, function (error) { console.log(error) });

                  }

                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                  $rootScope.statusBar.off();
                }, function (error) { console.log(error) });
            }
          };

          $scope.deleteMember = function (memberId)
          {
            if (window.confirm($rootScope.ui.teamup.deleteConfirm))
            {
              $rootScope.statusBar.display($rootScope.ui.teamup.deletingMember);

              TeamUp._(
                'memberDelete',
                { third: memberId }
              ).then(
                function (result)
                {
                  if (result.uuid)
                  {
                    $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);

                    // refresh the teams that contains  this user
                    angular.forEach(
                      $scope.members,
                      function (mem)
                      {
                        if (mem.uuid == memberId)
                        {
                          angular.forEach(
                            mem.teamUuids,
                            function (teamId)
                            {
                              $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                              var routePara = {'uuid': teamId};

                              Teams.query(false, routePara)
                                .then(
                                function () { $rootScope.statusBar.off() }
                              );

                              angular.forEach(
                                data.members[teamId],
                                function (mem, j)
                                {
                                  if (mem.uuid == memberId)
                                  {
                                    data.members[teamId].splice(j, 1);
                                  }
                                }
                              );
                            }
                          );
                        }
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
                }, function (error) { console.log(error) });
            }
          };


          // brefoe I know there is a good place to put this code
          // load the login user's avatar

          var imgURL = config.app.host + config.app.ns +
                       "/team/member/" + $rootScope.app.resources.uuid + "/photo?width=40&height=40";

          // console.log('imgURL ->', imgURL);

          /*
           var mId = $rootScope.app.resources.uuid;
           var imgId = mId.replace(".", "").replace("@", "");
           $('.navbar-inner #img_' + imgId).css('background-image', 'url(' + imgURL + ')');
           */

          //          Teams.loadImg(imgURL).then(
          //            function (result)
          //            {
          //              // console.log("loading pic " + imgURL);
          //
          //              var mId = $rootScope.app.resources.uuid;
          //              var imgId = mId.replace(".", "").replace("@", "");
          //
          //              if (result.status && (result.status == 404 || result.status == 403 || result.status == 500))
          //              {
          //                console.log("no pics ", result);
          //              }
          //              else
          //              {
          //                if (result.path)
          //                {
          //                  var realImgURL = profile.host().replace("\\:", ":") + result.path;
          //                  $('.navbar-inner #img_' + imgId).css('background-image', 'url("' + realImgURL + '")');
          //                }
          //              }
          //            }, function (error) { console.log("error when load pic " + error) }
          //          );


        }
      ]);
  }
);
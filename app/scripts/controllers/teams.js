define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'teamCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        'Teams',
        'data',
        '$route',
        '$routeParams',
        'Store',
        'Dater',
        'TeamUp',
        '$timeout',
        function ($rootScope, $scope, $location, Teams, data, $route, $routeParams, Store, Dater,
                  TeamUp, $timeout)
        {
          $rootScope.fixStyles();

          $scope.members = data.members;
          $scope.teams = data.teams;

          var params = $location.search();

          $scope.search = { query: '' };

          $scope.selection = {};

          $scope.data = data;

          $scope.roles = config.app.roles;

          // TODO: Readable variable name!
          $scope.mfuncs = config.app.mfunctions;

          var uuid,
              view;

          if (! params.uuid && ! $location.hash())
          {
            uuid = data.teams[0].uuid;
            view = 'team';

            $location.search({ uuid: data.teams[0].uuid }).hash('team');
          }
          else if (! params.uuid)
          {
            uuid = data.teams[0].uuid;
            view = $location.hash();

            $location.search({ uuid: data.teams[0].uuid });
          }
          else
          {
            uuid = params.uuid;
            view = $location.hash();
          }

          setTeamView(uuid);

          $scope.views = {
            team: true,
            newTeam: false,
            newMember: false,
            editTeam: false
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

            angular.forEach(
              $scope.members,
              function (member)
              {
                angular.forEach(
                  member.states,
                  function (state)
                  {
                    if (state.name == 'Location')
                    {
                      state.value_rscoded = 'loading address';

                      var coordinates = state.value.split(','),
                          latitude = parseFloat(coordinates[0]),
                          longitude = parseFloat(coordinates[1]);

                      // GoogleGEO.geocode(
                      //   {
                      //     'latLng': new google.maps.LatLng(latitude, longitude)
                      //   },
                      //   function (results, status)
                      //   {
                      //     // TODO: What if there are more results? Which one to pick?
                      //     // console.log('results ->', results);

                      //     if (status == google.maps.GeocoderStatus.OK)
                      //     {
                      //       if (results[1])
                      //       {
                      //         state.value_rscoded = results[1].formatted_address;
                      //       }
                      //       else
                      //       {
                      //         console.log('No results found for geo reversing!');
                      //       }
                      //     }
                      //     else
                      //     {
                      //       alert('Geocoder failed due to: ' + status);
                      //     }
                      //   }
                      // );

                    }
                  }
                );
              }
            );

            $scope.current = id;

          }

          $scope.requestTeam = function (current, switched)
          {
            setTeamView(current);

            $scope.$watch(
              $location.search(),
              function () { $location.search({ uuid: current }) }
            );

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
              team: false,
              newTeam: false,
              newMember: false,
              editTeam: false
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
                  $rootScope.notifier.error('Error with saving team info : ' + result.error);
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
                    }
                  );
                }
              }
            );
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

                  // TODO: Repetitive code!
                  Teams.query(false, result)
                    .then(
                    function (queries)
                    {
                      if (queries.error)
                      {
                        $rootScope.notifier.error($rootScope.ui.teamup.queryTeamError);

                        console.warn('error ->', queries);
                      }
                      else
                      {
                        $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                        $scope.closeTabs();

                        $scope.data = queries;

                        // also refresh the team-client group links cache 
                        Teams.queryClientGroups(queries.teams).then(
                          function (res)
                          {
                            console.log("new team added to team-client list", res);
                          });

                        angular.forEach(
                          queries.teams,
                          function (team)
                          {
                            if (team.uuid == result.uuid)
                            {
                              $scope.teams = queries.teams;

                              angular.forEach(
                                queries.teams,
                                function (_team)
                                {
                                  if (_team.uuid == team.uuid)
                                  {
                                    $scope.team = _team;
                                  }
                                });

                              $scope.members = data.members[team.uuid];

                              $scope.current = team.uuid;

                              $scope.$watch(
                                $location.search(),
                                function () { $location.search({ uuid: team.uuid }) }
                              );
                            }
                          }
                        );
                      }

                      $rootScope.statusBar.off();
                    }
                  );
                }
              }
            );
          };

          $scope.memberSubmit = function (member)
          {
            if (typeof member == 'undefined' || ! member.username || ! member.password || ! member.reTypePassword || ! member.birthDate)
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
                uuid: member.username,
                userName: member.username,
                passwordHash: MD5.parse(member.password),
                firstName: member.firstName,
                lastName: member.lastName,
                phone: member.phone,
                teamUuids: [member.team],
                role: member.role,
                birthDate: Dater.convert.absolute(member.birthDate, 0),
                function: member.function
              }
            ).then(
              function (result)
              {
                // change the REST return to json.
                if (result.error)
                {
                  $rootScope.notifier.error($rootScope.ui.teamup.teamSubmitError + ' : ' + result.error);
                }
                else
                {
                  $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                  // TODO: Repetitive code!
                  Teams.query(
                    false,
                    { 'uuid': result.teamId }
                  ).then(
                    function (queries)
                    {
                      if (queries.error)
                      {
                        $rootScope.notifier.error($rootScope.ui.teamup.queryTeamError);
                        console.warn('error ->', queries);
                      }
                      else
                      {
                        $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                        $scope.closeTabs();

                        $scope.data = queries;
                        var routePara = {'uuid': result.teamId};

                        angular.forEach(
                          queries.teams,
                          function (team)
                          {
                            if (team.uuid == routePara.uuid)
                            {
                              $scope.teams = queries.teams;

                              angular.forEach(
                                queries.teams,
                                function (_team)
                                {
                                  if (_team.uuid == team.uuid)
                                  {
                                    $scope.team = _team;
                                  }
                                });

                              $scope.members = data.members[team.uuid];

                              $scope.current = team.uuid;

                              $scope.$watch(
                                $location.search(),
                                function () { $location.search({ uuid: team.uuid }) }
                              );
                            }
                          }
                        );
                      }

                      $rootScope.statusBar.off();
                    }
                  );
                }
              }
            );
          };

          $scope.closeTabs = function ()
          {
            $scope.teamForm = {};

            $scope.memberForm = {};

            $scope.setViewTo('team');
          };

          $scope.editProfile = function (memberId, teamId) { sessionStorage.setItem(angular.lowercase(memberId) + '_team', teamId) };

          // give a special flag to member if there is no states being shared 
          $scope.noSharedStates = function (states)
          {
            var flag = true,
                result = true;

            angular.forEach(
              states,
              function (state)
              {
                if (state.share && flag)
                {
                  result = false;
                  flag = false;
                }
              }
            );

            return result;
          };

          $scope.confirmDeleteTeam = function ()
          {
            $timeout(
              function ()
              {
                angular.element('#confirmTeamModal').modal('show');
              }
            );
          };

          $scope.deleteTeam = function ()
          {
            // console.log($scope.current);

            angular.element('#confirmTeamModal').modal('show');

            $rootScope.statusBar.display($rootScope.ui.teamup.deletingTeam);

            TeamUp._(
              'teamDelete',
              { second: $scope.current }
            ).then(
              function (result)
              {
                if (result)
                {
                  Teams.query(
                    true,
                    {}
                  ).then(
                    function (teams)
                    {
                      $scope.requestTeam(teams[0].uuid);

                      // locally refresh
                      angular.forEach(
                        $scope.teams,
                        function (team, i)
                        {
                          if (team.uuid == result.result)
                          {
                            $scope.teams.splice(i, 1);
                          }
                        }
                      );

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
          };

          $scope._memberId = {};

          $scope.confirmDeleteMember = function (memberId)
          {
            $timeout(
              function ()
              {
                $scope._memberId = memberId;

                angular.element('#confirmMemberModal').modal('show');
              }
            );
          };

          $scope.deleteMember = function (memberId)
          {
            $scope._memberId = {};

            angular.element('#confirmMemberModal').modal('hide');

            $rootScope.statusBar.display($rootScope.ui.teamup.deletingMember);

            // lower case of the id :
            // TODO : we should also fix the issue in the backend.
            memberId = angular.lowercase(memberId);

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
                    function (member)
                    {
                      if (member.uuid == memberId)
                      {
                        angular.forEach(
                          member.teamUuids,
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
                              function (member, i)
                              {
                                if (member.uuid == memberId)
                                {
                                  data.members[teamId].splice(i, 1);
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
              }, function (error) { console.log(error) }
            );
          };

          // TODO: Investigate on this!
          $scope.$on(
            '$viewContentLoaded',
            function ()
            {
              console.log("teams : viewContentLoaded");

              // make sure the loading of the 
              if (! $rootScope.taskVisit)
              {
                $rootScope.$broadcast('taskFinishLoading');
                $rootScope.taskVisit = true;
              }
            }
          );

          $scope.convertUserName = function ()
          {
            $scope.memberForm.username = angular.lowercase($scope.memberForm.username);
          }

        }
      ]
    );
  }
);
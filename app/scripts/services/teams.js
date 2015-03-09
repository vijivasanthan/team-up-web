define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Teams',
      [
        '$resource', '$q', 'Store', '$rootScope', 'TeamUp', '$injector',
        function ($resource, $q, Store, $rootScope, TeamUp, $injector)
        {
          var TeamsService = $resource();

          // Get the list of teams
          TeamsService.prototype.query = function (only, routeParams)
          {
            var deferred = $q.defer();

            // Get the list of teams
            TeamUp._('teamQuery')
              .then(
              function (teams)
              {
                Store('app').save('teams', teams);

                if (!only)
                {
                  var calls = [],
                    data = {
                      teams: teams,
                      members: {}
                    };

                  // Walk through the team list
                  angular.forEach(
                    teams,
                    function (team)
                    {
                      if (typeof routeParams == "undefined" || team.uuid == routeParams.uuid)
                      {
                        calls.push(
                          TeamUp._(
                            'teamStatusQuery',
                            {third: team.uuid},
                            null,
                            {
                              success: function (results)
                              {
                                Store('app').save(team.uuid, results);
                                data.members[team.uuid] = [];
                                data.members[team.uuid] = results;
                              }
                            }
                          )
                        );
                      }
                      else
                      {
                        data.members[team.uuid] = Store('app').get(team.uuid);
                      }
                    }
                  );

                  $q.all(calls)
                    .then(function ()
                    {
                      deferred.resolve(data)
                    });
                }
                else
                {
                  deferred.resolve(teams);
                }
              }
            );

            return deferred.promise;
          };

          TeamsService.prototype.updateMembersLocal = function ()
          {
            return TeamUp._('teamMemberFree')
              .then(
              function (result)
              {
                Store('app').save('members', result);
              },
              function (error)
              {
                console.log(error)
              }
            );
          };

          // Get teams data from localStorage
          TeamsService.prototype.queryLocal = function ()
          {
            var data = {
              teams: Store('app').get('teams'),
              members: {}
            };

            _.each(
              data.teams,
              function (team)
              {
                data.members[team.uuid] = Store('app').get(team.uuid)
              }
            );

            return data;
          };

          // Get the list of links between client groups and teams
          TeamsService.prototype.queryClientGroups = function (teams)
          {
            var deferred = $q.defer(),
              calls = [],
              data = {};

            data.groups = {};

            data.teams = teams;

            angular.forEach(
              teams,
              function (team)
              {
                calls.push(
                  (function (team, data)
                  {
                    return {
                      id: team.uuid,
                      data: TeamUp._(
                        'teamClientGroupQuery',
                        {second: team.uuid}
                      ).then(
                        function (result)
                        {
                          // TODO: Repetitive code
                          Store('app').save(
                            'teamGroup_' + team.uuid,
                            (result.length == 4 &&
                            result[0][0] == 'n' &&
                            result[1][0] == 'u') ? [] : result
                          );

                          data.groups[team.uuid] = [];

                          data.groups[team.uuid] = result.data;

                          return result;
                        }
                      )
                    }
                  })(team, data)
                );
              }
            );

            $q.all(calls)
              .then(
              (function (results)
              {
                angular.forEach(
                  teams,
                  (function (team)
                  {
                    data.teams = teams;

                    data.groups[team.uuid] = [];

                    angular.forEach(
                      results,
                      function (result)
                      {
                        data.groups[team.uuid] = result.data
                      }
                    );
                  }).bind(results)
                );

                deferred.resolve(data);
              }).bind(data)
            );

            return deferred.promise;
          };

          /**
           *
           * @param options team uuid, start and end date
           * @returns tasks of the given range
           */
          TeamsService.prototype.getTasksRange = function (options)
          {
            return TeamUp._(
              'teamTaskQuery',
              {
                second: options.groupId,
                from: new Date(options.range.start).getTime(),
                to: new Date(options.range.end).getTime()
              }
            ).then(
              function (tasks)
              {
                return tasks;
              }.bind(this)
            );
          };

          // Get local data of links between client groups and teams
          TeamsService.prototype.queryLocalClientGroup = function (teams)
          {
            var groupIds = [];

            angular.forEach(
              Store('app').get('ClientGroups'),
              function (group)
              {
                groupIds.push(group.id)
              }
            );

            var returnValue = {};

            angular.forEach(
              teams,
              function (team)
              {
                var flag = true;

                var _teamGroup = Store('app').get('teamGroup_' + team.uuid);

                if (_teamGroup == [])
                {
                  // console.log('it is empty ->');
                }

                _teamGroup = angular.fromJson(localStorage.getItem('app.teamGroup_' + team.uuid)).value;
                // console.log('_teamGroup2 ->', angular.toJson(_teamGroup2.value));

                angular.forEach(
                  _teamGroup,
                  function (group)
                  {
                    if (groupIds.indexOf(group.id) != -1 && flag)
                    {
                      // console.log('putting in ->', group.id);

                      returnValue[team.uuid] = group.id;

                      flag = false;
                    }
                  }
                );
              }
            );

            return returnValue;
          };

          // Manage 1:n relations between teams and team members
          TeamsService.prototype.manage = function (changes)
          {
            var deferred = $q.defer(),
              calls = [];

            console.log('changes', changes);

            angular.forEach(
              changes,
              function (change, teamId)
              {
                if (change.a.length > 0 && change.r.length == 0)
                {
                  console.log('change.a', change.a);
                  calls.push(
                    TeamUp._(
                      'teamMemberAdd',
                      {second: teamId},
                      {ids: change.a}
                    )
                  );
                }

                if (change.r.length > 0 && change.a.length == 0)
                {
                  calls.push(
                    TeamUp._(
                      'teamMemberDelete',
                      {second: teamId},
                      {ids: change.r}
                    )
                  );
                }

                if (change.a.length > 0 && change.r.length > 0)
                {
                  calls.push(
                    TeamUp._(
                      'teamMemberUpdate',
                      {second: teamId},
                      {
                        remove: change.r,
                        add: change.a
                      }
                    )
                  );
                }
              });

            $q.all(calls).then(
              function ()
              {
                var queryCalls = [],
                  data = {};

                angular.forEach(
                  changes,
                  function (change, teamId)
                  {
                    // queryCalls.push(
                    //   TeamUp._(
                    //     'teamStatusQuery',
                    //     { third: teamId }
                    //   )
                    // );
                    var routeParam = {uuid: teamId};
                    //TeamsService.prototype.checkLoggedUserTeamsLocal(change, teamId);
                    queryCalls.push(TeamsService.prototype.query(false, routeParam));
                  }
                );

                $q.all(queryCalls)
                  .then(function ()
                  {
                    deferred.resolve(data)
                  });
              }
            );

            return deferred.promise;
          };

          /**
           * Update the localStorage of the logged user by changing from team
           * @param changedUsers
           * @param teamId
           */
          //TeamsService.prototype.checkLoggedUserTeamsLocal = function (changedUsers, teamId)
          //{
          //  angular.forEach(changedUsers, function (user)
          //  {
          //    console.log('changedUsers', changedUsers);
          //    console.log('user', user);
          //    console.log('$rootScope.app.resources.uuid', $rootScope.app.resources.uuid);
          //    if (user == $rootScope.app.resources.uuid)
          //    {
          //      var userResources = Store('app').get('resources'),
          //        indexTeam = userResources.teamUuids.indexOf(teamId);
          //
          //      (indexTeam < 0)
          //        ? userResources.teamUuids.push(teamId)
          //        : userResources.teamUuids.splice(indexTeam, 1);
          //
          //      Store('app').save('resources', userResources);
          //      $rootScope.app.resources = userResources;
          //      console.log('manage teams', userResources.teamUuids);
          //      return;
          //    }
          //  });
          //};

          TeamsService.prototype.removeAllTeamsFromMember = function(user)
          {
            var deferred = $q.defer(),
                changes = {};

            _.each(user.teamUuids, function(teamId) {
              changes[teamId] = {
                a: [],
                r: [user.uuid]
              };
            });

            TeamsService.prototype.manage(changes)
              .then(
              function()
              {
                var loggedUser = {
                  viewingUserhasTeam: true
                };

                if(user.uuid == $rootScope.app.resources.uuid)
                {
                  var Profile = $injector.get('Profile');

                  Profile.fetchUserData($rootScope.app.resources.uuid)
                    .then(
                    function(userData)
                    {
                      if(! userData.length)
                      {
                        loggedUser.viewingUserhasTeam = false;
                        deferred.resolve(loggedUser);
                      }
                    }
                  );
                }
                deferred.resolve(loggedUser);
              }
            );

            return deferred.promise;
          };

          // Manage 1:1 relations between teams and client groups
          TeamsService.prototype.manageGroups = function (changes)
          {
            var deferred = $q.defer(),
              calls = [];

            angular.forEach(
              changes,
              function (change, teamId)
              {
                if (change.a.length > 0 && change.r.length == 0)
                {
                  calls.push(
                    TeamUp._(
                      'teamClientGroupAdd',
                      {second: teamId},
                      {ids: change.a}
                    )
                  );
                }

                if (change.r.length > 0 && change.a.length == 0)
                {
                  calls.push(
                    TeamUp._(
                      'teamClientGroupDelete',
                      {second: teamId},
                      {ids: change.r}
                    )
                  );
                }

                if (change.a.length > 0 && change.r.length > 0)
                {
                  calls.push(
                    TeamUp._(
                      'teamClientGroupUpdate',
                      {second: teamId},
                      {
                        remove: change.r,
                        add: change.a
                      }
                    )
                  );
                }
              }
            );

            $q.all(calls)
              .then(
              function (changeResults)
              {
                var data = changeResults,
                  queryCalls = [];

                angular.forEach(
                  changes,
                  function (change, teamId)
                  {
                    queryCalls.push(
                      // TODO: Tricky! Test this whether works!
                      (function (teamId)
                      {
                        return {
                          id: teamId,
                          data: TeamUp._(
                            'teamClientGroupQuery',
                            {second: teamId}
                          ).then(
                            function (result)
                            {
                              // TODO: Repetitive code
                              Store('app').save(
                                'teamGroup_' + teamId,
                                (result.length == 4 &&
                                result[0][0] == 'n' &&
                                result[1][0] == 'u') ?
                                  [] :
                                  result
                              );

                              return result;
                            }
                          )
                        }
                      })(teamId)
                    );
                  }
                );

                $q.all(queryCalls)
                  .then(function ()
                  {
                    deferred.resolve(data)
                  });
              }
            );

            return deferred.promise;
          };

          return new TeamsService;
        }
      ]
    );
  }
);
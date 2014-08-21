define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Teams',
      [
        '$resource', '$q', 'Store', '$rootScope', 'TeamUp',
        function ($resource, $q, Store, $rootScope, TeamUp)
        {
          var TeamsService = $resource();

          // Get the list of teams
          TeamsService.prototype.query = function (only, routeParams)
          {
            var deferred = $q.defer();

            // Get the list of own teams
            TeamUp._(
              'teamQuery',
              { strict: true }
            ).then(
              function (own)
              {
                Store('teams').save('own', own);

                // Get the list of teams
                TeamUp._('teamQuery')
                  .then(
                  function (teams)
                  {
                    Store('app').save('teams', teams);

                    if (! only)
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
                              (function (team, data, Store)
                              {
                                // Get the list of members of that particular team
                                TeamUp._(
                                  'teamStatusQuery',
                                  { third: team.uuid },
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
                              })(team, data, Store)
                            );
                          }
                          else
                          {
                            data.members[team.uuid] = Store('app').get(team.uuid);
                          }
                        }
                      );

                      $q.all(calls)
                        .then(function () { deferred.resolve(data) });

                    }
                    else
                    {
                      deferred.resolve(teams);
                    }
                  }
                );

              }
            );

            return deferred.promise;
          };

          // Get teams data from localStorage
          TeamsService.prototype.queryLocal = function ()
          {
            var data = {
              teams: Store('app').get('teams'),
              members: {}
            };

            angular.forEach(
              data.teams,
              function (team) { data.members[team.uuid] = Store('app').get(team.uuid) }
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
                        { second: team.uuid }
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

                          // console.log('clientGroup ->', result);

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
                      function (result) { data.groups[team.uuid] = result.data }
                    );
                  }).bind(results)
                );

                deferred.resolve(data);
              }).bind(data)
            );

            return deferred.promise;
          };

          // Get local data of links between client groups and teams
          TeamsService.prototype.queryLocalClientGroup = function (teams)
          {
            var groupIds = [];

            angular.forEach(
              Store('app').get('ClientGroups'),
              function (group) { groupIds.push(group.id) }
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
                    if (groupIds.indexOf(group.id) != - 1 && flag)
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

            angular.forEach(
              changes,
              function (change, teamId)
              {
                if (change.a.length > 0 && change.r.length == 0)
                {
                  calls.push(
                    TeamUp._(
                      'teamMemberAdd',
                      { second: teamId },
                      { ids: change.a }
                    )
                  );
                }

                if (change.r.length > 0 && change.a.length == 0)
                {
                  calls.push(
                    TeamUp._(
                      'teamMemberDelete',
                      { second: teamId },
                      { ids: change.r }
                    )
                  );
                }

                if (change.a.length > 0 && change.r.length > 0)
                {
                  calls.push(
                    TeamUp._(
                      'teamMemberUpdate',
                      { second: teamId },
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
                    queryCalls.push(TeamsService.prototype.query(false, routeParam));
                  }
                );

                $q.all(queryCalls)
                  .then(function () { deferred.resolve(data) });
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
                      { second: teamId },
                      { ids: change.a }
                    )
                  );
                }

                if (change.r.length > 0 && change.a.length == 0)
                {
                  calls.push(
                    TeamUp._(
                      'teamClientGroupDelete',
                      { second: teamId },
                      { ids: change.r }
                    )
                  );
                }

                if (change.a.length > 0 && change.r.length > 0)
                {
                  calls.push(
                    TeamUp._(
                      'teamClientGroupUpdate',
                      { second: teamId },
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
                            { second: teamId }
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
                  .then(function () { deferred.resolve(data) });
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
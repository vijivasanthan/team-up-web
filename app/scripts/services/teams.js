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

          TeamsService.prototype.query = function (only)
          {
            var deferred = $q.defer();

            TeamUp._('teamQuery')
              .then(
              function (teams)
              {
                Store('app').save('teams', teams);

                if (only)
                {
                  deferred.resolve(teams);
                }
                else
                {
                  var calls = [],
                      data = {
                        teams:   teams,
                        members: {}
                      };

                  angular.forEach(
                    teams,
                    function (team)
                    {
                      calls.push(
                        (function (team, data, Store)
                        {
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
                  );

                  $q.all(calls)
                    .then(
                    function () { deferred.resolve(data) }
                  );
                }
              }
            );

            return deferred.promise;
          };

          TeamsService.prototype.queryLocal = function ()
          {
            var data = {
              teams:   Store('app').get('teams'),
              members: {}
            };

            angular.forEach(
              data.teams,
              function (team) { data.members[team.uuid] = Store('app').get(team.uuid) }
            );

            return data;
          };

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
                      id:   team.uuid,
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

                          console.log('clientGroup ->', result);

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
                        add:    change.a
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
                    queryCalls.push(
                      TeamUp._(
                        'teamStatusQuery',
                        { third: teamId }
                      )
                    );
                  }
                );

                $q.all(queryCalls)
                  .then(function () { deferred.resolve(data) });
              }
            );

            return deferred.promise;
          };

          /**
           * add or remove the client group from the teams
           */
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
                        add:    change.a
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
                          id:   teamId,
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
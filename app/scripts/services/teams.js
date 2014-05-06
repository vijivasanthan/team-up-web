define(
  ['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory(
      'Teams',
      [
        '$resource', '$q', 'Storage', '$rootScope', 'TeamUp',
        function ($resource, $q, Storage, $rootScope, TeamUp)
        {
          var TeamsService = $resource();

          TeamsService.prototype.query = function (only, routeParams)
          {
            var deferred = $q.defer();

            TeamUp._(
              'teamQuery',
              null,
              null,
              {
                success: function (teams)
                {
                  Storage.add('Teams', angular.toJson(teams));

                  if (! only)
                  {
                    var calls = [];

                    angular.forEach(
                      teams,
                      function (team)
                      {
                        calls.push(
                          TeamUp._(
                            'teamStatusQuery',
                            { third: team.uuid }
                          )
                        );
                      }
                    );

                    $q.all(calls)
                      .then(
                      function (results)
                      {
                        var data = {};

                        data.members = {};

                        angular.forEach(
                          teams,
                          function (team)
                          {
                            data.teams = teams;

                            data.members[team.uuid] = [];

                            angular.forEach(
                              results,
                              function (result)
                              {
                                if (routeParams.uuid)
                                {
                                  if (result.id == team.uuid && routeParams.uuid == team.uuid)
                                  {
                                    data.members[team.uuid] = result.data;
                                  }
                                  else
                                  {
                                    data.members[team.uuid] = angular.fromJson(Storage.get(team.uuid));
                                  }
                                }
                                else if (result.id == team.uuid)
                                {
                                  data.members[team.uuid] = result.data;
                                }
                              });
                          });

                        deferred.resolve(data);
                      }
                    );
                  }
                  else
                  {
                    deferred.resolve(teams);
                  }

                },
                error:   function (error) { deferred.resolve({error: error}) }
              }
            );

            return deferred.promise;
          };


          TeamsService.prototype.queryLocal = function ()
          {
            var data = {
              teams:   angular.fromJson(Storage.get("Teams")),
              members: {}
            };

            angular.forEach(
              data.teams,
              function (team) { data.members[team.uuid] = angular.fromJson(Storage.get(team.uuid)) }
            );

            return data;
          };


          TeamsService.prototype.queryClientGroups = function (teams)
          {
            var deferred = $q.defer();

            var calls = [];

            var data = {};

            data.groups = {};

            data.teams = teams;

            angular.forEach(
              teams,
              function (team)
              {
                calls.push(
                  // TODO: Tricky! Test this whether works!
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
                          Storage.add(
                              'teamGroup_' + team.uuid,
                              angular.toJson(
                                (result.length == 4 && result[0][0] == 'n' && result[1][0] == 'u') ?
                                [] :
                                result
                              )
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

            $q.all(calls).then(
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
            var deferred = $q.defer();

            var calls = [];

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
                var queryCalls = [];
                var data = {};

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
                  });

                $q.all(queryCalls).then(function () { deferred.resolve(data) });
              });

            return deferred.promise;
          };

          /**
           * add or remove the client group from the teams
           */
          TeamsService.prototype.manageGroups = function (changes)
          {
            var deferred = $q.defer();

            var calls = [];

            angular.forEach(
              changes, function (change, teamId)
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
              });

            $q.all(calls).then(
              function (changeResults)
              {
                var data = changeResults;

                var queryCalls = [];

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
                              Storage.add(
                                  'teamGroup_' + teamId,
                                  angular.toJson(
                                    (result.length == 4 && result[0][0] == 'n' && result[1][0] == 'u') ?
                                    [] :
                                    result
                                  )
                              );

                              return result;
                            }
                          )
                        }
                      })(teamId)
                    );
                  });

                $q.all(queryCalls).then(function () { deferred.resolve(data) });
              });

            return deferred.promise;
          };


          return new TeamsService;
        }
      ]
    );
  }
);
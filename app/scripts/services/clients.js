define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Clients',
      [
        '$resource', '$q', 'Store', 'TeamUp',
        function ($resource, $q, Store, TeamUp)
        {
          var ClientsService = $resource();

          // List of client groups
          ClientsService.prototype.query = function (only, routeParams)
          {
            var deferred = $q.defer();

            // List of client groups
            TeamUp._(
              'clientGroupsQuery',
              null,
              null,
              {
                success: function (clientGroups)
                {
                  Store('app').save('ClientGroups', clientGroups);

                  if (! only)
                  {
                    var calls = [];

                    angular.forEach(
                      clientGroups,
                      function (clientGroup)
                      {

                        //TODO this do not work with clients in multiple clientGroups, search in what clientGroups the client is
                        if (! routeParams.uuid || (routeParams.uuid == clientGroup.id))
                        {
                          // For each client group get the list of clients
                          calls.push(
                            TeamUp._(
                              'clientsByGroupIDQuery',
                              { third: clientGroup.id },
                              null,
                              {
                                success: function (result)
                                {
                                  Store('app').save(
                                    clientGroup.id,
                                    (result.length == 4 &&
                                     result[0][0] == 'n' &&
                                     result[1][0] == 'u') ?
                                    [] :
                                    result
                                  );
                                }
                              }
                            )
                          );
                        }
                      });

                    $q.all(calls)
                      .then(
                      function (results)
                      {
                        var data = {};

                        data.clients = {};

                        data.clientGroups = clientGroups;

                        angular.forEach(
                          clientGroups,
                          function (clientGroup)
                          {
                            data.clients[clientGroup.id] = [];

                            // Iterate over the list of client groups for getting clients belong to it
                            angular.forEach(
                              results,
                              function (result)
                              {
                                if (routeParams.uuid)
                                {
                                  data.clients[clientGroup.id] = (result.id == clientGroup.id &&
                                                                  routeParams.uuid == clientGroup.id) ?
                                                                 result.data :
                                                                 Store('app').get(clientGroup.id);
                                }
                                else
                                {
                                  if (result.id == clientGroup.id)
                                  {
                                    data.clients[clientGroup.id] = result.data;
                                  }
                                }
                              }
                            );
                          }
                        );

                        if (typeof data.clientGroups == 'undefined')
                        {
                          data.clientGroups = {};
                        }

                        deferred.resolve(data);
                      }
                    );
                  }
                  else
                  {
                    deferred.resolve(clientGroups);
                  }

                },
                error: function (error) { deferred.resolve({ error: error }) }
              }
            );

            return deferred.promise;
          };

          //ClientsService.prototype.query = function (only, routeParams)
          //{
          //  var deferred = $q.defer();
          //
          //  var data = {};

            //  TeamUp._(
          //    'clientGroupsQuery',
          //    null,
          //    null,
          //    {
          //      success: function (clientGroups)
          //      {
          //        Store('app').save('ClientGroups', clientGroups);
          //
          //        if (! only)
          //        {
          //
          //          data.clients = {};
          //
          //          data.clientGroups = (typeof data.clientGroups != 'undefined') ? clientGroups : {};
          //
          //          var clientGroupIds = _.pluck(clientGroups, 'id');
          //
          //          var calls = [];
          //
          //          if (!routeParams.uuid || clientGroupIds.indexOf(routeParams.uuid) >= 0)
          //          {
          //            console.log('door', routeParams.uuid);
          //            angular.forEach(
          //              clientGroups,
          //              function (clientGroup)
          //              {
          //                data.clients[clientGroup.id] = [];
          //                // For each client group get the list of clients
          //                calls.push(
          //                  TeamUp._(
          //                    'clientsByGroupIDQuery',
          //                    {third: clientGroup.id},
          //                    null,
          //                    {
          //                      success: function (result)
          //                      {
          //                        //var resultData = (result.length == 4 && result[0][0] == 'n' && result[1][0] == 'u') ? [] : result
          //
          //                        Store('app').save(
          //                          clientGroup.id,
          //                          result
          //                        );
          //
          //                        data.clients[clientGroup.id] = result;
          //                      }
          //                    }
          //                  )
          //                );
          //              });
          //          }
          //
          //          $q.all(calls)
          //            .then(
          //            function (results)
          //            {
          //              deferred.resolve(data);
          //            }
          //          );
          //        }
          //        else
          //        {
          //          deferred.resolve(clientGroups);
          //        }
          //
          //      },
          //      error: function (error) { deferred.resolve({ error: error }) }
          //    }
          //  );
          //
          //  return deferred.promise;
          //};


          // Manage 1:n relations between clients and client groups
          ClientsService.prototype.manage = function (changes)
          {
            var deferred = $q.defer(),
                calls = [];

            angular.forEach(
              changes,
              function (change, clientGroupId)
              {
                if (change.a.length > 0)
                {
                  calls.push(
                    TeamUp._(
                      'clientsByGroupIDAdd',
                      { third: clientGroupId },
                      { ids: change.a }
                    )
                  );
                }

                if (change.r.length > 0)
                {
                  calls.push(
                    TeamUp._(
                      'clientGroupClientDelete',
                      { third: clientGroupId },
                      { ids: change.r }
                    )
                  );
                }
              });

            $q.all(calls)
              .then(
              function ()
              {
                var queryCalls = [],
                    data = {},
                    refreshGroups = [];

                var getClientFromLocal = function (clientId)
                {
                  var result = null;

                  angular.forEach(
                    Store('app').get('ClientGroups'),
                    function (cGrp)
                    {
                      var clients = Store('app').get(cGrp.id);

                      angular.forEach(
                        clients,
                        function (client)
                        {
                          if (client.uuid == clientId)
                          {
                            result = client;
                          }
                        }
                      );
                    });

                  return result;
                };

                angular.forEach(
                  changes,
                  function (change, clientGroupId)
                  {
                    refreshGroups.push(clientGroupId);

                    // if (change.a.length > 0)
                    // {
                    //   angular.forEach(
                    //     change.a,
                    //     function (clientId)
                    //     {
                    //       var client = getClientFromLocal(clientId);

                    //       if (typeof client != 'undefined' &&
                    //           refreshGroups.indexOf(client.clientGroupUuid) == - 1)
                    //       {
                    //         refreshGroups.push(client.clientGroupUuid);
                    //         var routeParam = {uuid : client.clientGroupUuid};
                    //         queryCalls.push(ClientsService.prototype.query(false,routeParam));
                    //       }
                    //     }
                    //   );
                    // }

                    var routeParam = {uuid: clientGroupId};
                    queryCalls.push(ClientsService.prototype.query(false, routeParam));
                  });

                $q.all(queryCalls)
                  .then(function () { deferred.resolve(data) });
              }
            );

            return deferred.promise;
          };

          /**
           * Update a single client and update the clients locally
           * @param client
           * @returns {*} The updated client
           */
          ClientsService.prototype.singleUpdate = function(client)
          {
            var deferred = $q.defer(),
              clientUpdate = TeamUp._('clientUpdate', {second: client.uuid}, client),
              allClients = this.queryAll();

            $q.all([clientUpdate, allClients])
                .then(
                  function(data)
                  {
                    deferred.resolve(data[0]);
                  }
                );

            return deferred.promise;
          };

          /**
           * Check if All clients locally exist, if they exist remove the client from them and store
           * the list of all client locally.
           * @param clientId the id of the client who's removed
           */
          ClientsService.prototype.removeSingleFromAllLocally = function(clientId)
          {
            var allClients = Store('app').get('clients');

            if(allClients.length)
            {
              var removedMember = _.findWhere(allClients, {uuid: clientId}),
                  index = allClients.indexOf(removedMember);

              allClients.splice(index, 1);

              Store('app').save('clients', allClients);
            }
          };

          /**
           * query all clients, if there not locally call them from the backend
           */
          ClientsService.prototype.queryAllLocally = function()
          {
              var allClients = Store('app').get('clients'),
                  deferred = $q.defer();

              if(allClients.length)
              {
                deferred.resolve(allClients);
              }
              else
              {
                ClientsService.prototype.queryAll()
                  .then(
                    function(clients)
                    {
                      deferred.resolve(clients);
                    }
                  );
              }

              return deferred.promise();
          };

          /**
           * Query all Client and update them locally
           * @returns {*} All the clients
           */
          ClientsService.prototype.queryAll = function()
          {
            return TeamUp._('clientsQuery')
              .then(
                function(clients)
                {
                  Store('app').save('clients', clients);
                  return clients;
                }
              )
          };

          /**
           * Remove client from group
           * @param clientGroupId id of the group
           * @param clientId id of the client
           * @returns {*} promise with the current members of the team
           */
          ClientsService.prototype.deleteFromGroup = function(clientGroupId, clientId)
          {
            var deferred = $q.defer();

            TeamUp._(
              'clientGroupClientDelete',
              { third: clientGroupId },
              { ids: [clientId] }
            ).then(
              function(result)
              {
                var clientGroup = {uuid: clientGroupId};

                if(result)
                {
                  ClientsService.prototype.query(false, clientGroup)
                    .then(
                    function(clients)
                    {
                      deferred.resolve(clients);
                    }
                  );
                }
              }
            );

            return deferred.promise;
          };

          // Get the list local client groups with clients in it
          ClientsService.prototype.queryLocal = function ()
          {
            var data = {};

            data.clientGroups = Store('app').get('ClientGroups');

            data.clients = {};

            angular.forEach(
              data.clientGroups,
              function (clientGroup) { data.clients[clientGroup.id] = Store('app').get(clientGroup.id) }
            );

            return data;
          };


          return new ClientsService;
        }
      ]
    );
  }
);
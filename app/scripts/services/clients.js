define(
  ['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory(
      'Clients',
      [
        '$resource', '$q', 'Storage', 'TeamUp',
        function ($resource, $q, Storage, TeamUp)
        {
          var ClientsService = $resource();

          ClientsService.prototype.query = function (only, routeParams)
          {
            var deferred = $q.defer();

            TeamUp._(
              'clientGroupsQuery',
              null,
              null,
              {
                success: function (clientGroups)
                {
                  Storage.add('ClientGroups', angular.toJson(clientGroups));

                  if (! only)
                  {
                    var calls = [];

                    angular.forEach(
                      clientGroups,
                      function (clientGroup)
                      {
                        if (! routeParams.uuid || (routeParams.uuid == clientGroup.id))
                        {
                          calls.push(
                            TeamUp._(
                              'clientsByGroupIDQuery',
                              { third: clientGroup.id },
                              null,
                              {
                                success: function (result)
                                {
                                  Storage.add(
                                    clientGroup.id,
                                    angular.toJson(
                                      (result.length == 4 && result[0][0] == 'n' && result[1][0] == 'u') ?
                                      [] :
                                      result
                                    )
                                  );

                                  // TODO: Do something about return object!
                                  /*
                                   deferred.resolve(
                                   {
                                   id:   id,
                                   data: returned
                                   });
                                   */
                                }
                              }
                            )
                          );
                        }
                      });

                    $q.all(calls).then(
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

                            angular.forEach(
                              results, function (result)
                              {
                                if (routeParams.uuid)
                                {
                                  data.clients[clientGroup.id] = (result.id == clientGroup.id && routeParams.uuid == clientGroup.id) ?
                                                                 result.data :
                                                                 angular.fromJson(Storage.get(clientGroup.id));
                                }
                                else
                                {
                                  if (result.id == clientGroup.id)
                                  {
                                    data.clients[clientGroup.id] = result.data;
                                  }
                                }
                              });
                          }
                        );

                        if (typeof data.clientGroups == 'undefined')
                        {
                          data.clientGroups = {};
                        }

                        deferred.resolve(data);
                      });
                  }
                  else
                  {
                    deferred.resolve(clientGroups);
                  }

                },
                error:   function (error) { deferred.resolve({error: error}) }
              }
            );

            return deferred.promise;
          };


          ClientsService.prototype.manage = function (changes)
          {
            console.log('ClientsService.prototype.manage');

            var deferred = $q.defer();

            var calls = [];

            angular.forEach(
              changes, function (change, clientGroupId)
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

            $q.all(calls).then(
              function ()
              {
                var queryCalls = [];
                var data = {};
                var refreshGroups = [];

                var getClientFromLocal = function (clientId)
                {
                  var ret;

                  angular.forEach(
                    angular.fromJson(Storage.get("ClientGroups")),
                    function (cGrp)
                    {
                      var clients = angular.fromJson(Storage.get(cGrp.id));

                      angular.forEach(
                        clients,
                        function (client)
                        {
                          if (client.uuid == clientId)
                          {
                            ret = client;
                          }
                        });
                    });

                  return ret;
                };

                angular.forEach(
                  changes,
                  function (change, clientGroupId)
                  {
                    refreshGroups.add(clientGroupId);

                    if (change.a.length > 0)
                    {
                      angular.forEach(
                        change.a, function (clientId)
                        {
                          var client = getClientFromLocal(clientId);

                          if (typeof client != 'undefined' && refreshGroups.indexOf(client.clientGroupUuid) == - 1)
                          {
                            refreshGroups.add(client.clientGroupUuid);
                            queryCalls.push(ClientsService.prototype.get(client.clientGroupUuid));
                          }
                        });
                    }

                    queryCalls.push(ClientsService.prototype.get(clientGroupId));
                  });

                $q.all(queryCalls).then(function () { deferred.resolve(data) });
              });

            return deferred.promise;
          };

          ClientsService.prototype.queryLocal = function ()
          {
            console.log('ClientsService.prototype.queryLocal');

            var data = {};

            data.clientGroups = angular.fromJson(Storage.get("ClientGroups"));

            data.clients = {};

            angular.forEach(
              data.clientGroups,
              function (clientGroup) { data.clients[clientGroup.id] = angular.fromJson(Storage.get(clientGroup.id)) }
            );

            return data;
          };


          /**
           * Image calls
           */

          // TODO: Do not forget to port this one!
          var ClientImg = $resource(
              config.app.host + config.app.namespace + '/client/:clientId/photourl',
              {},
              {
                getURL: {
                  method:  'GET',
                  isArray: false
                }
              }
          );


          ClientsService.prototype.loadUploadURL = function (id)
          {
            console.log('ClientsService.prototype.loadUploadURL');

            var deferred = $q.defer();

            ClientImg.getURL(
              {
                clientId: id
              },
              function (result)
              {
                deferred.resolve(result);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };

          return new ClientsService;
        }
      ]
    );
  }
);
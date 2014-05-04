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

          var ClientGroups = $resource(
              config.app.host + config.app.namespace + '/client/clientGroups/',
              {},
              {
                query: {
                  method:  'GET',
                  params:  {},
                  isArray: true
                }
              }
          );


          ClientsService.prototype.query = function (only, routePara)
          {
            var deferred = $q.defer();

            TeamUp._(
              'clientGroupsQuery',
              null,
              null,
              {
                success: function (cGroups)
                {
                  Storage.add('ClientGroups', angular.toJson(cGroups));

                  if (! only)
                  {
                    var calls = [];

                    angular.forEach(
                      cGroups, function (clientGroup)
                      {
                        if (! routePara.uuid || (routePara.uuid == clientGroup.id))
                        {
                          calls.push(
                            // TeamUp
                            ClientsService.prototype.get(clientGroup.id)
                          );
                        }
                      });

                    $q.all(calls).then(
                      function (results)
                      {
                        var data = {};

                        data.clients = {};

                        angular.forEach(
                          cGroups, function (cGroup)
                          {
                            data.clientGroups = cGroups;

                            data.clients[cGroup.id] = [];

                            angular.forEach(
                              results, function (result)
                              {
                                if (routePara.uuid)
                                {
                                  if (result.id == cGroup.id && routePara.uuid == cGroup.id)
                                  {
                                    data.clients[cGroup.id] = result.data;
                                  }
                                  else
                                  {
                                    data.clients[cGroup.id] = angular.fromJson(Storage.get(cGroup.id));
                                  }
                                }
                                else
                                {
                                  if (result.id == cGroup.id)
                                  {
                                    data.clients[cGroup.id] = result.data;
                                  }
                                }
                              });
                          });

                        if (typeof data.clientGroups == 'undefined')
                        {
                          data.clientGroups = {};
                        }

                        deferred.resolve(data);
                      });
                  }
                  else
                  {
                    deferred.resolve(cGroups);
                  }

                },
                error:   function (error) { deferred.resolve({error: error}) }
              }
            );

            return deferred.promise;
          };


          /**
           * **************************************************************************************
           */


          var Clients_ByGroupId = $resource(
              config.app.host + config.app.namespace + '/client/clientGroup/:clientGroupId/clients/',
              {},
              {
                get:  {
                  method:  'GET',
                  params:  {},
                  isArray: true
                },
                save: {
                  method: 'POST'
                }
              }
          );


          ClientsService.prototype.get = function (id)
          {
            console.log('ClientsService.prototype.get');

            var deferred = $q.defer();

            Clients_ByGroupId.get(
              {
                clientGroupId: id
              },
              function (result)
              {
                var returned;

                if (result.length == 4 &&
                    result[0][0] == 'n' &&
                    result[1][0] == 'u')
                {
                  returned = [];
                }
                else
                {
                  returned = result;
                }

                Storage.add(id, angular.toJson(returned));

                deferred.resolve(
                  {
                    id:   id,
                    data: returned
                  });
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };


          ClientsService.prototype.addClient = function (id, memberIds)
          {
            console.log('ClientsService.prototype.addClient');

            var deferred = $q.defer();

            Clients_ByGroupId.save(
              {
                clientGroupId: id
              },
              memberIds,
              function (result)
              {
                deferred.resolve(result);
              },
              function (error) { deferred.resolve({error: error}) }
            );
            return deferred.promise;
          };


          /**
           * **************************************************************************************
           */

          var ClientGroup = $resource(
              config.app.host + config.app.namespace + '/clientGroup/:clientGroupId',
              {},
              {
                save: {
                  method: 'POST'
                },
                edit: {
                  method: 'PUT'
                },
                del:  {
                  method: 'DELETE'
                }
              }
          );


          ClientsService.prototype.deleteClientGroup = function (id)
          {
            console.log('ClientsService.prototype.deleteClientGroup');

            var deferred = $q.defer();

            ClientGroup.del(
              {
                clientGroupId: id
              },
              function (result)
              {
                deferred.resolve(angular.fromJson(result));
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };


          ClientsService.prototype.saveGroup = function (group)
          {
            console.log('ClientsService.prototype.saveGroup');

            var deferred = $q.defer();

            ClientGroup.save(
              group,
              function (result)
              {
                Storage.add(result.id, angular.toJson(result));

                deferred.resolve(result);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };


          ClientsService.prototype.edit = function (clientGroup)
          {
            console.log('ClientsService.prototype.edit');

            var deferred = $q.defer();

            if (clientGroup.id)
            {
              ClientGroup.edit(
                {
                  clientGroupId: clientGroup.id
                },
                clientGroup,
                function (result)
                {
                  deferred.resolve(result);
                },
                function (error) { deferred.resolve({error: error}) }
              );
            }

            return deferred.promise;
          };

          /**
           * **************************************************************************************
           */


          var Client = $resource(
              config.app.host + config.app.namespace + '/client/:clientId',
              {},
              {
                save: {
                  method: 'POST'
                },
                edit: {
                  method: 'PUT'
                },
                del:  {
                  method: 'DELETE'
                }
              }
          );


          ClientsService.prototype.deleteClient = function (id)
          {
            console.log('ClientsService.prototype.deleteClient');

            var deferred = $q.defer();

            Client.del(
              {
                clientId: id
              },
              function (result)
              {
                deferred.resolve(angular.fromJson(result));
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };


          ClientsService.prototype.save = function (client)
          {
            console.log('ClientsService.prototype.save');

            var deferred = $q.defer();

            Client.save(
              client,
              function (result)
              {
                Storage.add(result.id, angular.toJson(result));

                deferred.resolve(result);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };


          ClientsService.prototype.updateClient = function (client)
          {
            console.log('ClientsService.prototype.updateClient');

            var deferred = $q.defer();

            Client.edit(
              {
                clientId: client.uuid
              },
              client,
              function (result)
              {
                deferred.resolve(result);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };


          /**
           * **************************************************************************************
           */

          var Clients = $resource(
              config.app.host + config.app.namespace + '/client/clients',
              {},
              {
                query: {
                  method:  'GET',
                  params:  {},
                  isArray: true
                }
              }
          );


          ClientsService.prototype.queryAll = function ()
          {
            console.log('ClientsService.prototype.queryAll');

            var deferred = $q.defer();

            Clients.query(
              function (clients)
              {
                Storage.add('clients', angular.toJson(clients));

                deferred.resolve(clients);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };


          /**
           * **************************************************************************************
           */


          var ClientReports = $resource(
              config.app.host + config.app.namespace + '/clients/:clientId/reports',
              {},
              {
                query: {
                  method:  'GET',
                  params:  {},
                  isArray: true
                }
              }
          );


          ClientsService.prototype.queryReports = function (cId)
          {
            console.log('ClientsService.prototype.queryReports');

            var deferred = $q.defer();

            ClientReports.query(
              {
                clientId: cId
              },
              function (reports)
              {
                Storage.add('reports_' + cId, angular.toJson(reports));

                deferred.resolve(reports);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };


          /**
           * **************************************************************************************
           */


          var ClientsRemove = $resource(
              config.app.host + config.app.namespace + '/client/clientGroup/:clientGroupId/removeClients/',
              {},
              {
                remove: {
                  method: 'PUT'
                }
              }
          );


          ClientsService.prototype.delClient = function (id, memberIds)
          {
            console.log('ClientsService.prototype.delClient');

            var deferred = $q.defer();

            ClientsRemove.remove(
              {
                clientGroupId: id
              },
              memberIds,
              function (result)
              {
                deferred.resolve(result);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };


          /**
           * **************************************************************************************
           */


          var ClientGroupReports = $resource(
              config.app.host + config.app.namespace + '/clientGroup/:clientGroupId/reports',
              {},
              {
                query: {
                  method:  'GET',
                  params:  {},
                  isArray: true
                }
              }
          );


          ClientsService.prototype.queryGroupReports = function (cId)
          {
            console.log('ClientsService.prototype.queryGroupReports');

            var deferred = $q.defer();

            ClientGroupReports.query(
              {
                clientGroupId: cId
              },
              function (reports)
              {
                deferred.resolve(reports);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };


          /**
           * **************************************************************************************
           */


          var GroupTasks = $resource(
              config.app.host + config.app.namespace + '/clientGroup/:clientGroupId/tasks',
              {},
              {
                query: {
                  method:  'GET',
                  params:  {
                    from: '',
                    to:   ''
                  },
                  isArray: true
                }
              }
          );


          ClientsService.prototype.getClientTasks = function (id, start, end)
          {
            console.log('ClientsService.prototype.getClientTasks');

            var deferred = $q.defer();

            GroupTasks.query(
              {
                clientGroupId: id,
                from:          start,
                to:            end
              },
              function (result)
              {
                deferred.resolve(result);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };


          /**
           * **************************************************************************************
           */


          var ClientReport = $resource(
              config.app.host + config.app.namespace + '/clients/:clientId/reports',
              {},
              {
                save:   {
                  method: 'POST'
                },
                remove: {
                  method: 'DELETE',
                  params: {
                    reportId: ''
                  }
                }
              }
          );

          ClientsService.prototype.removeReport = function (cId, rId)
          {
            console.log('ClientsService.prototype.removeReport');

            var deferred = $q.defer();

            ClientReport.remove(
              {
                clientId: cId,
                reportId: rId
              },
              function (result)
              {
                deferred.resolve(angular.fromJson(result));
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };


          ClientsService.prototype.saveReport = function (id, report)
          {
            console.log('ClientsService.prototype.saveReport');

            var deferred = $q.defer();

            ClientReport.save(
              {
                clientId: id
              },
              report,
              function (result)
              {
                deferred.resolve(angular.fromJson(result));
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };


          /**
           * **************************************************************************************
           */


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


          /**
           * Some others!!
           */


          /**
           * **************************************************************************************
           */


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
                    ClientsService.prototype.addClient(
                      clientGroupId, {
                        ids: change.a
                      }));
                }

                if (change.r.length > 0)
                {
                  calls.push(
                    ClientsService.prototype.delClient(
                      clientGroupId, {
                        ids: change.r
                      }));
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
                  var cGrps = angular.fromJson(Storage.get("ClientGroups"));

                  angular.forEach(
                    cGrps, function (cGrp)
                    {
                      var clients = angular.fromJson(Storage.get(cGrp.id));

                      angular.forEach(
                        clients, function (client)
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
                  changes, function (change, clientGroupId)
                  {
                    // refresh the groups that used to have the client inside.
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


          ClientsService.prototype.loadImg = function (imgURL)
          {
            console.log('ClientsService.prototype.loadImg');

            var LoadImg = $resource(
              imgURL,
              {},
              {
                get: {
                  method: 'GET'
                }
              });

            var deferred = $q.defer();

            LoadImg.get(
              function (result)
              {
                deferred.resolve(result);
              },
              function (error) { deferred.resolve({error: error}) }
            );

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


          return new ClientsService;
        }
      ]
    );
  }
);
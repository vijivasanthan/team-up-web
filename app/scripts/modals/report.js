define(['services/services', 'config'],
  function (services, config)
  {

    'use strict';

    services.factory(
      'Report',
      [
        '$resource',
        '$q',
        'Settings',
        function ($resource, $q, Settings)
        {

          var Report = $resource(
            Settings.getBackEnd() + 'clients/:clientId/reports/:idReport',
            {
              clientId: '',
              idReport: ''
            },
            {
              get: {
                method: 'GET',
                params: {},
                isArray: true
              },
              save: {
                method: 'POST',
                params: {}
              },
              update: {
                method: 'PUT',
                params: {}
              },
              remove: {
                method: 'DELETE',
                params: {}
              }
            }
          );

          var reportByClientGroup = $resource(
            Settings.getBackEnd() + 'clientGroup/:clientGroupId/reports', {clientGroupId: ''},
            {
              get: {
                method: 'GET',
                params: {},
                isArray: true
              }
            }
          );

          Report.prototype = {

            all: function (clientId)
            {
              var deferred = $q.defer();

              Report.get(
                {clientId: clientId},
                function(result)
                {
                  //TODO add reports to local storage
                  //Store('app').save('reports_' + clientId, result)
                  deferred.resolve(result);
                }
              );

              return deferred.promise;
            },
            save: function(report)
            {
              var deferred = $q.defer();

              Report.save(
                {clientId: report.clientUuid},
                {
                  title: report.title,
                  body: report.body,
                  creationTime: report.creationTime
                },
                function(result)
                {
                  deferred.resolve(result);
                }
              );

              return deferred.promise;
            },
            update: function(report)
            {
              var deferred = $q.defer();

              Report.update(
                {
                  clientId: report.clientUuid,
                  idReport: report.uuid
                },
                {
                  uuid: report.uuid,
                  title: report.title,
                  body: report.body,
                  creationTime: report.creationTime
                },
                function(result)
                {
                  deferred.resolve(result);
                }
              );

              return deferred.promise;
            },
            remove: function(clientId, reportId)
            {
              var deferred = $q.defer();

              Report.remove(
                {
                  clientId: clientId,
                  reportId: reportId
                },
                function(result)
                {
                  deferred.resolve(result);
                }
              );

              return deferred.promise;
            },
            allByClientGroup: function(clientGroupId)
            {
              var deferred = $q.defer();

              reportByClientGroup.get(
                {clientGroupId: clientGroupId},
                function(result)
                {
                  deferred.resolve(result);
                }
              );

              return deferred.promise;
            }
          };

          return new Report;
        }
      ]
    );
  }
);


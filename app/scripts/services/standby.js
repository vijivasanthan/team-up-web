define(['services/services', 'config'], function (services, config) {
  'use strict';

  services.factory('StandBy', function ($resource, $q, $location, $rootScope, Log) {
    var StandBy = $resource(config.host + '/:first/:second/:third/:fourth', {}, {
      // User
      login: {
        method: 'GET',
        params: { first: 'login', uuid: '', pass: '' }
      },
      logout: {
        method: 'GET',
        params: { first: 'logout' },
        isArray: true
      },
      resources: {
        method: 'GET',
        params: { first: 'resources' }
      },
      // Environment
      domain: {
        method: 'GET',
        params: { first: 'domain' },
        isArray: true
      },
      divisions: {
        method: 'GET',
        params: { first: 'divisions' },
        isArray: true
      },
      states: {
        method: 'GET',
        params: { first: 'states' },
        isArray: true
      },
      // Network
      groups: {
        method: 'GET',
        params: { first: 'network' },
        isArray: true
      },
      members: {
        method: 'GET',
        params: { first: 'network', third: 'members'}, // fields: '[role, settingsWebPaige]'
        isArray: true
      },
      // Planboard
      cluster: {
        method: 'GET',
        params: { first: 'calc_planning', start: '', end: '' },
        isArray: true
      },
      availability: {
        method: 'GET',
        params: { first: 'askatars', third: 'slots', start: '', end: '' },
        isArray: true
      },
      availabilities: {
        method: 'GET',
        params: { first: 'network', third: 'member', fourth: 'slots2', start: '', end: '' },
        isArray: true
      }
    });

    StandBy.prototype._ = function (proxy, params, data, callback) {
      var deferred = $q.defer();

      params = params || {};

      try {
        StandBy[proxy](
          params,
          data,
          function (result) {
            ((callback && callback.success)) && callback.success.call(this, result);

            // Log.print('Call:', proxy, 'params: ', params, 'data load:', data, 'result: ', result);

            deferred.resolve(result);
          },
          function (result) {
            ((callback && callback.error)) && callback.error.call(this, result);

            Log.error('Error with call:', proxy, 'params: ', params, 'data load:', data, 'result: ', result);

            deferred.resolve({ error: result });
          });
      } catch (e) {
        Log.error('Error with making call:', e);
      }

      return deferred.promise;
    };

    return new StandBy();
  });
});
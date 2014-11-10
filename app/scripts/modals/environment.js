define(['services/services'], function (services) {
  'use strict';

  services.factory('Environment', function ($rootScope, $resource, $q, Log, StandBy, Store) {
    var Environment = $resource();

    Environment.prototype.domain = function () {
      return StandBy._('domain').then(function (result) {
        var domain = $rootScope.unite(result[0]);

        Store('environment').save('domain', domain);

        $rootScope.StandBy.environment.domain = domain;

        return domain;
      });
    };

    Environment.prototype.domain_ = function () {
      var deferred = $q.defer();

      try {
        StandBy._('domain').then(function (result) {
          var domain = $rootScope.unite(result[0]);

          Store('environment').save('domain', domain);

          $rootScope.StandBy.environment.domain = domain;

          deferred.resolve(domain);
        });
      } catch (e) {
        Log.error('Something went wrong with environment domain call:', e);
      }

      return deferred.promise;
    };

    Environment.prototype.states = function () {
      var deferred = $q.defer();

      try {
        StandBy._('states').then(function (results) {
          var states = [];
          _.each(results, function (result) {
            states.push($rootScope.unite(result));
          });

          Store('environment').save('states', states);

          $rootScope.StandBy.environment.states = states;

          _.each(states, function (state) {
            $rootScope.StandBy.config.timeline.config.states[state] = $rootScope.StandBy.config.statesall[state]
          });

          deferred.resolve(states);
        });
      } catch (e) {
        Log.error('Something went wrong with environment states call:', e);
      }

      return deferred.promise;
    };

    Environment.prototype.divisions = function () {
      var deferred = $q.defer();

      try {
        StandBy._('divisions').then(function (result) {
          // result = (result.length == 0) ? [] : result;
          // console.log('divisions ->', result);

          Store('environment').save('divisions', result);

          $rootScope.StandBy.environment.divisions = result;

          deferred.resolve(result);
        });
      } catch (e) {
        Log.error('Something went wrong with environment divisions call:', e);
      }

      return deferred.promise;
    };

    Environment.prototype.setup = function () {
      var deferred = $q.defer();

      var queue = [
        Environment.prototype.domain(),
        Environment.prototype.states(),
        Environment.prototype.divisions()
      ];

      try {
        $q.all(queue).then(function (results) {
          deferred.resolve(results);
        });
      } catch (e) {
        Log.error('Something went wrong with setting up environment call:', e);
      }

      return deferred.promise;
    };

    return new Environment();
  });
});
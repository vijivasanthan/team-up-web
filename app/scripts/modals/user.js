define(['services/services', 'config'], function (services, config) {
  'use strict';

  services.factory('User', function ($rootScope, $resource, $q, $http, Log, md5, StandBy, Session, Store) {
    var User = $resource();

    var Domain = $resource(
        config.host + '/domain/:level',
      {
      },
      {
        get: {
          method: 'GET',
          params: {},
          isArray: true
        },
        locations: {
          method: 'GET',
          params: { level: 'locations' },
          isArray:  true
        },
        locate: {
          method: 'post',
          params: { level: 'location' },
          isArray:  true
        }
      }
    );

    User.prototype.login = function (username, password) {
      var deferred = $q.defer();

      try {
        StandBy._('login', { uuid: username.toLowerCase(), pass: md5.createHash(password) }).then(function (result) {
          if (!result.error) {
            Session.set(result['X-SESSION_ID']);
          }

          deferred.resolve(result);
        });
      } catch (e) {
        Log.error('Something went wrong with login call:', e);
      }

      return deferred.promise;
    };

    User.prototype.logout = function () {
      var deferred = $q.defer();

      try {
        StandBy._('logout').then(function (result) {
          Session.clear();

          deferred.resolve(result);
        });
      } catch (e) {
        Log.error('Something went wrong with logout call:', e);
      }

      return deferred.promise;
    };

    User.prototype.resources = function () {
      var deferred = $q.defer();

      try {
        StandBy._('resources').then(function (result) {
          Store('user').save('resources', result);

          $rootScope.StandBy.resources = result;

          deferred.resolve(result);
        });
      } catch (e) {
        Log.error('Something went wrong with resources call:', e);
      }

      return deferred.promise;
    };

    User.prototype.locations = function ()
    {
      var deferred = $q.defer();

      Domain.locations(
        {},
        function (results)
        {
          var locations = [];

          angular.forEach(
            results,
            function (result)
            {
              var location = '';

              angular.forEach(
                result,
                function (_s) { location += _s; });

              if (location.length > 0)
              {
                locations.push(location);
              }
            }
          );

          deferred.resolve(locations);
        },
        function (error)
        {
          deferred.resolve(error);
        }
      );

      return deferred.promise;
    };


    /**
     * Locate
     */
    User.prototype.locate = function (location)
    {
      var deferred = $q.defer();
      
      if(location==null) {
        location = '';
      }

      Domain.locate(
        {},
        '"' + location + '"',
        function (result)
        {
          deferred.resolve(result);
        },
        function (error)
        {
          deferred.resolve(error);
        }
      );

      return deferred.promise;
    };

    return new User();
  });
});
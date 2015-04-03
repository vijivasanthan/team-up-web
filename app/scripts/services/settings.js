define(['services/services', 'config'], function (services, config) {
  'use strict';

  services.factory('Settings', function ($rootScope, $resource, $q, Profile, Store) {
    //TODO not yet implented, waiting until the userobject add the settings

    var Settings = $resource();

    Settings.prototype.get = function () {
      var deferred = $q.defer(),
          settings = Store('app').get('settings');

      if(settings.length)
      {
        deferred.resolve(settings);
      }
      else
      {
        Settings.prototype.init()
          .then(
            function(userSettings)
            {
              deferred.resolve(userSettings);
            }
          );
      }

      return deferred.promise;
    };

    /**
     * Checks if the user already have some setting otherwise return and save the default settings
     * @returns {*} promise with the settings of the user
     */
    Settings.prototype.init = function()
    {
      var deferred = $q.defer();

      Profile.get($rootScope.app.resources.uuid)
        .then(
        function(profileData)
        {
          if(profileData)
          {
            var settings = Settings.prototype.default();

            if(profileData.settings)
            {
              settings = profileData.settings;
            }
            else
            {
              Settings.prototype.save($rootScope.app.resources.uuid, settings);
            }

            Store('app').save('settings', settings);
            deferred.resolve(settings);
          }
          else
          {
            console.error('No profile data', profileData);
          }
        }
      );

      return deferred.promise;
    };

    Settings.prototype.default = function()
    {
      return $rootScope.config.app.settings;
    };

    Settings.prototype.save = function (id, settings) {
      var deferred = $q.defer();

      Profile.save(id, settings).then(function () {
        deferred.resolve({ saved: true });
      });

      return deferred.promise;
    };

    // BackendSettings
    var BackendSettings = $resource(
      config.host + '/settings',
      {},
      {
        get: {
          method: 'GET',
          params: {}
        }
      }
    );


    // Get BackendSettings
    Settings.prototype.getBackendSettings = function () {
      var deferred = $q.defer();

      BackendSettings.get(
        {},
        function (results)
        {
          Store('BackendSettings').save('settings', results);
          deferred.resolve(results);
        },
        function (error)
        {
          deferred.resolve(error);
        }
      );

      return deferred.promise;
    };

    return new Settings;
  });
});
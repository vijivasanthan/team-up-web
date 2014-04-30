define(
  ['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory(
      'Settings',
      [
        '$rootScope', '$resource', '$q', 'Storage', 'Profile',
        function ($rootScope, $resource, $q, Storage, Profile)
        {
          /**
           * Define settings resource
           * In this case it empty :)
           */
          var Settings = $resource();

          /**
           * Get settings from localStorage
           */
          Settings.prototype.get = function ()
          {
            return angular.fromJson(Storage.get('resources')).settingsWebPaige || {};
          };

          /**
           * Save settings
           */
          Settings.prototype.save = function (id, settings)
          {
            var deferred = $q.defer();

            Profile.save(
              id, {
                settingsWebPaige: angular.toJson(settings)
              })
              .then(
              function (result)
              {
                deferred.resolve(
                  {
                    saved: true
                  });
              });

            return deferred.promise;
          };

          return new Settings;
        }
      ]);

  }
);
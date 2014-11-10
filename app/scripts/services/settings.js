define(['services/services'], function (services) {
  'use strict';

  services.factory('Settings', function ($rootScope, $resource, $q, Profile, Store) {
    var Settings = $resource();

    Settings.prototype.get = function () {
      // return angular.fromJson(Storage.get('resources')).settingsWebPaige || {};
      return angular.fromJson(Store('user').get('resources').settingsWebPaige) || {};
    };

    Settings.prototype.save = function (id, settings) {
      var deferred = $q.defer();

      Profile.save(id, {settingsWebPaige: angular.toJson(settings)}).then(function () {
        deferred.resolve({ saved: true });
      });

      return deferred.promise;
    };

    return new Settings;
  });
});
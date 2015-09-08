define(['services/services', 'config'], function (services, config) {
  'use strict';

  services.factory('Settings', function ($resource, $q, Store, $injector) {
    //TODO not yet implented, waiting until the userobject add the settings

    return {
      getBackEnd: function()
      {
        return Store('app').get('backEnd') || config.app.host;
      }
      setBackEnd: function(backEnd)
      {
        Store('app').save('backEnd', backEnd)
        return backEnd;
      },
      initBackEnd: function(userName, passWord)
      {
        var deferred = $q.defer,
          loginPromises = (config.app.otapRole == 'live')
            ? $q.all[ login(config.app.host) ]
            : $q.all([
                login( config.app.backEnds[0] ),
                login( config.app.backEnds[1] )
              ]);

        loginPromises
          .then(function(result) 
          {
            //check result
            //if the first result got ant 
            //what backEnd is the final Backend
            //deferred.resolve(one of the results)
          });
        return deferred.promise;
      },
      login : function(backEnd)
      {
        var login = $resource(backEnd + 'login/',  {}, {
          get: {
            method: 'GET',
            params: {
              uuid: '',
              pass: ''
            }
          }
        });

        return login.get({
          uuid: userName,
          pass: passWord
        });
      }
    };

    // var Settings = $resource();

    // Settings.prototype.get = function () {
    //   var deferred = $q.defer(),
    //       settings = Store('app').get('settings');

    //   if(settings.length)
    //   {
    //     deferred.resolve(settings);
    //   }
    //   else
    //   {
    //     Settings.prototype.init()
    //       .then(
    //         function(userSettings)
    //         {
    //           deferred.resolve(userSettings);
    //         }
    //       );
    //   }

    //   return deferred.promise;
    // };

    // /**
    //  * Checks if the user already have some setting otherwise return and save the default settings
    //  * @returns {*} promise with the settings of the user
    //  */
    // Settings.prototype.init = function()
    // {
    //   var deferred = $q.defer();

    //   Profile.get($rootScope.app.resources.uuid)
    //     .then(
    //     function(profileData)
    //     {
    //       if(profileData)
    //       {
    //         var settings = Settings.prototype.default();

    //         if(profileData.settings)
    //         {
    //           settings = profileData.settings;
    //         }
    //         else
    //         {
    //           Settings.prototype.save($rootScope.app.resources.uuid, settings);
    //         }

    //         Store('app').save('settings', settings);
    //         deferred.resolve(settings);
    //       }
    //       else
    //       {
    //         console.error('No profile data', profileData);
    //       }
    //     }
    //   );

    //   return deferred.promise;
    // };

    // Settings.prototype.default = function()
    // {
    //   return $rootScope.config.app.settings;
    // };

    // Settings.prototype.save = function (id, settings) {
    //   var deferred = $q.defer();

    //   Profile.save(id, settings).then(function () {
    //     deferred.resolve({ saved: true });
    //   });

    //   return deferred.promise;
    // };

    // // BackendSettings
    // var BackendSettings = $resource(
    //   config.host + '/settings',
    //   {},
    //   {
    //     get: {
    //       method: 'GET',
    //       params: {}
    //     }
    //   }
    // );


    // // Get BackendSettings
    // Settings.prototype.getBackendSettings = function () {
    //   var deferred = $q.defer();

    //   BackendSettings.get(
    //     {},
    //     function (results)
    //     {
    //       Store('BackendSettings').save('settings', results);
    //       deferred.resolve(results);
    //     },
    //     function (error)
    //     {
    //       deferred.resolve(error);
    //     }
    //   );

    //   return deferred.promise;
    // };

    // return new Settings;
  });
});
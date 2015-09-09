define(['services/services', 'config'], function (services, config) {
  'use strict';

  services.factory('Settings', function ($q, Store, $injector) {
    return {
      getBackEnd: function()
      {
        var backEnd = Store('app').get('backEnd');

        return (backEnd && backEnd.get) ? backEnd.get : config.app.host;
      },
      setBackEnd: function(backEnd)
      {
        Store('app').save('backEnd', { 'get': backEnd });
        return backEnd;
      },
      initBackEnd: function(userName, passWord)
      {
        var deferred = $q.defer(),
          self = this;

        if(config.app.otapRole == 'dev')
        {
          var promises = [];
          //create http requests with the different backends
          _.each(config.app.backEnds, function (backEndDir)
          {
            var request = self.login(backEndDir, userName, passWord);
            promises.push(request);
          });

          //Resolve all promises even if there are rejections
          this.aSync(promises, function error(results)
          {
            console.log('Rejected request:', results);
          }, function success(results)
          {
            console.log('Results (final):', results);
            var finalIndex = null;
            results.some(function (singleResult, index)
            {
              finalIndex = index;
              singleResult = self.validate(singleResult);
              return (singleResult['X-SESSION_ID']);
            });

            self.setBackEnd(config.app.backEnds[finalIndex]);
            deferred.resolve(results[finalIndex]);
          });


          //$q.all(promises)
          //  .then(function (results)
          //  {
          //    console.log('results', results);
          //    var finalIndex = null;
          //    //the first valid result will be the final backEnd
          //    results.some(function (singleResult, index)
          //    {
          //      finalIndex = index;
          //      //singleResult = self.validate(singleResult);
          //      return (singleResult['X-SESSION_ID']);
          //    });
          //    //if none of the results is valid
          //    //if(! results[finalIndex].validate)
          //    //{
          //    //  //When the system tries to login and all hosts time-out, show a message to the user that the system is temporarily unavailable and that they should try again
          //    //  results[finalIndex].errorMessage = 'System is temporarily unavailable, try again in a minute';
          //    //  self.setBackEnd(config.app.host);//set backend back on the default host
          //    //} else {
          //    //  self.setBackEnd(config.app.backEnds[finalIndex]);//set the backend on the one who was logging in correctly
          //    //}
          //
          //    self.setBackEnd(config.app.backEnds[finalIndex]);
          //    deferred.resolve(results[finalIndex]);
          //  }, function (error)
          //  {
          //    console.log('error', error);
          //  });
        }
        else
        {
          var self = this;
          self.setBackEnd(config.app.host);

          //There is still one backend, so only one promise to resolve
          self.login(config.app.host, userName, passWord)
            .then(function(result)
            {
              deferred.resolve(result);
            },
            function (error)
            {
              error = self.validate(error);
              deferred.resolve(error);
            });
        }
        return deferred.promise;
      },
      /**
       * Validate the result of the login
       * @param result the result of tje login
       * @returns {result} with the validation true or false
       */
      validate: function(result)
      {
        var $rootScope = $injector.get('$rootScope');

        result.validation = true;
        //check if 404 or 200 with session
        var status = 0;
        if (result.status)
        {
          status = result.status;
        }
        else if (result.error && result.error.status)
        {
          status = result.error.status;
        }
        if (status == 400 ||
          status == 403 ||
          status == 404 ||
          result.error)
        {
          result.validation = false;
          result.errorMessage = $rootScope.ui.login.alert_wrongUserPass;

        }
        else if (result.status == 0)
        {
          result.validation = false;
          result.errorMessage = $rootScope.ui.login.alert_network;

        }
        return result;
      },
      /**
       *
       * @param backEndDir the location of the backend
       * @returns {*|{method, params}} returns a resource promise
       */
      login: function(backEndDir, userName, passWord)
      {
        var $resource = $injector.get('$resource'),
          login = $resource(backEndDir + 'login/',  {}, {
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
        }).$promise;
      },
      aSync: function (listOfPromises, onErrorCallback, finalCallback) {

        listOfPromises  = listOfPromises  || [];
        onErrorCallback = onErrorCallback || angular.noop;
        finalCallback   = finalCallback   || angular.noop;

        // Create a new list of promises
        // that can "recover" from rejection
        var newListOfPromises = listOfPromises.map(function (promise) {
          return promise.catch(function (reason) {

            // First call the `onErrroCallback`
            onErrorCallback(reason);

            // Change the returned value to indicate that it was rejected
            // Based on the type of `reason` you might need to change this
            // (e.g. if `reason` is an object, add a `rejected` property)
            console.log('rejected');
            return reason;
          });
        });
        // Finally, we create a "collective" promise that calls `finalCallback` when resolved.
        // Thanks to our modifications, it will never get rejected !
        $q.all(newListOfPromises).then(finalCallback);
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
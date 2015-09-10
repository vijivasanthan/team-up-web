define(['services/services', 'config'], function (services, config) {
  'use strict';

  services.factory('Settings', function ($q, Store, $injector) {
    return {
      /**
       * get the backend directory locally
       * @returns {*} return the backend dir
       */
      getBackEnd: function()
      {
        var backEnd = Store('app').get('backEnd');

        return backEnd.get;
      },
      /**
       * Save the backend directory locally
       * @param backEnd The backend directory
       */
      setBackEnd: function(backEnd)
      {
        Store('app').save('backEnd', { 'get': backEnd });
      },
      /**
       * initialise backend directory by logging in on all backends defined
       * after that validate all the responses on statuscode
       * in the localConfig.host
       * @param userName
       * @param passWord
       * @returns {*} the response, if the response was rejected a errorMessage is added
       */
      initBackEnd: function(userName, passWord)
      {
        var deferred = $q.defer(),
          self = this,
          promises = [];

        //create http requests with the different backends
        _.each(config.app.host, function (backEndDir)
        {
          var request = self.login(backEndDir, userName, passWord);
          promises.push(request);
        });

        //Resolve all promises even if there are rejections
        this.aSync(promises, function error(results)
        {
          console.log('Rejected requests:', results);
        }, function success(results)
        {
          var result = self.validate(results);
          self.setBackEnd(config.app.host[result.index]);
          deferred.resolve(result);
        });
        return deferred.promise;
      },
      /**
       * Validate all the results of the login attempts on statuscode
       * @param result results of the logins
       * @returns {result} with the validation true or false
       */
      validate: function(results)
      {
        var $rootScope = $injector.get('$rootScope'),
          statusCodes = _.pluck(results, 'status'),
          //add a index to the result, so by returing the system will know what result was the first in order
          index = -1;

        // statuscode undefined is equal to 200, because there will be not request info
        // when there is a successfull result
        if( (index = statusCodes.indexOf(undefined)) >= 0)
        {
          results[index].validate = true;
        }
        else if( (index = statusCodes.indexOf(400)) >= 0 ||
          (index = statusCodes.indexOf(403)) >= 0 ||
          (index = statusCodes.indexOf(404)) >= 0 )
        {
          results[index].validate = false;
          results[index].errorMessage = $rootScope.ui.login.alert_wrongUserPass;
        }
        else if( (index = statusCodes.indexOf(503)) >= 0)
        {
          results[index].validate = false;
          results[index].errorMessage = "The system is temporarily unavailable, try again in a few seconds";
        }
        else if( (index = statusCodes.indexOf(0)) >= 0)
        {
          results[index].validate = false;
          results[index].errorMessage = "The backend does not exist";
        }
        else
        {
          results[index].validate = false;
          results[index].errorMessage = 'Statuscode not regonized';
        }
        results[index].index = index;
        return results[index];
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
      /**
       * This method will bundle all the responses, and rejections, not seperated in a resolved and rejected callBack
       * like $q.all does
       * @param listOfPromises
       * @param onErrorCallback
       * @param finalCallback
       */
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
  });
});
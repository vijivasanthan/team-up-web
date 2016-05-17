define(['services/services', 'config'], function (services, config)
{
  'use strict';

  services.factory('Settings', function ($q, Store, $injector)
  {
    return {
      /**
       * get the backend directory locally
       * @returns {*} return the backend dir
       */
      getBackEnd: function ()
      {
        var backEnd = Store('app').get('backEnd');
        //the default back End is for testpurposes only
        return backEnd.get;
      },
      /**
       * Save the backend directory locally
       * @param backEnd The backend directory
       */
      setBackEnd: function (backEnd)
      {
        Store('app').save('backEnd', {'get': backEnd});
      },
      /**
       * initialise backend directory by logging in on all backends defined
       * after that validate all the responses on statuscode
       * in the localConfig.host
       * @param backEnds all the backend directories
       * @param userName
       * @param passWord
       * @returns {*} the response, if the response was rejected a errorMessage is added
       */
      initBackEnd: function (backEnds, userName, passWord)
      {
        var deferred = $q.defer(),
          self = this,
          promises = [];

        //create http requests with the different backends
        _.each(backEnds, function (backEndDir)
        {
          var request = self.login(backEndDir, userName, passWord);
          promises.push(request);
        });

        //Resolve all promises even if there are rejections
        this.aSync(promises, function error(results)
        {},
        function success(results)
        {
          var result = self.getResultOnStatusCode(results);
          self.setBackEnd(backEnds[result.index]);
          deferred.resolve(result);
        });
        return deferred.promise;
      },
      /**
       * The statuscodes will be ordered by depending on the result of the backend.
       * First a 200 as in a successfully login, second in a 400, 403, or 404 as in wrong username or password.
       * The thirth status code 503 represents as the back-end will time out. At last statuscode zero if the back-end
       * not exist
       * the first result in that order will return validated
       * @param results An array of objects, where each entry represents the http status code of a /login request
       * @returns {*} The first result in the order of status codes will return
       */
      getResultOnStatusCode: function (results)
      {
        var $rootScope = $injector.get('$rootScope'),
          statusCodes = _.map(results, 'status'),
          self = this,
          index = 0;

        // The order of these status codes is mandatory!
        [undefined, 400, 403, 404, 503, 0]
          .some(function (statusCode)
          {
            index = statusCodes.indexOf(statusCode);
            if (index !== -1)
            {
              results[index].index = index;
              results[index] = self.validate(results[index]);
              return true;
            }
          });
        //statuscode not found
        if (index === -1)
        {
          index = 0;
          results[index].validate = false;
          results[index].errorMessage = $rootScope.ui.teamup.statusCodeNotRegonized;
        }

        return results[index];
      },
      /**
       * Validate the result on statuscode and add a error message
       * @param result the result inclusive a key value with valid true/false and a error message
       * if the result was not successfully
       * @returns {result} with the validation true or false
       */
      validate: function (result)
      {
        var $rootScope = $injector.get('$rootScope');

        switch (result.status)
        {
          case undefined:
            result.valid = true;
            break;
          case 503:
          case 0:
            result.valid = false;
            result.errorMessage = $rootScope.ui.teamup.noBackend(config.app.supportEmail);
            break;
          case 400:
          case 403:
          case 404:
            result.valid = false;
            result.errorMessage = $rootScope.ui.login.alert_wrongUserPass;
            break;
        }
        return result;
      },
      /**
       * Create a resource object with the combination of the backend directory, username and password
       * and return this as a promise
       * @param backEndDir the location of the backend
       * @param userName
       * @param passWord
       * @returns {*|{method, params}} returns a promify resource
       */
      login: function (backEndDir, userName, passWord)
      {
        var $resource = $injector.get('$resource'),
          login = $resource(backEndDir + 'login/', {}, {
            get: {
              method: 'GET',
              params: {
                uuid: '',
                pass: ''
              },
              transformResponse: function(data)
              {
                try
                {
                  return angular.fromJson(data);
                }
                catch (e)
                {
                  return {message: data};
                }
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
      aSync: function (listOfPromises, onErrorCallback, finalCallback)
      {

        listOfPromises = listOfPromises || [];
        onErrorCallback = onErrorCallback || angular.noop;
        finalCallback = finalCallback || angular.noop;

        // Create a new list of promises
        // that can "recover" from rejection
        var newListOfPromises = listOfPromises.map(function (promise)
        {
          return promise.catch(function (reason)
          {

            // First call the `onErrroCallback`
            onErrorCallback(reason);

            // Change the returned value to indicate that it was rejected
            // Based on the type of `reason` you might need to change this
            // (e.g. if `reason` is an object, add a `rejected` property)
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
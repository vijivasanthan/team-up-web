'use strict';


angular.module('WebPaige.Modals.User', ['ngResource'])


/**
 * User
 */
.factory('User', 
[
	'$resource', '$config', '$q', '$location', 'Storage', '$rootScope', 
	function ($resource, $config, $q, $location, Storage, $rootScope) 
	{
	  var self = this;


	  var User = $resource();


	  var Login = $resource(
	    $config.host + '/login',
	    {
	    },
	    {
	      process: {
	        method: 'GET',
	        params: {
            uuid:'',
            pass:''
          }
	      }
	    }
	  );


	  var Logout = $resource(
	    $config.host + '/logout',
	    {
	    },
	    {
	      process: {
	        method: 'GET',
	        params: {},
          isArray: true
	      }
	    }
	  );


    var Resources = $resource(
        $config.host + '/resources',
      {
      },
      {
        get: {
          method: 'GET',
          params: {}
        }
      }
    );


    var Divisions = $resource(
        $config.host + '/divisions',
      {
      },
      {
        get: {
          method: 'GET',
          params: {},
          isArray: true
        }
      }
    );


    var States = $resource(
        $config.host + '/states',
      {
      },
      {
        get: {
          method: 'GET',
          params: {},
          isArray: true
        }
      }
    );


	  var Reset = $resource(
	    $config.host + '/passwordReset',
	    {
	    },
	    {
	      password: {
	        method: 'GET',
	        params: {
            uuid: '',
            path:''
          },
          isArray: true
	      }
	    }
	  );


	  var changePassword = $resource(
      $config.host + '/passwordReset',
      {
      },
	    {
        reset: {
          method: 'GET',
          params: {
            uuid: '',
            pass: '',
            key:  ''
          }
        }
      });


    /**
     * Divisions
     */
    User.prototype.divisions = function ()
    {
      var deferred = $q.defer();

      Divisions.get(
        {},
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


    /**
     * States
     */
    User.prototype.states = function ()
    {
      var deferred = $q.defer();

      States.get(
        {},
        function (results)
        {
          var states = [];

          angular.forEach(results, function (node)
          {
            var state = '';

            angular.forEach(node, function (_s) { state += _s; });

            states.push(state);
          });

          deferred.resolve(states);
        },
        function (error)
        {
          deferred.resolve(error);
        }
      );

      return deferred.promise;
    };
	  
	  
	  /**
	   * TODO: RE-FACTORY
	   * User login
	   */
	  User.prototype.password = function (uuid)
	  {
	    var deferred = $q.defer();

	    Reset.password(
	      {
	        uuid: uuid.toLowerCase(),
	        path: $location.absUrl()
	      }, 
	      function (result)
	      {
	        if (angular.equals(result, []) || angular.equals(result, [{}]))
	        {
	          deferred.resolve("ok");
	        }
	        else
	        {
	          deferred.resolve(result);
	        }
	      },
	      function (error)
	      {
	        deferred.resolve(error);
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * User login
	   */
	  User.prototype.login = function (uuid, pass) 
	  {    
	    var deferred = $q.defer();

	    Login.process(
        {
          uuid: uuid,
          pass: pass
        },
	      function (result) 
	      {
	        if (angular.equals(result, [])) 
	        {
	          deferred.reject("Something went wrong with login!");
	        }
	        else 
	        {
	          deferred.resolve(result);
	        }
	      },
	      function (error)
	      {
	        deferred.resolve(error);
	      }
	    );

	    return deferred.promise;
	  };
	  

	  /**
	   * RE-FACTORY
	   * change user password
	   */
	  User.prototype.changePass = function (uuid, newpass, key)
	  {
	    var deferred = $q.defer();
	    
	    /**
	     * RE-FACTORY
	     */
	    changePassword.get({
          uuid: uuid,
          pass: newpass,
          key:  key
        },
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


	  /**
	   * User logout
	   */
	  User.prototype.logout = function () 
	  {    
	    var deferred = $q.defer();

	    Logout.process(
        null,
	      function (result) 
	      {
	        deferred.resolve(result);
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * Get user resources
	   */
	  User.prototype.resources = function () 
	  {    
	    var deferred = $q.defer();

	    Resources.get(
        null,
	      function (result) 
	      {
	        if (angular.equals(result, [])) 
	        {
	          deferred.reject("User has no resources!");
	        }
	        else 
	        {
	          Storage.add('resources', angular.toJson(result));

	          deferred.resolve(result);
	        }
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };

	  return new User;
	}
]);
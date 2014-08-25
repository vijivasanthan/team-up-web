(function() {
  define(['services/services'], function(services) {
    'use strict';
    services.factory('Interceptor', [
      '$q', 'Log', '$location' , function($q, Log, $location) {
        return {
          request: function(config) {
            return config || $q.when(config);
          },
          requestError: function(rejection) {
            console.warn('request error ->', rejection);
            Log.error(rejection);
            return $q.reject(rejection);
          },
          response: function(response) {
            return response || $q.when(response);
          },
          responseError: function(rejection) {
            console.warn('response error ->', rejection);

            if (rejection.status == 403){
               localStorage.setItem('sessionTimeout', '');
               $location.path('/logout');
               //window.location.href = 'logout.html';
            }

            // Log.error(rejection);
            return $q.reject(rejection);
          }
        };
      }
    ]);
  });

}).call(this);

//# sourceMappingURL=interceptor.js.map

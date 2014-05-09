(function() {
  define(['services/services'], function(services) {
    'use strict';
    services.factory('Log', [
      'Store', function(Store) {
        return {
          record: function(key, message) {
            var stamp;
            stamp = Date.now();
            key += '_' + stamp;
            return Store('logs').save(key, {
              time: stamp,
              message: message
            });
          },
          error: function(trace) {
            var body, err, stamp;
            Store = Store('error');
            stamp = Date.now();
            err = {};
            body = {};
            if (trace.hasOwnProperty('message')) {
              body = {
                stack: trace.stack,
                message: trace.message
              };
            } else {
              body = {
                trace: trace
              };
            }
            err[stamp] = body;
            console.warn('Error: ', trace);
            return Store.save('error_' + stamp, err);
          }
        };
      }
    ]);
  });

}).call(this);

//# sourceMappingURL=log.js.map

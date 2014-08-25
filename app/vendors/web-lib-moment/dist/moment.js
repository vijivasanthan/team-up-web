(function() {
  define(['services/services', 'moment'], function(services, moment) {
    'use strict';
    services.factory('Moment', [
      function() {
        return moment;
      }
    ]);
  });

}).call(this);

//# sourceMappingURL=moment.js.map

(function() {
  define(['services/services'], function(services) {
    'use strict';
    services.factory('Offline', [
      '$rootScope', function($rootScope) {
        var Offline;
        Offline = (function() {
          function Offline() {
            var event, _i, _len, _ref;
            this.events = ['online', 'offline'];
            _ref = this.events;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              event = _ref[_i];
              this.addEvents(event);
            }
          }

          Offline.prototype.addEvent = function(element, event, fn, useCapture) {
            if (useCapture == null) {
              useCapture = false;
            }
            return element.addEventListener(event, fn, useCapture);
          };

          Offline.prototype.addEvents = function(event) {
            return this.addEvent(window, event, this[event]);
          };

          Offline.prototype.online = function() {
            return $rootScope.$broadcast('connection', false);
          };

          Offline.prototype.offline = function() {
            return $rootScope.$broadcast('connection', true);
          };

          return Offline;

        })();
        return Offline;
      }
    ]);
  });

}).call(this);

//# sourceMappingURL=offline.js.map

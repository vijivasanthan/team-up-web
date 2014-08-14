(function() {
  define(["services/services"], function(services) {
    "use strict";
    services.factory("Session", [
      "$rootScope", "$http", "$location", function($rootScope, $http, $location) {
        return {
          check: function() {
            if (!this.get()) {
              $location.path("/login");
              return false;
            } else {
              return true;
            }
          },
          get: function() {
            var session;
            session = angular.fromJson(sessionStorage.getItem("session"));
            if (!$http.defaults.headers.common["X-SESSION_ID"] && session) {
              $http.defaults.headers.common["X-SESSION_ID"] = session.id;
            }
            if (session) {
              return session.id;
            } else {
              return false;
            }
          },
          set: function(id) {
            $http.defaults.headers.common["X-SESSION_ID"] = id;
            sessionStorage.setItem("session", angular.toJson({
              id: id,
              time: new Date()
            }));
          },
          clear: function() {
            sessionStorage.removeItem("session");
            $http.defaults.headers.common["X-SESSION_ID"] = null;
          }
        };
      }
    ]);
  });

}).call(this);

//# sourceMappingURL=session.js.map

define ["services/services"], (services) ->
  "use strict"

  services.factory "Session", [
    "$rootScope"
    "$http"
    "$location"
    ($rootScope, $http, $location) ->

      return (

        check: ->
          unless @get()
            $location.path "/login"
            false
          else
            true

        get: ->
          session = angular.fromJson(sessionStorage.getItem("session"))
          if not $http.defaults.headers.common["X-SESSION_ID"] and session
            $http.defaults.headers.common["X-SESSION_ID"] = session.id
          (if (session) then session.id else false)

        set: (id) ->
          $http.defaults.headers.common["X-SESSION_ID"] = id
          sessionStorage.setItem "session", angular.toJson(
            id: id
            time: new Date()
          )
          return

        clear: ->
          sessionStorage.removeItem "session"
          $http.defaults.headers.common["X-SESSION_ID"] = null
          return

      )
  ]
  return

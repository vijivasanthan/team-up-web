define ['services/services'], (services) ->

  'use strict'

  services.factory 'Session', [
    '$http'
    'Store'
    ($http, Store) ->

      Store = Store('session')

      return (

        # Check the session
        get: ->
          session = Store.get 'info'
          session.id

        # Set the session
        set: (id) ->
          session = { id: id }
          session.inited = new Date().getTime()
          Store.save info: session
          $http.defaults.headers.common['X-SESSION_ID'] = session.id
          session

      # Clear the session
        clear: ->
          Store.remove 'info'
          $http.defaults.headers.common['X-SESSION_ID'] = null
          return
      )
  ]
  return
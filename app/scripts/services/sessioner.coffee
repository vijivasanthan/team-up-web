define ['services/services'], (services) ->
  'use strict'

  services.factory 'Session', [
    '$http'
    'Store'
    ($http, Store) ->
      Store = Store('session')

      return (

        get: ->
          session = Store.get 'info'
          session.id

        set: (id) ->
          session = { id: id }
          session.inited = new Date().getTime()
          Store.save info: session
          $http.defaults.headers.common['X-SESSION_ID'] = session.id
          session

        clear: ->
          Store.remove 'info'
          $http.defaults.headers.common['X-SESSION_ID'] = null
          return
      )
  ]
  return
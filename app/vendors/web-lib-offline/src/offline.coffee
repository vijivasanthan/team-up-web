define ['services/services'], (services) ->
  'use strict'

  services.factory 'Offline', [
    '$rootScope'
    ($rootScope) ->

      class Offline

        constructor: () ->
          @events = ['online', 'offline']
          @addEvents event for event in @events

        addEvent: (element, event, fn, useCapture = false) ->
          element.addEventListener event, fn, useCapture

        addEvents: (event) ->
          @addEvent window, event, @[event]

        online: () ->
          $rootScope.$broadcast 'connection', false

        offline: ->
          $rootScope.$broadcast 'connection', true

      return Offline
  ]
  return
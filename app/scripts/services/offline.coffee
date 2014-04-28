define ['services/services'], (services) ->

  'use strict'

  services.factory 'Offline', [
    '$rootScope'
    ($rootScope) ->

      class Offline
        constructor: () ->
          @events = ['online', 'offline']
          @addEvents event for event in @events

        # Add events
        addEvent: (element, event, fn, useCapture = false) ->
          element.addEventListener event, fn, useCapture

        # Run event list
        addEvents: (event) ->
          @addEvent window, event, @[event]

        # Are we online?
        online: () ->
          $rootScope.$broadcast 'connection', false

        # Or offline?
        offline: ->
          $rootScope.$broadcast 'connection', true
  ]
  return
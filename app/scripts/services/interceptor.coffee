define ['services/services'], (services) ->

  'use strict'

  services.factory 'Interceptor', [
    '$q'
    'Log'
    ($q, Log) ->

      # Log request
      request: (config) ->
        # console.log 'request ->', config
        config or $q.when(config)

      # On request error
      requestError: (rejection) ->
        # console.warn 'request error ->', rejection
        $q.reject rejection

      # Log response
      response: (response) ->
        # console.log 'response', response
        response or $q.when(response)

      # On response error
      responseError: (rejection) ->
        # console.warn 'response error ->', rejection
        $q.reject rejection
  ]

  return
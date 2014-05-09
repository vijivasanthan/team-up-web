define ['services/services'], (services) ->
  'use strict'

  services.factory 'Interceptor', [
    '$q'
    'Log'
    ($q, Log) ->

      request: (config) ->
        # console.log 'request ->', config
        config or $q.when(config)

      requestError: (rejection) ->
        console.warn 'request error ->', rejection
        Log.error rejection
        $q.reject rejection

      response: (response) ->
        # console.log 'response', response
        response or $q.when(response)

      responseError: (rejection) ->
        console.warn 'response error ->', rejection
        Log.error rejection
        $q.reject rejection

  ]

  return
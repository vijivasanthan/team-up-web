define ['services/services'], (services) ->

  'use strict'

  services.factory 'Log', [
    'Store'
    (Store) ->

      # Log any given errors
      error: (trace) ->
        Store = Store('error')

        stamp = Date.now()
        err = {}
        body = {}

        if trace.hasOwnProperty 'message'
          body = {
            stack: trace.stack,
            message: trace.message
          }
        else
          body = {
            trace: trace
          }

        err[stamp] = body

        console.warn 'Error: ', trace

        Store.save err
  ]
  return
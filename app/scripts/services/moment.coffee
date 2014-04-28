define ['services/services', 'moment'], (services, moment) ->

  'use strict'

  services.factory 'Moment', [
    ->
      moment
  ]
  return
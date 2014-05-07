define ['services/services'], (services) ->
  'use strict'

  # TODO
  # 1. Return callbacks in CRUD actions
  # 2. Extend it with local searching capabilities
  # 3. Implement Log module for errors
  # 4. Switch to angular foreach later on?

  services.factory 'Store', [
    '$window'
    '$log'
    '$parse'
    ($window, $log, $parse) ->
      return (name, config) ->

        getEntryId = (entry) ->
          try
            return idGetter(entry)
          catch e
            return null
          return

        LawnChair = (callback) ->
          new Lawnchair {name: name}, callback

        saveEntry = (data, key) ->
          key = key.toString()
          if angular.isObject(data) and data isnt collection[key]
            collection[key] = collection[key] or {}
            angular.extend collection[key], data
          else
            collection[key] = data
          update =
            key: key
            value: transformSave(collection[key])
          try
            LawnChair ->
              @save update
              return
          catch e
            if e.name is 'QUOTA_EXCEEDED_ERR' or e.name is 'NS_ERROR_DOM_QUOTA_REACHED'
              $window.localStorage.clear()
            $log.info 'LocalStorage Exception ==> ' + e.message
          return

        updateArray = (data) ->
          array.length = 0
          _.each data, (o) ->
            array.push o
            return
          array

        # Update cache
        updateCache = (obj, key) ->
          if obj and angular.isObject(obj) and collection[key] and collection[key] isnt obj
            angular.extend collection[key], obj
          else
            collection[key] = obj
          return

        updateCacheFromStorage = (cache, storage) ->
          if storage
            if angular.isObject(storage.value) and angular.isObject(cache)
              angular.extend cache, transformLoad(storage.value)
            else
              cache = transformLoad(storage.value)
            updateCache cache, storage.key
          cache

        allAsCollection = (callback) ->
          LawnChair ->
            @all (result) ->
              angular.forEach result, (o) ->
                updateCache o.value, o.key
                return
              callback collection if callback
              return
            return
          collection

        allAsArray = (callback) ->
          updateArray allAsCollection((data) ->
            updateArray data
            callback array if callback
            return
          )

        removeEntry = (key) ->
          delete collection[key]
          LawnChair ->
            @remove key
            return
          return

        getDefault = (key) ->
          if collection[key]
            collection[key]
          else
            d = {}
            idGetter.assign d, key
            d

        collection = {}
        array = []
        isArray = config and config.isArray
        idGetter = $parse((if (config and config.entryKey) then config.entryKey else 'id'))
        transformSave = (if (config and config.transformSave) then config.transformSave else angular.identity)
        transformLoad = (if (config and config.transformLoad) then config.transformLoad else angular.identity)

        Store =

          collection: collection

          save: (key, data, clear) ->
            unless data
              data = collection
              key = null
            if angular.isArray(data)
              angular.forEach data, (e, index) ->
                saveEntry e, getEntryId(e) or index
                return
            else if key or (data and getEntryId(data))
              saveEntry data, key or getEntryId(data)
            else
              angular.forEach data, saveEntry
            if clear
              newIds = (if angular.isArray(data) then _.chain(data).map(getEntryId).map(String).value() else _.keys(data))
              _.chain(collection).keys().difference(newIds).each removeEntry
              _.chain(collection).filter((entry) ->
                not getEntryId(entry)
              ).keys().each removeEntry
            updateArray collection if isArray
            return

          batch: (keys, target, callback) ->
            cache = _.chain(keys).map((k) ->
              getDefault k
            ).value()
            if target and angular.isArray(target)
              target.length = 0
              _.each cache, (o) ->
                target.push o
                return
            else
              target = cache
            LawnChair ->
              @get keys, (result) ->
                if result
                  i = result.length - 1
                  while i >= 0
                    target[i] = updateCacheFromStorage(target[i], result[i])
                    i--
                callback target if callback
                return
              return
            target

          get: (key, callback) ->
            value = getDefault(key)
            LawnChair ->
              @get key, (result) ->
                value = updateCacheFromStorage(value, result) if result
                callback value if callback
                return
              return
            value

          all: (if isArray then allAsArray else allAsCollection)

          remove: removeEntry

          nuke: ->
            LawnChair ->
              @nuke()
              return
            return

          destroy: ->
            for key of collection
              delete collection[key]
            LawnChair ->
              @nuke()
              return
            return

        Store
  ]
  return
define ['services/services'], (services) ->
  'use strict'

  # TODO
  # 1. Return callbacks in CRUD actions
  # 2. Extend it with local searching capabilities
  # 3. Implement Log module for errors

  services.factory 'Store', [
    '$window'
    '$log'
    '$parse'
    ($window, $log, $parse) ->
      return (name, config) ->

        # Get entry by ID
        getEntryId = (entry) ->
          try
            return idGetter(entry)
          catch e
            return null
          return

        # Create our LawnChair object
        LawnChair = (callback) ->
          new Lawnchair {name: name}, callback

        # Save entry
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

        # Update array
        updateArray = (data) ->
          array.length = 0
          # TODO: Switch to angular loop later on
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

        # Update cache from storage
        updateCacheFromStorage = (cache, storage) ->
          if storage
            if angular.isObject(storage.value) and angular.isObject(cache)
              angular.extend cache, transformLoad(storage.value)
            else
              cache = transformLoad(storage.value)
            updateCache cache, storage.key
          cache

        # Treat as collection
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

        # Treat as array
        allAsArray = (callback) ->
          updateArray allAsCollection((data) ->
            updateArray data
            callback array if callback
            return
          )

        # Remove entry
        removeEntry = (key) ->
          delete collection[key]
          LawnChair ->
            @remove key
            return
          return

        # Get default
        getDefault = (key) ->
          if collection[key]
            collection[key]
          else
            d = {}
            idGetter.assign d, key
            d

        # Define containers
        collection = {}
        array = []
        isArray = config and config.isArray
        idGetter = $parse((if (config and config.entryKey) then config.entryKey else 'id'))
        transformSave = (if (config and config.transformSave) then config.transformSave else angular.identity)
        transformLoad = (if (config and config.transformLoad) then config.transformLoad else angular.identity)

        # Create Store object
        Store =

        # Pass the collection
          collection: collection

        # Save a record
          save: (data, key, clear) ->
            unless data
              data = collection # if nothing is set save the current cache
              key = null
            if angular.isArray(data)
              angular.forEach data, (e, index) -> # Save a Array
                saveEntry e, getEntryId(e) or index
                return
            else if key or (data and getEntryId(data))
              saveEntry data, key or getEntryId(data) # save one entry
            else
              angular.forEach data, saveEntry # save a collection
            if clear
              newIds = (if angular.isArray(data) then _.chain(data).map(getEntryId).map(String).value() else _.keys(data))
              _.chain(collection).keys().difference(newIds).each removeEntry
              # remove entries without ids
              _.chain(collection).filter((entry) ->
                not getEntryId(entry)
              ).keys().each removeEntry
            updateArray collection if isArray
            return

        # Batch treat records
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

        # Get record(s)
          get: (key, callback) ->
            value = getDefault(key)
            LawnChair ->
              @get key, (result) ->
                value = updateCacheFromStorage(value, result) if result
                callback value if callback
                return
              return
            value

        # Treat all
          all: (if isArray then allAsArray else allAsCollection)

        # Remove a record
          remove: removeEntry

        # Nuke localStorage
          nuke: ->
            LawnChair ->
              @nuke()
              return
            return

        # Destroy a collection
          destroy: ->
            for key of collection
              delete collection[key]
            LawnChair ->
              @nuke()
              return
            return

        # Return our Store object
        Store
  ]
  return
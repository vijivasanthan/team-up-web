define(
  ['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory(
      'Slots',
      [
        '$rootScope', '$resource', '$q',
        function ($rootScope, $resource, $q)
        {
          var Slots = $resource(
              config.app.host + config.app.namespace + '/tasks/:taskId',
              {},
              {
                query:  {
                  method:  'GET',
                  params:  {
                    start: '',
                    end:   ''
                  },
                  isArray: true
                },
                change: {
                  method: 'PUT'
                },
                save:   {
                  method: 'POST'
                },
                remove: {
                  method: 'DELETE'
                }
              }
          );


          // Slots.prototype.local = function () { return angular.fromJson(Storage.get('slots')) };


          Slots.prototype.add = function (slot)
          {
            var deferred = $q.defer();

            Slots.save(
              slot,
              function (result)
              {
                deferred.resolve(result);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };





          Slots.prototype.update = function (slot)
          {
            var deferred = $q.defer();

            Slots.change(
              {
                taskId: slot.uuid
              },
              slot,
              function (result)
              {
                deferred.resolve(result);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };


          /**
           * This was not in use already!
           * @param tId
           * @returns {*}
           */
//          Slots.prototype.change = function (slot, user)
//          {
//            var deferred = $q.defer();
//
//            Slots.change(
//              angular.extend(
//                {
//                  start: new Date(slot.start).getTime() / 1000,
//                  end: new Date(slot.end).getTime() / 1000,
//                  recursive: angular.fromJson(slot.content).recursive,
//                  text:      angular.fromJson(slot.content).state,
//                  id:        angular.fromJson(slot.content).id
//                },
//                { member: user }
//              ),
//              function (result)
//              {
//                deferred.resolve(result);
//              },
//              function (error) { deferred.resolve({error: error}) }
//            );
//
//            return deferred.promise;
//          };






          Slots.prototype.remove = function (tId)
          {
            var deferred = $q.defer();

            Slots.remove(
              {
                taskId: tId
              },
              function (result)
              {
                deferred.resolve(result);
              },
              function (error) { deferred.resolve({error: error}) }
            );

            return deferred.promise;
          };





          return new Slots;
        }
      ]
    );
  }
);
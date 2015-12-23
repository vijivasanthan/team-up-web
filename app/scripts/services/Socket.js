define(['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory('Socket',
      function ($websocket)
      {
        var ws = $websocket('ws://echo.websocket.org/');
        var collection = [];

        ws.onMessage(function(event)
        {
          console.log('message received: ', event);
          var res;
          try {
            res = JSON.parse(event.data);
          } catch(e) {
            res = {
              'message': event.data
            };
          }

          collection.push({
            content: res.message,
            timeStamp: event.timeStamp
          });
        });

        ws.onError(function(event) {
          console.log('connection Error', event);
        });

        ws.onClose(function(event) {
          console.log('connection closed', event);
        });

        ws.onOpen(function() {
          console.log('connection open');
          ws.send('Hello World');
        });

        return {
          collection: collection,
          status: function() {
            return ws.readyState;
          },
          send: function(message) {
            if (angular.isString(message)) {
              ws.send(message);
            }
            else if (angular.isObject(message)) {
              ws.send(JSON.stringify(message));
            }
          }
        };
      });
  });
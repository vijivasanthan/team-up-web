define(['services/services', 'config', 'socket.io-client'],
  function (services, config, io)
  {
    'use strict';

    services.factory('socketService',
      function (socketFactory)
      {
        var socket = socketFactory({
            ioSocket: io.connect('leonj-pc.local:8082')
        });
        socket.forward('message');
        return socket;
      });
  });
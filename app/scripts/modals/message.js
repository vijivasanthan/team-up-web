define(['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory
    (
      'Message',
        function ($rootScope, $resource, $q, Store, $location)
        {
          var Message = $resource(config.app.host + 'team/teamMessage/:teamId', {},
              {
                get: {
                  method: 'GET',
                  interceptor: {
                    response: function (response)
                    {
                      return response;
                    }
                  }
                },
                save: {
                  method: 'POST',
                  params: {}
                }
              }
            );

          Message.prototype.addByType = function (typeData)
          {
            switch (typeData.type)
            {
              case "teamlid":
                console.log("het is een teamlid");
                break;
              case "client":
                console.log("het is een client");
                break;
              case "contact":
                console.log("het is een contact");
                break;
              default:
                console.log("");
            }
          };

          Message.prototype.save = function(message, teamId)
          {
            var deferred = $q.defer();
            var teamData = (teamId) ? {teamId: teamId} : {};
            var currentDate = new Date()
            var messageData = {
              title: 'Van: TeamUp' + currentDate.toString(config.app.formats.date),
              body: message,
              sendTime: currentDate.getTime()
            };

            Message.save(teamData, messageData, 
              function (result)
              {
                console.log('result', result);
                if(result.result)
                {
                  deferred.resolve(result.result);
                }
                else
                {
                  var errorMessage = 'Chat message isn t added -> ' + result;
                  console.log(errorMessage);
                  deferred.resolve(errorMessage);
                }
            })

            deferred.promise;
          };

          return new Message;
        }
    )
  }
);


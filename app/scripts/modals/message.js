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
                  params: {}
                },
                save: {
                  method: 'POST',
                  params: {}
                }
              }
            );

          //TODO different type of receivers
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
            var deferred = $q.defer(),
                teamData = (teamId) ? { teamId: teamId } : {},
                currentDate = new Date(),
                messageData = {
                  title: 'Van: TeamUp' + currentDate.toString(config.app.formats.date),
                  body: message,
                  sendTime: currentDate.getTime()
                };

            Message.save(teamData, messageData,
              function (result)
              {
                if(result.result)
                {
                  deferred.resolve(result.result);
                }
                else
                {
                  deferred.resolve({error: 'Chat message isn t added -> ' + result});
                }
            });

            return deferred.promise;
          };

          return new Message;
        }
    )
  }
);


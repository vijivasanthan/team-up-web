define(
  ['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory(
      'TeamUp',
      [
        '$resource', '$q', '$location', '$rootScope', 'Log',
        function ($resource, $q, $location, $rootScope, Log)
        {
          var TeamUp = $resource(
              config.app.host + config.app.namespace + '/:first/:second/:third/:fourth',
              {},
              {
                /**
                 * Account calls
                 */
                login:  {
                  method: 'GET',
                  params: {
                    first: 'login',
                    uuid:  '',
                    pass:  ''
                  }
                },
                logout: {
                  method:  'GET',
                  isArray: true,
                  params:  {
                    first: 'logout'
                  }
                },
                user:   {
                  method: 'GET',
                  params: {
                    first:  'team',
                    second: 'member'
                  }
                },

                /**
                 * Messaging
                 */
                chats:   {
                  method:  'GET',
                  params:  {
                    first:  'team',
                    second: 'teamMessage',
                    third:  ''
                  },
                  isArray: true
                },
                message: {
                  method: 'POST',
                  params: {
                    first:  'team',
                    second: 'teamMessage'
                  }
                },

                /**
                 * Team profiles
                 */
                profileGet:  {
                  method: 'GET',
                  params: {
                    first:  'team',
                    second: 'member'
                  }
                },
                profileSave: {
                  method: '',
                  params: {
                    first: '/team/',
                    third: 'member'
                  }
                },

                /**
                 * Tasks
                 */
                taskQuery:  {
                  method:  'GET',
                  params:  {
                    first: 'tasks',
                    start: '',
                    end:   ''
                  },
                  isArray: true
                },
                taskAdd:    {
                  method: 'POST',
                  params: {
                    first: 'tasks'
                  }
                },
                taskUpdate: {
                  method: 'PUT',
                  params: {
                    first: 'tasks'
                  }
                },
                taskDelete: {
                  method: 'DELETE',
                  params: {
                    first: 'tasks'
                  }
                },

                /**
                 * Client-Group
                 */
                clientGroupQuery: {
                  method:  'GET',
                  params:  {
                    first:  'client',
                    second: 'clientGroups'
                  },
                  isArray: true
                }



              }
          );

          TeamUp.prototype._ = function (proxy, params, data, callback)
          {
            console.log('call: proxy ->', arguments);

            Log.record(arguments);

            var deferred = $q.defer();

            params = params || {};

            try
            {
              TeamUp[proxy](
                params,
                data,
                function (result)
                {
                  if (callback && callback.success)
                  {
                    callback.success.call(this, result);
                  }

                  deferred.resolve(result);
                },
                function (result)
                {
                  if (callback && callback.error)
                  {
                    callback.error.call(this, result);
                  }

                  deferred.resolve({error: result});
                }
              );
            }
            catch (err)
            { Log.error(err) }

            return deferred.promise;
          };

          return new TeamUp();
        }
      ]
    );
  }
);
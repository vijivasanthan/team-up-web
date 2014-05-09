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
                clientGroupsQuery: {
                  method:  'GET',
                  params:  {
                    first:  'client',
                    second: 'clientGroups'
                  },
                  isArray: true
                },

                /**
                 * Clients-By-Group-ID
                 */
                clientsByGroupIDQuery: {
                  method: 'GET',

                  isArray: true,
                  params:  {
                    first:  'client',
                    second: 'clientGroup',
                    fourth: 'clients'
                  }
                },
                clientsByGroupIDAdd:   {
                  method: 'POST',
                  params: {
                    first:  'client',
                    second: 'clientGroup',
                    fourth: 'clients'
                  }
                },

                /**
                 * Client-Group
                 */
                clientGroupAdd:    {
                  method: 'POST',
                  params: {
                    first: 'clientGroup'
                  }
                },
                clientGroupUpdate: {
                  method: 'PUT',
                  params: {
                    first: 'clientGroup'
                  }
                },
                clientGroupDelete: {
                  method: 'DELETE',
                  params: {
                    first: 'clientGroup'
                  }
                },

                /**
                 * Client
                 */
                clientAdd:    {
                  method: 'POST',
                  params: {
                    first: 'client'
                  }
                },
                clientUpdate: {
                  method: 'PUT',
                  params: {
                    first: 'client'
                  }
                },
                clientDelete: {
                  method: 'DELETE',
                  params: {
                    first: 'client'
                  }
                },

                /**
                 * Clients
                 */
                clientsQuery: {
                  method:  'GET',
                  isArray: true,
                  params:  {
                    first:  'client',
                    second: 'clients'
                  }
                },

                /**
                 * Client-Reports
                 */
                clientReportsQuery: {
                  method:  'GET',
                  isArray: true,
                  params:  {
                    first: 'clients',
                    third: 'reports'
                  }
                },

                /**
                 * Client-Group-Client
                 */
                clientGroupClientDelete: {
                  method: 'PUT',
                  params: {
                    first:  'client',
                    second: 'clientGroup',
                    fourth: 'removeClients'
                  }
                },

                /**
                 * Client-Group-Reports
                 */
                clientGroupReportsQuery: {
                  query: {
                    method:  'GET',
                    isArray: true,
                    params:  {
                      first: 'clientGroup',
                      third: 'reports'
                    }
                  }
                },

                /**
                 * Client-Group-Tasks
                 */
                clientGroupTasksQuery: {
                  method:  'GET',
                  isArray: true,
                  params:  {
                    first: 'clientGroup',
                    third: 'tasks',
                    from:  '',
                    to:    ''
                  }
                },

                /**
                 * Client-Report
                 */
                clientReportAdd:    {
                  method: 'POST',
                  params: {
                    first: 'clients',
                    third: 'reports'
                  }
                },
                clientReportDelete: {
                  method: 'DELETE',
                  params: {
                    first:    'clients',
                    third:    'reports',
                    reportId: ''
                  }
                },

                /**
                 * Team
                 */
                teamQuery:  {
                  method:  'GET',
                  isArray: true,
                  params:  {
                    first: 'team'
                  }
                },
                teamAdd:    {
                  method: 'POST',
                  params: {
                    first: 'team',
                    id:    ''
                  }
                },
                teamUpdate: {
                  method: 'PUT',
                  params: {
                    first: 'team'
                  }
                },
                teamDelete: {
                  method: 'DELETE',
                  params: {
                    first: 'team'
                  }
                },

                /**
                 * Team-Status
                 */
                teamStatusQuery: {
                  method:  'GET',
                  isArray: true,
                  params:  {
                    first:  'team',
                    second: 'status'
                  }
                },

                /**
                 * Team-Member
                 */
                teamMemberAdd:    {
                  method: 'POST',
                  params: {
                    first: 'team',
                    third: 'member'
                  }
                },
                teamMemberUpdate: {
                  method: 'PUT',
                  params: {
                    first: 'team',
                    third: 'updateMembers'
                  }
                },
                teamMemberDelete: {
                  method: 'PUT',
                  params: {
                    first: 'team',
                    third: 'removeMember'
                  }
                },
                teamMemberFree:   {
                  method:  'GET',
                  isArray: true,
                  params:  {
                    first:  'team',
                    second: 'members'
                  }
                },

                /**
                 * Team-Client-Group
                 */
                teamClientGroupQuery:  {
                  method:  'GET',
                  isArray: true,
                  params:  {
                    first: 'team',
                    third: 'clientGroups'
                  }
                },
                teamClientGroupAdd:    {
                  method: 'POST',
                  params: {
                    first: 'team',
                    third: 'clientGroups'
                  }
                },
                teamClientGroupUpdate: {
                  method: 'PUT',
                  params: {
                    first: 'team',
                    third: 'updateClientGroups'
                  }
                },
                teamClientGroupDelete: {
                  method: 'PUT',
                  params: {
                    first: 'team',
                    third: 'unAssignClientGroups'
                  }
                },

                /**
                 * Team-Task
                 */
                teamTaskQuery: {
                  method:  'GET',
                  isArray: true,
                  params:  {
                    first: 'team',
                    third: 'tasks',
                    from:  '',
                    to:    ''
                  }
                },

                /**
                 * Team number
                 */
                teamPhoneNumber: {
                  method: 'GET',
                  params: {
                    first: 'team',
                    third: 'phone'
                  }
                },

                /**
                 * Member
                 */
                memberAdd:    {
                  method: 'POST',
                  params: {
                    first:  'team',
                    second: 'member'
                  }
                },
                memberDelete: {
                  method: 'DELETE',
                  params: {
                    first:  'team',
                    second: 'member'
                  }
                },
                memberPhoto:  {
                  method: 'GET',
                  params: {
                    first:  'team',
                    second: 'member',
                    fourth: 'photo',
                    width:  40,
                    height: 40
                  }
                }
              }
          );

          TeamUp.prototype._ = function (proxy, params, data, callback)
          {
            // TODO: Turn on logging later on!
            // Log.record('call', arguments);
            // console.log('call ->', arguments);

            var deferred = $q.defer();

            params = params || {};

            try
            {
              TeamUp[proxy](
                params,
                data,
                function (result)
                {
                  ((callback && callback.success)) && callback.success.call(this, result);

                  deferred.resolve(result);
                },
                function (result)
                {
                  ((callback && callback.error)) && callback.error.call(this, result);

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
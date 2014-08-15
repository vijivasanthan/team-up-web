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
                login: {
                  method: 'GET',
                  params: {
                    first: 'login',
                    uuid: '',
                    pass: ''
                  }
                },
                logout: {
                  method: 'GET',
                  isArray: true,
                  params: {
                    first: 'logout'
                  }
                },
                user: {
                  method: 'GET',
                  params: {
                    first: 'team',
                    second: 'member'
                  }
                },


                /**
                 * Messaging
                 */
                chats: {
                  method: 'GET',
                  params: {
                    first: 'team',
                    second: 'teamMessage',
                    third: '',
                    since: ''
                  },
                  isArray: true
                },
                message: {
                  method: 'POST',
                  params: {
                    first: 'team',
                    second: 'teamMessage'
                  }
                },


                /**
                 * Team profiles
                 */
                profileGet: {
                  method: 'GET',
                  params: {
                    first: 'team',
                    second: 'member'
                  }
                },
                profileSave: {
                  method: 'PUT',
                  params: {
                    first: 'team',
                    third: 'member'
                  }
                },


                /**
                 * Tasks
                 */
                // get list of all tasks
                tasksAll: {
                  method: 'GET',
                  params: {
                    first: 'team',
                    second: 'tasks'
                  },
                  isArray: true
                },
                // get list
                taskQuery: {
                  method: 'GET',
                  params: {
                    first: 'tasks',
                    start: '',
                    end: ''
                  },
                  isArray: true
                },
                // add a task
                taskAdd: {
                  method: 'POST',
                  params: {
                    first: 'tasks'
                  }
                },
                // update a task
                taskUpdate: {
                  method: 'PUT',
                  params: {
                    first: 'tasks'
                  }
                },
                // remove a task
                taskDelete: {
                  method: 'DELETE',
                  params: {
                    first: 'tasks'
                  }
                },
                // get mine tasks only
                taskMineQuery: {
                  method: 'GET',
                  params: {
                    first: 'tasks',
                    second: 'mine'
                  },
                  isArray: true
                },
                // get tasks list of team id
                taskByTeam: {
                  method: 'GET',
                  params: {
                    first: 'tasks',
                    second: 'team'
                  },
                  isArray: true
                },
                // get a specific task
                // TODO: check whether is being used on the web
                taskById: {
                  method: 'GET',
                  params: {
                    first: 'tasks'
                  },
                  isArray: false
                },


                /**
                 * Client-Group
                 */
                // get list of all the client groups
                clientGroupsQuery: {
                  method: 'GET',
                  params: {
                    first: 'client',
                    second: 'clientGroups'
                  },
                  isArray: true
                },
                // get clients by client group id
                clientsByGroupIDQuery: {
                  method: 'GET',
                  isArray: true,
                  params: {
                    first: 'client',
                    second: 'clientGroup',
                    fourth: 'clients'
                  }
                },
                // add clients by client group id
                clientsByGroupIDAdd: {
                  method: 'POST',
                  params: {
                    first: 'client',
                    second: 'clientGroup',
                    fourth: 'clients'
                  }
                },


                /**
                 * Client-Group
                 */
                // create a new client group
                clientGroupAdd: {
                  method: 'POST',
                  params: {
                    first: 'clientGroup'
                  }
                },
                // update a client group
                clientGroupUpdate: {
                  method: 'PUT',
                  params: {
                    first: 'clientGroup'
                  }
                },
                // delete a client group
                clientGroupDelete: {
                  method: 'DELETE',
                  params: {
                    first: 'clientGroup'
                  }
                },


                /**
                 * Client
                 */
                // add a client
                clientAdd: {
                  method: 'POST',
                  params: {
                    first: 'client'
                  }
                },
                // update a client
                clientUpdate: {
                  method: 'PUT',
                  params: {
                    first: 'client'
                  }
                },
                // remove a client
                clientDelete: {
                  method: 'DELETE',
                  params: {
                    first: 'client'
                  }
                },


                /**
                 * Clients
                 */
                // get the list of clients
                // meant more for management tab
                clientsQuery: {
                  method: 'GET',
                  isArray: true,
                  params: {
                    first: 'client',
                    second: 'clients'
                  }
                },


                /**
                 * Client-Reports
                 */
                // get the reports of that particular client
                clientReportsQuery: {
                  method: 'GET',
                  isArray: true,
                  params: {
                    first: 'clients',
                    third: 'reports'
                  }
                },


                /**
                 * Client-Group-Client
                 */
                // remove the client(s) from the specific group, meant more for management
                clientGroupClientDelete: {
                  method: 'PUT',
                  params: {
                    first: 'client',
                    second: 'clientGroup',
                    fourth: 'removeClients'
                  }
                },


                /**
                 * Client-Group-Reports
                 */
                // get the reports of a particular client group
                clientGroupReportsQuery: {
                  method: 'GET',
                  isArray: true,
                  params: {
                    first: 'clientGroup',
                    third: 'reports'
                  }
                },


                /**
                 * Client-Group-Tasks
                 */
                // get the tasks of particular client group, used in agenda
                clientGroupTasksQuery: {
                  method: 'GET',
                  isArray: true,
                  params: {
                    first: 'clientGroup',
                    third: 'tasks',
                    from: '',
                    to: ''
                  }
                },


                /**
                 * Client-Report
                 */
                // add a client report
                clientReportAdd: {
                  method: 'POST',
                  params: {
                    first: 'clients',
                    third: 'reports'
                  }
                },
                // update a client report
                clientReportUpdate: {
                  method: 'PUT',
                  params: {
                    first: 'clients',
                    third: 'reports'
                  }
                },
                // remove a client report
                clientReportDelete: {
                  method: 'DELETE',
                  params: {
                    first: 'clients',
                    third: 'reports',
                    reportId: ''
                  }
                },


                /**
                 * Team
                 */
                // get the list of teams
                teamQuery: {
                  method: 'GET',
                  isArray: true,
                  params: {
                    first: 'team'
                  }
                },
                // add a team
                teamAdd: {
                  method: 'POST',
                  params: {
                    first: 'team',
                    id: ''
                  }
                },
                // update a team
                teamUpdate: {
                  method: 'PUT',
                  params: {
                    first: 'team'
                  }
                },
                // remove a team
                teamDelete: {
                  method: 'DELETE',
                  params: {
                    first: 'team'
                  }
                },


                /**
                 * Team-Status
                 */
                // get the list of team members with their states of a particular team
                teamStatusQuery: {
                  method: 'GET',
                  isArray: true,
                  params: {
                    first: 'team',
                    second: 'status'
                  }
                },


                /**
                 * Team-Member
                 */
                // add a member to a team
                teamMemberAdd: {
                  method: 'POST',
                  params: {
                    first: 'team',
                    third: 'member'
                  }
                },
                // update the list a team in case of there are adds and removes
                teamMemberUpdate: {
                  method: 'PUT',
                  params: {
                    first: 'team',
                    third: 'updateMembers'
                  }
                },
                // remove members from a team
                teamMemberDelete: {
                  method: 'PUT',
                  params: {
                    first: 'team',
                    third: 'removeMember'
                  }
                },
                // get all members including members which do not belong to any teams
                // TODO: Makes a general query for members
                teamMemberFree: {
                  method: 'GET',
                  isArray: true,
                  params: {
                    first: 'team',
                    second: 'members'
                  }
                },


                /**
                 * Team-ClientGroup
                 */
                // get all the links between teams and client groups
                teamClientGroupQuery: {
                  method: 'GET',
                  isArray: true,
                  params: {
                    first: 'team',
                    third: 'clientGroups'
                  }
                },
                // add a link between teams and client groups
                teamClientGroupAdd: {
                  method: 'POST',
                  params: {
                    first: 'team',
                    third: 'clientGroups'
                  }
                },
                // update a link between teams and client groups
                teamClientGroupUpdate: {
                  method: 'PUT',
                  params: {
                    first: 'team',
                    third: 'updateClientGroups'
                  }
                },
                // remove a link between teams and client groups
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
                // Get tasks of a team, mainly used in agenda
                teamTaskQuery: {
                  method: 'GET',
                  isArray: true,
                  params: {
                    first: 'team',
                    third: 'tasks',
                    from: '',
                    to: ''
                  }
                },


                /**
                 * Team number
                 */
                // TODO: Depreciated functionailty
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
                // create a new team member
                // TODO: Check whether editing a member is being bundled in this call with id check in load
                memberAdd: {
                  method: 'POST',
                  params: {
                    first: 'team',
                    second: 'member'
                  }
                },
                // remove a team member
                memberDelete: {
                  method: 'DELETE',
                  params: {
                    first: 'team',
                    second: 'member'
                  }
                },


                // TODO: Not used as a AJAX call!
                // TODO: Depreciated!
                memberPhoto: {
                  method: 'GET',
                  params: {
                    first: 'team',
                    second: 'member',
                    fourth: 'photourl',
                    width: 40,
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
            {
              // Log.error(err)               
            }

            return deferred.promise;
          };

          return new TeamUp();
        }
      ]
    );
  }
);
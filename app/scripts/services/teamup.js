define(
  ['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory(
      'TeamUp',
      [
        '$resource', '$q', 'Settings',
        function ($resource, $q, Settings)
        {
          var TeamUp = function() {};

          TeamUp.prototype.get = function()
          {
            return $resource(
              Settings.getBackEnd() + config.app.namespace + ':first/:second/:third/:fourth',
              {},
              {
                /**
                 * Alarmnumbers
                 */
                alarmNumbersGet: {
                  method: 'GET',
                  params: {
                    first: 'alarmNumbers'
                  },
                  isArray: true
                },

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

                //version info
                versionInfo: {
                  method: "GET",
                  params: {
                    first: 'version'
                  }
                },

                /**
                 * Password
                 */
                password: {
                  method: 'GET',
                  params: {
                    first: 'passwordReset'
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
                    second: 'teamMessage',
                    third: ''
                  }
                },

                /**
                 * Team telephone settings
                 */
                TTSettingsGet: {
                  method: 'GET',
                  params: {
                    first: 'team',
                    third: 'teamTelephoneSettings'
                  }
                },
                TTSettingsSave: {
                  method: 'PUT',
                  params: {
                    first: 'team',
                    third: 'teamTelephoneSettings'
                  }
                },
                /**
                 * Get all the teamtelelephone settings
                 */
                TTOptionsGet : {
                  method: 'GET',
                  params: {
                    first: 'team',
                    third: 'teamTelephone'
                  }
                },
                /**
                 * post eamtelelephone settings
                 */
                TTOptionsActivate : {
                  method: 'POST',
                  params: {
                    first: 'team',
                    third: 'teamTelephone'
                  }
                },
                TTOptionsSave : {
                  method: 'PUT',
                  params: {
                    first: 'team',
                    third: 'teamTelephone'
                  }
                },

                //Put Scenario templates
                TTScenarioTemplateSave : {
                  method: 'PUT',
                  ignore: true,//ignore default response error, made a customized version
                  params: {
                    first: 'team',
                    third: 'teamTelephone',
                    fourth: 'scenario',
                    templateId: ''
                  }
                },

                //Get Scenario templates
                TTScenarioTemplateGet : {
                  method: 'GET',
                  params: {
                    first: 'teamTelephone',
                    second: 'templateIds'
                  },
                  isArray: true
                },

                TTscenarioGet : {
                  method: 'GET',
                  params: {
                    first: 'teamTelephone',
                    //optional second = teamId
                    third: 'scenarioInfo'
                    //optional scenarioId = scenarioId
                  }
                },

                /**
                 * Get free phonenumbers
                 */
                TTAdaptersGet : {
                  method: 'GET',
                  params: {
                    first: 'teamTelephone',
                    second: 'adapters',
                    adapterType: '',
                    excludeAdaptersWithDialog: ''
                  },
                  isArray: true
                },

                /**
                 * Post a Team phonenumber and it will return the room id for a videoconversation
                 */
                TTvideo : {
                  method: 'POST',
                  params: {
                    first: 'teamTelephone',
                    second: 'call',
                    phoneNumber: '',
                  },
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
                 * TeamTelephone call order per group
                 */
                callOrderGet: {
                  method: 'GET',
                  params: {
                    first: 'network',
                    third: 'orderedMembers', //Second: team uuid
                    isTeam: true //Tells server to look for teamAgent instead of groupAgent
                  }
                },

                callOrderSave: {
                  method: 'PUT',
                  params: {
                    first: 'network',
                    third: 'orderedMembers', //Second: team uuid
                    isTeam: true //Tells server to look for teamAgent instead of groupAgent
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
                clientGroupNameGet: {
                  method: 'GET',
                  params: {
                    first: 'client',
                    second: 'clientGroups',
                    third: ''
                  }
                },
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
                /**
                 * Get clientgroup by id
                 */
                clientGroupGet: {
                  method: 'GET',
                  params: {
                    first: 'clientGroup'
                  }
                },
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
                clientGet: {
                  method: 'GET',
                  params: {
                    first: 'client'
                  }
                },
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
                 * Client-Reports
                 */
                // get the reports of that particular client
                //clientReportsQuery: {
                //  method: 'GET',
                //  isArray: true,
                //  params: {
                //    first: 'clients',
                //    third: 'reports'
                //  }
                //},

                /**
                 * Client-Report
                 */
                // add a client report
                //clientReportAdd: {
                //  method: 'POST',
                //  params: {
                //    first: 'clients',
                //    third: 'reports'
                //  }
                //},
                // update a client report
                //clientReportUpdate: {
                //  method: 'PUT',
                //  params: {
                //    first: 'clients',
                //    third: 'reports'
                //  }
                //},
                // remove a client report
                //clientReportDelete: {
                //  method: 'DELETE',
                //  params: {
                //    first: 'clients',
                //    third: 'reports',
                //    reportId: ''
                //  }
                //},

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
                teamGet: {
                  method: 'GET',
                  params: {
                    first: 'team',
                    id: ''
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


                // Sync teamembers nedap
                teamSync: {
                  method: 'GET',
                  params: {
                    first: 'team',
                    third: 'sync'
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
                // get a member of a team
                teamMemberGet: {
                  method: 'GET',
                  params: {
                    first: 'team',
                    third: 'member'
                  }
                },

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
                allTeamMembers: {
                  method: 'GET',
                  isArray: true,
                  params: {
                    first: 'team',
                    second: 'members'
                  }
                },
                //search a member by first and/or lastname
                findMembers: {
                  method: 'GET',
                  headers:{'Content-Type':'application/x-www-form-urlencoded'},
                  params: {
                    first: 'teammembers'
                  }
                },

                /**
                 * Get the team-telephone number
                 */
                teamPhone: {
                  method: 'GET',
                  params: {
                    first: 'team',
                    third: 'phone'
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
                // get all the link between a team and a clientgroup
                clientGroupTeamQuery: {
                  method: 'GET',
                  isArray: true,
                  params: {
                    first: 'clientGroup',
                    third: 'teams'
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
          };

          TeamUp.prototype._ = function (proxy, params, data, callback)
          {
            // TODO: Turn on logging later on!
            // Log.record('call', arguments);

            // console.log('call ->', arguments);

            var deferred = $q.defer();

            params = params || {};

            try
            {
              var service = TeamUp.prototype.get();

              service[proxy](
                params,
                data,
                function (result)
                {
                  result = JSON.parse(angular.toJson(result));
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
              console.log('error', err);
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

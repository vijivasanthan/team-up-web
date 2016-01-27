define(
  ['../../controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'planboard', [
        '$rootScope',
        '$scope',
        '$location',
        '$filter',
        '$q',
        'Settings',
        'Dater',
        'Store',
        'Teams',
        'Clients',
        'TeamUp',
        'Session',
        'CurrentSelection',
        'moment',
        'data',
        function ($rootScope, $scope, $location, $filter, $q, Settings, Dater, Store,
                  Teams, Clients, TeamUp, Session, CurrentSelection, moment, data)
        {
          var params = $location.search();
          $scope.currentTeam = data.currentTeamId;
          $scope.currentClientGroup = null;
          $scope.relatedUsers = [];

          init();

          function init()
          {
            setInitialDefaults();
            setAllTeams();
            setAllClientGroups();
            setCurrentTeam(data.currentTeamId, data.currentTeamMembers);
          }

          function setRelatedUsers()
          {
            var deferred = $q.defer();

            console.error("$scope.section  ->", $scope.section );
            if ($scope.section === "teams")
            {
              //Get affected clients
              Teams.getRelationClientGroup($scope.currentTeam)
                   .then(function(relations)
                         {

                           console.error("relations ->", relations);
                           if(relations && relations.length >= 1)
                           {
                             return Clients.getSingle(relations[0].id);
                           }
                           else $rootScope.notifier.error($rootScope.ui.planboard.noAffectedClientGroup);
                         })
                   .then(function(clients)
                         {

                           var _clients = [];
                           console.error("clients ->", clients);
                           if(clients && clients.length)
                           {
                             $scope.relatedUserLabel = $rootScope.ui.teamup.clients;

                             _clients = setNameUsers(clients);
                           }
                           else $rootScope.notifier.error($rootScope.ui.planboard.noAffectedClientGroup);

                           console.error("_clients ->", _clients);

                           deferred.resolve(_clients);
                         });
            }
            else if ($scope.section === "clients")
            {
              //Get affected members
              Clients.getRelationsTeams($scope.currentClientGroup)
                     .then(function(relations)
                           {

                             console.error("relations ->", relations);
                             if(relations && relations.length >= 1)
                             {
                               return Teams.getSingle(relations[0].id);
                             }
                             else $rootScope.notifier.error($rootScope.ui.planboard.noAffectedTeam);
                           })
                     .then(function(members)
                           {

                             var _members = [];
                             console.error("members ->", members);
                             if(members && members.length)
                             {
                               $scope.relatedUserLabel = $rootScope.ui.planboard.members;

                               _members = setNameUsers(members);
                             }
                             else $rootScope.notifier.error($rootScope.ui.planboard.noAffectedTeam);

                             console.error("_members ->", _members);

                             deferred.resolve(_members);
                           });

            }

            return deferred.promise;

            function setNameUsers(users)
            {
              return _.map(users, function(user)
              {
                return {
                  uuid: user.uuid,
                  name: user.firstName + ' ' + user.lastName
                };
              })
            }
          }

          // Change a time-slot
          $scope.changeCurrent = function (current, periods)
          {
            CurrentSelection.local = current;
            $scope.currentTeam = CurrentSelection.getTeamId();
            $scope.currentClientGroup = current;

            loadData(periods);
          };

          $scope.setViewTo = function (uuid, hash)
          {
            $location.hash(hash);
            $scope.section = hash;
            $scope.load = true;
            $scope.list = $scope.data[$scope.section].list;

            //TODO Remove the multiple section checks
            //TODO planboard and timeline have the same $scope var, this is not only confusing but the two way binding don't works well anymore
            //if($scope.section === "clients")
            //{
            //  var clientGroupByParamUrl = _.findWhere($scope.list, {uuid: uuid});
            //
            //  (clientGroupByParamUrl)
            //    ? setCurrentClientGroup(clientGroupByParamUrl, function()
            //  {
            //    loadData();
            //  })
            //    : teamRelationClientGroup(function()
            //                              {
            //                                loadData();
            //                              })
            //}
            //else loadData();
            var clientGroupId = _.findWhere($scope.list, {uuid: $scope.currentClientGroup});
            $scope.currentClientGroup = clientGroupId || ($scope.list[0]).uuid;

            setRelatedUsers()
              .then(function(users)
                    {
                      $scope.relatedUsers = users;
                      console.error("$scope.relatedUsers ->", $scope.relatedUsers);

                      loadData();
                      setView(hash);
                    })
          };

	        /**
           * Set the current team data
           * @param teamId The id of the team
           * @param members The members of the current team
	         */
          function setCurrentTeam(teamId, members)
          {
            $scope.data.teams.members[teamId] = [];

            if (members && members.length > 0)
            {
              getMemberSlots(teamId, members);
            }
          }

	        /**
           * Set all teams data
           */
          function setAllTeams()
          {
            angular.forEach(
              data.teams,
              function (team)
              {
                $scope.data.teams.list.push(
                  {
                    uuid: team.uuid,
                    name: team.name
                  }
                );
              }
            );
          }

	        /**
           * Set all clientgroups data
           */
          function setAllClientGroups()
          {
            _.forEach(data.clientGroups, function(clientGroup)
            {
              $scope.data.clients.list.push(
                {
                  uuid: clientGroup.id,
                  name: clientGroup.name
                }
              );
            })
          }

	        /**
           * Set intial Scope data
           */
          function setInitialDefaults()
          {
            $scope.data = {
              teams: {
                list: [],
                members: {},
                tasks: []
              },
              clients: {
                list: [],
                members: {},
                tasks: []
              },
              user: [
                {
                  'count': 0,
                  'end': 1378681200,
                  'recursive': true,
                  'start': 1378504800,
                  'text': 'com.ask-cs.State.Available',
                  'type': 'availability',
                  'wish': 0
                },
                {
                  'count': 0,
                  'end': 1378850400,
                  'recursive': true,
                  'start': 1378720800,
                  'text': 'com.ask-cs.State.Available',
                  'type': 'availability',
                  'wish': 0
                }
              ],
              members: [],
              synced: Number(Date.today()),
              periods: {
                start: Number(Date.today()) - (7 * 24 * 60 * 60 * 1000),
                end: Number(Date.today()) + (7 * 24 * 60 * 60 * 1000)
              }
            };
          }

	        /**
           * Load data depending if the section clients or teams is on
           * @param periods
           */
          var loadData = function(periods)
          {
            var startTime = Number(Date.today()) - (7 * 24 * 60 * 60 * 1000),
              endTime = Number(Date.today()) + (7 * 24 * 60 * 60 * 1000);

            $scope.load = true;
            $scope.data.section = $scope.section;

            if ($scope.section == 'teams') loadMembers(startTime, endTime, prepareTasks);
            else if ($scope.section == 'clients') loadClients(startTime, endTime, prepareTasks);

	          /**
             * Prepare tasks
             * @param queryName
             * @param groupId
             * @param startTime
	           * @param endTime
	           */
            function prepareTasks(queryName, groupId, startTime, endTime)
            {
              getTasksByProvider(queryName, groupId, startTime, endTime)
                .then(showTasks);
            }

	          /**
             * Show tasks
             * @param tasks
             */
            function showTasks(tasks)
            {
              storeTask(tasks, startTime, endTime, periods);
              $rootScope.statusBar.off();
              $scope.load = false;
            }
          };

	        /**
           * Load Clients
           * @param startTime
           * @param endTime
           * @param callBack
	         */
          function loadClients(startTime, endTime, callBack)
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.loadClients);

            $scope.currentName = getGroupName($scope.currentClientGroup);
            $scope.data.clients.members = [];
            $scope.data[$scope.section].members[$scope.currentClientGroup] = [];

            Clients.getSingle($scope.currentClientGroup)
                   .then(function(clients)
                         {
                           $scope.hasClients = (!! clients.length);

                           getClientSlots($scope.currentClientGroup, clients);
                           $scope.data.members = $scope.data[$scope.section].members[$scope.currentClientGroup];
                           $location.search({uuid: $scope.currentClientGroup}).hash('clients');

                           (callBack && callBack('clientGroupTasksQuery', $scope.currentClientGroup, startTime, endTime));
                         })
          }

	        /**
           * Load members
           * @param startTime
           * @param endTime
           * @param callBack
	         */
          function loadMembers(startTime, endTime, callBack)
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.loadMembersByName);

            $scope.currentName = getGroupName($scope.currentTeam);
            $scope.data[$scope.section].members[$scope.currentTeam] = [];

            TeamUp._('teamStatusQuery', {third: $scope.currentTeam})
                  .then(function(members)
                        {
                          getMemberSlots($scope.currentTeam, members);
                          $scope.data.members = $scope.data[$scope.section].members[$scope.currentTeam];
                          $location.search({uuid: $scope.currentTeam}).hash('teams');

                          (callBack && callBack('teamTaskQuery', $scope.currentTeam, startTime, endTime))
                        })
          }

	        /**
           * Get tasks
           * @param section
           * @param currentGroup
           * @param startTime
           * @param endTime
	         */
          $scope.getTasks = function (section, currentGroup, startTime, endTime)
          {
            var taskProvider = (section == 'teams')
              ? 'teamTaskQuery'
              : 'clientGroupTasksQuery';

            getTasksByProvider(taskProvider,
              currentGroup,
              startTime,
              endTime)
              .then(function(tasks)
              {
                storeTask(tasks, startTime, endTime);
              });
          };

          function storeTask (tasks, startTime, endTime, periods)
          {
            // clear the array to keep tasks sync with sever side after changing
            $scope.data[$scope.section].tasks = [];

            _.each(
              tasks,
              function (task)
              {
                if (task != null)
                {
                  var memberId = '';

                  if ($scope.section == 'teams')
                  {
                    memberId = task.assignedTeamMemberUuid;
                  }

                  if ($scope.section == 'clients')
                  {
                    memberId = task.relatedClientUuid;
                  }

                  if (typeof $scope.data[$scope.section].tasks[memberId] == 'undefined')
                  {
                    $scope.data[$scope.section].tasks[memberId] = [];
                  }

                  $scope.data[$scope.section].tasks[memberId].push(task);
                }
              }
            );

            $rootScope.$broadcast(
              'timelinerTasks',
              periods || {start: startTime, end: endTime}
            );
          }

          function getTasksByProvider(query, sectionId, startTime, endTime)
          {
            return TeamUp._(
              query,
              {
                second: sectionId,
                from: startTime,
                to: endTime
              }
            );
          }

          function setView(hash)
          {
            $scope.views = {
              teams: false,
              clients: false,
              member: false,
              slot: {
                add: false,
                edit: false
              }
            };

            $scope.views[hash] = true;
          }



          function teamRelationClientGroup(callBack)
          {
              Teams.getRelationClientGroup($scope.currentTeam)
                   .then(function(relation)
                         {
                           //show the clientGroup which has a relation with the last selected team
                           var currentClientGroup = (relation && relation.length)
                             ? relation[0]
                             : ($scope.data["clients"].list)[0];//if no relation pick the first clientGroup

                           setCurrentClientGroup(currentClientGroup);
                           (callBack && callBack())
                         })
          }

          function setCurrentClientGroup(currentClientGroup, callBack)
          {
            $scope.currentClientGroup = currentClientGroup.id || currentClientGroup.uuid;
            (callBack && callBack());
          }

          function getGroupName(groupId)
          {
            var group = _.findWhere(
              $scope.data[$scope.section].list,
              {uuid: groupId}
            );
            return group && group.name;
          }

          $scope.resetViews = function ()
          {
            $scope.views.slot = {
              add: false,
              edit: false
            };
          };

          $rootScope.$on(
            'resetPlanboardViewsTasks',
            function ()
            {
              $scope.resetViews()
            }
          );

          /**
           * set default team and hash if there isn't any
           */
          $scope.setViewTo(
            params.uuid || $scope.data.teams.list[0].uuid,
            $location.hash() || 'teams'
          );

          $scope.self = this;

          $scope.current = {
            layouts: {
              user: true,
              group: false,
              members: false
            },
            day: moment().format('DDD'),
            week: moment().week(),
            month: Dater.current.month(),
            division: 'all'
          };

          Dater.registerPeriods();

          $scope.periods = Dater.getPeriods();
          $scope.periodsNext = Dater.getPeriods(true);

          $scope.slot = {};

          var indexStart = ((Dater.current.today() - 7) < 1 ) ? 1 : (Dater.current.today() - 7);

          $scope.timeline = {
            id: 'mainTimeline',
            main: true,
            user: {
              id: $rootScope.app.resources.uuid,
              role: $rootScope.app.resources.role
            },
            current: $scope.current,
            options: {
              start: $scope.periods.days[indexStart].last.day,
              end: $scope.periods.days[Dater.current.today() + 7].last.day,
              min: $scope.periods.days[indexStart].last.day,
              max: $scope.periods.days[Dater.current.today() + 7].last.day
            },
            range: {
              start: $scope.periods.days[indexStart].last.day,
              end: $scope.periods.days[Dater.current.today() + 7].last.day
            },
            scope: {
              day: false,
              week: true,
              month: false
            },
            // TODO: Remove unneeded config elements!
            config: {
              bar: config.app.timeline.config.bar,
              layouts: config.app.timeline.config.layouts,
              wishes: config.app.timeline.config.wishes,
              legenda: {},
              legendarer: config.app.timeline.config.legendarer,
              states: config.app.timeline.config.states,
              divisions: config.app.timeline.config.divisions,
              densities: config.app.timeline.config.densities
            }
          };

          if ($.browser.msie && $.browser.version == '8.0')
          {
            $scope.timeline.options = {
              start: $scope.periods.days[Dater.current.today() - 7].last.timeStamp,
              end: $scope.periods.days[Dater.current.today() + 7].last.timeStamp,
              min: $scope.periods.days[Dater.current.today() - 7].last.timeStamp,
              max: $scope.periods.days[Dater.current.today() + 7].last.timeStamp
            };
          }

          angular.forEach(
            config.app.timeline.config.states,
            function (state, index)
            {
              $scope.timeline.config.legenda[index] = true
            }
          );

          $scope.timeline.config.legenda.groups = {
            more: true,
            even: true,
            less: true
          };

          $scope.daterange = Dater.readable.date($scope.timeline.range.start) + ' / ' +
          Dater.readable.date($scope.timeline.range.end);

          // return the related user when select a time slot, etc, return client object
          // when select a time slot from Team view , return member object when select a time slot from client view.
          $scope.processRelatedUsers = function ()
          {
            var deferred = $q.defer();

            if ($scope.views.teams)
            {
              //Get affected clients
              Teams.getRelationClientGroup($scope.currentTeam)
                .then(function(relations)
                      {

                        console.error("relations ->", relations);
                        if(relations && relations.length >= 1)
                        {
                          return Clients.getSingle(relations[0].id);
                        }
                        else $rootScope.notifier.error($rootScope.ui.planboard.noAffectedClientGroup);
                      })
                  .then(function(clients)
                        {

                          var _clients = [];
                          console.error("clients ->", clients);
                          if(clients && clients.length)
                          {
                            $scope.relatedUserLabel = $rootScope.ui.teamup.clients;

                            _clients = setNameUsers(clients);
                          }
                          else $rootScope.notifier.error($rootScope.ui.planboard.noAffectedClientGroup);

                          console.error("_clients ->", _clients);

                          deferred.resolve(_clients);
                        });
            }
            else if ($scope.views.clients)
            {
              //Get affected members

            }

            return deferred.promise;

            function setNameUsers(users)
            {
              return _.map(users, function(user)
              {
                return {
                  uuid: user.uuid,
                  name: user.firstName + ' ' + user.lastName
                };
              })
            }
          };

          $scope.resetInlineForms = function ()
          {
            $scope.slot = {};
            $scope.original = {};

            $scope.resetViews();
          };

          $scope.refreshCurrentTimeline = function()
          {
            $scope.resetInlineForms();
            $rootScope.$broadcast('resetTaskTimeline');
          };

          /**
           * Create the members spots for sticking them to the timeline
           * @param teamId the current teamId of the members
           * @param members the members of the team
           */
          function getMemberSlots(teamId, members)
          {
            angular.forEach(
              members,
              function (member)
              {
                var avatarColorClass = $filter('stateColor')(member.states),
                  memberReachable = $filter('stateReachable')(member.states);

                var avatar = '<div class="task-planboard roundedPicSmall ' + avatarColorClass +
                  '" ' +
                  'style="float: left; background-image: url(' +
                  Settings.getBackEnd() +
                  config.app.namespace +
                  '/team/member/' +
                  member.uuid +
                  '/photo?width=' + 80 + '&height=' + 80 + '&sid=' +
                  Session.get() +
                  ');" memberId="' +
                  member.uuid +
                  '">';

                //Check if member is reachable
                if(memberReachable)
                {
                  avatar += '<span class="badge"><i class="glyphicon glyphicon-earphone"></i></span>';
                }

                avatar += '</div>';

                var name = avatar +
                  '<div style="float: left; margin: 15px 0 0 5px; font-size: 14px;">' +
                  member.firstName +
                  ' ' +
                  member.lastName +
                  '</div>';

                $scope.data.teams.members[teamId].push(
                  {
                    'head': name,
                    'memId': member.uuid
                  }
                );
              }
            );
          }

          /**
           * Get the slots of the clients of the current ClientGroup
           * @param clientGroupId
           * @param clients
           */
          function getClientSlots(clientGroupId, clients)
          {
            _.each(clients, function(_client)
            {
              var avatar = '<div class="task-planboard roundedPicSmall memberStateNone" ' +
                'style="float: left; background-image: url(' +
                Settings.getBackEnd() +
                config.app.namespace +
                '/client/' +
                _client.uuid +
                '/photo?width=' + 80 + '&height=' + 80 + '&sid=' +
                Session.get() +
                ');" memberId="' +
                _client.uuid +
                '"></div>';

              var name = avatar +
                '<div style="float: left; margin: 15px 0 0 5px; font-size: 14px;">' +
                _client.firstName +
                ' ' +
                _client.lastName
              '</div>';

              $scope.data.clients.members[clientGroupId].push(
                {
                  'head': name,
                  'memId': _client.uuid
                }
              );
            });
          }
        }
      ]
    );
  }
);

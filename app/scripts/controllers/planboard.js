define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'planboard', [
        '$rootScope',
        '$scope',
        '$location',
        '$filter',
        'Settings',
        'Dater',
        'Store',
        'Teams',
        'Clients',
        'TeamUp',
        'Session',
        'CurrentSelection',
        'moment',
        function ($rootScope, $scope, $location, $filter, Settings, Dater, Store,
                  Teams, Clients, TeamUp, Session, CurrentSelection, moment)
        {
          var params = $location.search();

          var teams = Store('app').get('teams'),
            clients = Store('app').get('ClientGroups');

          $scope.currentTeam = CurrentSelection.getTeamId();
          $scope.currentClientGroup = CurrentSelection.getClientGroupId();

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

          angular.forEach(
            teams,
            function (team)
            {
              var members = Store('app').get(team.uuid);

              $scope.data.teams.list.push(
                {
                  uuid: team.uuid,
                  name: team.name
                }
              );

              $scope.data.teams.members[team.uuid] = [];

              if (members && members.length > 0)
              {
                getMemberSpots(team.uuid, members);
              }
            }
          );

          angular.forEach(
            clients,
            function (client)
            {
              var members = Store('app').get(client.id);

              $scope.data.clients.list.push(
                {
                  uuid: client.id,
                  name: client.name
                }
              );

              $scope.data.clients.members[client.id] = [];

              if (members && members.length > 0)
              {
                angular.forEach(
                  members,
                  function (member)
                  {
                    var avatar = '<div class="task-planboard roundedPicSmall memberStateNone" ' +
                      'style="float: left; background-image: url(' +
                      Settings.getBackEnd() +
                      config.app.namespace +
                      '/client/' +
                      member.uuid +
                      '/photo?width=' + 80 + '&height=' + 80 + '&sid=' +
                      Session.get() +
                      ');" memberId="' +
                      member.uuid +
                      '"></div>';

                    var name = avatar +
                      '<div style="float: left; margin: 15px 0 0 5px; font-size: 14px;">' +
                      member.firstName +
                      ' ' +
                      member.lastName
                    '</div>';

                    $scope.data.clients.members[client.id].push(
                      {
                        'head': name,
                        'memId': member.uuid
                      }
                    );
                  }
                );
              }
            }
          );

          // switch agenda (timeline) between Team view or Client view
          function switchData()
          {
            switch ($scope.section)
            {
              case 'teams':
                $scope.list = $scope.data.teams.list;
                loadData()
                break;

              case 'clients':
                $scope.list = $scope.data.clients.list;
                loadData();
                break;
            }
          }

          // Change a time-slot
          $scope.changeCurrent = function (current, periods)
          {
            CurrentSelection.local = current;

            $scope.currentTeam = CurrentSelection.getTeamId();
            $scope.currentClientGroup = CurrentSelection.getClientGroupId();

            $scope.currentName = getGroupName();

            loadData(periods);
          };

          var loadData = function(periods)
          {
            var startTime = Number(Date.today()) - (7 * 24 * 60 * 60 * 1000),
              endTime = Number(Date.today()) + (7 * 24 * 60 * 60 * 1000);

            $scope.data.section = $scope.section;

            if ($scope.section == 'teams')
            {
              $rootScope.statusBar.display($rootScope.ui.teamup.loadMembersByName);
              $scope.load = true;

              $scope.data[$scope.section].members[$scope.currentTeam] = [];

              TeamUp._('teamStatusQuery', {third: $scope.currentTeam})
                .then(function(members) {
                  getMemberSpots($scope.currentTeam, members);
                  $scope.data.members = $scope.data[$scope.section].members[$scope.currentTeam];

                  return getTaskProvider('teamTaskQuery', $scope.currentTeam, startTime, endTime);
                })
                .then(function(tasks) {
                  $location.search({uuid: $scope.currentTeam}).hash('teams');
                  storeTask(tasks, startTime, endTime, periods);

                  $rootScope.statusBar.off();
                  $scope.load = false;
                });
            }
            else if ($scope.section == 'clients')
            {
              $rootScope.statusBar.display($rootScope.ui.teamup.loadClients);
              $scope.load = true;

              $scope.data.members = $scope.data[$scope.section].members[$scope.currentClientGroup];

              getTaskProvider('clientGroupTasksQuery', $scope.currentClientGroup, startTime, endTime)
                .then(function(tasks){
                  $location.search({uuid: $scope.currentClientGroup}).hash('clients');
                  storeTask(tasks, startTime, endTime, periods)

                  $rootScope.statusBar.off();
                  $scope.load = false;
                });
            }
          };

          function getTaskProvider(query, sectionId, startTime, endTime)
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

          var storeTask = function (tasks, startTime, endTime, periods)
          {
            // clear the array to keep tasks sync with sever side after changing
            $scope.data[$scope.section].tasks = [];

            angular.forEach(
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
              (periods) ? periods : {start: startTime, end: endTime}
            );
          };

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

          $scope.setViewTo = function (uuid, hash)
          {
            $scope.$watch(
              hash,
              function ()
              {
                $location.hash(hash);

                $scope.section = hash;

                $scope.currentName = getGroupName();

                switchData();

                setView(hash);
              }
            );
          };

          function getGroupName()
          {
            var current = ($scope.section == 'teams')
              ? $scope.currentTeam
              : $scope.currentClientGroup;

            var group = _.findWhere(
              $scope.data[$scope.section].list,
              {uuid: current}
            );

            return group.name;
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
          $scope.processRelatedUsers = function (selectedSlot)
          {
            var relatedUsers = [],
              memberId = angular.element(selectedSlot.group).attr('memberId');

            if ($scope.views.teams)
            {
              $scope.relatedUserLabel = $rootScope.ui.teamup.clients;

              var member = $rootScope.getTeamMemberById(memberId);

              if (typeof member.teamUuids != 'undefined' && member.teamUuids.length > 0)
              {
                relatedUsers = $rootScope.getClientsByTeam(member.teamUuids);
              }
            }
            else if ($scope.views.clients)
            {
              $scope.relatedUserLabel = $rootScope.ui.planboard.members;

              var client = $rootScope.getClientByID(memberId);

              if (typeof client.clientGroupUuid != 'undefined' && client.clientGroupUuid != '')
              {
                relatedUsers = $rootScope.getMembersByClient(client.clientGroupUuid);
              }
            }

            return relatedUsers;
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
          function getMemberSpots(teamId, members)
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
        }
      ]
    );
  }
);

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
        'Dater',
        'Store',
        'Teams',
        'Clients',
        'TeamUp',
        'Session',
        function ($rootScope, $scope, $location, Dater, Store, Teams, Clients, TeamUp, Session)
        {
          var params = $location.search();

          var teams = Store('app').get('teams'),
              clients = Store('app').get('ClientGroups');

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

              if (members && members.length > 0)
              {
                $scope.data.teams.list.push(
                  {
                    uuid: team.uuid,
                    name: team.name
                  }
                );

                $scope.data.teams.members[team.uuid] = [];

                angular.forEach(
                  members,
                  function (member)
                  {
                    var avatar = '<div class="roundedPicSmall memberStateNone" ' +
                                 'style="float: left; background-image: url(' +
                                 config.app.host +
                                 config.app.namespace +
                                 '/team/member/' +
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
                               member.lastName +
                               '</div>';

                    $scope.data.teams.members[team.uuid].push(
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

          angular.forEach(
            clients,
            function (client)
            {
              var members = Store('app').get(client.id);

              if (members && members.length > 0)
              {
                $scope.data.clients.list.push(
                  {
                    uuid: client.id,
                    name: client.name
                  }
                );

                $scope.data.clients.members[client.id] = [];

                angular.forEach(
                  members,
                  function (member)
                  {
                    var avatar = '<div class="roundedPicSmall memberStateNone" ' +
                                 'style="float: left; background-image: url(' +
                                 config.app.host +
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
                               member.lastName +
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
          function switchData ()
          {
            switch ($scope.section)
            {
              case 'teams':
                $scope.list = $scope.data.teams.list;

                if (typeof $scope.currentTeam == 'undefined')
                {
                  $scope.currentTeam = $scope.data.teams.list[0].uuid;
                }

                $scope.changeCurrent($scope.currentTeam);

                break;

              case 'clients':
                $scope.list = $scope.data.clients.list;

                if (typeof $scope.currentClientGroup == 'undefined')
                {
                  $scope.currentClientGroup = $scope.data.clients.list[0].uuid;
                }

                $scope.changeCurrent($scope.currentClientGroup);

                break;
            }

          }

          // TODO: not really sure what this function is used for
          var getTeamID = function ()
          {
            var found = false;

            var team = angular.forEach(
              Store('app').all(),
              function (value, key)
              {
                if (/teamGroup_/.test(key) && value.hasOwnProperty('0') && ! found)
                {
                  if (value[0].id == $scope.currentClientGroup)
                  {
                    found = true;

                    console.log('key ->', key, $scope.currentClientGroup);

                    return key;
                  }
                }
              }
            );

            return (found) ? team : false;
          };

          $scope.getTeamID = function () { getTeamID() };

          // Change a time-slot
          $scope.changeCurrent = function (current, periods)
          {
            angular.forEach(
              $scope.data[$scope.section].list,
              function (node)
              {
                if (node.uuid == current)
                {
                  $scope.currentName = node.name;
                }
              }
            );

            if ($scope.section == 'teams')
            {
              $scope.currentTeam = current;
              $scope.data.members = $scope.data[$scope.section].members[$scope.currentTeam];
            }
            else if ($scope.section == 'clients')
            {
              $scope.currentClientGroup = current;
              $scope.data.members = $scope.data[$scope.section].members[$scope.currentClientGroup];
            }

            $scope.data.section = $scope.section;

            // try to loading the slots from here
            // TODO: Find a better way of handling this!
            var startTime = Number(Date.today()) - (7 * 24 * 60 * 60 * 1000),
                endTime = Number(Date.today()) + (7 * 24 * 60 * 60 * 1000);

            var storeTask = function (tasks, startTime, endTime)
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
                'timeliner',
                (periods) ? periods : { start: startTime, end: endTime }
              );
            };

            if ($scope.data.section == 'teams')
            {
              $location.search({ uuid: $scope.currentTeam }).hash('teams');

              TeamUp._(
                'teamTaskQuery',
                {
                  second: $scope.currentTeam,
                  from: startTime,
                  to: endTime
                }
              ).then(
                function (tasks) { storeTask(tasks, startTime, endTime) }
              );
            }
            else if ($scope.data.section == 'clients')
            {
              $location.search({ uuid: $scope.currentClientGroup }).hash('clients');

              TeamUp._(
                'clientGroupTasksQuery',
                {
                  second: $scope.currentClientGroup,
                  from: startTime,
                  to: endTime
                }
              ).then(function (tasks) { storeTask(tasks, startTime, endTime) });
            }
          };

          function setView (hash)
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

                switchData();

                setView(hash);
              }
            );
          };

          $scope.resetViews = function ()
          {
            $scope.views.slot = {
              add: false,
              edit: false
            };
          };

          $rootScope.$on(
            'resetPlanboardViews',
            function () { $scope.resetViews() }
          );

          var uuid,
              view;

          if (! params.uuid && ! $location.hash())
          {
            uuid = $scope.data.teams.list[0].uuid;
            view = 'teams';

            $location.search({ uuid: $scope.data.teams.list[0].uuid }).hash(view);
          }
          else
          {
            uuid = params.uuid;
            view = $location.hash();
          }

          $scope.setViewTo(uuid, view);

          $scope.self = this;

          $scope.current = {
            layouts: {
              user: true,
              group: false,
              members: false
            },
            day: Dater.current.today() + 1,
            week: Dater.current.week(),
            month: Dater.current.month(),
            division: 'all'
          };

          Dater.registerPeriods();

          $scope.periods = Dater.getPeriods();

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
            function (state, index) { $scope.timeline.config.legenda[index] = true }
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

            if ($scope.section == 'teams')
            {
              $scope.changeCurrent($scope.currentTeam);
            }
            else if ($scope.section == 'clients')
            {
              $scope.changeCurrent($scope.currentClientGroup);
            }
          };
        }
      ]
    );
  }
);
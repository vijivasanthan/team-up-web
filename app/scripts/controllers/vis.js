define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'vis',
      [
        '$rootScope', '$scope', '$location', 'Store', 'Dater', 'TeamUp', 'Moment',
        function ($rootScope, $scope, $location, Store, Dater, TeamUp, Moment)
        {
          // $rootScope.fixStyles();

          function resetViews ()
          {
            $scope.views = {
              teams: false,
              clients: false
            };
          }

          var setView = function (hash)
          {
            resetViews();

            $scope.views[hash] = true;
          };

          $scope.setViewTo = function (hash)
          {
            $scope.$watch(
              hash,
              function ()
              {
                $location.hash(hash);

                setView(hash);
              }
            );
          };

          setView('teams');

          switchData();

          $scope.items = {
            team_1: [
              {id: 1, content: 'item 1', start: '2014-05-22', end: '2014-05-29'},
              {id: 2, content: 'item 2', start: '2014-05-20'}
            ],
            team_2: [
              {id: 3, content: 'item 3', start: '2014-05-18'},
              {id: 4, content: 'item 4', start: '2014-05-16', end: '2014-05-19'}
            ],
            team_3: [
              {id: 5, content: 'item 5', start: '2014-05-25'},
              {id: 6, content: 'item 6', start: '2014-05-27'}
            ]
          };


          var debug = false;


          $scope.simplifyItems = function (items)
          {
            var simplified = [];

            angular.forEach(
              items,
              function (group, label)
              {
                angular.forEach(
                  group,
                  function (item)
                  {
                    item.group = label;

                    simplified.push(item);
                  });
              }
            );

            return simplified;
          };

          /**
           * Timeline stuff
           */
          $scope.timeline = {

            select: function (selected)
            {
              if (debug)
              {
                console.log('selected items: ', selected.items);
              }

              var items = $scope.simplifyItems($scope.items);

              var format = 'YYYY-MM-DDTHH:mm';

              angular.forEach(
                items,
                function (item)
                {
                  if (item.id == selected.items[0])
                  {
                    $scope.slot = {
                      id: item.id,
                      start: Moment(item.start).format(format),
                      end: (item.end) ? Moment(item.end).format(format) : null,
                      content: item.content
                    };

                    $scope.$apply();
                  }
                }
              );
            },

            range: {},

            rangeChange: function (period)
            {
              this.range = $scope.timeline.getWindow();

              if (! $scope.$$phase)
              {
                $scope.$apply();
              }

              if (debug)
              {
                console.log(
                  'rangeChange: start-> ',
                  period.start, ' end-> ', period.end);
              }
            },

            rangeChanged: function (period)
            {
              if (debug)
              {
                console.log(
                  'rangeChange(d): start-> ',
                  period.start, ' end-> ', period.end);
              }
            },

            customTime: null,

            timeChange: function (period)
            {
              if (debug)
              {
                console.log('timeChange: ', period.time);
              }

              $scope.$apply(
                function ()
                {
                  $scope.timeline.customTime = period.time;
                }
              );
            },

            timeChanged: function (period)
            {
              if (debug)
              {
                console.log('timeChange(d): ', period.time);
              }
            },

            slot: {
              add: function (item, callback)
              {
                item.content = prompt('Enter text content for new item:', item.content);

                if (item.content != null)
                {
                  callback(item); // send back adjusted new item
                }
                else
                {
                  callback(null); // cancel item creation
                }
              },

              move: function (item, callback)
              {
                if (confirm(
                    'Do you really want to move the item to\n' +
                    'start: ' + item.start + '\n' +
                    'end: ' + item.end + '?'))
                {
                  callback(item); // send back item as confirmation (can be changed
                }
                else
                {
                  callback(null); // cancel editing item
                }
              },

              update: function (item, callback)
              {
                item.content = prompt('Edit items text:', item.content);

                if (item.content != null)
                {
                  callback(item); // send back adjusted item
                }
                else
                {
                  callback(null); // cancel updating the item
                }
              },

              remove: function (item, callback)
              {
                if (confirm('Remove item ' + item.content + '?'))
                {
                  callback(item); // confirm deletion
                }
                else
                {
                  callback(null); // cancel deletion
                }
              }
            }
          };

          $scope.getCustomTime = function ()
          {
            $scope.gotCustomDate = $scope.timeline.getCustomTime();
          };

          $scope.getSelection = function ()
          {
            $scope.gotSelection = $scope.timeline.getSelection();
          };

          $scope.setSelection = function (selection)
          {
            selection = (angular.isArray(selection)) ? selection : [].concat(selection);

            $scope.timeline.setSelection(selection);
          };

          $scope.getWindow = function ()
          {
            $scope.gotWindow = $scope.timeline.getWindow();
          };

          $scope.setWindow = function (start, end)
          {
            $scope.timeline.setScope('custom');

            $scope.timeline.setWindow(start, end);
          };

          $scope.setOptions = function (options)
          {
            $scope.timeline.setOptions(options);
          };


          var params = $location.search();

          // TODO: Remove these ones too!
          $scope.imgHost = config.app.host;
          $scope.ns = config.app.ns;

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
                    var imgURL = '';

                    var avatar = '<div class="roundedPicSmall memberStateNone" ' +
                                 'style="float: left; background-image: url(' +
                                 imgURL +
                                 ');" memberId="' +
                                 member.uuid +
                                 '"></div>';

                    var name = avatar +
                               '<div style="float: left; margin: 15px 0 0 5px; font-size: 14px;">' +
                               member.firstName +
                               ' ' +
                               member.lastName +
                               '</div>';

                    var obj = {
                      'head': name,
                      'memId': member.uuid
                    };

                    $scope.data.teams.members[team.uuid].push(obj);
                  });
              }
            });

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
                  });

                $scope.data.clients.members[client.id] = [];

                angular.forEach(
                  members,
                  function (member)
                  {
                    // TODO: Remove this one later on!
                    // var imgfile = Storage.avatar.geturl(member.uuid);
                    var imgfile = '';
                    var imgURL = $scope.imgHost + imgfile;

                    if (typeof imgfile == 'undefined')
                    {
                      imgURL = config.app.noImgURL;
                    }

                    var avatar = '<div class="roundedPicSmall memberStateNone" ' +
                                 'style="float: left; background-image: url(' +
                                 imgURL +
                                 ');" memberId="' +
                                 member.uuid +
                                 '"></div>';

                    var name = avatar +
                               '<div style="float: left; margin: 15px 0 0 5px; font-size: 14px;">' +
                               member.firstName +
                               ' ' +
                               member.lastName +
                               '</div>';

                    var obj = {
                      'head': name,
                      'memId': member.uuid
                    };

                    $scope.data.clients.members[client.id].push(obj);
                  });
              }
            });

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

          $scope.changeCurrent = function (current)
          {
            console.log('current ->', current);

            angular.forEach(
              $scope.data[$scope.section].list,
              function (node)
              {
                if (node.uuid == current)
                {
                  $scope.currentName = node.name;
                }
              });

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
            var startTime = Number(Date.today()) - (7 * 24 * 60 * 60 * 1000);
            var endTime = Number(Date.today()) + (7 * 24 * 60 * 60 * 1000);

            var storeTask = function (tasks, startTime, endTime)
            {
              // clear the array to keep tasks sync with sever side after changing
              $scope.data[$scope.section].tasks = [];

              angular.forEach(
                tasks, function (task, i)
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
                      $scope.data[$scope.section].tasks[memberId] = new Array();
                    }

                    $scope.data[$scope.section].tasks[memberId].push(task);
                  }
                });

              $rootScope.$broadcast(
                'timeliner', {
                  start: startTime,
                  end: endTime
                });
            };

            if ($scope.data.section == 'teams')
            {
              $location.search(
                {
                  uuid: $scope.currentTeam
                }).hash('teams');

              TeamUp._(
                'teamTaskQuery',
                {
                  second: $scope.currentTeam,
                  from: startTime,
                  to: endTime
                }
              ).then(
                function (tasks) { storeTask(tasks, startTime, endTime) },
                function (error)
                {
                  console.log('error happend when getting the tasks for the team members ' + error);
                }
              );
            }
            else if ($scope.data.section == 'clients')
            {
              $location.search(
                {
                  uuid: $scope.currentClientGroup
                }).hash('clients');

              TeamUp._(
                'clientGroupTasksQuery',
                {
                  second: $scope.currentClientGroup,
                  from: startTime,
                  to: endTime
                },
                null,
                {
                  error: function (error)
                  {
                    console.log('error happend when getting the tasks for the team members ' + error);
                  }
                }
              ).then(
                function (tasks) { storeTask(tasks, startTime, endTime) }
              );
            }
          };


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

          var index_start = ((Dater.current.today() - 7) < 1 ) ? 1 : (Dater.current.today() - 7);

          $scope.__timeline = {
            id: 'mainTimeline',
            main: true,
            user: {
              id: $rootScope.app.resources.uuid,
              role: $rootScope.app.resources.role
            },
            current: $scope.current,
            options: {
              start: $scope.periods.days[index_start].last.day,
              end: $scope.periods.days[Dater.current.today() + 7].last.day,
              min: $scope.periods.days[index_start].last.day,
              max: $scope.periods.days[Dater.current.today() + 7].last.day
            },
            range: {
              start: $scope.periods.days[index_start].last.day,
              end: $scope.periods.days[Dater.current.today() + 7].last.day
            },
            scope: {
              day: false,
              week: true,
              month: false
            },
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
            config.app.timeline.config.states, function (state, index)
            {
              $scope.timeline.config.legenda[index] = true;
            });

          $scope.__timeline.config.legenda.groups = {
            more: true,
            even: true,
            less: true
          };

          $scope.daterange = Dater.readable.date($scope.timeline.range.start) + ' / ' +
                             Dater.readable.date($scope.timeline.range.end);

          $scope.processRelatedUsers = function (selectedSlot)
          {
            var relatedUsers = [];
            var memberId = angular.element(selectedSlot.group).attr('memberId');

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
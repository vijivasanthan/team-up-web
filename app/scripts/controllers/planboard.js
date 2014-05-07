define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'planboard', [
        '$rootScope', '$scope', '$location', 'Dater', 'Storage', 'Teams', 'Clients', 'TeamUp',
        function ($rootScope, $scope, $location, Dater, Storage, Teams, Clients, TeamUp)
        {
          var params = $location.search();

          // TODO: Remove these ones too!
          $scope.imgHost = config.app.host;
          $scope.ns = config.app.ns;

          var teams = angular.fromJson(Storage.get('Teams')),
              clients = angular.fromJson(Storage.get('ClientGroups'));

          // console.log('Teams ->', teams);

          $scope.data = {
            teams:   {
              list:    [],
              members: {},
              tasks:   []
            },
            clients: {
              list:    [],
              members: {},
              tasks:   []
            },
            user:    [
              {
                "count":     0,
                "end":       1378681200,
                "recursive": true,
                "start":     1378504800,
                "text":      "com.ask-cs.State.Available",
                "type":      "availability",
                "wish":      0
              },
              {
                "count":     0,
                "end":       1378850400,
                "recursive": true,
                "start":     1378720800,
                "text":      "com.ask-cs.State.Available",
                "type":      "availability",
                "wish":      0
              }
            ],
            members: [],
            synced:  Number(Date.today()),
            periods: {
              start: Number(Date.today()) - (7 * 24 * 60 * 60 * 1000),
              end: Number(Date.today()) + (7 * 24 * 60 * 60 * 1000)
            }
          };

          angular.forEach(
            teams,
            function (team)
            {
              var members = angular.fromJson(Storage.get(team.uuid));

              console.log('members ->', members);

              if (members && members.length > 0)
              {
                console.log('team ->', team);

                $scope.data.teams.list.push(
                  {
                    uuid: team.uuid,
                    name: team.name
                  });

                $scope.data.teams.members[team.uuid] = [];

                angular.forEach(
                  members, function (member)
                  {
                    var imgfile = Storage.avatar.geturl(member.uuid);
                    var imgURL = $scope.imgHost + imgfile;

                    if (typeof imgfile == "undefined")
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

                    var obj = {"head": name, "memId": member.uuid};

                    $scope.data.teams.members[team.uuid].push(obj);
                  });
              }
            });

          angular.forEach(
            clients, function (client)
            {
              var members = angular.fromJson(Storage.get(client.id));

              if (members && members.length > 0)
              {
                $scope.data.clients.list.push(
                  {
                    uuid: client.id,
                    name: client.name
                  });

                $scope.data.clients.members[client.id] = [];

                angular.forEach(
                  members, function (member)
                  {
                    var imgfile = Storage.avatar.geturl(member.uuid);
                    var imgURL = $scope.imgHost + imgfile;

                    if (typeof imgfile == "undefined")
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
                      "head":  name,
                      "memId": member.uuid
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

                if (typeof $scope.currentTeam == "undefined")
                {
                  $scope.currentTeam = $scope.data.teams.list[0].uuid;
                }

                $scope.changeCurrent($scope.currentTeam);
                break;

              case 'clients':
                $scope.list = $scope.data.clients.list;

                if (typeof $scope.currentClientGroup == "undefined")
                {
                  $scope.currentClientGroup = $scope.data.clients.list[0].uuid;
                }

                $scope.changeCurrent($scope.currentClientGroup);
                break;
            }

          }

          $scope.changeCurrent = function (current)
          {
            angular.forEach(
              $scope.data[$scope.section].list, function (node)
              {
                if (node.uuid == current)
                {
                  $scope.currentName = node.name;
                }
              });

            if ($scope.section == "teams")
            {
              $scope.currentTeam = current;
              $scope.data.members = $scope.data[$scope.section].members[$scope.currentTeam];
            }
            else if ($scope.section == "clients")
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
                    var memberId = "";

                    if ($scope.section == "teams")
                    {
                      memberId = task.assignedTeamMemberUuid;
                    }

                    if ($scope.section == "clients")
                    {
                      memberId = task.relatedClientUuid;
                    }

                    if (typeof $scope.data[$scope.section].tasks[memberId] == "undefined")
                    {
                      $scope.data[$scope.section].tasks[memberId] = new Array();
                    }

                    $scope.data[$scope.section].tasks[memberId].push(task);
                  }
                });

              $rootScope.$broadcast(
                'timeliner', {
                  start: startTime,
                  end:   endTime
                });
            };

            if ($scope.data.section == "teams")
            {
              $location.search(
                {
                  uuid: $scope.currentTeam
                }).hash('teams');

              TeamUp._(
                'teamTaskQuery',
                {
                  second: $scope.currentTeam,
                  from:   startTime,
                  to:     endTime
                }
              ).then(
                function (tasks) { storeTask(tasks, startTime, endTime) },
                function (error)
                {
                  console.log("error happend when getting the tasks for the team members " + error);
                }
              );
            }
            else if ($scope.data.section == "clients")
            {
              $location.search(
                {
                  uuid: $scope.currentClientGroup
                }).hash('clients');

              TeamUp._(
                'clientGroupTasksQuery',
                {
                  second: $scope.currentClientGroup,
                  from:   startTime,
                  to:     endTime
                },
                null,
                {
                  error: function (error)
                  {
                    console.log("error happend when getting the tasks for the team members " + error);
                  }
                }
              ).then(
                function (tasks) { storeTask(tasks, startTime, endTime) }
              );
            }
          };

          function setView (hash)
          {
            $scope.views = {
              teams:   false,
              clients: false,
              member:  false,
              slot:    {
                add:  false,
                edit: false
              }
            };

            $scope.views[hash] = true;
          }

          $scope.setViewTo = function (uuid, hash)
          {
            $scope.$watch(
              hash, function ()
              {
                $location.hash(hash);

                $scope.section = hash;

                switchData();

                setView(hash);
              });
          };

          $scope.resetViews = function ()
          {
            $scope.views.slot = {
              add:  false,
              edit: false
            };
          };

          $rootScope.$on(
            'resetPlanboardViews', function () { $scope.resetViews() }
          );

          var uuid, view;

          if (! params.uuid && ! $location.hash())
          {
            uuid = $scope.data.teams.list[0].uuid;
            view = 'teams';

            $location.search(
              {
                uuid: $scope.data.teams.list[0].uuid
              }).hash('teams');
          }
          else
          {
            uuid = params.uuid;
            view = $location.hash();
          }

          $scope.setViewTo(uuid, view);

          $scope.self = this;

          $scope.current = {
            layouts:  {
              user:    true,
              group:   false,
              members: false
            },
            day: Dater.current.today() + 1,
            week:     Dater.current.week(),
            month:    Dater.current.month(),
            division: 'all'
          };

          Dater.registerPeriods();

          $scope.periods = Dater.getPeriods();

          $scope.slot = {};

          var index_start = ((Dater.current.today() - 7) < 1 ) ? 1 : (Dater.current.today() - 7);

          $scope.timeline = {
            id:      'mainTimeline',
            main:    true,
            user:    {
              id:   $rootScope.app.resources.uuid,
              role: $rootScope.app.resources.role
            },
            current: $scope.current,
            options: {
              start: $scope.periods.days[index_start].last.day,
              end:   $scope.periods.days[Dater.current.today() + 7].last.day,
              min:   $scope.periods.days[index_start].last.day,
              max:   $scope.periods.days[Dater.current.today() + 7].last.day
            },
            range:   {
              start: $scope.periods.days[index_start].last.day,
              end:   $scope.periods.days[Dater.current.today() + 7].last.day
            },
            scope:   {
              day:   false,
              week:  true,
              month: false
            },
            config:  {
              bar:        $rootScope.config.timeline.config.bar,
              layouts:    $rootScope.config.timeline.config.layouts,
              wishes:     $rootScope.config.timeline.config.wishes,
              legenda:    {},
              legendarer: $rootScope.config.timeline.config.legendarer,
              states:     $rootScope.config.timeline.config.states,
              divisions:  $rootScope.config.timeline.config.divisions,
              densities:  $rootScope.config.timeline.config.densities
            }
          };

          if ($.browser.msie && $.browser.version == '8.0')
          {
            $scope.timeline.options = {
              start: $scope.periods.days[Dater.current.today() - 7].last.timeStamp,
              end:   $scope.periods.days[Dater.current.today() + 7].last.timeStamp,
              min:   $scope.periods.days[Dater.current.today() - 7].last.timeStamp,
              max:   $scope.periods.days[Dater.current.today() + 7].last.timeStamp
            };
          }

          angular.forEach(
            $rootScope.config.timeline.config.states, function (state, index)
            {
              $scope.timeline.config.legenda[index] = true;
            });

          $scope.timeline.config.legenda.groups = {
            more: true,
            even: true,
            less: true
          };

          $scope.daterange = Dater.readable.date($scope.timeline.range.start) + ' / ' +
                             Dater.readable.date($scope.timeline.range.end);

          $scope.processRelatedUsers = function (selectedSlot)
          {
            var relatedUsers = [];
            var memberId = $(selectedSlot.group).attr("memberId");

            if ($scope.views.teams)
            {
              $scope.relatedUserLabel = $rootScope.ui.teamup.clients;

              var member = $rootScope.getTeamMemberById(memberId);

              if (typeof member.teamUuids != "undefined" && member.teamUuids.length > 0)
              {
                relatedUsers = $rootScope.getClientsByTeam(member.teamUuids);
              }
            }
            else if ($scope.views.clients)
            {
              $scope.relatedUserLabel = $rootScope.ui.planboard.members;

              var client = $rootScope.getClientByID(memberId);

              if (typeof client.clientGroupUuid != "undefined" && client.clientGroupUuid != "")
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

            if ($scope.section == "teams")
            {
              $scope.changeCurrent($scope.currentTeam);
            }
            else if ($scope.section == "clients")
            {
              $scope.changeCurrent($scope.currentClientGroup);
            }
          };
        }
      ]);
  }
);
define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'timeline', [
        '$rootScope',
        '$scope',
        '$q',
        '$location',
        '$timeout',
        '$route',
        '$window',
        'Dater',
        'TeamUp',
        'Store',
        'Teams',
        'moment',
        function ($rootScope, $scope, $q, $location, $timeout, $route, $window, Dater, TeamUp, Store, Teams, moment)
        {
          var range, diff;

          $scope.$watch(
            function ()
            {
              if ($scope.timeline && $scope.timeline.main)
              {
                range = $scope.self.timeline.getVisibleChartRange();

                diff = Dater.calculate.diff(range);

                if (diff <= 86400000)
                {
                  $scope.timeline.scope = {
                    day: true,
                    week: false,
                    month: false
                  };
                }
                else if (diff < 604800000)
                {
                  $scope.timeline.scope = {
                    day: false,
                    week: true,
                    month: false
                  };
                }
                else if (diff > 604800000)
                {
                  $scope.timeline.scope = {
                    day: false,
                    week: false,
                    month: true
                  };
                }

                $scope.timeline.range = {
                  start: new Date(range.start).toString(),
                  end: new Date(range.end).toString()
                };

                $scope.daterange = Dater.readable.date($scope.timeline.range.start) + ' / ' +
                Dater.readable.date($scope.timeline.range.end);

              }
              else if ($route.current.params.userId != $rootScope.app.resources.uuid)
              {
                if ($scope.self.timeline)
                {
                  range = $scope.self.timeline.getVisibleChartRange();

                  $scope.timeline.range = {
                    start: new Date(range.start).toString(),
                    end: new Date(range.end).toString()
                  };
                }
              }
            }
          );

          $rootScope.$on(
            'slotInitials',
            function ()
            {
              $scope.slot = {};

              $scope.slot = {
                start: {
                  date: new Date().toString(config.app.formats.date),
                  time: new Date().toString(config.app.formats.time),
                  datetime: new Date().toISOString()
                },
                end: {
                  date: new Date().toString(config.app.formats.date),
                  time: new Date().addHours(1).toString(config.app.formats.time),
                  datetime: new Date().toISOString()
                },
                state: 'com.ask-cs.State.Available',
                recursive: false,
                id: ''
              };
            }
          );

          $scope.timeliner = {
            init: function ()
            {
              $scope.self.timeline = new links.Timeline(document.getElementById($scope.timeline.id));

              links.events.addListener($scope.self.timeline, 'rangechanged', this.getRange);
              links.events.addListener($scope.self.timeline, 'add', this.onAdd);
              links.events.addListener($scope.self.timeline, 'delete', this.onRemove);
              links.events.addListener($scope.self.timeline, 'change', this.onChange);
              links.events.addListener($scope.self.timeline, 'select', this.onSelect);

              this.render($scope.timeline.options);
            },

            getRange: function ()
            {
              $scope.timelineGetRange()
            },

            onAdd: function ()
            {
              $scope.timelineOnAdd()
            },
            //todo remove after confirmation, (removes the row already before the confirmation ended)
            onRemove: function ()
            {
              $scope.timelineOnRemove()
            },

            onChange: function ()
            {
              $scope.timelineChanging()
            },

            onSelect: function ()
            {
              $scope.timelineOnSelect()
            },

            process: function (data)
            {
              var timelineData = [];

              var offset = Number(Date.now());

              angular.forEach(
                data.members,
                (function (member)
                {
                  var tasks = [];

                  if (data.section == 'teams')
                  {
                    if (data.teams.tasks[member.memId] != null)
                    {
                      tasks.push(data.teams.tasks[member.memId]);
                    }
                  }
                  else if (data.section == 'clients')
                  {
                    if (data.clients.tasks[member.memId] != null)
                    {
                      tasks.push(data.clients.tasks[member.memId]);
                    }
                  }

                  angular.forEach(
                    tasks,
                    function (memberTasks)
                    {
                      angular.forEach(
                        memberTasks,
                        function (task)
                        {
                          var relatedUser = '';

                          if (data.section == 'teams')
                          {
                            // should get the name from team members ;
                            relatedUser = $rootScope.getClientByID(task.relatedClientUuid);
                          }
                          else if (data.section == 'clients')
                          {
                            // should get the name from clients;
                            relatedUser = $rootScope.getTeamMemberById(task.assignedTeamMemberUuid);
                          }

                          var slotContent = '';

                          if (relatedUser != null)
                          {
                            slotContent = relatedUser.firstName + ' ' + relatedUser.lastName;
                          }

                          // deal with the unfinished task
                          if (task.plannedEndVisitTime == 0)
                          {
                            task.plannedEndVisitTime = offset;
                          }

                          // FIXME: Organise this one!
                          var content = '<span>' + slotContent + '</span>' +
                            "<input type=hidden value='" +
                            angular.toJson(
                              {
                                type: 'slot',
                                id: task.uuid,
                                mid: task.authorUuid,
                                description: task.description,
                                clientUuid: task.relatedClientUuid,
                                memberId: task.assignedTeamMemberUuid
                              }
                            ) +
                            "'>";

                          timelineData.push(
                            {
                              start: Math.round(task.plannedStartVisitTime),
                              end: Math.round(task.plannedEndVisitTime),
                              group: member.head,
                              content: content,
                              className: 'state-available',
                              editable: false
                            }
                          );
                        }
                      );
                    }
                  );

                  var addLoading = function (data, timedata, rows)
                  {
                    angular.forEach(
                      rows,
                      function (row)
                      {
                        timedata.push(
                          {
                            start: 1577836800000,//data.periods.end,
                            end: 1577836800000,
                            group: row,
                            content: 'loading',
                            className: 'state-loading-right',
                            editable: false
                          });

                        timedata.push(
                          {
                            start: 0,//data.periods.start,
                            end: 0,
                            group: row,
                            content: 'loading',
                            className: 'state-loading-left',
                            editable: false
                          });
                      });

                    return timedata;
                  };

                  timelineData = addLoading(data, timelineData, [member.head]);
                }).bind(this)
              );

              return timelineData;
            },

            render: function (options, remember)
            {
              var start,
                end;

              if ($scope.timeline.range)
              {
                if (typeof $scope.timeline.range.start != Date)
                {
                  $scope.timeline.range.start = new Date($scope.timeline.range.start);
                }

                if (typeof $scope.timeline.range.end != Date)
                {
                  $scope.timeline.range.end = new Date($scope.timeline.range.end);
                }

                start = $scope.timeline.range.start;
                end = $scope.timeline.range.end;
              }
              else
              {
                start = new Date(options.start);
                end = new Date(options.end);
              }

              $scope.timeline = {
                id: $scope.timeline.id,
                main: $scope.timeline.main,
                user: $scope.timeline.user,
                current: $scope.timeline.current,
                scope: $scope.timeline.scope,
                config: $scope.timeline.config,
                options: {
                  start: (remember) ? start : new Date(options.start),
                  end: (remember) ? end : new Date(options.end),
                  min: new Date(options.start),
                  max: new Date(options.end)
                }
              };

              if ($.browser.msie && $.browser.version == '8.0')
              {
                $scope.timeline.options.start = new Date(options.start);
                $scope.timeline.options.end = new Date(options.end);
              }

              angular.extend($scope.timeline.options, config.app.timeline.options);

              $scope.self.timeline.draw(
                this.process($scope.data),
                $scope.timeline.options
              );

              if (remember)
              {
                $scope.self.timeline.setVisibleChartRange(start, end);
              }
              else
              {
                $scope.self.timeline.setVisibleChartRange($scope.timeline.options.start, $scope.timeline.options.end);
              }
            },

            refresh: function ()
            {
              $scope.slot = {};

              if ($scope.timeline.main)
              {
                $rootScope.$broadcast('resetPlanboardViewsTasks');
              }
              else
              {
                $scope.forms = {
                  add: true,
                  edit: false
                };
              }

              var week = moment().week(),
                  start = $scope.timeline.range.start || $scope.periods.weeks[week].first.timeStamp,
                  end = $scope.timeline.range.end || $scope.periods.weeks[week].last.timeStamp;

              this.render(
                {
                  start: start,
                  end: end
                }, true
              );
            },

            redraw: function ()
            {
              $scope.self.timeline.redraw()
            },

            isAdded: function ()
            {
              return (angular.element('.timeline-event-selected .timeline-event-content').text() == 'Nieuw');
            },

            cancelAdd: function ()
            {
              $scope.self.timeline.cancelAdd()
            }
          };

          if ($scope.timeline)
          {
            $scope.timeliner.init()
          }

          $rootScope.$on(
            'timelinerTasks',
            function ()
            {
              $scope.timeliner.render(
                {
                  start: new Date(arguments[1].start).getTime(),
                  end: new Date(arguments[1].end).getTime()
                }
              );
            }
          );

          $scope.requestTimeline = function (section)
          {
            switch (section)
            {
              case 'group':
                $scope.timeline.current.layouts.group = !$scope.timeline.current.layouts.group;

                if ($scope.timeline.current.layouts.members && !$scope.timeline.current.layouts.group)
                {
                  $scope.timeline.current.layouts.members = false;
                }

                break;

              case 'members':
                $scope.timeline.current.layouts.members = !$scope.timeline.current.layouts.members;

                if ($scope.timeline.current.layouts.members && !$scope.timeline.current.layouts.group)
                {
                  $scope.timeline.current.layouts.group = true;
                }

                break;
            }

            $scope.timeliner.render(
              {
                start: $scope.data.periods.start,
                end: $scope.data.periods.end
              }
            );
          };

          $scope.timelineGetRange = function ()
          {
            var range = $scope.self.timeline.getVisibleChartRange();

            $scope.$apply(
              function ()
              {
                $scope.timeline.range = {
                  start: new Date(range.from).toString(),
                  end: new Date(range.till).toString()
                };

                if ($scope.timeline.main)
                {
                  $scope.daterange = {
                    start: Dater.readable.date(new Date(range.start).getTime()),
                    end: Dater.readable.date(new Date(range.end).getTime())
                  };
                }

              }
            );
          };

          $scope.selectedSlot = function ()
          {
            var selection;

            if ($scope.timeliner.isAdded() > 0)
            {
              // console.log('there is one newly added slot');
              // $scope.self.timeline.prototype.cancelAdd();
              // links.Timeline.prototype.cancelAdd();
              // $scope.self.timeline.applyAdd = false;
              // $scope.resetInlineForms();
            }

            if (selection = $scope.self.timeline.getSelection()[0])
            {
              var values = $scope.self.timeline.getItem(selection.row);

              var content = $scope.getSlotContentJSON(values.content);

              $scope.relatedUsers = $scope.processRelatedUsers(values);

              $scope.original = {
                start: values.start,
                end: values.end,
                content: content
              };

              if ($scope.timeline.main && values.content != 'Nieuw')
              {
                $rootScope.$broadcast('resetPlanboardViewsTasks');
              }
              else if (values.content != 'Nieuw')
              {
                $scope.forms = {
                  add: false,
                  edit: true
                };
              }

              if (values.content == 'Nieuw')
              {
                content = {type: 'slot'};
              }
              else if (content.clientUuid && typeof content.id == 'undefined')
              {
                content = $.extend(content, {type: 'slot'});
              }

              if (content.type)
              {
                if ($scope.timeline.main)
                {
                  switch (content.type)
                  {
                    case 'slot':
                      if (values.content == 'Nieuw' || (content.relatedUser && typeof content.id == 'undefined'))
                      {
                        $scope.views.slot.add = true;
                      }
                      else
                      {
                        $scope.views.slot.edit = true;
                      }
                      break;
                    case 'group':
                      $scope.views.group = true;
                      break;
                    case 'wish':
                      $scope.views.wish = true;
                      break;
                    case 'member':
                      $scope.views.member = true;
                      break;
                  }
                }

                var relatedUserId;

                if ($scope.views.teams)
                {
                  relatedUserId = content.clientUuid;
                }
                else if ($scope.views.clients)
                {
                  relatedUserId = content.memberId;
                }

                $scope.slot = {
                  start: {
                    date: new Date(values.start).toString(config.app.formats.date),
                    time: new Date(values.start).toString(config.app.formats.time),
                    datetime: new Date(values.start).toISOString()
                  },
                  end: {
                    date: new Date(values.end).toString(config.app.formats.date),
                    time: new Date(values.end).toString(config.app.formats.time),
                    datetime: new Date(values.end).toISOString()
                  },
                  state: content.state,
                  recursive: content.recursive,
                  id: content.id,
                  memberId: content.memberId,
                  mid: content.mid,
                  clientUuid: content.clientUuid,
                  relatedUser: relatedUserId,
                  description: content.description
                };

                if ($scope.timeline.main)
                {
                  switch (content.type)
                  {
                    case 'group':
                      $scope.slot.diff = content.diff;
                      $scope.slot.group = content.group;
                      break;

                    case 'wish':
                      $scope.slot.wish = content.wish;
                      $scope.slot.group = content.group;
                      $scope.slot.groupId = content.groupId;
                      break;

                    case 'member':
                      $scope.slot.member = content.mid;
                      break;
                  }
                }
              }

              return values;
            }
            else
            {
              $scope.resetViews();
            }
          };

          $scope.timelineOnSelect = function ()
          {
            $scope.$apply(
              function ()
              {
                $scope.selectedOriginal = $scope.selectedSlot();

                // make the slot movable (editable)
                if (typeof $scope.selectedOriginal != 'undefined')
                {
                  $scope.redrawSlot($scope.selectedOriginal);
                }
              }
            );
          };

          // remove the task item from the right list
          function deleteTask(tasks, uuid)
          {
            var i = 0;
            for (; i < tasks.length; i++)
            {
              if (uuid == tasks[i].uuid)
              {
                tasks.splice(i, 1);
                i--;
              }
            }
            return tasks;
          }

          // refresh myTasks and alltasks
          $scope.refreshTasks = function (taskId, action)
          {
            TeamUp._(
              'taskById',
              {second: taskId},
              null
            ).then(
              function (result)
              {
                var allTasks = Store('app').get('allTasks');
                var myTasks = Store('app').get('myTasks');

                if (action == 'add' || action == 'update')
                {
                  if (result.error)
                  {
                    $rootScope.notifier.error(result.error);
                  }
                  else
                  {
                    if (!allTasks.length)
                    {
                      allTasks = [];
                    }
                    if (action == 'update')
                    {
                      allTasks = deleteTask(allTasks, result.uuid);
                    }
                    allTasks.push(result);
                    if (result.assignedTeamMemberUuid == $rootScope.app.resources.uuid)
                    {
                      if (!myTasks.length)
                      {
                        myTasks = [];
                      }
                      if (action == 'update')
                      {
                        myTasks = deleteTask(myTasks, result.uuid);
                      }
                      myTasks.push(result);
                    }
                  }
                }
                else if (action == 'delete')
                {
                  allTasks = deleteTask(allTasks, result.uuid);
                  myTasks = deleteTask(myTasks, result.uuid);
                }

                Store('app').save('allTasks', allTasks);
                Store('app').save('myTasks', myTasks);
              });

          };

          /**
           * confirmation to delete tasks by range group or user
           * @param range start and enddate
           */
          $scope.confirmDeleteTasks = function (range, user)
          {
            if ($location.hash() == 'clients')
            {
              //TODO create options per client
              $scope.removeTaskOptions = {
                groupId: $scope.currentClientGroup,
                name: $scope.currentName,
                group: 'clientgroep',
                range: {}
              };
            }
            else if ($location.hash() == 'teams')
            {
              //TODO create options per member
              $scope.removeTaskOptions = {
                groupId: $scope.currentTeam,
                name: $scope.currentName,
                group: 'team',
                range: {}
              };
            }

            if(!_.isUndefined(user))
            {
              $scope.removeTaskOptions.userId = user.uuid;
            }

            //TODO als de range een dag is de datum is doe dan van 0:00 - 23:59
            if (!_.isUndefined(range))
            {
              $scope.removeTaskOptions.range.start = moment(range.start).format("DD MMM. YYYY");
              $scope.removeTaskOptions.range.end = moment(range.end).format("DD MMM. YYYY");
            }

            //TODO the above moment will be depricated, the createFromInputFallback might be a solution
            //moment.createFromInputFallback = function(config) {
            //  // your favorite unreliable string magic, or
            //  config._d = new Date(config._i);
            //};

            $timeout(
              function ()
              {
                angular.element('#confirmTasksDeleteModal').modal('show');
              }
            );
          };

          /**
           * Delete tasks by range depending what the group might be
           * @param options uuid, range start and end
           */
          $scope.deleteTasksByRange = function (options)
          {
            var allTasks = Store('app').get('allTasks'),
              myTasks = Store('app').get('myTasks');

            $rootScope.planboardSync.clear();

            angular.element('#confirmTasksDeleteModal').modal('hide');
            $rootScope.statusBar.display($rootScope.ui.task.taskDeleted);

            switch (options.group)
            {
              case "team":
                deleteTasksByTeamByRange(options, allTasks, myTasks);
                break;
              case "client":
                console.log('client');
                break;
              default:
                console.log("Voor het verwijderen van taken is geen team, clientgroep, client of member geselecteerd.");
            }
          };

          /**
           * Delete the tasks from a specific team by a date range
           * @param options team uuid and start and end date
           * @param allTasks allTasks localstorage
           * @param myTasks myTasks localstorage
           */
          function deleteTasksByTeamByRange(options, allTasks, myTasks)
          {
            var calls = [];

            Teams.getTasksRange(options)
              .then(function (tasks)
              {
                if(tasks.length == 0)
                {
                  $rootScope.notifier.error($rootScope.ui.planboard.noTasksFounded);
                  $rootScope.statusBar.off();
                }
                else if (tasks.error)
                {
                  $rootScope.notifier.error(result.error);
                }
                else
                {
                  angular.forEach(tasks, function (task)
                  {

                    allTasks = deleteTask(allTasks, task.uuid);
                    myTasks = deleteTask(myTasks, task.uuid);

                    calls.push(
                      TeamUp._
                      (
                        'taskDelete',
                        {second: task.uuid},
                        task
                      )
                    );
                  });

                  $q.all(calls)
                    .then(function (result)
                    {
                      if (result.error)
                      {
                        console.log('failed to remove task ', task);
                      }

                      $rootScope.notifier.success($rootScope.ui.planboard.tasksDeleted(options));
                      $rootScope.statusBar.off();
                      $scope.resetInlineForms();

                      $rootScope.planboardSync.start();
                    });
                  }
              });
          };

          $scope.timelineOnAdd = function (form, slot)
          {
            $rootScope.planboardSync.clear();

            var now = Date.now().getTime(),
                nowStamp = Math.abs(Math.floor(now / 1000)),
                values;

            if (!form)
            {
              values = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row);

              $scope.relatedUsers = $scope.processRelatedUsers(values);

              if ((new Date(values.start).getTime() >= now && new Date(values.end).getTime() > now))
              {
                if ($scope.timeliner.isAdded() > 1)
                {
                  $scope.self.timeline.cancelAdd();
                }

                $scope.$apply(
                  function ()
                  {
                    if ($scope.timeline.main)
                    {
                      $rootScope.$broadcast('resetPlanboardViewsTasks');

                      $scope.views.slot.add = true;
                    }
                    else
                    {
                      $scope.forms = {
                        add: true,
                        edit: false
                      };
                    }

                    $scope.slot = {
                      start: {
                        date: new Date(values.start).toString(config.app.formats.date),
                        time: new Date(values.start).toString(config.app.formats.time),
                        datetime: new Date(values.start).toISOString()
                      },
                      end: {
                        date: new Date(values.end).toString(config.app.formats.date),
                        time: new Date(values.end).toString(config.app.formats.time),
                        datetime: new Date(values.end).toISOString()
                      },
                      recursive: (values.group.match(/recursive/)) ? true : false,
                      state: 'com.ask-cs.State.Available'
                    };

                    $scope.original = {
                      start: new Date(values.start),
                      end: new Date(values.end),
                      content: {
                        recursive: $scope.slot.recursive,
                        state: $scope.slot.state
                      }
                    };

                  }
                );
              }
              else
              {
                $scope.self.timeline.cancelAdd();

                $rootScope.notifier.error($rootScope.ui.agenda.pastAdding);

                $rootScope.$apply();
              }
            }
            else
            {
              // var now = Date.now().getTime();
              values = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row);

              // console.log('values from row ->', values);

              // console.log('slot ->', slot);

              values = {
                startTime: ($rootScope.browser.mobile) ?
                  new Date(slot.start.datetime).getTime() :
                  Dater.convert.absolute(slot.start.date, slot.start.time, false),
                endTime: ($rootScope.browser.mobile) ?
                  new Date(slot.end.datetime).getTime() :
                  Dater.convert.absolute(slot.end.date, slot.end.time, false),
                description: (typeof slot.description == 'undefined') ? '' : slot.description,
                relatedUserId: slot.relatedUser
              };

              if(values.startTime < now && values.endTime < now)
              {
                $rootScope.notifier.error($rootScope.ui.agenda.pastAdding);

                $scope.timeliner.refresh();
              }
              else
              {
                if (typeof slot.relatedUser == 'undefined' || slot.relatedUser == '')
                {
                  if ($scope.views.teams)
                  {
                    $rootScope.notifier.error($rootScope.ui.teamup.selectMember);
                    return;
                  }
                  else if ($scope.views.clients)
                  {
                    $rootScope.notifier.error($rootScope.ui.teamup.selectClient);
                    return;
                  }

                  slot.relatedUser = null;
                }

                if(values.startTime > values.endTime ||
                  values.startTime == values.endTime)
                {
                  $rootScope.notifier.error($rootScope.ui.task.startLaterThanEnd);
                  return;
                }

                if (values.startTime < now)
                {
                  values.startTime = now;
                }

                var selected = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row),
                  memberId = angular.element(selected.group).attr('memberId');

                if (typeof memberId == 'undefined')
                {
                  $rootScope.notifier.error($rootScope.ui.teamup.selectSlot);

                  return;
                }

                $rootScope.statusBar.display($rootScope.ui.planboard.addTimeSlot);

                // convert the value to the new Task json object
                values = $.extend(values, {'memberId': memberId});
                values = $scope.convertTaskJsonObject(values);

                TeamUp._(
                  'taskAdd',
                  null,
                  values
                ).then(
                  function (result)
                  {
                    $rootScope.$broadcast('resetPlanboardViewsTasks');

                    if (result.error)
                    {
                      if (result.error.data)
                      {
                        $rootScope.notifier.error($rootScope.transError(result.error.data.result));
                      }
                      else
                      {
                        $rootScope.notifier.error($rootScope.transError(result.error));
                      }
                    }
                    else
                    {
                      $rootScope.notifier.success($rootScope.ui.planboard.slotAdded);
                    }

                    if ($scope.section == 'teams')
                    {
                      $scope.changeCurrent(
                        $scope.currentTeam, {
                          start: $scope.timeline.range.start,
                          end: $scope.timeline.range.end
                        });
                    }
                    else if ($scope.section == 'clients')
                    {
                      $scope.changeCurrent(
                        $scope.currentClientGroup, {
                          start: $scope.timeline.range.start,
                          end: $scope.timeline.range.end
                        });
                    }

                    // refresh my tasks or alltasks
                    $scope.refreshTasks(result.result, "add");

                    $rootScope.statusBar.off();

                    // $scope.timeliner.refresh();
                  }
                );
              }
            }
          };

          /**
           * convert the raw slot data to json that can be processed
           */
          $scope.convertTaskJsonObject = function (rawSlot)
          {
            // console.log('rawSlot ->', rawSlot);

            var teamMemberId,
              clientId,
              team;

            if ($scope.views.teams)
            {
              teamMemberId = rawSlot.memberId;
              clientId = rawSlot.relatedUserId;
              team = $scope.currentTeam;
            }
            else if ($scope.views.clients)
            {
              if (rawSlot.relatedUserId)
              {
                teamMemberId = rawSlot.relatedUserId;
                var member = $rootScope.getTeamMemberById(teamMemberId);
                team = member.teamUuids[0];
              }
              else
              {
                team = null;
              }

              clientId = rawSlot.memberId;
            }

            return {
              uuid: rawSlot.uuid,
              status: 2,
              plannedStartVisitTime: rawSlot.startTime,
              plannedEndVisitTime: rawSlot.endTime,
              relatedClientUuid: clientId,
              assignedTeamUuid: team,
              description: rawSlot.description,
              assignedTeamMemberUuid: teamMemberId
            };
          };

          // TODO: Investigate on when it is run and from where?
          $scope.redrawSlot = function ()
          {
            var start = Dater.convert.absolute($scope.slot.start.date, $scope.slot.start.time, false),
              end = Dater.convert.absolute($scope.slot.end.date, $scope.slot.end.time, false);

            var selectedSlot = $scope.self.timeline.getSelection()[0];

            if (typeof selectedSlot != 'undefined')
            {
              var slotContent = $scope.processSlotContent(selectedSlot.row);

              $scope.self.timeline.changeItem(
                selectedSlot.row,
                {
                  'content': slotContent,
                  'start': new Date(start),
                  'end': new Date(end)
                }
              );
            }
            else
            {
              alert($rootScope.ui.teamup.selectSlot);
            }
          };

          $scope.processSlotContent = function (row)
          {
            var item = $scope.self.timeline.getItem(row);

            var relatedUserName = '';

            angular.forEach(
              $scope.relatedUsers,
              function (user)
              {
                // client might not allowed to changed here
                if (user.uuid == $scope.slot.relatedUser)
                {
                  relatedUserName = user.name;
                }
              }
            );

            var itemContent = item.content;

            if (itemContent != 'Nieuw')
            {
              itemContent = $scope.getSlotContentJSON(item.content);
              itemContent.clientUuid = $scope.slot.clientUuid;
              itemContent.memberId = $scope.slot.memberId;
            }
            else
            {
              itemContent = {
                clientUuid: $scope.slot.clientUuid,
                memberId: $scope.slot.memberId
              };
            }

            var content = '<span>' + relatedUserName + '</span>' +
              '<input type="hidden" value="' + angular.toJson(itemContent) + '">';

            if ((typeof $scope.slot.clientUuid == 'undefined' && $scope.views.teams ) ||
              (typeof $scope.slot.memberId == 'undefined' && $scope.views.clients))
            {
              if (typeof $scope.slot.relatedUser == 'undefined' || $scope.slot.relatedUser == '')
              {
                content = 'Nieuw';
              }
            }

            return content;
          };

          $scope.timelineChanging = function ()
          {
            $rootScope.planboardSync.clear();

            var values = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row),
              content = $scope.getSlotContentJSON(values.content);

            if (content != undefined)
            {
              $scope.$apply(
                function ()
                {
                  $scope.slot = {
                    start: {
                      date: new Date(values.start).toString(config.app.formats.date),
                      time: new Date(values.start).toString(config.app.formats.time),
                      datetime: new Date(values.start).toISOString()
                    },
                    end: {
                      date: new Date(values.end).toString(config.app.formats.date),
                      time: new Date(values.end).toString(config.app.formats.time),
                      datetime: new Date(values.end).toISOString()
                    },
                    state: content.state,
                    id: content.id,
                    memberId: content.memberId,
                    mid: content.mid,
                    clientUuid: content.clientUuid,
                    relatedUser: $scope.slot.relatedUser,
                    description: content.description
                  };
                }
              );
            }
          };

          $scope.getRelatedUserId = function (name)
          {
            var result = '';

            angular.forEach(
              $scope.relatedUsers,
              function (user)
              {
                if (user.name == name)
                {
                  result = user.uuid;
                }
              }
            );

            return result;
          };

          $scope.timelineOnChange = function (direct, original, slot)
          {

            //add description
            $rootScope.planboardSync.clear();

            var options,
              selected = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row),
              content = $scope.getSlotContentJSON(selected.content),
              memberId = angular.element(selected.group).attr('memberId');

            if (!direct)
            {
              options = {
                startTime: selected.start,
                endTime: selected.end,
                description: slot.description,
                relatedUserId: slot.relatedUser,
                uuid: content.id,
                memberId: memberId
              };
            }
            else
            {
              options = {
                startTime: ($rootScope.browser.mobile) ?
                  new Date(slot.start.datetime).getTime() :
                  Dater.convert.absolute(slot.start.date, slot.start.time, false),
                endTime: ($rootScope.browser.mobile) ?
                  new Date(slot.end.datetime).getTime() :
                  Dater.convert.absolute(slot.end.date, slot.end.time, false),
                description: slot.description,
                relatedUserId: slot.relatedUser,
                uuid: content.id,
                memberId: memberId
              };
            }

            var now = Date.now().getTime(),
                values = $scope.convertTaskJsonObject(options);

            original.start = new Date(original.start).getTime();
            original.end = new Date(original.end).getTime();

            var notAllowedForPast = function ()
            {
              $rootScope.notifier.error($rootScope.ui.agenda.pastChanging);

              $scope.timeliner.refresh();
            };

            if (values.plannedStartVisitTime < now && values.plannedEndVisitTime < now
              || values.plannedStartVisitTime < now && values.plannedEndVisitTime > now)
            {
              notAllowedForPast();
              return;
            }

            if (values.plannedStartVisitTime > now && values.plannedEndVisitTime > now)
            {
              if (original.start < now && original.end < now)
              {
                notAllowedForPast();
                return;
              }
            }

            if(values.plannedStartVisitTime > values.plannedEndVisitTime ||
              values.plannedStartVisitTime == values.plannedEndVisitTime)
            {
              $rootScope.notifier.error($rootScope.ui.task.startLaterThanEnd);
              return;
            }

            TeamUp._(
              'taskUpdate',
              {second: values.uuid},
              values
            ).then(
              function (result)
              {
                $rootScope.$broadcast('resetPlanboardViewsTasks');

                if (result.error)
                {
                  $rootScope.notifier.error(result.error.data.result);
                  // console.warn('error ->', result);
                }
                else
                {
                  $rootScope.notifier.success($rootScope.ui.planboard.slotChanged);

                  if ($scope.section == 'teams')
                  {
                    $scope.changeCurrent(
                      $scope.currentTeam, {
                        start: $scope.timeline.range.start,
                        end: $scope.timeline.range.end
                      });
                  }
                  else if ($scope.section == 'clients')
                  {
                    $scope.changeCurrent(
                      $scope.currentClientGroup, {
                        start: $scope.timeline.range.start,
                        end: $scope.timeline.range.end
                      });
                  }
                }

                // refresh my tasks or alltasks
                $scope.refreshTasks(result.result, "update");

                // $scope.timeliner.refresh();
                //                $scope.timeliner.render(
                //                  {
                //                    start: $scope.timeline.options.start,
                //                    end: $scope.timeline.options.end
                //                  },
                //                  true
                //                );

                $rootScope.statusBar.off();
              }
            );
          };

          $scope.confirmDeleteTask = function ()
          {
            $timeout(
              function ()
              {
                angular.element('#confirmTaskModal').modal('show');
              }
            );
          };

          $scope.timelineOnRemove = function ()
          {
            $rootScope.planboardSync.clear();

            angular.element('#confirmTaskModal').modal('hide');

            if ($scope.timeliner.isAdded() > 0)
            {
              $scope.self.timeline.cancelAdd();

              $scope.$apply(
                function ()
                {
                  $scope.resetInlineForms();
                }
              );
            }
            else
            {
              var selected = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row),
                content = $scope.getSlotContentJSON(selected.content),
                memberId = angular.element(selected.group).attr('memberId');

              if (typeof content == 'undefined')
              {
                $scope.timeliner.refresh();
                return;
              }

              if (typeof content.id == 'undefined')
              {
                return;
              }

              $rootScope.statusBar.display($rootScope.ui.planboard.deletingTimeslot);

              TeamUp._(
                'taskDelete',
                {second: content.id}
              ).then(
                function (result)
                {
                  $rootScope.$broadcast('resetPlanboardViewsTasks');

                  if (result.error)
                  {
                    $rootScope.notifier.error(result.error.data.result);
                    // console.warn('error ->', result);
                  }
                  else
                  {
                    $rootScope.notifier.success($rootScope.ui.planboard.timeslotDeleted);

                    if ($scope.section == 'teams')
                    {
                      $scope.changeCurrent(
                        $scope.currentTeam, {
                          start: $scope.timeline.range.start,
                          end: $scope.timeline.range.end
                        });
                    }
                    else if ($scope.section == 'clients')
                    {
                      $scope.changeCurrent(
                        $scope.currentClientGroup, {
                          start: $scope.timeline.range.start,
                          end: $scope.timeline.range.end
                        });
                    }
                  }

                  // $scope.timeliner.refresh();
                  $scope.refreshTasks(content.id, "delete");

                  $rootScope.statusBar.off();
                  $rootScope.planboardSync.start();
                }
              );
            }
          };

          if ($scope.timeline && $scope.timeline.main)
          {
            setTimeout(
              function ()
              {
                $scope.self.timeline.redraw()
              }, 100
            );
          }

          $rootScope.planboardSync = {
            start: function ()
            {
              $window.planboardSync = $window.setInterval(
                function ()
                {
                  if ($location.path() == '/planboard')
                  {
                    $scope.slot = {};

                    $rootScope.$broadcast('resetPlanboardViewsTasks');

                    $scope.timeliner.render(
                      {
                        start: $scope.data.periods.start,
                        end: $scope.data.periods.end
                      }, true
                    );
                  }
                }, 60000
              );
            },

            clear: function ()
            {
              $window.clearInterval($window.planboardSync)
            }
          };

          $rootScope.planboardSync.start();

          $scope.getSlotContentJSON = function (content)
          {
            if (content != 'Nieuw')
            {
              return angular.fromJson(
                content.substring(content.indexOf('value=') + 7, content.length - 2)
              );
            }
          }

          $rootScope.$on('resetTaskTimeline', function ()
          {
            $scope.timeliner.render(
              {
                start: $scope.timeline.range.start,
                end: $scope.timeline.range.end
              }, true);
          });
        }
      ]
    );
  }
);

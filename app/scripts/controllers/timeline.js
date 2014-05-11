define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'timeline', [
        '$rootScope', '$scope', '$q', '$location', '$route', '$window', 'Dater', 'Sloter', 'TeamUp',
        function ($rootScope, $scope, $q, $location, $route, $window, Dater, Sloter, TeamUp)
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
                    day:   true,
                    week:  false,
                    month: false
                  };
                }
                else if (diff < 604800000)
                {
                  $scope.timeline.scope = {
                    day:   false,
                    week:  true,
                    month: false
                  };
                }
                else if (diff > 604800000)
                {
                  $scope.timeline.scope = {
                    day:   false,
                    week:  false,
                    month: true
                  };
                }

                $scope.timeline.range = {
                  start: new Date(range.start).toString(),
                  end:   new Date(range.end).toString()
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
                    end:   new Date(range.end).toString()
                  };
                }
              }
            }
          );

          $rootScope.$on(
            'slotInitials', function ()
            {
              $scope.slot = {};

              $scope.slot = {
                start:     {
                  date:     new Date().toString(config.app.formats.date),
                  time:     new Date().toString(config.app.formats.time),
                  datetime: new Date().toISOString()
                },
                end:       {
                  date:     new Date().toString(config.app.formats.date),
                  time:     new Date().addHours(1).toString(config.app.formats.time),
                  datetime: new Date().toISOString()
                },
                state:     'com.ask-cs.State.Available',
                recursive: false,
                id:        ''
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

            getRange: function () { $scope.timelineGetRange() },

            onAdd: function () { $scope.timelineOnAdd() },

            onRemove: function () { $scope.timelineOnRemove() },

            onChange: function () { $scope.timelineChanging() },

            onSelect: function () { $scope.timelineOnSelect() },

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
                id:      $scope.timeline.id,
                main:    $scope.timeline.main,
                user:    $scope.timeline.user,
                current: $scope.timeline.current,
                scope:   $scope.timeline.scope,
                config:  $scope.timeline.config,
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

              if ($scope.timeline.main)
              {
                // console.log('timeline data ->', $scope.data);

                $scope.self.timeline.draw(
                  Sloter.process(
                    $scope.data,
                    $scope.timeline.config,
                    $scope.divisions,
                    $scope.timeline.user.role,
                    $scope.timeline.current), $scope.timeline.options
                );
              }
              else
              {
                var timeout = ($location.hash() == 'timeline') ? 100 : 2000;

                $rootScope.timelineLoaded = false;

                setTimeout(
                  function ()
                  {
                    $rootScope.timelineLoaded = true;
                    $rootScope.$apply();

                    $scope.self.timeline.draw(
                      Sloter.profile($scope.data.slots.data, $scope.timeline.config),
                      $scope.timeline.options);
                  }, timeout
                );
              }

              $scope.self.timeline.setVisibleChartRange($scope.timeline.options.start, $scope.timeline.options.end);

            },

            load: function (stamps, remember)
            {
              var _this = this;

              _this.render(stamps, remember);
            },

            refresh: function ()
            {
              $scope.slot = {};

              if ($scope.timeline.main)
              {
                $rootScope.$broadcast('resetPlanboardViews');
              }
              else
              {
                $scope.forms = {
                  add:  true,
                  edit: false
                };
              }

              this.load(
                {
                  start: $scope.data.periods.start,
                  end:   $scope.data.periods.end
                }, true
              );
            },

            redraw: function () { $scope.self.timeline.redraw() },

            isAdded: function () { return $('.state-new').length },

            cancelAdd: function () { $scope.self.timeline.cancelAdd() }
          };

          if ($scope.timeline)
          {
            $scope.timeliner.init();
          }

          $rootScope.$on(
            'timeliner', function ()
            {
              $scope.timeliner.load(
                {
                  start: new Date(arguments[1].start).getTime(),
                  end:   new Date(arguments[1].end).getTime()
                }
              );
            }
          );

          $scope.requestTimeline = function (section)
          {
            switch (section)
            {
              case 'group':
                $scope.timeline.current.layouts.group = ! $scope.timeline.current.layouts.group;

                if ($scope.timeline.current.layouts.members && ! $scope.timeline.current.layouts.group)
                {
                  $scope.timeline.current.layouts.members = false;
                }

                break;

              case 'members':
                $scope.timeline.current.layouts.members = ! $scope.timeline.current.layouts.members;

                if ($scope.timeline.current.layouts.members && ! $scope.timeline.current.layouts.group)
                {
                  $scope.timeline.current.layouts.group = true;
                }

                break;
            }

            $scope.timeliner.load(
              {
                start: $scope.data.periods.start,
                end:   $scope.data.periods.end
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
                  end:   new Date(range.till).toString()
                };

                if ($scope.timeline.main)
                {
                  $scope.daterange = {
                    start: Dater.readable.date(new Date(range.start).getTime()),
                    end:   Dater.readable.date(new Date(range.end).getTime())
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
                start:   values.start,
                end:     values.end,
                content: content
              };

              if ($scope.timeline.main && values.content != "New")
              {
                $rootScope.$broadcast('resetPlanboardViews');
              }
              else if (values.content != "New")
              {
                $scope.forms = {
                  add:  false,
                  edit: true
                };
              }

              if (values.content == "New")
              {
                content = {type: "slot"};
              }
              else if (content.clientUuid && typeof content.id == "undefined")
              {
                content = $.extend(content, {type: "slot"});
              }

              if (content.type)
              {
                if ($scope.timeline.main)
                {
                  switch (content.type)
                  {
                    case 'slot':
                      if (values.content == "New" || (content.relatedUser && typeof content.id == "undefined"))
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
                  start:       {
                    date:     new Date(values.start).toString(config.app.formats.date),
                    time:     new Date(values.start).toString(config.app.formats.time),
                    datetime: new Date(values.start).toISOString()
                  },
                  end:         {
                    date:     new Date(values.end).toString(config.app.formats.date),
                    time:     new Date(values.end).toString(config.app.formats.time),
                    datetime: new Date(values.end).toISOString()
                  },
                  state:       content.state,
                  recursive:   content.recursive,
                  id:          content.id,
                  memberId:    content.memberId,
                  mid:         content.mid,
                  clientUuid:  content.clientUuid,
                  relatedUser: relatedUserId
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
              //			$scope.resetInlineForms();
              console.log("click the timeline , but not a slot");
            }
          };

          $scope.timelineOnSelect = function ()
          {
            $scope.$apply(
              function ()
              {
                $scope.selectedOriginal = $scope.selectedSlot();

                // make the slot movable (editable)
                if (typeof $scope.selectedOriginal != "undefined")
                {
                  $scope.redrawSlot($scope.selectedOriginal);
                }
              }
            );
          };

          $scope.destroy = {
            timeline:   function ()
            {
              // Not working !! :(
              // Sloter.pies($scope.data);
            },
            statistics: function ()
            {
              setTimeout(
                function ()
                {
                  $scope.timeliner.redraw();
                }, 10
              );
            }
          };

          $scope.timelineOnAdd = function (form, slot)
          {
            $rootScope.planboardSync.clear();

            var values;

            if (! form)
            {
              values = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row);

              $scope.relatedUsers = $scope.processRelatedUsers(values);

              if ($scope.timeliner.isAdded() > 1)
              {
                $scope.self.timeline.cancelAdd();
              }

              $scope.$apply(
                function ()
                {
                  if ($scope.timeline.main)
                  {
                    $rootScope.$broadcast('resetPlanboardViews');

                    $scope.views.slot.add = true;
                  }
                  else
                  {
                    $scope.forms = {
                      add:  true,
                      edit: false
                    };
                  }

                  $scope.slot = {
                    start: {
                      date:     new Date(values.start).toString(config.app.formats.date),
                      time:     new Date(values.start).toString(config.app.formats.time),
                      datetime: new Date(values.start).toISOString()
                    },
                    end:   {
                      date:     new Date(values.end).toString(config.app.formats.date),
                      time:     new Date(values.end).toString(config.app.formats.time),
                      datetime: new Date(values.end).toISOString()
                    },
                    recursive: (values.group.match(/recursive/)) ? true : false,
                    state: 'com.ask-cs.State.Available'
                  };
                }
              );
            }
            else
            {
              // var now = Date.now().getTime();

              values = {
                startTime: ($rootScope.browser.mobile) ?
                           new Date(slot.start.datetime).getTime() :
                           Dater.convert.absolute(slot.start.date, slot.start.time, false),
                endTime: ($rootScope.browser.mobile) ?
                         new Date(slot.end.datetime).getTime() :
                         Dater.convert.absolute(slot.end.date, slot.end.time, false),
                description: (typeof slot.state == "undefined") ? "" : slot.state,
                relatedUserId: slot.relatedUser
              };

              if (typeof slot.relatedUser == "undefined" || slot.relatedUser == "")
              {
                if ($scope.views.teams)
                {
                  $rootScope.notifier.error($rootScope.ui.teamup.selectClient);
                }
                else if ($scope.views.clients)
                {
                  $rootScope.notifier.error($rootScope.ui.teamup.selectMember);
                }

                return;
              }

              var selected = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row);
              var memberId = $(selected.group).attr("memberId");

              if (typeof memberId == "undefined")
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
                values
              ).then(
                function (result)
                {
                  $rootScope.$broadcast('resetPlanboardViews');

                  if (result.error)
                  {
                    $rootScope.notifier.error(result.error.data.result);
                    console.warn('error ->', result.error.data.result);
                  }
                  else
                  {
                    $rootScope.notifier.success($rootScope.ui.planboard.slotAdded);
                    if ($scope.section == "teams")
                    {
                      $scope.changeCurrent($scope.currentTeam);
                    }
                    else if ($scope.section == "clients")
                    {
                      $scope.changeCurrent($scope.currentClientGroup);
                    }
                    $rootScope.statusBar.off();
                  }

                  $scope.timeliner.refresh();
                }
              );

            }
          };

          /**
           * convert the raw slot data to json that can be processed
           */
          $scope.convertTaskJsonObject = function (rawSlot)
          {
            var teamMemberId, clientId, team;

            if ($scope.views.teams)
            {
              teamMemberId = rawSlot.memberId;
              clientId = rawSlot.relatedUserId;
              team = $scope.currentTeam;
            }
            else if ($scope.views.clients)
            {
              teamMemberId = rawSlot.relatedUserId;
              clientId = rawSlot.memberId;

              var member = $rootScope.getTeamMemberById(teamMemberId);

              team = member.teamUuids[0];
            }

            return {
              uuid:                   rawSlot.uuid,
              status:                 1,
              plannedStartVisitTime:  rawSlot.startTime,
              plannedEndVisitTime:    rawSlot.endTime,
              relatedClientUuid:      clientId,
              assignedTeamUuid:       team,
              description:            rawSlot.description,
              assignedTeamMemberUuid: teamMemberId
            };
          };

          $scope.redrawSlot = function ()
          {
            var start = Dater.convert.absolute($scope.slot.start.date, $scope.slot.start.time, false);
            var end = Dater.convert.absolute($scope.slot.end.date, $scope.slot.end.time, false);

            var selectedSlot = $scope.self.timeline.getSelection()[0];

            if (typeof selectedSlot != "undefined")
            {
              var slotContent = $scope.processSlotContent(selectedSlot.row);

              $scope.self.timeline.changeItem(
                selectedSlot.row, {
                  'content': slotContent,
                  'start':   new Date(start),
                  'end':     new Date(end)
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

            var relateUserName = "";

            angular.forEach(
              $scope.relatedUsers, function (ru)
              {
                // client might not allowed to changed here
                if (ru.uuid == $scope.slot.relatedUser)
                {
                  relateUserName = ru.name;
                }
              }
            );

            var content_obj = item.content;

            if (content_obj != "New")
            {
              content_obj = $scope.getSlotContentJSON(item.content);
              content_obj.clientUuid = $scope.slot.clientUuid;
              content_obj.memberId = $scope.slot.memberId;
            }
            else
            {
              content_obj = {
                clientUuid: $scope.slot.clientUuid,
                memberId:   $scope.slot.memberId
              };
            }

            var content = "<span>" + relateUserName + "</span>" +
                          "<input type=hidden value='" + angular.toJson(content_obj) + "'>";

            if ((typeof $scope.slot.clientUuid == 'undefined' && $scope.views.teams ) ||
                (typeof $scope.slot.memberId == 'undefined' && $scope.views.clients))
            {
              if (typeof $scope.slot.relatedUser == "undefined" || $scope.slot.relatedUser == "")
              {
                content = "New";
              }
            }

            return content;
          };

          $scope.timelineChanging = function ()
          {
            $rootScope.planboardSync.clear();

            var values = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row);

            /*
             var options = {
             start:   values.start,
             end:     values.end,
             // content:  angular.fromJson(values.content.match(/<span class="secret">(.*)<\/span>/)[1])
             content: values.content
             };
             */

            var content_obj = $scope.getSlotContentJSON(values.content);

            $scope.$apply(
              function ()
              {
                $scope.slot = {
                  start:       {
                    date:     new Date(values.start).toString(config.app.formats.date),
                    time:     new Date(values.start).toString(config.app.formats.time),
                    datetime: new Date(values.start).toISOString()
                  },
                  end:         {
                    date:     new Date(values.end).toString(config.app.formats.date),
                    time:     new Date(values.end).toString(config.app.formats.time),
                    datetime: new Date(values.end).toISOString()
                  },
                  state:       content_obj.state,
                  id:          content_obj.id,
                  memberId:    content_obj.memberId,
                  mid:         content_obj.mid,
                  clientUuid:  content_obj.clientUuid,
                  relatedUser: $scope.slot.relatedUser
                };
              }
            );
          };

          $scope.getRelatedUserId = function (name)
          {
            var ret = "";

            angular.forEach(
              $scope.relatedUsers, function (user)
              {
                if (user.name == name)
                {
                  ret = user.uuid;
                }
              }
            );

            return ret;
          };

          $scope.timelineOnChange = function (direct, original, slot)
          {
            $rootScope.planboardSync.clear();

            var selected = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row);
            var content = $scope.getSlotContentJSON(selected.content);

            var memberId = $(selected.group).attr("memberId");

            var options;

            if (! direct)
            {
              options = {
                startTime:     selected.start,
                endTime:       selected.end,
                description:   "",
                relatedUserId: slot.relatedUser,
                uuid:          content.id,
                memberId:      memberId
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
                description:   "",
                relatedUserId: slot.relatedUser,
                uuid:          content.id,
                memberId:      memberId
              };
            }

            var values = $scope.convertTaskJsonObject(options);

            TeamUp._(
              'taskUpdate',
              {
                taskId: values.uuid
              }
            ).then(
              function (result)
              {
                $rootScope.$broadcast('resetPlanboardViews');

                if (result.error)
                {
                  $rootScope.notifier.error(result.error.data.result);
                  console.warn('error ->', result);
                }
                else
                {
                  $rootScope.notifier.success($rootScope.ui.planboard.slotChanged);
                  if ($scope.section == "teams")
                  {
                    $scope.changeCurrent($scope.currentTeam);
                  }
                  else if ($scope.section == "clients")
                  {
                    $scope.changeCurrent($scope.currentClientGroup);
                  }
                }

                $scope.timeliner.refresh();
                $rootScope.statusBar.off();
              }
            );
          };

          $scope.timelineOnRemove = function ()
          {
            $rootScope.planboardSync.clear();

            if ($scope.timeliner.isAdded() > 0)
            {
              $scope.self.timeline.cancelAdd();

              $scope.$apply(
                function () { $scope.resetInlineForms() }
              );
            }
            else
            {
              var selected = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row);
              var content = $scope.getSlotContentJSON(selected.content);
              var memberId = $(selected.group).attr("memberId");

              if (typeof content == "undefined")
              {
                $scope.timeliner.refresh();
                return;
              }

              if (typeof content.id == "undefined")
              {
                console.log("Nothing to delete");
                return;
              }

              $rootScope.statusBar.display($rootScope.ui.planboard.deletingTimeslot);

              TeamUp._(
                'taskDelete',
                {
                  taskId: content.id
                }
              ).then(
                function (result)
                {
                  $rootScope.$broadcast('resetPlanboardViews');

                  if (result.error)
                  {
                    $rootScope.notifier.error(result.error.data.result);
                    console.warn('error ->', result);
                  }
                  else
                  {
                    $rootScope.notifier.success($rootScope.ui.planboard.timeslotDeleted);

                    if ($scope.section == "teams")
                    {
                      $scope.changeCurrent($scope.currentTeam);
                    }
                    else if ($scope.section == "clients")
                    {
                      $scope.changeCurrent($scope.currentClientGroup);
                    }
                  }

                  $scope.timeliner.refresh();

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
                $scope.self.timeline.redraw();
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

                    $rootScope.$broadcast('resetPlanboardViews');

                    $scope.timeliner.load(
                      {
                        start: $scope.data.periods.start,
                        end:   $scope.data.periods.end
                      }, true
                    );
                  }
                }, 60000
              );
            },

            clear: function () { $window.clearInterval($window.planboardSync) }
          };

          $rootScope.planboardSync.start();

          $scope.getSlotContentJSON = function (content)
          {
            var jsonStr = content.substring(content.indexOf("value=") + 7, content.length - 2);

            return angular.fromJson(jsonStr);
          }
        }
      ]
    );
  }
);
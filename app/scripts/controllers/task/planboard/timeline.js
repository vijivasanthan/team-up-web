define(
  ['../../controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'timeline',
        function ($rootScope, $scope, $q, $location, $timeout,
                  $route, $window, Dater, TeamUp, Store, Teams, moment, vis)
        {
          var range, diff, newSlot = [];

          var visDataSet = new vis.DataSet();
          var visGroupsDataSet = new vis.DataSet();

          $scope.$watch(
            function ()
            {
              if ($scope.timeline && $scope.timeline.main)
              {
                range = $scope.self.timeline.getWindow();

                var period = {
                  hour: 1000 * 60 * 60,
                  day: 1000 * 60 * 60 * 24,
                  week: 1000 * 60 * 60 * 24 * 7
                };

                diff = Dater.calculate.diff(range) - period.hour;

                /**
                 * Scope is a day
                 */
                if (diff <= period.day)
                {
                  $scope.timeline.scope = {
                    day: true,
                    week: false,
                    month: false
                  };
                }
                /**
                 * Scope is less than a week
                 */
                else if (diff <= period.week)
                {
                  $scope.timeline.scope = {
                    day: false,
                    week: true,
                    month: false
                  };
                }
                /**
                 * Scope is more than a week
                 */
                else
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
                  range = $scope.self.timeline.getWindow();

                  $scope.timeline.range = {
                    start: new Date(range.start).toString(),
                    end: new Date(range.end).toString()
                  };
                }
              }

              if ($scope.timeline)
              {
                // moment returns epoch offset(milliseconds) when 'cast' to number
                var _diff = moment().add(1, 'years').endOf('year').add(1, 'ms') - moment(new Date(range.end));
                // used new Date above because range.end was made by browser's Date,
                // which is not always consistent across browsers

                if (_diff <= 0)
                {
                  $('#timelineAfterBtn').attr('disabled', 'disabled');
                }
                else if (
                  $scope.timeline.current.year == Dater.current.year()
                  &&
                  (($scope.timeline.scope.month && $scope.timeline.current.month === 1) ||
                  (($scope.timeline.scope.week && $scope.timeline.current.week === 1 && $scope.timeline.current.month != 12)) ||
                  ($scope.timeline.scope.day && $scope.timeline.current.day === 1))
                )
                {
                  $('#timelineBeforeBtn').attr('disabled', 'disabled');
                }
                else
                {
                  var timelineBeforeBtn = $('#timelineBeforeBtn'),
                      timelineAfterBtn = $('#timelineAfterBtn'),
                      timelineBeforeBtnAttr = timelineBeforeBtn.attr('disabled'),
                      timelineAfterBtnAttr = timelineAfterBtn.attr('disabled');

                  if (typeof timelineBeforeBtnAttr !== 'undefined' && timelineBeforeBtnAttr !== false)
                  {
                    timelineBeforeBtn.removeAttr('disabled');
                  }

                  if (typeof timelineAfterBtnAttr !== 'undefined' && timelineAfterBtnAttr !== false)
                  {
                    timelineAfterBtn.removeAttr('disabled');
                  }
                }
              }
            }
          );

          var groupSort = function (a, b)
          {
            if ((a.id === $rootScope.ui.planboard.myPlanning) || a.id.match($rootScope.ui.planboard.planning))
            {
              return -1;
            }
            if ((b.id === $rootScope.ui.planboard.myPlanning) || b.id.match($rootScope.ui.planboard.planning))
            {
              return 1;
            }
            if ((a.id === $rootScope.ui.planboard.myWeeklyPlanning) || a.id.match($rootScope.ui.planboard.weeklyPlanning))
            {
              return -1;
            }
            if ((b.id === $rootScope.ui.planboard.myWeeklyPlanning) || b.id.match($rootScope.ui.planboard.weeklyPlanning))
            {
              return 1;
            }

            // sort alphabetically
            // the reason the combined slot is still above the others:
            //  combined slot url starts with 'groups', others start with 'profile'
            // also sorts only on uuid, as it shows up before the name
            if (a.id > b.id)
            {
              return 1;
            }
            if (a.id < b.id)
            {
              return -1;
            }

            return 0;
          };

          /* Check if startdate is before the enddate
           * @param slot The current selected slot
           * @returns {boolean} startdate is before the enddate returns true
           */
          function slotDatesValid(slot)
          {
            var dates = getUnixTimeStamps(slot);
            return (dates.end > dates.start);
          }

          function convertDateTimeToLocal(d)
          {
            //var d1 = new Date(d);
            //d1.setMinutes(d1.getMinutes() - d1.getTimezoneOffset());
            ////return d1.toISOString().replace("Z", "");
            return moment(d).toDate();
          }

          // adapted from VisJS
          var timelineSnap = function (date, scale, step)
          {
            var clone = new Date(date.valueOf());

            if (scale == 'year')
            {
              var year = clone.getFullYear() + Math.round(clone.getMonth() / 12);
              clone.setFullYear(Math.round(year / step) * step);
              clone.setMonth(0);
              clone.setDate(0);
              clone.setHours(0);
              clone.setMinutes(0);
              clone.setSeconds(0);
              clone.setMilliseconds(0);
            }
            else if (scale == 'month')
            {
              if (clone.getDate() > 15)
              {
                clone.setDate(1);
                clone.setMonth(clone.getMonth() + 1);
                // important: first set Date to 1, after that change the month.
              }
              else
              {
                clone.setDate(1);
              }

              clone.setHours(0);
              clone.setMinutes(0);
              clone.setSeconds(0);
              clone.setMilliseconds(0);
            }
            else if (scale == 'day')
            {
              switch (step)
              {
                case 5:
                case 2:
                  clone.setHours(Math.round(clone.getHours() / 12) * 12);
                  break;
                default:
                  clone.setHours(Math.round(clone.getHours() / 4) * 4);
                  break;
              }
              clone.setMinutes(0);
              clone.setSeconds(0);
              clone.setMilliseconds(0);
            }
            else if (scale == 'weekday')
            {
              switch (step)
              {
                case 5:
                case 2:
                  clone.setHours(Math.round(clone.getHours() / 12) * 12);
                  break;
                default:
                  clone.setHours(Math.round(clone.getHours() / 1) * 1);
                  break;
              }
              clone.setMinutes(0);
              clone.setSeconds(0);
              clone.setMilliseconds(0);
            }
            else if (scale == 'hour')
            {
              switch (step)
              {
                case 4:
                  clone.setMinutes(Math.round(clone.getMinutes() / 60) * 60);
                  break;
                default:
                  clone.setMinutes(Math.round(clone.getMinutes() / 15) * 15);
                  break;
              }
              clone.setSeconds(0);
              clone.setMilliseconds(0);
            }
            else if (scale == 'minute')
            {
              switch (step)
              {
                case 15:
                case 10:
                  clone.setMinutes(Math.round(clone.getMinutes() / 5) * 5);
                  clone.setSeconds(0);
                  break;
                case 5:
                  clone.setSeconds(Math.round(clone.getSeconds() / 60) * 60);
                  break;
                default:
                  clone.setSeconds(Math.round(clone.getSeconds() / 60) * 60);
                  break;
              }
              clone.setMilliseconds(0);
            }
            else if (scale == 'second')
            {
              clone.setSeconds(Math.round(clone.getSeconds() / 60) * 60);
            }
            else if (scale == 'millisecond')
            {
              clone.setSeconds(Math.round(clone.getSeconds() / 60) * 60);
            }

            return clone;
          };

          var generateWeekendBackgrounds = function ()
          {
            var m = moment();
            var weekendBgs = [];

            function genWeeks()
            {
              for (var i = 1; i < 54; i++)
              {
                weekendBgs.push({
                                  id: '' + m.year() + 'week' + i,
                                  start: m.week(i).day(6).format('YYYY-MM-DD'),
                                  end: m.add(2, 'days').format('YYYY-MM-DD'),
                                  type: 'background'
                                });
              }
            }

            genWeeks();
            m = moment().add(1, 'year');
            genWeeks();

            return weekendBgs;
          };

          var weekendBackgrounds = [];

          $rootScope.$on(
            'slotInitials',
            function ()
            {
              $scope.slot = {};

              $scope.slot = {
                start: {
                  date: new Date().toString(config.app.formats.date),
                  time: new Date().toString(config.app.formats.time),
                  datetime: getDateTimeToPicker(new Date().toISOString())
                },
                end: {
                  date: new Date().toString(config.app.formats.date),
                  time: new Date().addHours(1).toString(config.app.formats.time),
                  datetime: getDateTimeToPicker(new Date().toISOString())
                },
                state: 'com.ask-cs.State.Available',
                recursive: false,
                id: ''
              };
            }
          );

          $scope.timelineGetRange = function (props)
          {
            function updateRange(range)
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
            // if not by user, we're probably in a digest cycle, don't use $apply
            (props.byUser)
              ? $scope.$apply(updateRange(props))
              : updateRange(props);
          };

          $scope.timeliner = {
            init: function ()
            {
              var calendarOptions = {
                daysShort: moment.weekdaysShort(),
                days: moment.weekdays(),
                monthsShort: moment.monthsShort(),
                months: moment.months(),
              };

              var visOptions = {
                editable: {
                  add: true,
                  remove: true,
                  updateTime: true,
                  updateGroup: true
                },
                type: 'range',
                orientation: 'top',
                onAdd: this.onAdd,
                onRemove: this.onRemove,
                onMoving: this.onChange,
                stack: false,
                padding: 0,
                margin: {
                  axis: 5
                },
                snap: timelineSnap,
                groupOrder: groupSort,
                zoomMin: config.app.timeline.options.intervalMin,
                locale: config.app.lang
              };

              var visElement = document.getElementById($scope.timeline.id);
              $scope.self.timeline = new vis.Timeline(visElement, visDataSet, visGroupsDataSet, visOptions);

              $scope.self.timeline.on('select', function (props)
              {
                $scope.timelineOnSelect(props);
              });

              $scope.self.timeline.on('rangechanged', function (props)
              {
                this.getRange(props);
              }.bind(this));

              /**
               * Timeline on remove
               */
              $scope.timelineOnRemove = function (slot, item, callback)
              {
                $rootScope.planboardSync.clear();
                angular.element('#confirmTaskModal').modal('hide');

                if (newSlot.length)
                {
                  (callback && callback(item));
                  newSlot = [];
                  $scope.$apply($scope.resetInlineForms());
                }
                else
                {
                  if( angular.isUndefined(item) && angular.isUndefined(callback) )
                  {
                    // function was called from button, get ID of selected item and remove from dataset on success
                    item = visDataSet.get($scope.self.timeline.getSelection()[0]);
                    callback = function(itemId)
                    {
                      if( itemId )
                      {
                        visDataSet.remove(itemId);
                      }
                    }
                  }

                  console.error("$scope.self.timeline.getSelection() ->", $scope.self.timeline.getSelection());
                  console.error("item ->", item);
                  console.error("callback ->", callback);


                  var selected = visDataSet.get(item);
                  var content = $scope.getSlotContentJSON(item.content);

                  var memberId = angular.element(selected.group).attr('memberId'),
                      now = moment().valueOf();

                  if (typeof content == 'undefined')
                  {
                    $scope.timeliner.refresh();
                    return;
                  }

                  if (typeof content.id == 'undefined') return;

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
                        callback(null);
                      }
                      else
                      {
                        $rootScope.notifier.success($rootScope.ui.planboard.timeslotDeleted);

                        if (newSlot.length)
                        {
                          newSlot = [];
                        }
                        callback(item);

                        var group = ($scope.section == 'teams')
                          ? $scope.currentTeam
                          : $scope.currentClientGroup;

                        $scope.getTasks(
                          $scope.section,
                          group,
                          moment($scope.timeline.range.start).valueOf(),
                          moment($scope.timeline.range.end).valueOf()
                        );

                        $rootScope.planboardSync.start();
                      }
                      $rootScope.statusBar.off();
                    }
                  );
                }
              };

              // add background behind axis
              // TODO: add event listener for vis 'finishedRedraw' and determine if resize needed
              var axisHeight = document.querySelector('.vis.timeline .vispanel.top').getBoundingClientRect().height;

              var bgInterval = null;
              var bgCount = 0;
              var bgMax = 40; // * 100 ms = 2 s

              var axisBg = document.createElement('div');
              axisBg.className = 'vispanel background teamup';
              if (axisHeight !== 0)
              {
                axisBg.style.height = axisHeight + 'px';
                document.querySelector('.vis.timeline .vispanel.background').appendChild(axisBg);
              }
              else
              {
                bgInterval = $window.setInterval(function ()
                                                 {
                                                   bgCount += 1;
                                                   axisHeight = document.querySelector('.vis.timeline .vispanel.top').getBoundingClientRect().height;
                                                   if (axisHeight === 0)
                                                   {
                                                     if (bgCount > bgMax)
                                                     {
                                                       // don't set height, css has fallback
                                                       document.querySelector('.vis.timeline .vispanel.background').appendChild(axisBg);
                                                       $window.clearInterval(bgInterval);
                                                       bgInterval = null;
                                                     }
                                                     return;
                                                   }
                                                   axisBg.style.height = axisHeight + 'px';
                                                   document.querySelector('.vis.timeline .vispanel.background').appendChild(axisBg);
                                                   $window.clearInterval(bgInterval);
                                                   bgInterval = null;
                                                 }, 50);
                $rootScope.intervals = $rootScope.intervals || [];
                $rootScope.intervals.push(bgInterval);
              }

              weekendBackgrounds = generateWeekendBackgrounds();

              this.initTooltip(visElement);

              this.render($scope.timeline.options);
            },

            getRange: function (props)
            {
              $scope.timelineGetRange(props)
            },

            initTooltip: function (visElement)
            {

              var timelineElement = visElement.getElementsByClassName('vispanel center')[0];

              timelineElement.addEventListener('mousemove', function (e)
              {
                var props;

                props = $scope.self.timeline.getEventProperties(e);
                this.updateTooltip(props);

              }.bind(this));

              timelineElement.addEventListener('mouseleave', function (e)
              {
                this.removeTooltip();
              }.bind(this));

            },

            onAdd: function (item, callback)
            {
              $scope.timelineOnAdd(null, null, item, callback)
            },
            //todo remove after confirmation, (removes the row already before the confirmation ended)
            onRemove: function (item, callback)
            {
              $scope.timelineOnRemove(null, item, callback);
            },
            onChange: function (item, callback)
            {
              $scope.timelineChanging(item, callback);
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

              var groupIds = {};
              $scope.resetViews();

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

              if($scope.timeline.main)
              {
                visDataSet.clear();

                visDataSet.add(
                  this.process($scope.data),
                  $scope.timeline.options
                );

                visGroupsDataSet.clear();

                angular.forEach(visDataSet.get(), function (item)
                {
                  groupIds[item.group] = item.group;
                });

                angular.forEach(groupIds, function (id)
                {
                  //console.error("id ->", id);
                  visGroupsDataSet.add({id: id, content: id});
                });

                visDataSet.add(weekendBackgrounds);

                //set range options timeline / loading only the tasks in between the range
                $scope.self.timeline.setOptions({
                                                  max: $scope.timeline.options.max,
                                                  min: $scope.timeline.options.min,
                                                  start: $scope.timeline.options.start,
                                                  end: $scope.timeline.options.end
                                                });
              }

              $scope.self.timeline.setWindow($scope.timeline.options.start, $scope.timeline.options.end);
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

            updateTooltip: function (props)
            {
              var tooltipVal = moment(props.snappedTime).format('DD-MM-YYYY || HH:mm');
              var element,
                  style,
                  update = false,
                  self = this,
                  what = props.what;

              if (this.tooltipValue && this.tooltipElement)
              {
                if (this.tooltipValue !== tooltipVal)
                {
                  update = true;
                  this.tooltipValue = tooltipVal;
                }
              }
              else
              {

                this.tooltipValue = moment(props.snappedTime).format('DD-MM-YYYY || HH:mm');
                element = document.createElement('div');
                element.className = 'vis-timeline-tooltip';
                element.appendChild(document.createTextNode(this.tooltipValue));
                document.getElementById('mainTimeline').appendChild(element);

                this.tooltipElement = document.getElementsByClassName('vis-timeline-tooltip')[0];
                this.tooltipText = this.tooltipElement.firstChild;
              }

              var drawTooltip = function ()
              {
                // tooltip could have been removed between frames
                if (self.tooltipElement !== null)
                {
                  style = self.tooltipElement.style;

                  if (update)
                  {
                    self.tooltipText.nodeValue = self.tooltipValue;
                  }

                  // don't show tooltip on item
                  if (what === 'item')
                  {
                    style.display = 'none';
                  }
                  else
                  {
                    style.display = 'block';
                    style.top = props.pageY - 238 + 15 + 'px';
                    style.left = props.pageX - 20 + 15 + 'px';
                  }
                }
              };

              if (window.requestAnimationFrame)
              {
                window.requestAnimationFrame(function ()
                                             {
                                               drawTooltip();
                                             });
              }
              else
              {
                drawTooltip();
              }

            },
            removeTooltip: function ()
            {
              document.getElementById('mainTimeline').removeChild(this.tooltipElement);
              this.tooltipElement = null;
            }
          };

          if ($scope.timeline)
          {
            $scope.timeliner.init()
          }

          $scope.$on(
            'timelinerTasks',
            function ()
            {
              var start = new Date(arguments[1].start).getTime(),
                  shownRangeDate = moment(start);

              $scope.timeline.current.day = shownRangeDate.format("DDD");
              $scope.timeline.current.week = shownRangeDate.week();
              $scope.timeline.current.month = (shownRangeDate.month() + 1);
              $scope.timeline.current.year = shownRangeDate.year();


              $scope.timeliner.render(
                {
                  start: start,
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

          $scope.selectedSlot = function (props)
          {
            var values = visDataSet.get(props.items[0]);

            if(values.content)
            {
              var content = $scope.getSlotContentJSON(values.content);

              $scope.original = {
                start: values.start,
                end: values.end,
                content: content
              };

              if ($scope.timeline.main && ! values.content.match(/Nieuw/))
              {
                $rootScope.$broadcast('resetPlanboardViewsTasks');
              }
              else if (! values.content.match(/Nieuw/))
              {
                $scope.forms = {
                  add: false,
                  edit: true
                };
              }

              if (values.content.match(/Nieuw/))
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
                      if (values.content.match(/Nieuw/) || (content.relatedUser && typeof content.id == 'undefined'))
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
                    date: moment(values.start).format(config.app.formats.date),
                    time: moment(values.start).format(config.app.formats.time),
                    datetime: convertDateTimeToLocal(values.start)
                  },
                  end: {
                    date: moment(values.end).format(config.app.formats.date),
                    time: moment(values.end).format(config.app.formats.time),
                    datetime: convertDateTimeToLocal(values.end)
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
              }

              return values;
            }
          };

          $scope.timelineOnSelect = function (props)
          {
            $rootScope.planboardSync.clear();

            // reset tooltips and slots on empty selection
            if (props && props.items.length === 0)
            {
              $scope.timeliner.render(
                {
                  start: $scope.data.periods.start,
                  end: $scope.data.periods.end
                },
                true
              );
            }

            // negate multiple item selections
            if (props && props.items.length > 1)
            {
              $scope.self.timeline.setSelection(props.items[0]);
              // setSelection doesn't trigger another event
              props.items = [props.items[0]];
            }

            $scope.$apply(
              function ()
              {
                $scope.selectedOriginal = $scope.selectedSlot(props);

                // make the slot movable (editable)
                if (typeof $scope.selectedOriginal != 'undefined')
                {
                  $scope.redrawSlot($scope.selectedOriginal);
                }
              }
            );
          };

          var getDateTimeFromPicker = function (date)
          {
            if (typeof(date) == 'undefined' || date == null || date == '') return "";

            var tmpDate = new Date(date);

            var offset = tmpDate.getTimezoneOffset();

            var newDate = tmpDate.addMinutes(offset);

            return newDate.toISOString();
          };

          // remove the task item from the right list
          function deleteTask(tasks, uuid)
          {
            var i = 0;
            console.error('tasks', tasks);

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
              $scope.removeTaskOptions.range.start = moment(range.start).format("DD MMM YYYY");
              $scope.removeTaskOptions.range.end = moment(range.end).format("DD MMM YYYY");
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
                                     else
                                     {
                                       var group = ($scope.section == 'teams')
                                         ? $scope.currentTeam
                                         : $scope.currentClientGroup;

                                       $scope.getTasks(
                                         $scope.section,
                                         group,
                                         moment($scope.timeline.range.start).valueOf(),
                                         moment($scope.timeline.range.end).valueOf()
                                       );
                                       $rootScope.notifier.success($rootScope.ui.planboard.tasksDeleted(options));
                                     }
                                     $rootScope.statusBar.off();
                                   });
                         }
                       });
          }

          var getDateTimeToPicker = function (d)
          {
            //var d1 = new Date(d);
            //// var offset = d.getTimezoneOffset() / 60;
            //d1.setMinutes(d1.getMinutes() - d1.getTimezoneOffset());
            //
            //return d1.toISOString().replace("Z", "");
            return moment(d).toDate();
          };


          function setSlot(values, now, nowStamp)
          {
            if ((new Date(values.start).getTime() >= now && new Date(values.end).getTime() > now))
            {
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
                      date: moment(values.start).format(config.app.formats.date),
                      time: moment(values.start).format(config.app.formats.time),
                      datetime: convertDateTimeToLocal(values.start)
                    },
                    end: {
                      date: moment(values.end).format(config.app.formats.date),
                      time: moment(values.end).format(config.app.formats.time),
                      datetime: convertDateTimeToLocal(values.end)
                    },
                    recursive: (values.group.match(/recursive/)) ? true : false,
                    state: 'com.ask-cs.State.Available'
                  };

                  if($scope.relatedUsers && $scope.relatedUsers.length)
                  {
                    $scope.slot.relatedUser = $scope.relatedUsers[0].uuid
                  }

                  $scope.original = {
                    start: new Date(values.start),
                    end: new Date(values.end),
                    content: {
                      recursive: $scope.slot.recursive,
                      state: $scope.slot.state
                    }
                  };

                  $scope.redrawSlot(values);
                }
              );
            }
            else
            {
              $rootScope.notifier.error($rootScope.ui.agenda.pastAdding);

              $rootScope.$apply();
            }
          }

          $scope.timelineOnAdd = function (form, slot, item, callback)
          {
            $rootScope.planboardSync.clear();

            var now = moment().valueOf(),
                nowStamp = Math.abs(Math.floor(now / 1000)),
                values;

            if (!form)
            {
              if (moment(item.start) < now)
              {
                $rootScope.notifier.error($rootScope.ui.agenda.pastAdding);
                $rootScope.$apply();
                callback(null);

                if (newSlot.length)
                {
                  visDataSet.remove(newSlot[0]);
                  newSlot = [];
                  $scope.timeliner.refresh();
                }
              }

              if ((new Date(item.start).getTime() >= now && new Date(item.end).getTime() > now))
              {
                //check an item in the newSlot and remove it if there's already an old item
                if (newSlot.length >= 1)
                {
                  callback(null);
                  visDataSet.remove(newSlot[0]);
                  newSlot.splice(0, 1);
                }

                newSlot.push(item.id);
                visDataSet.add(item);
                values = item;

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
                        date: moment(values.start).format(config.app.formats.date),
                        time: moment(values.start).format(config.app.formats.time),
                        datetime: convertDateTimeToLocal(values.start)
                      },
                      end: {
                        date: moment(values.end).format(config.app.formats.date),
                        time: moment(values.end).format(config.app.formats.time),
                        datetime: convertDateTimeToLocal(values.end)
                      },
                      recursive: (values.group.match(/recursive/)) ? true : false,
                      state: 'com.ask-cs.State.Available'
                    };

                    if($scope.relatedUsers && $scope.relatedUsers.length)
                    {
                      $scope.slot.relatedUser = $scope.relatedUsers[0].uuid
                    }

                    $scope.original = {
                      start: new Date(values.start),
                      end: new Date(values.end),
                      content: {
                        recursive: $scope.slot.recursive,
                        state: $scope.slot.state
                      }
                    };

                    var newSlot = $scope.redrawSlot(values);
                    values.start = newSlot.start; 
                    values.end = newSlot.end;

                    var toolTipContent = tooltip({
                                                start: moment(values.start).unix(),
                                                end: moment(values.end).unix()
                                              }, true);
                    values.content = newSlot.content;//toolTipContent + newSlot.content;

                    console.error("values.content ->", values.content);

                  /*
                    <div class="time-tip">27-02-2016 01:00 / 28-02-2016 11:00
                  <div class="slot-tooltip slot-tooltip--start">01:00
                    </div>
                  <div class="slot-tooltip slot-tooltip--end">11:00</div></div>
                    */

                    //values.className = $scope.timeline
                    //                          .config
                    //                          .states[values.state].className;
                    //values.className += ' has-slot-tooltip';

                    //tooltip();

                    visDataSet.update(values);

                    $timeout(function ()
                             {
                               $scope.self.timeline.setSelection(values.id);
                             });
                  }
                );
              }
            }
            else
            {
              values = {
                startTime: ($rootScope.browser.mobile) ?
                  Math.abs(Math.floor(new Date(getDateTimeFromPicker(slot.start.datetime)).getTime())) :
                  +moment(slot.start.date +' '+ slot.start.time, config.app.formats.datetime),
                endTime: ($rootScope.browser.mobile) ?
                  Math.abs(Math.floor(new Date(getDateTimeFromPicker(slot.end.datetime)).getTime())) :
                  +moment(slot.end.date +' '+ slot.end.time, config.app.formats.datetime),
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
                    var message = ($scope.relatedUsers && $scope.relatedUsers.length)
                      ? $rootScope.ui.teamup.selectMember
                      : $rootScope.ui.planboard.noAffectedClientGroup;
                    $rootScope.notifier.error(message);
                    return;
                  }
                  else if ($scope.views.clients)
                  {
                    var message = ($scope.relatedUsers && $scope.relatedUsers.length)
                      ? $rootScope.ui.teamup.selectClient
                      : $rootScope.ui.planboard.noAffectedTeam;
                    $rootScope.notifier.error(message);
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

                var selected = visDataSet.get($scope.self.timeline.getSelection()[0]),
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
                      newSlot = [];
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

                    $rootScope.$broadcast('resetPlanboardViewsTasks');
                    $rootScope.statusBar.off();
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
          $scope.redrawSlot = function (slot)
          {
            var start = ($rootScope.browser.mobile)
              ?   Math.abs(Math.floor(new Date($scope.slot.start.datetime).getTime() / 1000))
              :   +moment($scope.slot.start.date +' '+ $scope.slot.start.time, config.app.formats.datetime);
            var end = ($rootScope.browser.mobile)
              ?   Math.abs(Math.floor(new Date($scope.slot.end.datetime).getTime() / 1000))
              :   +moment($scope.slot.end.date +' '+ $scope.slot.end.time, config.app.formats.datetime);

            var selectedSlot = $scope.self.timeline.getSelection()[0] || slot.id;

            if (typeof selectedSlot != 'undefined')
            {
              var slotContent = $scope.processSlotContent(selectedSlot);

              return {
                'content': slotContent,
                'start': new Date(start),
                'end': new Date(end)
              };
            }
            else
            {
              //TODO
              console.error("alert selectSlot ->");
              //alert($rootScope.ui.teamup.selectSlot);
            }
          };

          $scope.processSlotContent = function (row)
          {
            var item = visDataSet.get(row);
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

            var content = '<span>Nieuw</span>';

            //if ((typeof $scope.slot.clientUuid == 'undefined' && $scope.views.teams ) ||
            //  (typeof $scope.slot.memberId == 'undefined' && $scope.views.clients))
            //{
            //  if (typeof $scope.slot.relatedUser == 'undefined' || $scope.slot.relatedUser == '')
            //  {
            //    content = 'Nieuw';
            //  }
            //}

            content += '<input type="hidden" value="' + angular.toJson(itemContent) + '">';

            return content;
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
                selected = visDataSet.get($scope.self.timeline.getSelection()[0]),
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
                  Math.abs(Math.floor(new Date(getDateTimeFromPicker(slot.start.datetime)).getTime())) :
                  +moment(slot.start.date +' '+ slot.start.time, config.app.formats.datetime),
                endTime: ($rootScope.browser.mobile) ?
                  Math.abs(Math.floor(new Date(getDateTimeFromPicker(slot.end.datetime)).getTime())) :
                  +moment(slot.end.date +' '+ slot.end.time, config.app.formats.datetime),
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

            //callback timelineOnChange

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

                $rootScope.statusBar.off();
              }
            );
          };

          $scope.timelineChanging = function (item, callback)
          {
            $rootScope.planboardSync.clear();

            var values = item,
                content = $scope.getSlotContentJSON(values.content);
            //content = {} bij nieuw, de check in getSlotContentJSON gaat niet goed

            if (content != undefined)
            {
              $scope.$apply(
                function ()
                {
                  $scope.slot = {
                    start: {
                      date: moment(values.start).format(config.app.formats.date),
                      time: moment(values.start).format(config.app.formats.time),
                      datetime: getDateTimeToPicker(new Date(values.start).toISOString())
                    },
                    end: {
                      date: moment(values.end).format(config.app.formats.date),
                      time: moment(values.end).format(config.app.formats.time),
                      datetime: getDateTimeToPicker(new Date(values.end).toISOString())
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
            callback(item);
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

          //if ($scope.timeline && $scope.timeline.main)
          //{
          //  console.error('123', 123);
          //  setTimeout(
          //    function ()
          //    {
          //      $scope.self.timeline.redraw()
          //    }, 100
          //  );
          //}

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
              $window.clearInterval($window.planboardSync);
            }
          };

          $rootScope.planboardSync.start();

          $scope.getSlotContentJSON = function (content)
          {
            //|| content.indexOf('{}') >= 1

            if (content && content !== 'Nieuw')
            {
              return angular.fromJson(
                content.substring(content.indexOf('value=') + 7, content.length - 2)
              );
            }
          };

          $rootScope.$on('resetTaskTimeline', function ()
          {
            $scope.timeliner.refresh();
            //$scope.timeliner.render(
            //  {
            //    start: $scope.timeline.range.start,
            //    end: $scope.timeline.range.end
            //  }, true);
          });

          function tooltip (periods, tooltips)
          {
            var convertTimestamp = function (stamp)
            {
              return moment(stamp * 1000).format(config.app.formats.datetime);
            };

            var content = convertTimestamp(periods.start) + ' / ' +
              convertTimestamp(periods.end);

            var startTooltip = moment(periods.start * 1000).format('HH:mm');
            var endTooltip = moment(periods.end * 1000).format('HH:mm');

            if (periods.hasOwnProperty('min'))
            {
              content += ' / ' + $rootScope.ui.agenda.currentAmountReachable + ': ' + periods.min;
            }

            if (periods.hasOwnProperty('wish'))
            {
              content += ' / ' + $rootScope.ui.agenda.amountOfPeopleWished +': ' + periods.wish;
            }

            if (periods.hasOwnProperty('member'))
            {
              content += ' / ' + periods.member;
            }

            if (periods.hasOwnProperty('state'))
            {
              content += ' / ' + periods.state;
            }

            if(tooltips){
              content += '<div class="slot-tooltip slot-tooltip--start">' + startTooltip + '</div>';
              content += '<div class="slot-tooltip slot-tooltip--end">' + endTooltip + '</div>';

              return '<div class="time-tip">' + content + '</div>';
            }

            return '<div class="time-tip" title="' + content + '">' + content + '</div>';
          }
        }
    );
  }
);
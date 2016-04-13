define(
  ['../../controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'agenda-timeline',
      function ($rootScope, $scope, $q, $location, $route, $timeout, $window, Slots,
                Teams, Profile, Dater, Sloter, TeamUp, Store, CurrentSelection, $filter, moment, vis)
      {
        // TODO: Define diff in the watcher maybe?
        var range,
          diff,
          newSlot = [];

        var visDataSet = new vis.DataSet();
        var visGroupsDataSet = new vis.DataSet();

        /**
         * Watch for changes in timeline range
         */
        $scope.$watch(
          function ()
          {
            /**
             * If main timeline
             */
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
            /**
             * User timeline
             * Allow only if it is not user
             */
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

        function getUnixTimeStamps(slot)
        {
          var startDate = slot.start.date + " " + slot.start.time,
            endDate = slot.end.date + " " + slot.end.time,
            dateTimeFormat = 'DD-MM-YYYY HH:mm',
            startUnixTimeStamp = moment(startDate, dateTimeFormat).valueOf(),
            endUnixTimeStamp = moment(endDate, dateTimeFormat).valueOf();
          return {
            start: startUnixTimeStamp,
            end: endUnixTimeStamp
          }
        }

        $scope.showDuration = function ()
        {
          var dates = getUnixTimeStamps($scope.slot),
            duration = $filter('calculateDeltaTime')(dates.end, dates.start),
            durationEl = angular.element('.duration'),
            dangerClass = 'label-danger';

          $scope.duration = '';

          if (dates.start > dates.end)
          {
            durationEl.addClass(dangerClass);
            $scope.duration += '-';
          }
          else
          {
            durationEl.removeClass(dangerClass);
          }
          $scope.duration += duration;
        };

        /**
         * TODO: Stress-test this!
         * Hot fix against not-dom-ready problem for timeline
         */
        if ($scope.timeline && $scope.timeline.main)
        {
          setTimeout(
            function ()
            {
              $scope.self.timeline.redraw()
            },
            config.app.timers.TICKER
          );
        }

        $rootScope.intervals = $rootScope.intervals || [];

        /**
         * Background sync in every 60 sec
         */
        $rootScope.planboardSync = {
          /**
           * Start planboard sync
           */
          start: function ()
          {
            $window.planboardSync = $window.setInterval(
              function ()
              {
                /**
                 * Update planboard only in planboard is selected
                 */
                if ($location.path() == '/team-telefoon')
                {
                  $scope.slot = {};

                  $rootScope.$broadcast('resetPlanboardViews');

                  $scope.timeliner.load(
                    {
                      start: $scope.data.periods.start,
                      end: $scope.data.periods.end
                    },
                    true
                  );
                }
              }, config.app.timers.PLANBOARD_SYNC);

            // Record interval for cleanup when switching controllers
            $rootScope.intervals.push($window.planboardSync);
          },

          /**
           * Clear planboard sync
           */
          clear: function ()
          {
            var index;
            $window.clearInterval($window.planboardSync);

            index = $rootScope.intervals.indexOf($window.planboardSync);
            if(index !== -1){
              $rootScope.intervals.splice(index, 1);
            }

            $window.planboardSync = null;
          }
        };

        $scope.$watch('slot.state', function (newValue, oldValue)
        {
          updateSlot(newValue, oldValue, function(item, newValue)
          {
            item.state = newValue;
            item.className = $scope.timeline.config.states[item.state].className;
            item.className += ' has-slot-tooltip';
            return item;
          });
        });


        $scope.$watch('slot.start.date', function (newValue, oldValue)
        {
          updateSlot(newValue, oldValue, function(item, newValue)
          {
            item.start = moment(newValue + " " + $scope.slot.start.time,
                                config.app.formats.date + " " + config.app.formats.time).toDate();
            return item;
          });
        });

        $scope.$watch('slot.end.date', function (newValue, oldValue)
        {
          updateSlot(newValue, oldValue, function(item, newValue)
          {
            item.end = moment(newValue + " " + $scope.slot.end.time,
                                config.app.formats.date + " " + config.app.formats.time).toDate();
            return item;
          });
        });

        $scope.$watch('slot.start.time', function (newValue, oldValue)
        {
          //update day if the hour is midnight
          updateSlot(newValue, oldValue, function(item, newValue)
          {
            item.start = moment($scope.slot.start.date + " " + newValue,
                                config.app.formats.date + " " + config.app.formats.time).toDate();
            return item;
          });
        });

        $scope.$watch('slot.end.time', function (newValue, oldValue)
        {
          //update day if the hour is midnight
          updateSlot(newValue, oldValue, function(item, newValue)
          {
            item.end = moment($scope.slot.end.date + " " + newValue,
                              config.app.formats.date + " " + config.app.formats.time).toDate();
            return item;
          });
        });

        $scope.$watch('slot.end.time', function (newValue, oldValue)
        {
          //update day if the hour is midnight
          updateSlot(newValue, oldValue, function(item, newValue)
          {
            item.end = moment($scope.slot.end.date + " " + newValue,
                              config.app.formats.date + " " + config.app.formats.time).toDate();
            return item;
          });
        });

        if($rootScope.browser.mobile)
        {
          $scope.$watch('slot.start.datetime', function (newValue, oldValue)
          {
            //update day if the hour is midnight
            updateSlot(newValue, oldValue, function(item, newValue)
            {
              item.start = moment(newValue).toDate();
              return item;
            });
          });

          $scope.$watch('slot.end.datetime', function (newValue, oldValue)
          {
            //update day if the hour is midnight
            updateSlot(newValue, oldValue, function(item, newValue)
            {
              item.end = moment(newValue).toDate();
              return item;
            });
          });
        }

        function updateSlot(newValue, oldValue, callback)
        {
          var ids, item;

          if (newValue === oldValue) return;
          if (typeof newValue === 'undefined') return;

          if (($scope.views.slot && ($scope.views.slot.add === true || $scope.views.slot.edit === true)) || //planboard
            ($scope.forms && ($scope.forms.add === true || $scope.forms.edit === true))) //profile
          {
            ids = $scope.self.timeline.getSelection();

            if (ids.length === 1)
            {
              item = visDataSet.get(ids)[0];
              item = callback(item, newValue);
              visDataSet.update(item);
            }
          }
        }

        /**
         * Timeline on changing
         */
        $scope.timelineChanging = function (item, callback)
        {
          if(/<\/?[^>]*>/.test(item.group) ) callback(null);
          else
          {
            $scope.$apply(
              function ()
              {
                $rootScope.planboardSync.clear();

                item.content = Sloter.tooltip({
                                                start: moment(item.start).unix(),
                                                end: moment(item.end).unix()
                                              }, true);

                // change hover tooltip to constant tooltip
                if (item.className)
                { // won't have if created by ctrl/shift-drag
                  item.className = item.className.replace('has-hover-slot-tooltip', 'has-slot-tooltip');
                }

                $scope.slot = {
                  start: {
                    date: moment(item.start).format(config.app.formats.date),
                    time: moment(item.start).format(config.app.formats.time),
                    datetime: convertDateTimeToLocal(item.start)
                  },
                  end: {
                    date: moment(item.end).format(config.app.formats.date),
                    time: moment(item.end).format(config.app.formats.time),
                    datetime: convertDateTimeToLocal(item.end)
                  },
                  state: item.state,
                  recursive: item.recursive,
                  id: item.id
                };
                $scope.showDuration();

                callback(item);
              }
            );
          }
        };

        /**
         * Timeliner listener
         */
        $rootScope.$on(
          'slotInitials',
          function ()
          {
            $scope.slot = {};

            $scope.slot = {
              start: {
                date: moment().format(config.app.formats.date),
                time: moment().format('HH:00'),
                datetime: moment().toDate()
              },
              end: {
                date: moment().format(config.app.formats.date),
                time: moment().add(1, 'hours').format('HH:00'),
                datetime: moment().add(1, 'hours').toDate()
              },
              state: 'com.ask-cs.State.Available',
              recursive: false,
              id: ''
            };
            $scope.setEndDate($scope.slot.start.date);
            $scope.setEndTime($scope.slot.start.date, $scope.slot.start.time);
            $scope.showDuration();
          }
        );

        /**
         * Timeline (The big boy)
         */
        $scope.timeliner = {

          /**
           * Init timeline
           */
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
                updateTime: true
              },
              type: 'range',
              orientation: 'top',
              onAdd: this.onAdd,
              onRemove: this.onRemove,
              onMoving: this.onChange,
              stack: false,
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

              if (newSlot.length)
              {
                callback(item);
                newSlot = [];

                $scope.$apply($scope.resetInlineForms());
              }
              else
              {
                if (angular.isUndefined(item) && angular.isUndefined(callback))
                {
                  // function was called from button, get ID of selected item and remove from dataset on success
                  item = $scope.self.timeline.getSelection()[0]; // will be the id of the selected item

                  callback = function (itemId)
                  {
                    if (itemId)
                    {
                      visDataSet.remove(itemId);
                    }
                  }
                }

                var successCallback = function (result)
                {
                  $rootScope.$broadcast('resetPlanboardViews');

                  if (result.error)
                  {
                    $rootScope.notifier.error($rootScope.ui.errors.timeline.remove);
                    callback(null);
                  }
                  else
                  {
                    $rootScope.notifier.success($rootScope.ui.agenda.timeslotDeleted);
                    if (newSlot.length)
                    {
                      newSlot = [];
                    }
                    callback(item);
                  }

                  $scope.timeliner.refresh();

                  $rootScope.planboardSync.start();
                };

                var now = moment().valueOf(),
                  currentSlotUser = (slot && slot.member) ? slot.member : $scope.timeline.user.id,
                  changedEndDate = new Date(now - 10000);

                if ($scope.original.end <= now && $scope.original.recursive == false)
                {
                  $rootScope.notifier.error($rootScope.ui.agenda.pastDeleting);

                  $scope.timeliner.refresh();
                }
                else if ($scope.original.start <= now &&
                  $scope.original.end >= now &&
                  $scope.original.recursive == false)
                {
                  Slots.change(
                    $scope.original,
                    {
                      start: Math.abs(Math.floor(new Date($scope.original.start).getTime())),
                      end: Math.abs(Math.floor(changedEndDate)),
                      recursive: $scope.original.recursive,
                      state: $scope.original.state
                    },
                    currentSlotUser
                  ).then(
                    function (result)
                    {
                      updateLoggedUser(currentSlotUser);
                      successCallback(result)
                    }
                  );
                }
                else
                {
                  $rootScope.statusBar.display($rootScope.ui.agenda.deletingTimeslot);

                  Slots.remove($scope.original, currentSlotUser)
                    .then(
                      function (result)
                      {
                        updateLoggedUser(currentSlotUser);
                        successCallback(result)
                      }
                    );
                }
              }
            };

            // add background behind axis
            // TODO: add event listener for vis 'finishedRedraw' and determine if resize needed

            var axisHeight = document.querySelector('.vis-timeline .vis-panel.vis-top').getBoundingClientRect().height;

            var bgInterval = null;
            var bgCount = 0;
            var bgMax = 40; // * 100 ms = 2 s

            var axisBg = document.createElement('div');
            axisBg.className = 'vis-panel vis-background teamup';
            if (axisHeight !== 0)
            {
              axisBg.style.height = axisHeight + 'px';
              document.querySelector('.vis-timeline .vis-panel.vis-background').appendChild(axisBg);
            }
            else
            {
              bgInterval = $window.setInterval(function ()
              {
                bgCount += 1;
                axisHeight = document.querySelector('.vis-timeline .vis-panel.vis-top').getBoundingClientRect().height;
                if (axisHeight === 0)
                {
                  if (bgCount > bgMax)
                  {
                    // don't set height, css has fallback
                    document.querySelector('.vis-timeline .vis-panel.vis-background').appendChild(axisBg);
                    $window.clearInterval(bgInterval);
                    bgInterval = null;
                  }
                  return;
                }
                axisBg.style.height = axisHeight + 'px';
                document.querySelector('.vis-timeline .vis-panel.vis-background').appendChild(axisBg);
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

          initTooltip: function (visElement)
          {

            var timelineElement = visElement.getElementsByClassName('vis-panel vis-center')[0];

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

          getRange: function (props)
          {
            $scope.timelineGetRange(props)
          },

          onAdd: function (item, callback)
          {
            $scope.timelineOnAdd(null, null, item, callback);
          },

          onRemove: function (item, callback)
          {
            $scope.timelineOnRemove(null, item, callback);
          },

          onChange: function (item, callback)
          {
            $scope.timelineChanging(item, callback);
          },

          onSelect: function ()
          {
            $scope.timelineOnSelect()
          },

          /**
           * (Re-)Render timeline
           */
          render: function (options, remember)
          {
            var start,
              end;

            var groupIds = {};

            // rerendering will break newSlot logic, so just reset it
            if (newSlot.length)
            {
              visDataSet.remove(newSlot[0]);
              newSlot = [];
            }

            /**
             * Hot fix for not converted Date objects initially given by timeline
             */
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

            /**
             * IE8 fix for inability of - signs in date object
             */
            if ($.browser.msie && $.browser.version == '8.0')
            {
              $scope.timeline.options.start = new Date(options.start);
              $scope.timeline.options.end = new Date(options.end);
            }

            angular.extend($scope.timeline.options, config.app.timeline.options);

            if ($scope.timeline.main)
            {
              visDataSet.clear();

              visDataSet.add(
                Sloter.process(
                  $scope.data,
                  $scope.timeline.config,
                  $scope.divisions,
                  $scope.timeline.user.id,
                  $scope.timeline.user.role,
                  $scope.timeline.user,
                  $scope.timeline.current,
                  $rootScope.app.resources
                ));

              visGroupsDataSet.clear();

              angular.forEach(visDataSet.get(), function (item)
              {
                groupIds[item.group] = item.group;
              });

              angular.forEach(groupIds, function (id)
              {
                visGroupsDataSet.add({id: id, content: id});
              });

              visDataSet.add(weekendBackgrounds);

              $scope.self.timeline.setOptions({
                max: $scope.timeline.options.max,
                min: $scope.timeline.options.min,
                start: $scope.timeline.options.start,
                end: $scope.timeline.options.end
              });
            }
            else
            {
              var timeout = ($location.hash() == 'timeline') ?
                config.app.timers.TICKER :
                config.app.timers.MEMBER_TIMELINE_RENDER;

              $rootScope.timelineLoaded = false;

              setTimeout(
                function ()
                {
                  $rootScope.timelineLoaded = true;
                  $rootScope.$apply();

                  //$scope.self.timeline.draw(
                  //  Sloter.profile(
                  //    $scope.data.slots.data,
                  //    $scope.timeline.config
                  //  ), $scope.timeline.options);

                  visDataSet.clear();
                  visDataSet.add(Sloter.profile(
                    $scope.data.slots.data,
                    $scope.timeline.config
                  ));

                  visGroupsDataSet.clear();

                  angular.forEach(visDataSet.get(), function (item)
                  {
                    groupIds[item.group] = item.group;
                  });

                  angular.forEach(groupIds, function (id)
                  {
                    if (id === 'empty')
                    {
                      visGroupsDataSet.add({id: id, content: '&nbsp'});
                      return;
                    }
                    visGroupsDataSet.add({id: id, content: id});
                  });

                  visDataSet.add(weekendBackgrounds);

                  $scope.self.timeline.setOptions({
                    max: $scope.timeline.options.max,
                    min: $scope.timeline.options.min,
                    start: $scope.timeline.options.start,
                    end: $scope.timeline.options.end
                  });

                }, timeout);
            }

            $scope.self.timeline.setWindow($scope.timeline.options.start, $scope.timeline.options.end);
          },

          /**
           * Grab new timeline data from backend and render timeline again
           */
          load: function (stamps, remember)
          {
            var _this = this;

            $rootScope.statusBar.display($rootScope.ui.agenda.refreshTimeline);

            if ($scope.timeline.main)
            {
              var options = {
                groupId: $scope.timeline.current.group,
                division: $scope.timeline.current.division,
                layouts: $scope.timeline.current.layouts,
                month: $scope.timeline.current.month,
                stamps: stamps,
                user: $route.current.params.userId
              };

              //TODO load and render at the same time, two times the same call
              Teams.getSingle($scope.timeline.current.group)
                   .then(function (members)
                         {
                           options.members = members;
                           return Slots.all(options);
                         })
                   .then(function (data)
                         {
                           if (data.error)
                           {
                             $rootScope.notifier.error($rootScope.ui.agenda.query);
                           }
                           else
                           {
                             $scope.data = data;
                             _this.render(stamps, remember);
                           }
                           $rootScope.statusBar.off();
                         });
            }
            else
            {
              //TODO is this ever used?
              //Profile.getSlots(
              //  $scope.timeline.user.id,
              //  stamps
              //).then(
              //  function (data)
              //  {
              //    if (data.error)
              //    {
              //      $rootScope.notifier.error($rootScope.ui.agenda.query);
              //      console.warn('error ->', data);
              //    }
              //    else
              //    {
              //      data.user = data.slots.data;
              //
              //      $scope.data = data;
              //
              //      //_this.render(stamps, remember);
              //
              //      $rootScope.statusBar.off();
              //    }
              //  }
              //);
            }
          },

          /**
           * Refresh timeline as it is
           */
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
                add: true,
                edit: false
              };
            }

            this.load(
              {
                start: $scope.data.periods.start,
                end: $scope.data.periods.end
              }, true);
          },

          /**
           * Redraw timeline
           */
          redraw: function ()
          {
            $scope.self.timeline.redraw();
          },

          isAdded: function ()
          {
            // return $('.timeline-event-content')
            //            .contents()
            //            .filter(function ()
            //            {
            //              return this.nodeValue == 'New'
            //            }).length;
            return $('.state-new').length;
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

        function wish(id)
        {
          var deferred = $q.defer(),
            count = 0,
            end = moment().add(1, 'years').unix();

          Slots.wishes(
            {
              id: id,
              start: 255600,
              end: end
            }).then(
            function (results)
            {
              angular.forEach(
                results,
                function (slot)
                {
                  if (slot.start == 255600 &&
                    slot.end == end &&
                    slot.count != null)
                  {
                    count = slot.count;
                  }
                }
              );

              deferred.resolve({count: count});
            }
          );

          return deferred.promise;
        }

        function wisher(id)
        {
          wish(id)
            .then(
              function (wish)
              {
                $scope.wish = wish.count;
                $rootScope.groupWish = $scope.wish;

                $scope.popover = {
                  id: id,
                  wish: wish.count
                };
              }
            );
        }

        $scope.$watch(function ()
          {
            return $scope.timeline.current.group;
          },
          function (currentTeamId)
          {
            wisher(currentTeamId);
          });


        /**
         * Timeliner listener
         */
        $rootScope.$on(
          'timeliner',
          function ()
          {
            var periods = {
              start: new Date(arguments[1].start).getTime(),
              end: new Date(arguments[1].end).getTime()
            };

            if (periods.start == periods.end)
            {
              periods.end = moment(
                new Date(arguments[1].end)
              )
                .add(1, 'days')
                .valueOf();
            }

            var shownRangeDate = moment(periods.start);
            $scope.timeline.current.day = shownRangeDate.format("DDD");
            $scope.timeline.current.week = shownRangeDate.week();
            $scope.timeline.current.month = (shownRangeDate.month() + 1);
            $scope.timeline.current.year = shownRangeDate.year();

            $scope.timeliner.load(periods);
          }
        );

        $rootScope.$on('resetTimeline', function ()
        {
          if($scope.timeline.range)
          {
            $scope.timeliner.render(
              {
                start: $scope.timeline.range.start,
                end: $scope.timeline.range.end
              }, true);
          }
        });

        /**
         * Gets Aggs and the wish
         * @param periods
         * @returns {*}
         */
        var groupSlots = function (periods)
        {
          var aggs = Slots.aggs({
            id: $scope.timeline.current.group,
            start: periods.start,
            end: periods.end,
            month: $scope.timeline.current.month
          });

          var wishes = Slots.wishes(
            {
              id: $scope.timeline.current.group,
              start: $scope.data.periods.start / 1000,
              end: $scope.data.periods.end / 1000
            });

          return $q.all([aggs, wishes])
            .then(
              function (data)
              {
                return ({aggs: data[0], wishes: data[1]});
              }
            );
        };

        /**
         * Handle new requests for timeline
         */
        $scope.requestTimeline = function (section)
        {
          CurrentSelection.local = $scope.timeline.current.group;
          var periods = {
            start: ($scope.data.periods.start / 1000),
            end: ($scope.data.periods.end / 1000)
          };

          Teams.getTeamTelephoneOptions($scope.timeline.current.group)
            .then(function (options)
            {
              fetchTeamTimelineData(section, periods);
            });
        };

        /**
         * Fetch timeline data per team
         * @param section group or members
         */
        function fetchTeamTimelineData(section, periods)
        {
          switch (section)
          {
            case 'group':
              $scope.timeline.current.layouts.group = !$scope.timeline.current.layouts.group;

              if ($scope.timeline.current.layouts.members && !$scope.timeline.current.layouts.group)
              {
                $scope.timeline.current.layouts.members = false;
              }

              if ($scope.timeline.current.layouts.group)
              {
                $rootScope.statusBar.display($rootScope.ui.login.loading_Group);

                groupSlots(periods)
                  .then(function (data)
                  {
                    $scope.data.aggs = data.aggs;
                    $scope.data.aggs.wishes = data.wishes;
                    $scope.timeliner.render({start: $scope.data.periods.start, end: $scope.data.periods.end});
                    $rootScope.statusBar.off();
                  });
              }
              else
              {
                delete $scope.data.aggs;
                $scope.timeliner.render({start: $scope.data.periods.start, end: $scope.data.periods.end});
              }
              break;

            case 'members':
              $scope.timeline.current.layouts.members = !$scope.timeline.current.layouts.members;

              if ($scope.timeline.current.layouts.members && !$scope.timeline.current.layouts.group)
              {
                $scope.timeline.current.layouts.group = true;
              }

              if ($scope.timeline.current.layouts.members)
              {
                $rootScope.statusBar.display($rootScope.ui.login.loading_Members);
                Teams.getSingle($scope.timeline.current.group)
                     .then(function (membersGroup)
                           {
                             return Slots.members($scope.timeline.current.group, periods, membersGroup);
                           })
                     .then(function (members)
                           {
                             if (!members.length)
                             {
                               $scope.timeline.current.layouts.members = false;
                               $rootScope.notifier.info($rootScope.ui.agenda.noMembers);
                             }

                             $scope.data.members = members;
                             $scope.timeliner.render({start: $scope.data.periods.start, end: $scope.data.periods.end});
                             $rootScope.statusBar.off();
                           });
              }
              else
              {
                delete $scope.data.members;
                $scope.timeliner.render({start: $scope.data.periods.start, end: $scope.data.periods.end});
              }
              break;
            default:
              $scope.timeliner.load({start: $scope.data.periods.start, end: $scope.data.periods.end});
          }
        }

        /**
         * Timeline get ranges
         */
        $scope.timelineGetRange = function (props)
        {
          function updateRange(range)
          {
            $scope.timeline.range = {
              start: new Date(range.start).toString(),
              end: new Date(range.end).toString()
            };

            if ($scope.timeline.main)
            {
              $scope.daterange = {
                start: Dater.readable.date(new Date(range.start).getTime()),
                end: Dater.readable.date(new Date(range.end).getTime())
              };
            }
          }

          if (props.byUser)
          {
            $scope.$apply(updateRange(props));
          }
          // if not by user, we're probably in a digest cycle, don't use $apply
          else
          {
            updateRange(props);
          }
        };

        /**
         * Init timeline
         */
        if ($scope.timeline)
        {
          $scope.timeliner.init();
        }

        /**
         * Get information of the selected slot
         */
        $scope.selectedSlot = function (props)
        {
          var selectedItem = visDataSet.get(props.items[0]);

          $scope.original = {
            start: selectedItem.start,
            end: selectedItem.end,
            recursive: selectedItem.recursive,
            state: selectedItem.state
          };

          if ($scope.timeline.main)
          {
            $rootScope.$broadcast('resetPlanboardViews');
          }
          else
          {
            /**
             * TODO (Convert to resetview?)
             */
            $scope.forms = {
              add: false,
              edit: true
            };
          }

          if (selectedItem.itemType)
          {
            if ($scope.timeline.main)
            {
              switch (selectedItem.itemType)
              {
                case 'slot':
                  $scope.views.slot.edit = true;
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

            $scope.slot = {
              start: {
                date: moment(selectedItem.start).format(config.app.formats.date),
                time: moment(selectedItem.start).format(config.app.formats.time),
                datetime: convertDateTimeToLocal(selectedItem.start)
              },
              end: {
                date: moment(selectedItem.end).format(config.app.formats.date),
                time: moment(selectedItem.end).format(config.app.formats.time),
                datetime: convertDateTimeToLocal(selectedItem.end)
              },
              state: selectedItem.state,
              recursive: selectedItem.recursive,
              id: selectedItem.id
            };

            if(selectedItem.groupName)
            {
              $scope.slot.groupName = selectedItem.groupName;
            }
            $scope.showDuration();

            /**
             * TODO (Check if this can be combined with switch later on!)
             *
             * Set extra data based slot type for inline form
             */
            if ($scope.timeline.main)
            {
              switch (selectedItem.itemType)
              {
                case 'group':
                  $scope.slot.diff = selectedItem.diff;
                  $scope.slot.group = selectedItem.group;
                  break;

                case 'wish':
                  $scope.slot.wish = selectedItem.wish;
                  $scope.slot.group = selectedItem.group;
                  $scope.slot.groupId = selectedItem.groupId;
                  break;

                case 'member':
                  $scope.slot.member = selectedItem.mid;
                  break;
              }
            }
          }
          return selectedItem;
        };


        /**
         * Timeline on select
         */
        $scope.timelineOnSelect = function (props)
        {
          var groupId;
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

          groupId = visDataSet.get(props.items[0]).group;

          if (newSlot.length)
          {
            // if new slot, always select only that slot
            $scope.self.timeline.setSelection(newSlot[0]);
            return;
          }
          // don't allow deletion if not own planning
          // other groups have a hyperlink
          else if (groupId && groupId.match('href='))
          {
            $scope.self.timeline.setOptions({
              editable: {
                remove: false,
                updateTime: false
              }
            });
            $scope.self.timeline.setSelection(props.items[0]);
          }
          // if not a planner, the others don't have a hyperlink
          // check for locale strings in groupId
          // (will break if someone's name matches)
          // TODO: this is silly, use an exposed attribute with visJS ASAP
          else if ($scope.currentUser
            && $scope.currentUser.rolenumber > 1
            && groupId
            && !groupId.match($rootScope.ui.planboard.myPlanning)
            && !groupId.match($rootScope.ui.planboard.myWeeklyPlanning)
            && !groupId.match($rootScope.ui.planboard.planning)
            && !groupId.match($rootScope.ui.planboard.weeklyPlanning))
          {
            $scope.self.timeline.setOptions({
              editable: {
                remove: false,
                updateTime: false
              }
            });
            $scope.self.timeline.setSelection(props.items[0]);
          }
          else
          {
            $scope.self.timeline.setOptions({
              editable: {
                remove: true,
                updateTime: true
              }
            });

          }

          $scope.$apply(
            function ()
            {
              $scope.selectedOriginal = $scope.selectedSlot(props);
            }
          );
        };

        /**
         * Change division
         */
        //$scope.changeDivision = function ()
        //{
        //  _.each(
        //    $scope.divisions,
        //    function (division)
        //    {
        //      $scope.groupPieHide[division.id] = false
        //    }
        //  );
        //
        //  if ($scope.timeline.current.division !== 'all')
        //  {
        //    $scope.groupPieHide[$scope.timeline.current.division] = true;
        //  }
        //
        //  $scope.timeliner.render(
        //    {
        //      start: $scope.timeline.range.start,
        //      end: $scope.timeline.range.end
        //    }
        //  );
        //};

        /**
         * Group aggs barCharts toggler
         */
        $scope.barCharts = function ()
        {
          $scope.timeline.config.bar = !$scope.timeline.config.bar;

          $scope.timeliner.render(
            {
              start: $scope.timeline.range.start,
              end: $scope.timeline.range.end
            }
          );
        };

        /**
         * Timeline legenda toggler
         */
        $scope.showLegenda = function ()
        {
          $scope.timeline.config.legendarer = !$scope.timeline.config.legendarer;
        };


        /**
         * Alter legenda settings
         */
        $scope.alterLegenda = function (legenda)
        {
          $scope.timeline.config.legenda = legenda;

          $scope.timeliner.render(
            {
              start: $scope.timeline.range.start,
              end: $scope.timeline.range.end
            }
          );
        };

        /**
         * Update reachability status logged user
         * @param userName of the user
         */
        var updateLoggedUser = function (userName)
        {
          if (userName == $rootScope.app.resources.uuid)
          {
            Profile.fetchUserData(userName);
          }
        };

        /**
         * Add prefixed availability periods in agenda
         */
        $scope.setAvailability = function (availability, period)
        {
          var now = Math.abs(Math.floor(moment().valueOf() / 1000)),
            hour = 60 * 60;

          var periods = {
            start: now,
            end: Number(now + period * hour),
            state: (availability) ? 'com.ask-cs.State.Available' : 'com.ask-cs.State.Unavailable'
          };

          var values = {
            start: periods.start,
            end: periods.end,
            recursive: false,
            text: periods.state
          };

          $rootScope.statusBar.display($rootScope.ui.agenda.addTimeSlot);

          Slots.add(values, $scope.timeline.user.id)
               .then(
                 function (result)
                 {
                   Store('environment').remove('setPrefixedAvailability');

                   $rootScope.$broadcast('resetPlanboardViews');

                   if (result.error)
                   {
                     $rootScope.notifier.error($rootScope.ui.agenda.errorAdd);
                     console.warn('error ->', result);
                   }
                   else
                   {
                     updateLoggedUser($scope.timeline.user.id);

                     $rootScope.notifier.success($rootScope.ui.agenda.slotAdded);
                   }

                   $scope.timeliner.refresh();

                   $rootScope.planboardSync.start();
                 }
               );
        };


        /**
         * Listen for incoming prefixed availability changes
         */
        if ($location.search().setPrefixedAvailability)
        {
          var options = Store('environment').get('setPrefixedAvailability');

          $scope.setAvailability(options.availability, options.period);
        }

        /**
         * Event by editing a slot
         * @param event
         */
        //$scope.setPositionSingleClick = function(event)
        //{
        //  setPositionSlotForm(event);
        //};

        var getDateTimeFromPicker = function (date)
        {
          if (typeof(date) == 'undefined' || date == null || date == '') return "";

          var tmpDate = new Date(date);

          var offset = tmpDate.getTimezoneOffset();

          var newDate = moment(tmpDate).add(offset, 'minutes');

          return newDate.toISOString();
        };

        /**
         * Show the duration of the slot
         */

        /**
         * Set the end date depending on the start date
         * @param startDate
         */
        $scope.setEndDate = function (startDate)
        {
          $scope.slot.end.date = startDate;
        };

        /**
         * Set the end time depending on the start time
         * @param startDate
         */
        $scope.setEndTime = function (startDate, startTime)
        {
          var dateFormat = 'DD-MM-YYYY',
            timeFormat = 'HH:mm';

          $scope.slot.end.time = moment(startDate + " " + startTime,
                                        dateFormat + " " + timeFormat).add(6, 'hours');
          $scope.slot.end.datetime = moment(startDate + " " + startTime,
                                            dateFormat + " " + timeFormat).add(6, 'hours').toDate();

          $scope.slot.end.date = $scope.slot.end.time.format(dateFormat);
          $scope.slot.end.time = $scope.slot.end.time.format(timeFormat);
        };

        /**
         * Add slot trigger start view
         */
        $scope.timelineOnAdd = function (form, slot, item, callback)
        {
          $rootScope.planboardSync.clear();
          var values, groupId, recursive;
          var now = moment().valueOf(),
            nowStamp = Math.abs(Math.floor(now / 1000));

          /**
           * Make view for new slot
           */
          if (!form)
          {
            //can not add new slots in the past!!
            if (moment(item.start) < now)
            {
              callback(null);

              if (newSlot.length)
              {
                visDataSet.remove(newSlot[0]);
                newSlot = [];
                $scope.timeliner.refresh();
              }
            }
            if(/<\/?[^>]*>/.test(item.group))
            {
              callback(null);
              return;
            }

            values = item;

            if (values.recursive ||
              values.group.match($rootScope.ui.planboard.weeklyPlanning) ||
              values.group === $rootScope.ui.planboard.myWeeklyPlanning ||
              (new Date(values.start).getTime() >= now && new Date(values.end).getTime() > now))
            {
              // cancel adding if not own planning
              groupId = item.group;
              // other groups have a hyperlink
              if (groupId && groupId.match('href='))
              {
                callback(null);
                return;
              }

              //cancel if 'empty', used in profile timeline to add empty row
              if (groupId === 'empty')
              {
                callback(null);
                return
              }

              // if not a planner, the others don't have a hyperlink
              // check for locale strings in groupId
              // (will break if someone's name matches)
              // TODO: this is silly, use an exposed attribute with visJS ASAP
              if ($scope.currentUser && $scope.currentUser.rolenumber > 1 &&
                groupId && !groupId.match($rootScope.ui.planboard.myPlanning) &&
                !groupId.match($rootScope.ui.planboard.myWeeklyPlanning) &&
                !groupId.match($rootScope.ui.planboard.planning) &&
                !groupId.match($rootScope.ui.planboard.weeklyPlanning))
              {
                callback(null);
                return;
              }

              //check an item in the newSlot and remove it if there's already an old item
              if (newSlot.length >= 1)
              {
                visDataSet.remove(newSlot[0]);
                newSlot.splice(0, 1);
              }

              newSlot.push(item.id);

              //update values with the last drawn item in the timeline
              values = item;
              var element = angular.element(values.content);

              $scope.$apply(
                function ()
                {
                  var id = item.id;

                  // Insert element, fixes IE9 not displaying on new slot.
                  // The span.secret gives no height, and changing it messes up other slots.
                  // This should only be applied once.
                  // angular.element('.timeline-event-selected > .timeline-event-content > span.secret')
                  //   .before("<div class='time-tip' style='padding: 0;'></div>");

                  if ($scope.timeline.main)
                  {
                    $rootScope.$broadcast('resetPlanboardViews');

                    $scope.views.slot.add = true;
                  }
                  else
                  {
                    $scope.forms = {
                      add: true,
                      edit: false
                    };
                  }

                  // Check if groupId matches selected locale week strings
                  if (groupId &&
                    ((groupId === $rootScope.ui.planboard.myWeeklyPlanning) ||
                    groupId.match($rootScope.ui.planboard.weeklyPlanning)))
                  {
                    recursive = true;
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
                    recursive: recursive,
                    state: 'com.ask-cs.State.Available'
                  };

                  if(! item.type || item.type !== 'range')
                  {
                    $scope.setEndDate($scope.slot.start.date);
                    $scope.setEndTime($scope.slot.start.date, $scope.slot.start.time);
                    item.end = $scope.slot.end.datetime;
                  }

                  item.content = Sloter.tooltip({
                                                  start: moment(item.start).unix(),
                                                  end: moment(item.end).unix()
                                                }, true);

                  $scope.showDuration();

                  $scope.original = {
                    start: new Date(values.start),
                    end: new Date(values.end),
                    recursive: $scope.slot.recursive,
                    state: $scope.slot.state
                  };

                  item.state = $scope.slot.state;
                  item.recursive = recursive;
                  item.className = $scope.timeline.config.states[item.state].className;
                  item.className += ' has-slot-tooltip';

                  // make sure that the user can modify the element
                  $scope.self.timeline.setOptions({
                    editable: {
                      remove: true,
                      updateTime: true
                    }
                  });

                  //callback(item);
                  //update visDataSet with the new item
                  visDataSet.add(item);

                  $timeout(function ()
                  {
                    $scope.self.timeline.setSelection(id);
                  });

                });
            }
            else
            {
              var errorMessage = (/#timeline/.test(values.group)) ?
                $rootScope.ui.agenda.notAuth :
                $rootScope.ui.agenda.pastAdding;

              $rootScope.notifier.error(errorMessage);

              $rootScope.$apply();
            }
          }
          else/**
           * Add new slot through the form
           */
          {
            if (! slotDatesValid(slot))
            {
              $rootScope.notifier.error($rootScope.ui.task.startLaterThanEnd);
              return;
            }

            var start = ($rootScope.browser.mobile) ?
              Math.abs(Math.floor(new Date(slot.start.datetime).getTime() / 1000)) :
              moment(slot.start.date +' '+ slot.start.time, config.app.formats.datetime).unix();

            var end = ($rootScope.browser.mobile) ?
              Math.abs(Math.floor(new Date(slot.end.datetime).getTime() / 1000)) :
                  moment(slot.end.date +' '+ slot.end.time, config.app.formats.datetime).unix();


            if (typeof start == "undefined" ||
              isNaN(start) ||
              start == 0 ||
              typeof end == "undefined" ||
              isNaN(end) ||
              end == 0)
            {
              $rootScope.notifier.error($rootScope.ui.errors.timeline.invalidTimeslot);

              // Dont call the refresh; keep the timeslot update box open so it can be corrected
              //$scope.timeliner.refresh();
            }
            else if (start < nowStamp && end < nowStamp && slot.recursive == false)
            {
              $rootScope.notifier.error($rootScope.ui.agenda.pastAdding);

              $scope.timeliner.refresh();
            }
            else
            {
              if (start < nowStamp && ! slot.recursive)
              {
                start = nowStamp;
              }

              values = {
                start: start,
                end: end,
                recursive: (slot.recursive) ? true : false,
                text: slot.state
              };

              /**
               * Two minutes waiting time to take an action
               */
              if ((values.start * 1000) + 60000 * 2 < now && ! values.recursive)
              {
                $rootScope.notifier.error($rootScope.ui.agenda.pastAdding);

                $scope.timeliner.refresh();
              }
              else
              {
                $rootScope.statusBar.display($rootScope.ui.agenda.addTimeSlot);

                Slots.add(
                  values,
                  $scope.timeline.user.id
                ).then(
                  function (result)
                  {
                    $rootScope.$broadcast('resetPlanboardViews');

                    if (result.error)
                    {
                      $rootScope.notifier.error($rootScope.ui.agenda.errorAdd);
                      console.warn('error ->', result);
                    }
                    else
                    {
                      updateLoggedUser($scope.timeline.user.id);
                      $rootScope.notifier.success($rootScope.ui.agenda.slotAdded);
                    }
                    newSlot = [];
                    $scope.timeliner.refresh();

                    $rootScope.planboardSync.start();
                  }
                );
              }
            }
          }
        };

        /* Check if startdate is before the enddate
         * @param slot The current selected slot
         * @returns {boolean} startdate is before the enddate returns true
         */
        function convertDateTimeToLocal(d)
        {
          //var d1 = new Date(d);
          //d1.setMinutes(d1.getMinutes() - d1.getTimezoneOffset());
          ////return d1.toISOString().replace("Z", "");
          return moment(d).toDate();
        }

        /**
         * Timeline on change
         */
        $scope.timelineOnChange = function (direct, original, slot, changed)
        {
          $rootScope.planboardSync.clear();

          var values = visDataSet.get($scope.self.timeline.getSelection()[0]);

          if (!direct)
          {
            changed = {
              start: values.start,
              end: values.end,
              content: angular.fromJson(values.content.match(/<span class="secret">(.*)<\/span>/)[1])
            };
          }
          else
          {
            changed = {
              start: ($rootScope.browser.mobile) ?
                new Date(slot.start.datetime).getTime() :
                +moment(slot.start.date +' '+ slot.start.time, config.app.formats.datetime),
              end: ($rootScope.browser.mobile) ?
                new Date(slot.end.datetime).getTime() :
                +moment(slot.end.date +' '+ slot.end.time, config.app.formats.datetime),
              recursive: slot.recursive,
              state: slot.state
            };

            // Invalid timeslot?
            //console.log(changed.start);
            //console.log(changed.end);
            if (typeof changed.start == "undefined" || isNaN(changed.start) || changed.start == 0 || typeof changed.end == "undefined" || isNaN(changed.end) || changed.end == 0)
            {
              $rootScope.notifier.error($rootScope.ui.errors.timeline.invalidTimeslot);

              // Dont call the refresh; keep the timeslot update box open so it can be corrected
              //$scope.timeliner.refresh();
              return;
            }

            // Swapped time inputs?
            if (changed.end <= changed.start)
            {
              $rootScope.notifier.error($rootScope.ui.task.startLaterThanEnd);
              return;
            }
          }

          original.start = new Date(original.start).getTime();
          original.end = new Date(original.end).getTime();

          var now = moment().valueOf();

          var callback = function (result, messages, added)
          {
            $rootScope.$broadcast('resetPlanboardViews');

            if (result.error)
            {
              $rootScope.notifier.error(messages.error);
              console.warn('error ->', result);
            }
            else
            {
              !added && $rootScope.notifier.success(messages.success);

              added && add(added);
            }

            $scope.timeliner.refresh();

            $rootScope.planboardSync.start();
          };

          var change = function (changed, added)
          {
            $rootScope.statusBar.display($rootScope.ui.agenda.changingSlot);

            Slots.change(
              $scope.original,
              changed,
              (slot && slot.member) ? slot.member : $scope.timeline.user.id
            ).then(
              function (result)
              {
                updateLoggedUser($scope.timeline.user.id);

                callback(
                  result,
                  {
                    error: $rootScope.ui.agenda.errorChange,
                    success: $rootScope.ui.agenda.slotChanged
                  },
                  added
                );
              }
            );
          };

          var add = function (options)
          {
            Slots.add(
              options,
              $scope.timeline.user.id
            ).then(
              function (result)
              {
                updateLoggedUser($scope.timeline.user.id);
                callback(
                  result,
                  {
                    error: $rootScope.ui.agenda.errorAdd,
                    success: $rootScope.ui.agenda.slotChanged
                  }
                );
              }
            );
          };

          var changeAndAdd = function (changed, added)
          {
            change(
              changed,
              {
                start: Math.abs(Math.floor(added.start / 1000)),
                end: Math.abs(Math.floor(added.end / 1000)),
                recursive: (added.recursive) ? true : false,
                text: added.state
              }
            );
          };

          var notAllowedForPast = function ()
          {
            $rootScope.notifier.error($rootScope.ui.agenda.pastChanging);

            $scope.timeliner.refresh();
          };

          // It is already blocked at time-line level but for in case
          if (/#timeline/.test(values.group))
          {
            $rootScope.notifier.error($rootScope.ui.agenda.notAuth);

            $scope.timeliner.refresh();
          }
          else
          {
            if (changed.recursive)
            {
              change(changed);
            }
            else
            {
              if (changed.start < now && changed.end < now)
              {
                notAllowedForPast();
                return;
              }

              if (changed.start > now && changed.end > now)
              {
                if (original.start < now && original.end < now)
                {
                  notAllowedForPast();
                  return;
                }

                if (original.start < now && original.end > now)
                {
                  changeAndAdd(
                    {
                      start: $scope.original.start,
                      end: now,
                      recursive: $scope.original.recursive,
                      state: $scope.original.state
                    },
                    {
                      start: changed.start + (now - $scope.original.start),
                      end: changed.end,
                      recursive: changed.recursive,
                      state: changed.state
                    }
                  );
                }

                if (original.start > now && original.end > now)
                {
                  change(changed);
                }
              }

              if (changed.start < now && changed.end > now)
              {
                if (original.start < now && original.end < now)
                {
                  notAllowedForPast();
                  return;
                }

                if (original.start < now && original.end > now)
                {
                  if (changed.state == original.state)
                  {
                    change(
                      {
                        start: $scope.original.start,
                        end: changed.end,
                        recursive: changed.recursive,
                        state: changed.state
                      }
                    );
                  }
                  else
                  {
                    changeAndAdd(
                      {
                        start: $scope.original.start,
                        end: now,
                        recursive: $scope.original.recursive,
                        state: $scope.original.state
                      },
                      {
                        start: now,
                        end: changed.end,
                        recursive: changed.recursive,
                        state: changed.state
                      }
                    );
                  }
                }

                if (original.start > now && original.end > now)
                {
                  change(
                    {
                      start: now,
                      end: changed.end,
                      recursive: changed.recursive,
                      state: changed.state
                    }
                  );
                }
              }
            }
          }
        };


        /* Wish section */

        /**
         * Set wish
         */
        $scope.wisher = function (slot)
        {
          var wishAmount = parseInt(slot.wish);
          if(! (wishAmount >= 0 && wishAmount <= 30) ) return $rootScope.notifier.error($rootScope.ui.validation.wish.integer);

          $rootScope.statusBar.display($rootScope.ui.agenda.changingWish);

          var formattedSlot = {
            id: slot.groupId,
            start: ($rootScope.browser.mobile) ?
              new Date(slot.start.datetime).getTime() / 1000 :
              moment(slot.start.date +' '+ slot.start.time, config.app.formats.datetime).unix(),
            end: ($rootScope.browser.mobile) ?
              new Date(slot.end.datetime).getTime() / 1000 :
              moment(slot.end.date +' '+ slot.end.time, config.app.formats.datetime).unix(),
            recursive: (!_.isUndefined(slot.recursive)),
            wish: slot.wish
          };

          Slots.setWish(formattedSlot)
               .then(
                 function (result)
                 {
                   $rootScope.$broadcast('resetPlanboardViews');

                   if (result.error)
                   {
                     $rootScope.notifier.error($rootScope.ui.agenda.wisher);
                     console.warn('error ->', result);
                   }
                   else
                   {
                     $rootScope.notifier.success($rootScope.ui.agenda.wishChanged);
                   }

                   $scope.timeliner.refresh();
                 }
               );
        };

        /**
         *
         * @param id teamId
         * @param wish wish amount
         */
        $scope.saveWish = function (id, wish)
        {
          $rootScope.statusBar.display($rootScope.ui.planboard.changingWish);

          Slots.setWish({
                          id: id,
                          start: 255600,
                          end: 860400,
                          recursive: true,
                          wish: wish
                        }).then(function (result)
                                {
                                  $rootScope.statusBar.off();

                                  if (result.error)
                                  {
                                    $rootScope.notifier.error($rootScope.ui.errors.groups.saveWish);

                                    console.warn('error ->', result);
                                  }
                                  else
                                  {
                                    $rootScope.notifier.success($rootScope.ui.planboard.wishChanged);
                                  }
                                  wisher(id);
                                  getWishes();
                                });

        };

        function wish(id)
        {
          var deferred = $q.defer(),
              count = 0;

          Slots.wishes(
            {
              id: id,
              start: 255600,
              end: 860400
            }).then(
            function (results)
            {
              angular.forEach(
                results,
                function (slot)
                {
                  if (slot.start == 255600 &&
                    slot.end == 860400 &&
                    slot.count != null)
                  {
                    count = slot.count;
                  }
                }
              );

              deferred.resolve({count: count});
            }
          );

          return deferred.promise;
        }

        /**
         * Get wishes
         */
        function getWishes()
        {
          if ($scope.timeline.current.layouts.group)
          {
            $rootScope.statusBar.display($rootScope.ui.message.getWishes);

            Slots.wishes(
              {
                id: $scope.timeline.current.group,
                start: $scope.data.periods.start / 1000,
                end: $scope.data.periods.end / 1000
              }).then(
              function (wishes)
              {
                $rootScope.statusBar.off();

                $scope.data.aggs.wishes = wishes;

                $scope.timeliner.render(
                  {
                    start: $scope.timeline.range.start,
                    end: $scope.timeline.range.end
                  }, true);
              }
            );
          }
        }
      });
  }
);

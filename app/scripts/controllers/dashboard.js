define(['controllers/controllers'], function (controllers) {
  'use strict';

  controllers.controller('dashboard', function ($scope, $rootScope, $q, $window, $location, Dashboard, Slots, Dater, Settings, Profile, Groups, Announcer, Network, $timeout, Store) {
    $rootScope.notification.status = false;

    $rootScope.fixStyles();

    $scope.loading = {
      pies: true,
      alerts: true,
      smartAlarm: true
    };

    $scope.more = {
      status: false,
      text: $rootScope.ui.dashboard.showMore
    };

    $scope.synced = {
      alarms: new Date().getTime(),
      pies: new Date().getTime()
    };

    /**
     * TODO: Check somewhere that user-settings widget-groups are synced with the
     * real groups list and if a group is missing in settings-groups add by default!
     */
    var groups = Store('network').get('groups');

    var selection = {};

    var settings = angular.fromJson(Store('user').get('resources').settingsWebPaige);

    _.each(settings.app.widgets.groups, function (value, group) {
      selection[group] = value
    });

    _.each(groups, function (group) {
      if (!selection[group.uuid]) {
        selection[group.uuid] = {
          divisions: ($rootScope.StandBy.config.timeline.config.divisions.length > 0),
          status: false
        };
      }
    });

    var filteredGroups = [];

    _.each(groups, function (group) {
      if (group.uuid != 'all') {
        filteredGroups.push(group);
      }
    });


    $scope.loadingPresence = true;

    var presencePerGroup = function (present) {
      var presentGroups = {},
          sortedGroups = [],
          otherGroups = [];

      var groupOrder = ["Hoofd BHV","BHV Ploegleider","BHV'er","EHBO'er"];

      _.each(present, function (member){
        if (!member.resources.groups) {
            if (typeof presentGroups["ungrouped"] == 'undefined'){
              presentGroups["ungrouped"] = [];
            }

            presentGroups["ungrouped"].push(member);
        }
        else {
          _.each(groups, function (group){
            if (member.resources.groups[0].uuid === group.uuid){
              if (typeof presentGroups[group.name] == 'undefined'){
                presentGroups[group.name] = [];
              }

              member.resources.groups[0].name = group.name;

              presentGroups[group.name].push(member);
            }
          });
        }
      });

      _.each(presentGroups, function (group, name){
        if (groupOrder.indexOf(name) !== -1) {
          sortedGroups[groupOrder.indexOf(name)] = group;
        }
        else {
          otherGroups.push(group);
        }
      });

      otherGroups.sort();

      _.each(otherGroups, function (group){
        sortedGroups.push(group);
      });

      sortedGroups = _.compact(sortedGroups);

      return sortedGroups;
    }

    var presencePerAvailability = function (present) {
      var sortedGroups = [],
          i;

      var stateClasses = ['memberStateAvailable', 'memberStateOffline', 'memberStateBusy'];

      _.each(present, function (member){
        _.each($scope.availability.members, function (list, availability) {
          switch(availability){
            case 'available':
            i = 0;
            break;
            case 'possible':
            i = 1;
            break;
            case 'unavailable':
            i = 2;
            break;
          }
          _.each(list, function (_member) {
            if (member.uuid === _member.id) {
              if(typeof sortedGroups[i] == 'undefined'){
                sortedGroups[i] = []
              }
              member.availabilityClass = stateClasses[i];
              sortedGroups[i].push(member);
            };
          })
        });
      });

      return sortedGroups;
    }

    $scope.checkPresence = function () {
      var members = Store('network').get('unique');
      var present = [],
          absent = [];

      _.each(members, function(member){
        if (member.resources){

          member.resources.groups = Groups.getMemberGroups(member.uuid);

          if (member.resources.groups && member.resources.groups.length > 1) {

            member.resources.groups.sort(function (a, b) {
              if (a.name.toUpperCase() > b.name.toUpperCase()) {
                return 1;
              }
              if (a.name.toUpperCase() < b.name.toUpperCase()) {
                return -1;
              }
              return 0;
            });

            member.resources.groups = member.resources.groups.slice(0,1);
          }

          if (member.resources.currentPresence){
            present.push(member);
          }
          else {
            absent.push(member);
          }
        }
      });

      // TODO: check config from profile?
      $scope.present = presencePerAvailability(present);
      $scope.absent = presencePerAvailability(absent);
      $scope.loadingPresence = false;
    };

    $rootScope.intervals = [];

    $rootScope.intervals.push(
      $window.setInterval(
        function () {
          Network.population().then($scope.checkPresence);
      }, $rootScope.StandBy.config.timers.ALARM_SYNC)
    );

    $scope.popover = {
      groups: filteredGroups,
      selection: selection,
      divisions: ($rootScope.StandBy.environment.divisions.length > 0)
    };

    $scope.checkAnyPies = function () {
      var ret = true;

      $scope.loading.pies = false;

      _.each(settings.app.widgets.groups, function (group) {
        if (group.status === true) {
          ret = false;
        }
      });

      return ret;
    };

    $scope.loadingPies = true;

    function getOverviews() {
      $scope.loadingPies = true;

      if (!$scope.checkAnyPies()) {
        Dashboard.pies().then(function (pies) {
          $scope.loadingPies = false;

          if (pies.error) {
            $rootScope.notifier.error($rootScope.ui.errors.dashboard.getOverviews);
            console.warn('error ->', pies.error);
          } else {
            $scope.shortageHolders = {};

            $scope.loading.pies = false;

            $scope.periods = {
              start: pies[0].weeks.current.start.date,
              end: pies[0].weeks.next.end.date
            };

            _.each(pies, function (pie) {
                // Check whether if it is an array what data processor gives back
                if (pie.weeks.current.state instanceof Array) {
                  pie.weeks.current.state = pie.weeks.current.state[0];
                }

                if (pie.weeks.current.state.diff === null) pie.weeks.current.state.diff = 0;
                if (pie.weeks.current.state.wish === null) pie.weeks.current.state.wish = 0;

                if (pie.weeks.current.state.wish == 0) {
                  pie.weeks.current.state.cls = 'disabled';
                } else {
                  if (pie.weeks.current.state.diff > 0) {
                    pie.weeks.current.state.cls = 'more';
                  } else if (pie.weeks.current.state.diff === 0) {
                    pie.weeks.current.state.cls = 'even';
                  } else if (pie.weeks.current.state.diff < 0) {
                    pie.weeks.current.state.cls = 'less';
                  }
                }

                pie.weeks.current.state.start = (pie.weeks.current.state.start !== undefined) ?
                  new Date(pie.weeks.current.state.start * 1000)
                    .toString($rootScope.StandBy.config.formats.datetime) :
                  $rootScope.ui.dashboard.possiblyAvailable;

                pie.weeks.current.state.end = (pie.weeks.current.state.end !== undefined) ?
                  new Date(pie.weeks.current.state.end * 1000)
                    .toString($rootScope.StandBy.config.formats.datetime) :
                  $rootScope.ui.dashboard.possiblyAvailable;

                pie.shortages = {
                  current: pie.weeks.current.shortages,
                  next: pie.weeks.next.shortages,
                  total: pie.weeks.current.shortages.length + pie.weeks.next.shortages.length
                };

                pie.state = pie.weeks.current.state;

                delete(pie.weeks.current.shortages);
                delete(pie.weeks.current.state);

                $scope.shortageHolders['shortages-' + pie.id] = false;
              }
            );

            $scope.pies = pies;
          }
        }).then(function () {
          _.each($scope.pies, function (pie) {
            pieMaker('weeklyPieCurrent-', pie.id + '-' + pie.division, pie.weeks.current.ratios);
            pieMaker('weeklyPieNext-', pie.id + '-' + pie.division, pie.weeks.next.ratios);
          });

          function pieMaker($id, id, _ratios) {
            $timeout(function () {
              if ($.browser.msie && $.browser.version == '8.0') {
                $('#' + $id + id).html('');
              } else {
                if (document.getElementById($id + id)) {
                  document.getElementById($id + id).innerHTML = '';
                }
              }

              var ratios = [],
                colorMap = {
                  more: '#6cad6c',
                  even: '#e09131',
                  less: '#d34545'
                },
                colors = [],
                xratios = [];

              _.each(_ratios, function (ratio, index) {
                if (ratio !== 0) {
                  ratios.push({
                    ratio: ratio,
                    color: colorMap[index]
                  });
                }
              });

              ratios = ratios.sort(function (a, b) {
                return b.ratio - a.ratio
              });

              _.each(ratios, function (ratio) {
                colors.push(ratio.color);
                xratios.push(ratio.ratio);
              });

              try {
                new Raphael($id + id)
                  .piechart(
                  40, 40, 40,
                  xratios,
                  {
                    colors: colors,
                    stroke: 'white'
                  }
                );
              } catch (e) {
                console.warn(' Raphael error ->', e);
              }

            }, $rootScope.StandBy.config.timers.TICKER);
          }
        });
      } else {
        $rootScope.statusBar.off();
      }
    }

    $timeout(function () {
      getOverviews()
    }, 25);

    function prepareSaMembers(setup) {
      var cached = Store('smartAlarm').get('guard');

      $scope.saMembers = {
        truck: [],
        reserves: []
      };

      $scope.saSynced = cached.synced;

      _.each(setup.selection, function (selection) {
        function translateName(user) {
          return (user !== null) ?
            setup.users[user].name :
            $rootScope.ui.dashboard.notAssigned
        }

        var saClass = (selection.user==null ? 'sa-icon-not-assigned' : null);

        switch (selection.role) {
          case 'bevelvoerder':
            $scope.saMembers.truck.push({
              rank: 1,
              icon: $rootScope.ui.dashboard.alarmRoles.commanderInitial,
              role: $rootScope.ui.dashboard.alarmRoles.commander,
              class: (selection.user==null ? 'sa-icon-not-assigned' : 'sa-icon-commander'),
              name: translateName(selection.user),
              uuid: selection.user
            });
            break;

          case 'chauffeur':
            $scope.saMembers.truck.push({
              rank: 0,
              icon: $rootScope.ui.dashboard.alarmRoles.driverInitial,
              role: $rootScope.ui.dashboard.alarmRoles.driver,
              class: (selection.user==null ? 'sa-icon-not-assigned' : 'sa-icon-driver'),
              name: translateName(selection.user),
              uuid: selection.user
            });
            break;

          case 'manschap.1':
            $scope.saMembers.truck.push({
              rank: 2,
              icon: 'M1',
              role: $rootScope.ui.dashboard.alarmRoles.manpower + ' 1',
              name: translateName(selection.user),
              uuid: selection.user,
              class : saClass
            });
            break;

          case 'manschap.2':
            $scope.saMembers.truck.push({
              rank: 3,
              icon: 'M2',
              role: $rootScope.ui.dashboard.alarmRoles.manpower + ' 2',
              name: translateName(selection.user),
              uuid: selection.user,
              class : saClass
            });
            break;

          case 'manschap.3':
            $scope.saMembers.truck.push({
              rank: 4,
              icon: 'M3',
              role: $rootScope.ui.dashboard.alarmRoles.manpower + ' 3',
              name: translateName(selection.user),
              uuid: selection.user,
              class : saClass
            });
            break;

          case 'manschap.4':
            $scope.saMembers.truck.push({
              rank: 5,
              icon: 'M4',
              role: $rootScope.ui.dashboard.alarmRoles.manpower + ' 4',
              name: translateName(selection.user),
              uuid: selection.user,
              class : saClass
            });
            break;
        }

        $rootScope.StandBy.guard.role = setup.role;

        if (setup.users[$rootScope.StandBy.resources.uuid]) {
          $rootScope.StandBy.guard.currentState = setup.users[$rootScope.StandBy.resources.uuid].state;
        } else {
          Slots.currentState().then(function (state) {
            $rootScope.StandBy.guard.currentState = state.label
          });
        }

        var reserves = {};

        // TODO: Kind of duplicate purpose with states
        var states = ['available', 'unavailable', 'noplanning'];

        _.each(states, function (state) {
          reserves[state] = [];
          _.each(setup.reserves[state], function (member) {
            _.each(member, function (meta, userID) {
              if (meta.role != 0) {
                reserves[state].push({
                  id: userID,
                  name: meta.name,
                  state: meta.state
                });
              }
            });
          });
        });

        $scope.saMembers.reserves = reserves;

        $scope.loading.smartAlarm = false;
      });
    }

    if ($rootScope.StandBy.config.profile.smartAlarm) {
      if (Store('smartAlarm').get('guard').selection) {
        $scope.loading.smartAlarm = false;

        prepareSaMembers(Store('smartAlarm').get('guard'));
      }

      Groups.guardMonitor().then(function () {
        Groups.guardRole().then(function (setup) {
          prepareSaMembers(setup)
        });
      });
    }

    var members = Store('network').get('unique');

    var initGroup;

    groups.unshift({
      'name': $rootScope.ui.dashboard.everyone,
      'uuid': 'all'
    });

    initGroup = 'all';

    $scope.groups = groups;

    $scope.states = $rootScope.StandBy.config.timeline.config.states;

    $scope.states['no-state'] = {
      className: 'no-state',
      label: $rootScope.ui.dashboard.possiblyAvailable,
      color: '#ececec',
      type: $rootScope.ui.dashboard.noPlanning,
      display: false
    };

    $scope.divisions = $rootScope.StandBy.environment.divisions || [];

    if ($scope.divisions.length > 0) {
      if ($scope.divisions[0].id !== 'all') {
        $scope.divisions.unshift({
          id: 'all',
          label: $rootScope.ui.dashboard.allDivisions
        });
      }
    }

    $scope.current = {
      group: initGroup,
      division: 'all'
    };

    $scope.loadingAvailability = true;

    $scope.getAvailability = function (groupID, divisionID) {
      var deferred = $q.defer();

      if (!groupID) {
        groupID = $scope.current.group;
      }

      if (!divisionID) {
        divisionID = $scope.current.division;
      }

      Slots.getMemberAvailabilities(groupID, divisionID).then(function (results) {
        var ordered = {};

        _.each(angular.fromJson(angular.toJson(results.members)), function (slots, id) {
          if (members[id] &&
            (members[id].resources.role != 0 && members[id].resources.role != 4)) {
            var _member = {
              id: id,
              state: (slots.length > 0) ? slots[0].state : 'no-state',
              label: (slots.length > 0) ? $scope.states[slots[0].state].label[0] : '',
              end: (slots.length > 0 && slots[0].end !== undefined) ?
                slots[0].end * 1000 :
                $rootScope.ui.dashboard.possiblyAvailable,
              name: (members && members[id]) ?
                members[id].resources.firstName + ' ' + members[id].resources.lastName :
                id
            };

            if (slots.length > 0) {
              if (!ordered.available)
                ordered.available = [];

              if (!ordered.unavailable)
                ordered.unavailable = [];

              if (slots[0].state == 'com.ask-cs.State.Unreached') {
                ordered.unavailable.push(_member);
              } else if (slots[0].state == 'com.ask-cs.State.Unavailable') {
                ordered.unavailable.push(_member);
              } else {
                if (slots[0].state == 'com.ask-cs.State.Available') {
                  _member.style = 'sa-icon-reserve-available';
                }

                if (slots[0].state == 'com.ask-cs.State.KNRM.BeschikbaarNoord') {
                  _member.style = 'sa-icon-reserve-available-north';
                }

                if (slots[0].state == 'com.ask-cs.State.KNRM.BeschikbaarZuid') {
                  _member.style = 'sa-icon-reserve-available-south';
                }

                if (slots[0].state == 'com.ask-cs.State.KNRM.SchipperVanDienst') {
                  _member.style = 'sa-icon-reserve-available-schipper';
                }

                ordered.available.push(_member);
              }
            } else {
              if (!ordered.possible) {
                ordered.possible = [];
              }

              ordered.possible.push(_member);
            }
          }
        });

        $scope.loadingAvailability = false;

        var sortByEnd = function (a, b) {
          if (a.end < b.end) {
            return -1;
          }

          if (a.end > b.end) {
            return 1;
          }

          return 0;
        };

        if (ordered.hasOwnProperty('available')) {
          ordered.available.sort(sortByEnd);
        }

        if (ordered.hasOwnProperty('unavailable')) {
          ordered.unavailable.sort(sortByEnd);
        }

        var _availables = [];

        _.each(ordered.available, function (available) {
          if (available.state == 'com.ask-cs.State.KNRM.SchipperVanDienst') {
            _availables.push(available);
          }
        });

        _.each(ordered.available, function (available) {
          if (available.state == 'com.ask-cs.State.Available') {
            _availables.push(available);
          }
        });

        _.each(ordered.available, function (available) {
          if (available.state == 'com.ask-cs.State.KNRM.BeschikbaarNoord') {
            _availables.push(available);
          }
        });

        _.each(ordered.available, function (available) {
          if (available.state == 'com.ask-cs.State.KNRM.BeschikbaarZuid') {
            _availables.push(available);
          }
        });

        ordered.available = _availables;

        $scope.availability = {
          members: ordered,
          synced: results.synced * 1000
        };

        deferred.resolve($scope.availability);
      },
      function (results) {
        deferred.reject(results);
      });

      return deferred.promise;
    };

    $scope.getGroupAvailability = function () {
      var deferred = $q.defer();
      $scope.current.division = 'all';

      $scope.getAvailability($scope.current.group, $scope.current.division)
      .then(function (results) {
        deferred.resolve(results);
      },
      function (results) {
        deferred.reject(results);
      });
      return deferred.promise;
    };

    $scope.getDivisionAvailability = function () {
      $scope.getAvailability($scope.current.group, $scope.current.division);
    };

    if ($rootScope.StandBy.config.profile.presence) {
      $q.all([$scope.getGroupAvailability(), Network.population()])
      .then(function(){
        $scope.checkPresence();
      },
      function(){
        // Only getGroupAvailability would reject, try once more
        $scope.getGroupAvailability().then(function(){
          $scope.checkPresence();
        })
      });
    }
    else {
      $scope.getGroupAvailability();
    }


    $scope.saveOverviewWidget = function (selection) {
      $rootScope.statusBar.display($rootScope.ui.settings.saving);

      _.each(selection, function (selected) {
        if (!selected.status) {
          selected.divisions = false;
        }
      });

      Settings.save($rootScope.StandBy.resources.uuid, {
        user: angular.fromJson(Store('user').get('resources').settingsWebPaige).user,
        app: {
          group: angular.fromJson(Store('user').get('resources').settingsWebPaige).app.group,
          widgets: {
            groups: selection
          }
        }
      }).then(function () {
        $rootScope.statusBar.display($rootScope.ui.dashboard.refreshGroupOverviews);

        Profile.get($rootScope.StandBy.resources.uuid, true).then(function () {
          getOverviews()
        });
      });
    };

    $scope.getP2000 = function () {
      Dashboard.p2000().then(function (result) {
        $scope.loading.alerts = false;

        $scope.alarms = result.alarms;

        $scope.alarms.list = $scope.alarms.short;

        $scope.synced.alarms = result.synced;
      });
    };

    $rootScope.alarmSync = {
      start: function () {
        this.id = $window.setInterval(
          function () {
            if ($location.path() == '/dashboard') {
              $scope.$apply(function (scope) {
                scope.getP2000();

                if ($rootScope.StandBy.config.profile.smartAlarm) {
                  if (Store('smartAlarm').get('guard').selection) {
                    console.log('Guard', Store('smartAlarm').get('guard').selection);
                    prepareSaMembers(Store('smartAlarm').get('guard'));
                  }

                  Groups.guardRole().then(function (setup) {
                    prepareSaMembers(setup);
                  });
                } else {
                  scope.getAvailability(scope.current.group);
                }
              });
            }
          }, $rootScope.StandBy.config.timers.ALARM_SYNC);
        $rootScope.intervals.push(this.id);
      },
      clear: function () {
        $window.clearInterval(this.id);
      },
      id: ''
    };

    $rootScope.alarmSync.start();

    $scope.toggle = function (more) {
      $scope.alarms.list = (more) ? $scope.alarms.short : $scope.alarms.long;

      $scope.more.text = (more) ?
        $rootScope.ui.dashboard.showMore :
        $rootScope.ui.dashboard.showLess;

      $scope.more.status = !$scope.more.status;
    };

    // $scope.fixPopoverPos = function () {
    //   setTimeout(function () {
    //     var spanWidth = $('#dashboard .span9').css('width'),
    //       popWidth = $('#dashboard .popover').css('width');

    //     $('.popover').css({
    //       top: $('#dashboardPopoverBtn').css('top'),
    //       left: ((spanWidth.substring(0, spanWidth.length - 2) - popWidth.substring(0, popWidth.length - 2) / 2) + 4)
    //         + 'px'
    //     });
    //   }, $rootScope.StandBy.config.timers.TICKER);
    // };

    if ($rootScope.StandBy.config.profile.smartAlarm) {
      $.ajax({
        url: $rootScope.StandBy.config.profile.p2000.url,
        dataType: 'json',
        success: function (results) {
          $rootScope.statusBar.off();

          var processed = Announcer.process(results, true);

          var result = {
            alarms: processed,
            synced: new Date().getTime()
          };

          $scope.$apply(function () {
            $scope.loading.alerts = false;

            $scope.alarms = result.alarms;

            $scope.alarms.list = $scope.alarms.short;

            $scope.synced.alarms = result.synced;
          });
        },
        error: function () {
          console.log('ERROR with getting p2000 for the first time!');
        }
      });
    } else {
      Dashboard.getCapcodes().then(function (capcodes) {
        var _capcodes = '';

        capcodes = capcodes.sort();

        _.each(capcodes, function (code) {
          _capcodes += code + ', '
        });

        $scope.capcodes = _capcodes.substring(0, _capcodes.length - 2);

        $.ajax({
          url: $rootScope.StandBy.config.profile.p2000.url + '?code=' + capcodes,
          dataType: 'jsonp',
          success: function (results) {
            $rootScope.statusBar.off();

            var processed = Announcer.process(results);

            var result = {
              alarms: processed,
              synced: new Date().getTime()
            };

            $scope.$apply(function () {
              $scope.loading.alerts = false;

              $scope.alarms = result.alarms;

              $scope.alarms.list = $scope.alarms.short;

              $scope.synced.alarms = result.synced;
            });
          },
          error: function () {
            console.log('ERROR with getting p2000 for the first time!');
          }
        });
      });
    }

    $scope.setPrefixedAvailability = function (availability, period) {
      Store('environment').save('setPrefixedAvailability', {
        availability: availability,
        period: period
      });

      $location.path('/planboard').search({ setPrefixedAvailability: true });
    }
  });
});
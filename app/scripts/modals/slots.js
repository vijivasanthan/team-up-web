define(['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory(
      'Slots',
      [
        '$rootScope',
        '$resource',
        '$q',
        'Dater',
        'Sloter',
        'Store',
        'Stats',
        'Teams',
        function ($rootScope, $resource, $q, Dater, Sloter, Store, Stats, Teams)
        {
          var Slots = $resource(config.app.host + '/askatars/:user/slots', {user: ''}, {
            query: {
              method: 'GET',
              params: {start: '', end: ''},
              isArray: true
            },
            change: {
              method: 'PUT',
              params: {start: '', end: '', text: '', recursive: ''}
            },
            save: {
              method: 'POST',
              params: {}
            },
            remove: {
              method: 'DELETE',
              params: {}
            }
          });

          var Aggs = $resource(config.app.host + '/calc_planning/:id', {}, {
            query: {
              method: 'GET',
              params: {id: '', start: '', end: ''},
              isArray: true
            }
          });

          var Wishes = $resource(config.app.host + '/network/:id/wish', {}, {
            query: {
              method: 'GET',
              params: {id: '', start: '', end: ''},
              isArray: true
            },
            save: {
              method: 'PUT',
              params: {id: ''}
            }
          });

          var MemberSlots = $resource(config.app.host + '/network/:id/member/slots2', {}, {
            query: {
              method: 'GET',
              params: {id: '', start: '', end: ''}
            },
            get: {
              method: 'GET',
              params: {id: '', start: '', end: ''},
              interceptor: {
                response: function(response) {
                  // expose response
                  return response;
                }
              }
            }
          });

          Slots.prototype.wishes = function (options) {

            var deferred = $q.defer(),
              params = {
                id: options.id,
                start: options.start,
                end: options.end
              };

            Wishes.query(
              params,
              function (result) {
                deferred.resolve(result);
              },
              function (error) {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };

          Slots.prototype.setWish = function (options) {
            var deferred = $q.defer(),
              params = {
                start: options.start,
                end: options.end,
                wish: options.wish,
                recurring: options.recursive
              };

            Wishes.save(
              {id: options.id}, params,
              function (result) {
                deferred.resolve(result);
              },
              function (error) {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };

          Slots.prototype.aggs = function (options) {
            var deferred = $q.defer(),
              calls = [];

            if (config.app.timeline.config.divisions.length > 0) {
              _.each(config.app.timeline.config.divisions, function (division) {
                if (division.id !== 'all') {
                  var params = {
                    id: options.id,
                    start: options.start,
                    end: options.end,
                    stateGroup: division.id,
                    division: {
                      id: division.id,
                      label: division.label
                    }
                  };

                  calls.push(Slots.prototype.agg(params));
                }
              });
            } else {
              calls.push(
                Slots.prototype.agg(
                  {
                    id: options.id,
                    start: options.start,
                    end: options.end
                  }));
            }

            $q.all(calls).then(function (result) {
              deferred.resolve(result);
            });

            return deferred.promise;
          };

          Slots.prototype.agg = function (options) {
            var deferred = $q.defer();

            Aggs.query(
              options,
              function (result) {
                var stats = Stats.aggs(result, options.start, options.end);

                deferred.resolve(
                  {
                    id: options.id,
                    division: options.division,
                    data: result,
                    ratios: stats.ratios,
                    durations: stats.durations
                  });
              },
              function (error) {
                deferred.resolve({error: error});
              });

            return deferred.promise;
          };

          Slots.prototype.pie = function (options) {
            var deferred = $q.defer(),
              now = Math.floor(Date.now().getTime() / 1000),
              periods = Dater.getPeriods(),
              current = Dater.current.week(),
              weeks = {
                current: {
                  period: periods.weeks[current],
                  data: [],
                  shortages: []
                },
                next: {
                  period: periods.weeks[current + 1],
                  data: [],
                  shortages: []
                }
              },
              slicer = weeks.current.period.last.timeStamp;
            var params = {
              id: options.id,
              start: weeks.current.period.first.timeStamp / 1000,
              end: weeks.next.period.last.timeStamp / 1000
            };

            if (options.division != 'both') params.stateGroup = options.division;

            Aggs.query(
              params,
              function (results) {
                deferred.resolve(processPies(results));
              },
              function (error) {
                deferred.resolve({error: error});
              }
            );

            function processPies(results) {
              var state;

              if (results.length > 1) {
                _.each(results, function (slot) {
                  // Fish out the current
                  if (now >= slot.start && now <= slot.end) state = slot;

                  // Slice from end of first week
                  if (slicer <= slot.start * 1000) {
                    weeks.next.data.push(slot);
                  } else if (slicer >= slot.start * 1000) {
                    weeks.current.data.push(slot)
                  }
                });

                // slice extra timestamp from the last of current week data set and add that to week next
                var last = weeks.current.data[weeks.current.data.length - 1],
                  next = weeks.next.data[0],
                  difference = (last.end * 1000) - slicer,
                  currents = [];

                // if start of current of is before the start reset it to start
                weeks.current.data[0].start = weeks.current.period.first.timeStamp / 1000;

                // if there is a leak to next week adjust the last one of current
                // week and add new slot to next week with same values
                if (difference > 0) {
                  weeks.next.data.unshift(
                    {
                      diff: last.diff,
                      start: slicer / 1000,
                      end: last.end,
                      wish: last.wish
                    });
                }

                // shortages and back-end gives more than asked sometimes, with returning
                // values out of the range which being asked !
                _.each(weeks.current.data, function (slot) {
                  if (slot.end - slot.start > 0) currents.push(slot);

                  // add to shortages
                  if (slot.diff < 0) weeks.current.shortages.push(slot);
                });

                // reset to start of current weekly begin to week begin
                currents[0].start = weeks.current.period.first.timeStamp / 1000;

                // add to shortages
                _.each(weeks.next.data, function (slot) {
                  if (slot.diff < 0) weeks.next.shortages.push(slot);
                });

                return {
                  id: options.id,
                  division: options.division,
                  name: options.name,
                  weeks: {
                    current: {
                      data: currents,
                      state: state,
                      shortages: weeks.current.shortages,
                      start: {
                        date: new Date(weeks.current.period.first.timeStamp).toString(config.formats.date),
                        timeStamp: weeks.current.period.first.timeStamp
                      },
                      end: {
                        date: new Date(weeks.current.period.last.timeStamp).toString(config.formats.date),
                        timeStamp: weeks.current.period.last.timeStamp
                      },
                      ratios: Stats.pies(currents, params.start, params.end)
                    },
                    next: {
                      data: weeks.next.data,
                      shortages: weeks.next.shortages,
                      start: {
                        date: new Date(weeks.next.period.first.timeStamp).toString(config.formats.date),
                        timeStamp: weeks.next.period.first.timeStamp
                      },
                      end: {
                        date: new Date(weeks.next.period.last.timeStamp).toString(config.formats.date),
                        timeStamp: weeks.next.period.last.timeStamp
                      },
                      ratios: Stats.pies(weeks.next.data, params.start, params.end)
                    }
                  }
                }
              } else {
                if (results[0].diff == null) results[0].diff = 0;
                if (results[0].wish == null) results[0].wish = 0;

                var currentWeek = [
                    {
                      start: weeks.current.period.first.timeStamp / 1000,
                      end: weeks.current.period.last.timeStamp / 1000,
                      wish: results[0].wish,
                      diff: results[0].diff
                    }
                  ],
                  nextWeek = [
                    {
                      start: weeks.next.period.first.timeStamp / 1000,
                      end: weeks.next.period.last.timeStamp / 1000,
                      wish: results[0].wish,
                      diff: results[0].diff
                    }
                  ];

                if (currentWeek[0].diff < 0) weeks.current.shortages.push(currentWeek[0]);
                if (nextWeek[0].diff < 0) weeks.next.shortages.push(nextWeek[0]);

                return {
                  id: options.id,
                  division: options.division,
                  name: options.name,
                  weeks: {
                    current: {
                      data: currentWeek,
                      state: currentWeek,
                      shortages: weeks.current.shortages,
                      start: {
                        date: new Date(weeks.current.period.first.timeStamp).toString(config.formats.date),
                        timeStamp: weeks.current.period.first.timeStamp
                      },
                      end: {
                        date: new Date(weeks.current.period.last.timeStamp).toString(config.formats.date),
                        timeStamp: weeks.current.period.last.timeStamp
                      },
                      ratios: Stats.pies(currentWeek, params.start, params.end)
                    },
                    next: {
                      data: nextWeek,
                      shortages: weeks.next.shortages,
                      start: {
                        date: new Date(weeks.next.period.first.timeStamp).toString(config.formats.date),
                        timeStamp: weeks.next.period.first.timeStamp
                      },
                      end: {
                        date: new Date(weeks.next.period.last.timeStamp).toString(config.formats.date),
                        timeStamp: weeks.next.period.last.timeStamp
                      },
                      ratios: Stats.pies(nextWeek, params.start, params.end)
                    }
                  }
                }
              }

            }

            return deferred.promise;
          };

          Slots.prototype.currentState = function () {
            var deferred = $q.defer(),
              resources = Store('user').get('resources');

            if (resources) {
              // TODO: Use mathematical formula to calculate it
              var now;

              now = String(Date.now().getTime());
              now = Number(now.substr(0, now.length - 3));

              var params = {
                user: resources.uuid,
                start: now,
                end: now + 1
              };

              Slots.query(params, function (result) {
                deferred.resolve(
                  (result.length > 0) ?
                    $rootScope.StandBy.config.statesall[result[0]['text']] :
                  {
                    color: 'gray',
                    label: 'Mogelijk inzetbaar'
                  }
                );
              });
            } else {
              deferred.resolve([]);
            }

            return deferred.promise;
          };

          Slots.prototype.all = function (options) {
            var deferred = $q.defer(),
              periods = Dater.getPeriods(),
              params = {
                user: Store('app').get('resources').uuid,
                start: options.stamps.start / 1000,
                end: options.stamps.end / 1000
              },
              data = {};

            Slots.query(
              params,
              function (user) {
                _.each(user, function (slot) {
                  if (!slot.recursive) {
                    slot.recursive = false;
                  }
                });

                if (options.layouts.group) {
                  var groupParams = {
                    id: options.groupId,
                    start: params.start,
                    end: params.end,
                    month: options.month
                  };

                  Slots.prototype.aggs(groupParams).then(function (aggs) {
                    if (options.layouts.members) {
                      var allMembers = Store('app').get(options.groupId),
                        calls = [];

                      Slots.prototype.memberSlots2.query({
                          id: options.groupId,
                          start: params.start,
                          end: params.end,
                          type: 'both'
                        },
                        function (members) {
                          var mems = [];
                          _.each(members, function (mdata, index) {
                              _.each(mdata, function (tslot) {
                                tslot.text = tslot.state
                              });

                              var member;

                              _.each(allMembers, function (mem) {
                                if (index == mem.uuid) {
                                  member = mem;
                                }
                              });

                              if (member != null) {
                                mems.push({
                                  id: index,
                                  lastName: member.lastName,
                                  role: member.role,
                                  data: mdata,
                                  stats: Stats.member(mdata, params.start, params.end)
                                });
                              }
                            }
                          );

                          deferred.resolve({
                            user: user,
                            groupId: options.groupId,
                            aggs: aggs,
                            members: mems,
                            synced: new Date().getTime(),
                            periods: {
                              start: options.stamps.start,
                              end: options.stamps.end
                            }
                          });
                        },
                        function (error) {
                          deferred.resolve({error: error})
                        });
                    } else {
                      deferred.resolve({
                        user: user,
                        groupId: options.groupId,
                        aggs: aggs,
                        synced: new Date().getTime(),
                        periods: {
                          start: options.stamps.start,
                          end: options.stamps.end
                        }
                      });
                    }
                  });
                } else {
                  deferred.resolve({
                    user: user,
                    synced: new Date().getTime(),
                    periods: {
                      start: options.stamps.start,
                      end: options.stamps.end
                    }
                  });
                }
              },
              function (error) {
                deferred.resolve({error: error});
              });

            return deferred.promise;
          };

          Slots.prototype.getMemberAvailabilitiesPerTeam = function (groupID, divisionID)
          {
            var deferred = $q.defer(),
                now = Math.floor(Date.now().getTime() / 1000);

            MemberSlots.get({
                id: groupID,
                type: divisionID,
                start: now,
                end: now + 1000
              },function (response) {
                deferred.resolve({
                  members: response.data,
                  synced: now
                });
              },
              function (error) {
                deferred.reject({error: error});
              });

            return deferred.promise;
          };

          Slots.prototype.getAllMemberAvailabilities = function (teams, divisionID)
          {
            var deferred = $q.defer(),
              teamDeferred = [],
              now = Math.floor(Date.now().getTime() / 1000);

            _.each(teams, function (team)
            {
              var membersDeferred = $q.defer();
              teamDeferred.push(membersDeferred.promise);

              MemberSlots.get
              (
                {
                  id: team.uuid,
                  type: divisionID,
                  start: now,
                  end: now + 1000
                },
                function(response)
                {
                  membersDeferred.resolve(response.data);
                }
              )
            });

            $q.all(teamDeferred)
              .then(
              function (teams)
              {
                var allMembers = {};

                angular.forEach(teams, function(team) {
                  angular.forEach(team, function(memberData, memberId) {
                    allMembers[memberId] = memberData;
                  });
                });

                deferred.resolve({
                  members: allMembers,
                  synced: now
                });
              },
              function (error)
              {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };

          Slots.prototype.memberSlots2 = {
            query: function (options, callbackSuccess, callbackError) {

              var memDeferred = [],
                  members = [],
                  queriedTeams = Teams.query();

              queriedTeams.then(function (teams){

                if(options.id == 'all'){
                  members = $rootScope.unique(Store('app').get('members'));
                }
                else if(typeof teams.members[options.id] != 'undefined') {
                  members = $rootScope.unique(teams.members[options.id]);
                }

                _.each(members, function (member){
                  var memberDeferred = $q.defer(),
                      _options;
                  memDeferred.push(memberDeferred.promise);

                  _options = {
                    user: member.uuid,
                    start: options.start,
                    end: options.end
                  }

                  if (options.type) {
                    _options.type = options.type;
                  }

                  Slots.query(
                    _options,
                    function (result) {
                      _.each(result, function(member){
                        member.state = member.text;
                        member.text = null;
                      })
                      memberDeferred.resolve({uuid: member.uuid, content: result});
                    },
                    function (error) {
                      memberDeferred.resolve({error: error});
                    }
                  );
                });

                $q.all(memDeferred).then(function (results){
                  var success = {};
                  _.each(results, function (result) {
                    if (!result.error){
                      success[result.uuid] = result.content;
                    } else {
                      console.log(result.error);
                    }
                  });

                  callbackSuccess(success);

                });
              });
            }
          }

          Slots.prototype.user = function (params) {
            var deferred = $q.defer();

            Slots.query(
              params,
              function (result) {
                deferred.resolve({
                  id: params.user,
                  data: result,
                  stats: Stats.member(result, params.start, params.end)
                });
              },
              function (error) {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };

          Slots.prototype.users = function (members)
          {
            var deferred = $q.defer(),
              memDeferred = [];

            var now = Math.floor(Date.now().getTime() / 1000);

            _.each(members, function (member)
            {
              var memberDeferred = $q.defer();
              memDeferred.push(memberDeferred.promise);

              Slots.query(
                {
                  user: member.uuid,
                  start: now,
                  end: now + 1000
                },
                function (result) {
                  _.each(result, function(member){
                    member.state = member.text;
                    member.text = null;
                  })
                  memberDeferred.resolve({uuid: member.uuid, content: result});
                },
                function (error) {
                  memberDeferred.resolve({error: error});
                }
              );
            });

            $q.all(memDeferred).then(function (results){
              var success = {};
              _.each(results, function (result) {
                if (!result.error){
                  success[result.uuid] = result.content;
                }
              });

              deferred.resolve({members: success, synced: now});
            });

            return deferred.promise;
          };

          Slots.prototype.local = function () {
            return Store('user').get('slots');
          };

          Slots.prototype.add = function (slot, user) {
            var deferred = $q.defer();

            // Always reset to 0 seconds
            var start = moment.unix(slot.start).seconds(0);
            slot.start = start.unix();

            Slots.save(
              {user: user}, slot,
              function (result) {
                deferred.resolve(result);
              },
              function (error) {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };

          Slots.prototype.change = function (original, changed, user) {
            var deferred = $q.defer();

            Slots.change(
              angular.extend(naturalize(changed), {user: user}), naturalize(original),
              function (result) {
                deferred.resolve(result);
              },
              function (error) {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };

          Slots.prototype.remove = function (slot, user) {
            var deferred = $q.defer();

            Slots.remove(
              angular.extend(naturalize(slot), {user: user}),
              function (result) {
                deferred.resolve(result);
              },
              function (error) {
                deferred.resolve({error: error});
              }
            );

            return deferred.promise;
          };

          function naturalize(slot) {
            var content = angular.fromJson(slot.content);

            return {
              start: Math.floor(new Date(slot.start).getTime() / 1000),
              end: Math.floor(new Date(slot.end).getTime() / 1000),
              recursive: content.recursive,
              text: content.state,
              id: content.id
            }
          }

          return new Slots;
        }
      ]
    );
  });

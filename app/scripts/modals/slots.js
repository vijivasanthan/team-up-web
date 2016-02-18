define(['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory(
      'Slots',
      function ($rootScope, $resource, $q, Dater, Sloter, Store, Stats, Teams, moment, Settings)
      {
        var Slots = function ()
        {
        };

        Slots.prototype.resourceSlots = function ()
        {
          return $resource(Settings.getBackEnd() + 'askatars/:user/slots', {user: ''}, {
            query: {
              method: 'GET',
              params: {start: '', end: ''},
              isArray: true
            },
            change: {
              method: 'PUT',
              params: {start: '', end: '', text: '', recursive: ''},
              isArray: true
            },
            save: {
              method: 'POST',
              params: {},
              isArray: true
            },
            remove: {
              method: 'DELETE',
              params: {}
            }
          });
        };

        Slots.prototype.resourceAggs = function ()
        {
          return $resource(Settings.getBackEnd() + 'calc_planning/:id', {}, {
            query: {
              method: 'GET',
              params: {id: '', start: '', end: ''},
              isArray: true
            }
          });
        };

        Slots.prototype.resourceWishes = function ()
        {
          return $resource(Settings.getBackEnd() + 'network/:id/wish', {}, {
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
        };

        Slots.prototype.resourceMemberSlots = function ()
        {
          return $resource(Settings.getBackEnd() + 'network/:id/member/slots2', {}, {
            query: {
              method: 'GET',
              params: {id: '', start: '', end: ''}
            },
            get: {
              method: 'GET',
              params: {id: '', start: '', end: ''},
              interceptor: {
                response: function (response)
                {
                  // expose response
                  return response;
                }
              }
            }
          });
        };

        Slots.prototype.wishes = function (options)
        {

          var deferred = $q.defer(),
            params = {
              id: options.id,
              start: options.start,
              end: options.end
            };

          var wishesResource = Slots.prototype.resourceWishes();

          wishesResource.query(
            params,
            function (result)
            {
              deferred.resolve(result);
            },
            function (error)
            {
              deferred.resolve({error: error});
            }
          );

          return deferred.promise;
        };

        Slots.prototype.setWish = function (options)
        {
          var deferred = $q.defer(),
            params = {
              start: options.start,
              end: options.end,
              wish: options.wish,
              recurring: options.recursive
            };
          var wishesResource = Slots.prototype.resourceWishes();
          wishesResource.save(
            {id: options.id}, params,
            function (result)
            {
              deferred.resolve(result);
            },
            function (error)
            {
              deferred.resolve({error: error});
            }
          );

          return deferred.promise;
        };

        Slots.prototype.aggs = function (options)
        {
          var deferred = $q.defer(),
            calls = [];

          if (config.app.timeline.config.divisions.length > 0)
          {
            _.each(config.app.timeline.config.divisions, function (division)
            {
              if (division.id !== 'all')
              {
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
          }
          else
          {
            calls.push(
              Slots.prototype.agg(
                {
                  id: options.id,
                  start: options.start,
                  end: options.end
                }));
          }

          $q.all(calls).then(function (result)
          {
            deferred.resolve(result);
          });

          return deferred.promise;
        };

        Slots.prototype.agg = function (options)
        {
          var deferred = $q.defer(),
            aggsResource = Slots.prototype.resourceAggs();

          aggsResource.query(
            options,
            function (result)
            {
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
            function (error)
            {
              deferred.resolve({error: error});
            });

          return deferred.promise;
        };

        Slots.prototype.pie = function (options)
        {
          var deferred = $q.defer(),
            now = Math.floor(moment.valueOf() / 1000),
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

          var aggsResource = Slots.prototype.resourceAggs();

          aggsResource.query(
            params,
            function (results)
            {
              deferred.resolve(processPies(results));
            },
            function (error)
            {
              deferred.resolve({error: error});
            }
          );

          function processPies(results)
          {
            var state;

            if (results.length > 1)
            {
              _.each(results, function (slot)
              {
                // Fish out the current
                if (now >= slot.start && now <= slot.end) state = slot;

                // Slice from end of first week
                if (slicer <= slot.start * 1000)
                {
                  weeks.next.data.push(slot);
                }
                else if (slicer >= slot.start * 1000)
                {
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
              if (difference > 0)
              {
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
              _.each(weeks.current.data, function (slot)
              {
                if (slot.end - slot.start > 0) currents.push(slot);

                // add to shortages
                if (slot.diff < 0) weeks.current.shortages.push(slot);
              });

              // reset to start of current weekly begin to week begin
              currents[0].start = weeks.current.period.first.timeStamp / 1000;

              // add to shortages
              _.each(weeks.next.data, function (slot)
              {
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
            }
            else
            {
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

        Slots.prototype.currentState = function ()
        {
          var deferred = $q.defer(),
            resources = Store('user').get('resources');

          if (resources)
          {
            // TODO: Use mathematical formula to calculate it
            var now = moment().unix();

            //now = String(Date.now().getTime());
            //now = Number(now.substr(0, now.length - 3));

            var params = {
              user: resources.uuid,
              start: now,
              end: now + 1
            };
            var slotsResource = Slots.prototype.resourceSlots();

            slotsResource.query(params, function (result)
            {
              deferred.resolve(
                (result.length > 0) ?
                  $rootScope.config.app.statesall[result[0]['text']] :
                {
                  color: 'gray',
                  label: 'Mogelijk inzetbaar'
                }
              );
            });
          }
          else
          {
            deferred.resolve([]);
          }

          return deferred.promise;
        };

        Slots.prototype.members = function (groupId, periods, membersCurrentGroup)
        {
          var allMembers = membersCurrentGroup || Store('app').get(groupId),
            deferred = $q.defer();

          Slots.prototype.memberSlots2.query({
              id: groupId,
              start: periods.start,
              end: periods.end,
              type: 'both'
            },
            function (members)
            {
              var mems = [];
              _.each(members,
                function (mdata, index)
                {
                  _.each(mdata, function (tslot)
                  {
                    tslot.text = tslot.state
                  });

                  var member;

                  _.each(allMembers, function (mem)
                  {
                    if (index == mem.uuid)
                    {
                      member = mem;
                    }
                  });

                  if (member != null)
                  {
                    mems.push({
                      id: index,
                      fullName: member.firstName + ' ' + member.lastName,
                      lastName: member.lastName,
                      role: member.role,
                      data: mdata,
                      stats: Stats.member(mdata, periods.start, periods.end)
                    });
                  }
                }
              );
              deferred.resolve(mems);
            },
            function (error)
            {
              deferred.resolve({error: error})
            }
          );

          return deferred.promise;
        };

        Slots.prototype.memberSlots2 = {
          query: function (options, callbackSuccess, callbackError)
          {
            var memDeferred = [],
              members = [],
              teams = Teams.queryLocal();

            if (options.id == 'all')
            {
              //members = $rootScope.unique(Store('app').get('members'));
            }
            else if (typeof teams.members[options.id] != 'undefined')
            {
              members = $rootScope.unique(teams.members[options.id]);
            }

            _.each(members, function (member)
            {
              var memberDeferred = $q.defer(),
                _options;
              memDeferred.push(memberDeferred.promise);

              _options = {
                user: member.uuid,
                start: options.start,
                end: options.end
              }

              if (options.type)
              {
                _options.type = options.type;
              }

              var slotsResource = Slots.prototype.resourceSlots();

              slotsResource.query(
                _options,
                function (result)
                {
                  _.each(result, function (slot)
                  {
                    slot.state = slot.text;
                    slot.text = null;
                  })
                  memberDeferred.resolve({uuid: member.uuid, content: result});
                },
                function (error)
                {
                  memberDeferred.resolve({error: error});
                }
              );
            });

            $q.all(memDeferred).then(function (results)
            {
              var success = {};
              _.each(results, function (result)
              {
                if (!result.error)
                {
                  success[result.uuid] = result.content;
                }
                else
                {
                  console.log(result.error);
                }
              });

              callbackSuccess(success);
            });
          }
        }

        Slots.prototype.all = function (options)
        {
          var deferred = $q.defer(),
            params = {
              user: options.user, //options.user, //Store('app').get('resources').uuid,
              start: moment(options.stamps.start).unix(),
              end: moment(options.stamps.end).unix()
            },
            data = {};
          var slotsResource = Slots.prototype.resourceSlots();
          slotsResource.query(
            params,
            function (user)
            {
              _.each(user, function (slot)
              {
                if (!slot.recursive)
                {
                  slot.recursive = false;
                }
              });

              if (options.layouts.group)
              {
                var groupParams = {
                  id: options.groupId,
                  start: params.start,
                  end: params.end,
                  month: options.month
                };

                Slots.prototype.aggs(groupParams)
                  .then(function (aggs)
                  {
                    var _aggs = aggs;


                    Slots.prototype.wishes(
                      {
                        id: options.groupId,
                        start: params.start,
                        end: params.end
                      }).then(
                      function (wishes)
                      {
                        _aggs.wishes = wishes;

                        if (options.layouts.members)
                        {
                          var allMembers = options.members || Store('app').get(options.groupId),
                            calls = [];

                          var resource = Slots.prototype.resourceMemberSlots();
                          resource.get
                          (
                            {
                              id: options.groupId,
                              start: params.start,
                              end: params.end,
                              type: 'both'

                            },
                            function (response)
                            {
                              var members = response.data;
                              var mems = [];
                              _.each(members, function (mdata, index)
                                {
                                  _.each(mdata, function (tslot)
                                  {
                                    tslot.text = tslot.state
                                  });

                                  var member;

                                  _.each(allMembers, function (mem)
                                  {
                                    if (index == mem.uuid)
                                    {
                                      member = mem;
                                    }
                                  });

                                  if (member != null)
                                  {
                                    mems.push({
                                      id: index,
                                      fullName: member.firstName + ' ' + member.lastName,
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
                                aggs: _aggs,
                                members: mems,
                                synced: +moment(),
                                periods: {
                                  start: options.stamps.start,
                                  end: options.stamps.end
                                }
                              });
                            },
                            function (error)
                            {
                              deferred.resolve({error: error})
                            }
                          );
                        }
                        else
                        {
                          deferred.resolve({
                            user: user,
                            groupId: options.groupId,
                            aggs: _aggs,
                            synced: +moment(),
                            periods: {
                              start: options.stamps.start,
                              end: options.stamps.end
                            }
                          });
                        }
                      }
                    );
                  });
              }
              else
              {
                deferred.resolve({
                  user: user,
                  synced: +moment(),
                  periods: {
                    start: options.stamps.start,
                    end: options.stamps.end
                  }
                });
              }
            },
            function (error)
            {
              deferred.resolve({error: error});
            });

          return deferred.promise;
        };

        Slots.prototype.getMemberAvailabilitiesPerTeam = function (groupID, divisionID)
        {
          var deferred = $q.defer(),
            now = Math.floor(moment().valueOf() / 1000),
            resource = Slots.prototype.resourceMemberSlots();

          resource.get({
              id: groupID,
              type: divisionID,
              start: now,
              end: now + 1000
            }, function (response)
            {
              deferred.resolve({
                members: response.data,
                synced: now
              });
            },
            function (error)
            {
              deferred.reject({error: error});
            });

          return deferred.promise;
        };

        Slots.prototype.MemberReachabilitiesByTeam = function (groupId, startTime)
        {
          var deferred = $q.defer(),
            now = startTime || Math.floor(moment().valueOf() / 1000),
            resource = Slots.prototype.resourceMemberSlots();

          resource.get
          (
            {
              id: groupId,
              type: null,
              start: now,
              end: now + 60
            },
            function (response)
            {
              deferred.resolve({
                members: response.data,
                synced: now
              });
            }
          )

          return deferred.promise;
        };

        Slots.prototype.getAllMemberReachabilities = function (teams, divisionID)
        {
          var deferred = $q.defer(),
            teamDeferred = [],
            now = Math.floor(moment().valueOf() / 1000);

          _.each(teams, function (team)
          {
            var membersDeferred = $q.defer();
            teamDeferred.push(membersDeferred.promise);
            var resource = Slots.prototype.resourceMemberSlots();

            resource.get
            (
              {
                id: team.uuid,
                type: divisionID,
                start: now,
                end: now + 60
              },
              function (response)
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

                _.each(teams, function (team)
                {
                  _.each(team, function (memberData, memberId)
                  {
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

        Slots.prototype.user = function (params)
        {
          var deferred = $q.defer();
          var slotsResource = Slots.prototype.resourceSlots();
          slotsResource.query(
            params,
            function (result)
            {
              deferred.resolve({
                id: params.user,
                data: result,
                stats: Stats.member(result, params.start, params.end)
              });
            },
            function (error)
            {
              deferred.resolve({error: error});
            }
          );

          return deferred.promise;
        };

        Slots.prototype.users = function (members)
        {
          var deferred = $q.defer(),
            memDeferred = [];

          var now = Math.floor(moment().valueOf() / 1000);

          _.each(members, function (member)
          {
            var memberDeferred = $q.defer();
            memDeferred.push(memberDeferred.promise);

            var slotsResource = Slots.prototype.resourceSlots();

            slotsResource.query(
              {
                user: member.uuid,
                start: now,
                end: now + 1000
              },
              function (result)
              {
                _.each(result, function (member)
                {
                  member.state = member.text;
                  member.text = null;
                });
                memberDeferred.resolve({uuid: member.uuid, content: result});
              },
              function (error)
              {
                memberDeferred.resolve({error: error});
              }
            );
          });

          $q.all(memDeferred).then(function (results)
          {
            var success = {};
            _.each(results, function (result)
            {
              if (!result.error)
              {
                success[result.uuid] = result.content;
              }
            });

            deferred.resolve({members: success, synced: now});
          });

          return deferred.promise;
        };

        Slots.prototype.local = function ()
        {
          return Store('user').get('slots');
        };

        Slots.prototype.add = function (slot, user)
        {
          var deferred = $q.defer();

          // Always reset to 0 seconds
          var start = moment.unix(slot.start).seconds(0);
          slot.start = start.unix();

          var slotsResource = Slots.prototype.resourceSlots();

          slotsResource.save(
            {user: user}, slot,
            function (result)
            {
              deferred.resolve(result);
            },
            function (error)
            {
              deferred.resolve({error: error});
            }
          );

          return deferred.promise;
        };

        Slots.prototype.change = function (original, changed, user)
        {
          var deferred = $q.defer(),
            slotsResource = Slots.prototype.resourceSlots();

          slotsResource.change(
            angular.extend(naturalize(changed), {user: user}), naturalize(original),
            function (result)
            {
              deferred.resolve(result);
            },
            function (error)
            {
              deferred.resolve({error: error});
            }
          );
          return deferred.promise;
        };

        Slots.prototype.remove = function (slot, user)
        {
          var deferred = $q.defer(),
            slotsResource = Slots.prototype.resourceSlots();

          slotsResource.remove(
            angular.extend(naturalize(slot), {user: user}),
            function (result)
            {
              deferred.resolve(result);
            },
            function (error)
            {
              deferred.resolve({error: error});
            }
          );

          return deferred.promise;
        };

        function naturalize(slot)
        {
          return {
            start: Math.floor(new Date(slot.start).getTime() / 1000),
            end: Math.floor(new Date(slot.end).getTime() / 1000),
            recursive: slot.recursive,
            text: slot.state,
            id: slot.id
          }
        }

        return new Slots;
      }
    );
  });

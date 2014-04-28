'use strict';


angular.module('WebPaige.Modals.Slots', ['ngResource'])


/**
 * Slots
 */
.factory('Slots', 
[
	'$rootScope', '$config', '$resource', '$q', 'Storage', 'Dater', 'Sloter', 'Stats',
	function ($rootScope, $config, $resource, $q, Storage, Dater, Sloter, Stats) 
	{
	  /**
	   * Define Slot Resource from back-end
	   */
	  var Slots = $resource(
	    $config.host + '/askatars/:user/slots',
	    {
	      user: ''
	    },
	    {
	      query: {
	        method: 'GET',
	        params: {start:'', end:''},
	        isArray: true
	      },
	      change: {
	        method: 'PUT',
	        params: {start:'', end:'', text:'', recursive:''}        
	      },
	      save: {
	        method: 'POST',
	        params: {}
	      },
	      remove: {
	        method: 'DELETE',
	        params: {}
	      }
	    }
	  );


	  /**
	   * Group aggs resource
	   */
	  var Aggs = $resource(
	    $config.host + '/calc_planning/:id',
	    {
	    },
	    {
	      query: {
	        method: 'GET',
	        params: {id: '', start:'', end:''},
	        isArray: true
	      }
	    }
	  );


	  /**
	   * Wishes resource
	   */
	  var Wishes = $resource(
	    $config.host + '/network/:id/wish',
	    {
	    },
	    {
	      query: {
	        method: 'GET',
	        params: {id: '', start:'', end:''},
	        isArray: true
	      },
	      save: {
	        method: 'PUT',
	        params: {id: ''}
	      }
	    }
	  );


	  /**
     * Members resource
	   */
	  var MemberSlots = $resource(
	    $config.host + '/network/:id/member/slots2',
	    {
	    },
	    {
	      query: {
	        method: 'GET',
	        params: {id: '', start:'', end:''}
	        // ,
	        // isArray: true
	      }
	    }
	  );


	  /**
	   * Get group wishes
	   */
	  Slots.prototype.wishes = function (options) 
	  {
	    var deferred  = $q.defer(),
	        params    = {
	          id:     options.id,
	          start:  options.start,
	          end:    options.end
	        };

	    Wishes.query(params, 
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


	  /**
	   * Set group wish
	   */
	  Slots.prototype.setWish = function (options) 
	  {
	    var deferred = $q.defer(),
	        params = {
	          start:      options.start,
	          end:        options.end,
	          wish:       options.wish,
	          recurring:  options.recursive
	        };

	    Wishes.save({id: options.id}, params, 
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


	  /**
	   * Get group aggs
	   */
    Slots.prototype.aggs = function (options)
    {
      var deferred  = $q.defer(),
          calls     = [];

      if ($rootScope.config.timeline.config.divisions.length > 0)
      {
        angular.forEach($rootScope.config.timeline.config.divisions, function (division)
        {
          if (division.id !== 'all')
          {
            var params = {
              id:     options.id,
              start:  options.start,
              end:    options.end,
              stateGroup: division.id,
              division: {
                id:    division.id,
                label: division.label
              }
            };

            calls.push(Slots.prototype.agg(params));
          }
        });
      }
      else
      {
        calls.push(Slots.prototype.agg({
          id:     options.id,
          start:  options.start,
          end:    options.end
        }));
      }

      $q.all(calls)
        .then(function (result)
        {
          deferred.resolve(result);
        });

      return deferred.promise;
    };


    /**
     * Fetch calculated planning of one group
     */
    Slots.prototype.agg = function (options)
    {
      var deferred = $q.defer();

      Aggs.query(options,
        function (result)
        {
          var stats = Stats.aggs(result);

          deferred.resolve({
            id:       options.id,
            division: options.division,
            data:     result,
            ratios:   stats.ratios,
            durations: stats.durations
          });
        },
        function (error)
        {
          deferred.resolve({error: error});
        });

      return deferred.promise;
    };


	  /**
	   * Get group aggs for pie charts
	   */
	  Slots.prototype.pie = function (options) 
	  {
	    var deferred  = $q.defer(),
	        now       = Math.floor(Date.now().getTime() / 1000),
	        periods   = Dater.getPeriods(),
	        current   = Dater.current.week(),
	        weeks     = {
	          current:  {
	            period:   periods.weeks[current],
	            data:     [],
	            shortages:[]
	          },
	          next: {
	            period:   periods.weeks[current + 1],
	            data:     [],
	            shortages:[]
	          }
	        },
	        slicer = weeks.current.period.last.timeStamp;

      var params = {
        id:     options.id,
        start:  weeks.current.period.first.timeStamp / 1000,
        end:    weeks.next.period.last.timeStamp / 1000
      };

      if (options.division != 'both') params.stateGroup = options.division;

	    Aggs.query(params,
	      function (results)
	      {
          deferred.resolve(processPies(results));
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

      function processPies (results)
      {
        var state;

        // Check whether it is only one
        if (results.length > 1)
        {
          angular.forEach(results, function (slot)
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
          var last        = weeks.current.data[weeks.current.data.length-1],
              next        = weeks.next.data[0],
              difference  = (last.end * 1000 - slicer) / 1000,
              currents    = [];

          // if start of current of is before the start reset it to start
          weeks.current.data[0].start = weeks.current.period.first.timeStamp / 1000;

          // if there is a leak to next week adjust the last one of current
          // week and add new slot to next week with same values
          if (difference > 0)
          {
            last.end = slicer / 1000;

            weeks.next.data.unshift({
              diff:   last.diff,
              start:  slicer / 1000,
              end:    last.end,
              wish:   last.wish
            });
          }

          // shortages and back-end gives more than asked sometimes, with returning
          // values out of the range which being asked !
          angular.forEach(weeks.current.data, function (slot)
          {
            if (slot.end - slot.start > 0) currents.push(slot);

            // add to shortages
            if (slot.diff < 0) weeks.current.shortages.push(slot);
          });

          // reset to start of current weekly begin to week begin
          currents[0].start = weeks.current.period.first.timeStamp / 1000;

          // add to shortages
          angular.forEach(weeks.next.data, function (slot)
          {
            if (slot.diff < 0) weeks.next.shortages.push(slot);
          });

          return {
            id:       options.id,
            division: options.division,
            name:     options.name,
            weeks:    {
              current: {
                data:   currents,
                state:  state,
                shortages: weeks.current.shortages,
                start: {
                  date:       new Date(weeks.current.period.first.timeStamp).toString($config.formats.date),
                  timeStamp:  weeks.current.period.first.timeStamp
                },
                end: {
                  date:       new Date(weeks.current.period.last.timeStamp).toString($config.formats.date),
                  timeStamp:  weeks.current.period.last.timeStamp
                },
                ratios: Stats.pies(currents)
              },
              next: {
                data:   weeks.next.data,
                shortages: weeks.next.shortages,
                start: {
                  date:       new Date(weeks.next.period.first.timeStamp).toString($config.formats.date),
                  timeStamp:  weeks.next.period.first.timeStamp
                },
                end: {
                  date:       new Date(weeks.next.period.last.timeStamp).toString($config.formats.date),
                  timeStamp:  weeks.next.period.last.timeStamp
                },
                ratios: Stats.pies(weeks.next.data)
              }
            }
          }
        }
        else
        {
          if (results[0].diff == null) results[0].diff = 0;
          if (results[0].wish == null) results[0].wish = 0;

          var currentWeek = [{
              start:  weeks.current.period.first.timeStamp / 1000,
              end:    weeks.current.period.last.timeStamp / 1000,
              wish:   results[0].wish,
              diff:   results[0].diff
            }],
            nextWeek = [{
              start:  weeks.next.period.first.timeStamp / 1000,
              end:    weeks.next.period.last.timeStamp / 1000,
              wish:   results[0].wish,
              diff:   results[0].diff
            }];

          if (currentWeek[0].diff < 0) weeks.current.shortages.push(currentWeek[0]);
          if (nextWeek[0].diff < 0) weeks.next.shortages.push(nextWeek[0]);

          return {
            id:       options.id,
            division: options.division,
            name:     options.name,
            weeks:    {
              current: {
                data: currentWeek,
                state: currentWeek,
                shortages: weeks.current.shortages,
                start: {
                  date:       new Date(weeks.current.period.first.timeStamp).toString($config.formats.date),
                  timeStamp:  weeks.current.period.first.timeStamp
                },
                end: {
                  date:       new Date(weeks.current.period.last.timeStamp).toString($config.formats.date),
                  timeStamp:  weeks.current.period.last.timeStamp
                },
                ratios: Stats.pies(currentWeek)
              },
              next: {
                data: nextWeek,
                shortages: weeks.next.shortages,
                start: {
                  date:       new Date(weeks.next.period.first.timeStamp).toString($config.formats.date),
                  timeStamp:  weeks.next.period.first.timeStamp
                },
                end: {
                  date:       new Date(weeks.next.period.last.timeStamp).toString($config.formats.date),
                  timeStamp:  weeks.next.period.last.timeStamp
                },
                ratios: Stats.pies(nextWeek)
              }
            }
          }
        }

      }

	    return deferred.promise;
	  };


	  /**
	   * Slots percentage calculator
	   */
	  var preloader = {

	  	/**
	  	 * Init preloader
	  	 */
	  	init: function (total)
	  	{
	  		$rootScope.app.preloader = {
	  			status: 	true,
	  			total: 		total,
	  			count: 		0,
	  			started: 	Date.now().getTime()
	  		}
	  	},

	  	/**
	  	 * Countdown
	  	 */
	  	count: function ()
	  	{
	  		$rootScope.app.preloader.count = Math.abs(Math.floor( $rootScope.app.preloader.count + (100 / $rootScope.app.preloader.total) ));

	  		$rootScope.app.preloader.stopped = Date.now().getTime();
	  	}
	  };


    /**
     * Get current state of the user
     */
    Slots.prototype.currentState = function ()
    {
      /**
       * TODO: Use mathematical formula to calculate it
       */
      var now;

      now = String(Date.now().getTime());
      now = Number(now.substr(0, now.length - 3));

      var deferred  = $q.defer(),
          params    = {
            user:   angular.fromJson(Storage.get('resources')).uuid,
            start:  now,
            end:    now + 1
          };

      Slots.query(params,
        function (result)
        {
          deferred.resolve(
            (result.length > 0) ?
              $rootScope.config.statesall[result[0]['text']] :
              {
                color: 'gray',
                label: 'Geen planning'
              }
          );
        });

      return deferred.promise;
    };


	  /**
	   * Get slot bundels user, group aggs and members
	   */
	  Slots.prototype.all = function (options) 
	  {
	    /**
	     * Define vars
	     */
	    var deferred  = $q.defer(),
	        periods   = Dater.getPeriods(),
	        params    = {
	          user:   angular.fromJson(Storage.get('resources')).uuid, // user hardcoded!!
	          start:  options.stamps.start / 1000,
	          end:    options.stamps.end / 1000
	        },
	        data      = {};
	    
	    Slots.query(params, 
	      function (user) 
	      {
          angular.forEach(user, function (slot)
          {
            if (!slot.recursive)
            {
              slot.recursive = false;
            }
          });

	      	/**
	      	 * If group is on
	      	 */
	        if (options.layouts.group)
	        {
	          var groupParams = {
	              id:     options.groupId,
	              start:  params.start,
	              end:    params.end,
	              month:  options.month
	          };

	          // if (options.division != 'all') groupParams.division = options.division;

	          Slots.prototype.aggs(groupParams)
	          .then(function (aggs)
	          {
              /**
	          	 * If members are on
	          	 */
	            if (options.layouts.members)
	            {
	              var allMembers  = angular.fromJson(Storage.get(options.groupId)),
	                  calls       = [];


                // console.log('all members ->', allMembers);

	              /**
	               * New bundled call
	               */
						    MemberSlots.query(
							    {
							    	id: 		options.groupId,
						    		start: 	params.start,
						    		end: 		params.end,
						    		type: 	'both'
						    	},
						      function (members) 
						      {
						        var mems = [];

						        angular.forEach(members, function (mdata, index)
						      	{
						      		angular.forEach(mdata, function (tslot)
						      		{
						      			tslot.text = tslot.state;	
						      		});

                      var lastName;

                      angular.forEach(allMembers, function (mem)
                      {
                        if (index == mem.uuid)
                        {
                          lastName = mem.resources.lastName;
                        }
                      });

						      		mems.push({
							          id:     index,
                        lastName: lastName,
							          data:   mdata,
							          stats:  Stats.member(mdata)
							        })
						      	});


		                deferred.resolve({
		                  user:     user,
		                  groupId:  options.groupId,
		                  aggs:     aggs,
		                  members:  mems,
		                  synced:   new Date().getTime(),
		                  periods: {
		                    start:  options.stamps.start,
		                    end:    options.stamps.end
		                  }
		                });
						      },
						      function (error)
						      {
						        deferred.resolve({error: error});
						      }
						    );

	              /**
	               * Run the preloader
	               */
	              // preloader.init(members.length);

	              // angular.forEach(members, function (member, index)
	              // {
	              // 	calls.push(Slots.prototype.user({
	              //     user: member.uuid,
	              //     start:params.start,
	              //     end:  params.end,
	              //     type: 'both'
	              //   }));
	              // });

	              // $q.all(calls)
	              // .then(function (members)
	              // {
	              //   deferred.resolve({
	              //     user:     user,
	              //     groupId:  options.groupId,
	              //     aggs:     aggs,
	              //     members:  members,
	              //     synced:   new Date().getTime(),
	              //     periods: {
	              //       start:  options.stamps.start,
	              //       end:    options.stamps.end
	              //     }
	              //   });
	              // });
	            }
	            else
	            {
	              deferred.resolve({
	                user:     user,
	                groupId:  options.groupId,
	                aggs:     aggs,
	                synced:   new Date().getTime(),
	                periods: {
	                  start:  options.stamps.start,
	                  end:    options.stamps.end
	                }
	              });
	            }
	          });
	        }
	        else
	        {
	          deferred.resolve({
	            user:   user,
	            synced: new Date().getTime(),
	            periods: {
	              start:  options.stamps.start,
	              end:    options.stamps.end
	            }
	          });
	        }
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * Fetch user slots
	   * This is needed as a seperate promise object
	   * for making the process wait in Slots.all call bundle
	   */
	  Slots.prototype.user = function (params) 
	  {
	    var deferred = $q.defer();

	    Slots.query(params, 
	      function (result) 
	      {
	      	/**
	      	 * Countdown on preloader
	      	 */
					preloader.count();

	        deferred.resolve({
	          id:     params.user,
	          data:   result,
	          stats:  Stats.member(result)
	        });
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * Return local slots
	   */
	  Slots.prototype.local = function () { return angular.fromJson(Storage.get('slots')); };


	  /**
	   * Slot adding process
	   */
	  Slots.prototype.add = function (slot, user) 
	  {
	    var deferred = $q.defer();

	    Slots.save({user: user}, slot,
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


	  /**
	   * TODO: Add back-end
	   * Check whether slot is being replaced on top of an another
	   * slot of same sort. If so combine them silently and show them as
	   * one slot but keep aligned with back-end, like two or more slots 
	   * in real.
	   * 
	   * Slot changing process
	   */
	  Slots.prototype.change = function (original, changed, user) 
	  {
	    var deferred = $q.defer();

	    Slots.change(angular.extend(naturalize(changed), {user: user}), naturalize(original), 
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


	  /**
	   * Slot delete process
	   */
	  Slots.prototype.remove = function (slot, user) 
	  {
	    var deferred = $q.defer();

	    Slots.remove(angular.extend(naturalize(slot), {user: user}), 
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
	  

	  /**
	   * Naturalize Slot for back-end injection
	   */
	  function naturalize (slot)
	  {
	    var content = angular.fromJson(slot.content);

	    return {
	      start:      Math.floor(new Date(slot.start).getTime() / 1000),
	      end:        Math.floor(new Date(slot.end).getTime() / 1000),
	      recursive:  content.recursive,
	      text:       content.state,
	      id:         content.id
	    }
	  }


	  /**
	   * Check whether slot extends from saturday to sunday and if recursive?
	   * 
	   * Produce timestamps for sunday 00:00 am through the year and
	   * check whether intended to change recursive slot has one of those
	   * timestamps, if so slice slot based on midnight and present as two
	   * slots in timeline.
	   */
	  // function checkForSatSun (slot) { };


	  /**
	   * Check for overlapping slots exists?
	   * 
	   * Prevent any overlapping slots by adding new slots or changing
	   * the current ones in front-end so back-end is almost always aligned with
	   * front-end.
	   */
	  // function preventOverlaps (slot) { };


	  /**
	   * Slice a slot from a give point
	   */
	  // function slice (slot, point) { };


	  /**
	   * Combine two slots
	   */
	  // function combine (slots) { };


	  return new Slots;


    /**
     * Get group aggs for pie charts
     */
//    Slots.prototype.pie = function (options)
//    {
//      var deferred  = $q.defer(),
//        now       = Math.floor(Date.now().getTime() / 1000),
//        periods   = Dater.getPeriods(),
//        current   = Dater.current.week(),
//        weeks     = {
//          current:  {
//            period:   periods.weeks[current],
//            data:     [],
//            shortages:[]
//          },
//          next: {
//            period:   periods.weeks[current + 1],
//            data:     [],
//            shortages:[]
//          }
//        },
//        slicer = weeks.current.period.last.timeStamp;
//
//
//
//
//
//      Aggs.query(
//        {
//          id:     options.id,
//          start:  weeks.current.period.first.timeStamp / 1000,
//          end:    weeks.next.period.last.timeStamp / 1000
//        },
//        function (results)
//        {
//          var state;
//
////          console.warn('results ->', results);
//
//          // Check whether it is only one
//          if (results.length > 1)
//          {
//            angular.forEach(results, function (slot)
//            {
//              // Fish out the current
//              if (now >= slot.start && now <= slot.end) state = slot;
//
//              // Slice from end of first week
//              if (slicer <= slot.start * 1000)
//              {
//                weeks.next.data.push(slot);
//              }
//              else if (slicer >= slot.start * 1000)
//              {
//                weeks.current.data.push(slot)
//              }
//            });
//
//            // slice extra timestamp from the last of current week dataset and add that to week next
//            var last        = weeks.current.data[weeks.current.data.length-1],
//              next        = weeks.next.data[0],
//              difference  = (last.end * 1000 - slicer) / 1000,
//              currents    = [];
//
//            // if start of current of is before the start reset it to start
//            weeks.current.data[0].start = weeks.current.period.first.timeStamp / 1000;
//
//            // if there is a leak to next week adjust the last one of current week and add new slot to next week with same values
//            if (difference > 0)
//            {
//              last.end = slicer / 1000;
//
//              weeks.next.data.unshift({
//                diff:   last.diff,
//                start:  slicer / 1000,
//                end:    last.end,
//                wish:   last.wish
//              });
//            }
//
//            // shortages and back-end gives more than asked sometimes, with returning values out of the range which being asked !
//            angular.forEach(weeks.current.data, function (slot)
//            {
//              if (slot.end - slot.start > 0) currents.push(slot);
//
//              // add to shortages
//              if (slot.diff < 0) weeks.current.shortages.push(slot);
//            });
//
//            // reset to start of current weekly begin to week begin
//            currents[0].start = weeks.current.period.first.timeStamp / 1000;
//
//            // add to shortages
//            angular.forEach(weeks.next.data, function (slot)
//            {
//              if (slot.diff < 0) weeks.next.shortages.push(slot);
//            });
//
//            deferred.resolve({
//              id:       options.id,
//              name:     options.name,
//              weeks:    {
//                current: {
//                  data:   currents,
//                  state:  state,
//                  shortages: weeks.current.shortages,
//                  start: {
//                    date:       new Date(weeks.current.period.first.timeStamp).toString($config.formats.date),
//                    timeStamp:  weeks.current.period.first.timeStamp
//                  },
//                  end: {
//                    date:       new Date(weeks.current.period.last.timeStamp).toString($config.formats.date),
//                    timeStamp:  weeks.current.period.last.timeStamp
//                  },
//                  ratios: Stats.pies(currents)
//                },
//                next: {
//                  data:   weeks.next.data,
//                  shortages: weeks.next.shortages,
//                  start: {
//                    date:       new Date(weeks.next.period.first.timeStamp).toString($config.formats.date),
//                    timeStamp:  weeks.next.period.first.timeStamp
//                  },
//                  end: {
//                    date:       new Date(weeks.next.period.last.timeStamp).toString($config.formats.date),
//                    timeStamp:  weeks.next.period.last.timeStamp
//                  },
//                  ratios: Stats.pies(weeks.next.data)
//                }
//              }
//            });
//          }
//          else
//          {
//            if (results[0].diff == null) results[0].diff = 0;
//            if (results[0].wish == null) results[0].wish = 0;
//
//            var currentWeek = [{
//                start:  weeks.current.period.first.timeStamp / 1000,
//                end:    weeks.current.period.last.timeStamp / 1000,
//                wish:   results[0].wish,
//                diff:   results[0].diff
//              }],
//              nextWeek = [{
//                start:  weeks.next.period.first.timeStamp / 1000,
//                end:    weeks.next.period.last.timeStamp / 1000,
//                wish:   results[0].wish,
//                diff:   results[0].diff
//              }];
//
//            if (currentWeek[0].diff < 0) weeks.current.shortages.push(currentWeek[0]);
//            if (nextWeek[0].diff < 0) weeks.next.shortages.push(nextWeek[0]);
//
//            deferred.resolve({
//              id:       options.id,
//              name:     options.name,
//              weeks:    {
//                current: {
//                  data: currentWeek,
//                  state: currentWeek,
//                  shortages: weeks.current.shortages,
//                  start: {
//                    date:       new Date(weeks.current.period.first.timeStamp).toString($config.formats.date),
//                    timeStamp:  weeks.current.period.first.timeStamp
//                  },
//                  end: {
//                    date:       new Date(weeks.current.period.last.timeStamp).toString($config.formats.date),
//                    timeStamp:  weeks.current.period.last.timeStamp
//                  },
//                  ratios: Stats.pies(currentWeek)
//                },
//                next: {
//                  data: nextWeek,
//                  shortages: weeks.next.shortages,
//                  start: {
//                    date:       new Date(weeks.next.period.first.timeStamp).toString($config.formats.date),
//                    timeStamp:  weeks.next.period.first.timeStamp
//                  },
//                  end: {
//                    date:       new Date(weeks.next.period.last.timeStamp).toString($config.formats.date),
//                    timeStamp:  weeks.next.period.last.timeStamp
//                  },
//                  ratios: Stats.pies(nextWeek)
//                }
//              }
//            });
//          }
//        },
//        function (error)
//        {
//          deferred.resolve({error: error});
//        }
//      );
//
//
//
//
//
//
//
//      return deferred.promise;
//    };
	}
]);
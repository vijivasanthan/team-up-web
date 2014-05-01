define(
	['services/services', 'config'],
	function (services, config)
	{
		'use strict';

		services.factory(
			'Slots',
			[
				'$rootScope', '$resource', '$q', 'Storage', 'Dater',
				function ($rootScope, $resource, $q, Storage, Dater)
				{
					var Slots = $resource(
							config.app.host + config.app.namespace + '/tasks/:taskId',
							{},
							{
								query:  {
									method:  'GET',
									params:  {
										start: '',
										end:   ''
									},
									isArray: true
								},
								change: {
									method: 'PUT'
								},
								save:   {
									method: 'POST'
								},
								remove: {
									method: 'DELETE'
								}
							}
					);

					var Aggs = $resource(
							config.app.host + '/calc_planning/:id',
							{},
							{
								query: {
									method:  'GET',
									params:  {
										id:    '',
										start: '',
										end:   ''
									},
									isArray: true
								}
							}
					);

					var Wishes = $resource(
							config.app.host + '/network/:id/wish',
							{},
							{
								query: {
									method:  'GET',
									params:  {
										id:    '',
										start: '',
										end:   ''
									},
									isArray: true
								},
								save:  {
									method: 'PUT',
									params: {
										id: ''
									}
								}
							}
					);

					Slots.prototype.wishes = function (options)
					{
						var deferred = $q.defer(),
						    params = {
							    id:    options.id,
							    start: options.start,
							    end:   options.end
						    };

						Wishes.query(
							params,
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
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
							    start:     options.start,
							    end:       options.end,
							    wish:      options.wish,
							    recurring: options.recursive
						    };

						Wishes.save(
							{
								id: options.id
							},
							params,
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};

					Slots.prototype.aggs = function (options)
					{
						var deferred = $q.defer(),
						    params = {
							    id:    options.id,
							    start: options.start,
							    end:   options.end
						    };

						if (options.division != undefined) params.stateGroup = options.division;

						Aggs.query(
							params,
							function (result)
							{
								var stats = Stats.aggs(result);

								Slots.prototype.wishes(params)
									.then(
									function (wishes)
									{
										deferred.resolve(
											{
												id:        options.id,
												division:  options.division,
												wishes:    wishes,
												data:      result,
												ratios:    stats.ratios,
												durations: stats.durations
											});
									});
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};

					Slots.prototype.pie = function (options)
					{
						var deferred = $q.defer(),
						    now = Math.floor(Date.now().getTime() / 1000),
						    periods = Dater.getPeriods(),
						    current = Dater.current.week(),
						    weeks = {
							    current: {
								    period:    periods.weeks[current],
								    data:      [],
								    shortages: []
							    },
							    next:    {
								    period:    periods.weeks[current + 1],
								    data:      [],
								    shortages: []
							    }
						    },
						    slicer = weeks.current.period.last.timeStamp;

						Aggs.query(
							{
								id: options.id,
								start: weeks.current.period.first.timeStamp / 1000,
								end: weeks.next.period.last.timeStamp / 1000
							},
							function (results)
							{
								var state;

								if (results.length > 1)
								{
									angular.forEach(
										results, function (slot)
										{
											if (now >= slot.start && now <= slot.end) state = slot;

											if (slicer <= slot.start * 1000)
											{
												weeks.next.data.push(slot);
											}
											else if (slicer >= slot.start * 1000)
											{
												weeks.current.data.push(slot)
											}
										});

									var last = weeks.current.data[weeks.current.data.length - 1],
									    next = weeks.next.data[0],
									    difference = (last.end * 1000 - slicer) / 1000,
									    currents = [];

									weeks.current.data[0].start = weeks.current.period.first.timeStamp / 1000;

									if (difference > 0)
									{
										last.end = slicer / 1000;

										weeks.next.data.unshift(
											{
												diff: last.diff,
												start: slicer / 1000,
												end:  last.end,
												wish: last.wish
											});
									}

									angular.forEach(
										weeks.current.data, function (slot)
										{
											if (slot.end - slot.start > 0) currents.push(slot);

											if (slot.diff < 0) weeks.current.shortages.push(slot);
										});

									currents[0].start = weeks.current.period.first.timeStamp / 1000;

									angular.forEach(
										weeks.next.data, function (slot)
										{
											if (slot.diff < 0) weeks.next.shortages.push(slot);
										});

									deferred.resolve(
										{
											id:    options.id,
											name:  options.name,
											weeks: {
												current: {
													data:      currents,
													state:     state,
													shortages: weeks.current.shortages,
													start:     {
														date:      new Date(weeks.current.period.first.timeStamp).toString(config.app.formats.date),
														timeStamp: weeks.current.period.first.timeStamp
													},
													end:       {
														date:      new Date(weeks.current.period.last.timeStamp).toString(config.app.formats.date),
														timeStamp: weeks.current.period.last.timeStamp
													},
													ratios:    Stats.pies(currents)
												},
												next:    {
													data:      weeks.next.data,
													shortages: weeks.next.shortages,
													start:     {
														date:      new Date(weeks.next.period.first.timeStamp).toString(config.app.formats.date),
														timeStamp: weeks.next.period.first.timeStamp
													},
													end:       {
														date:      new Date(weeks.next.period.last.timeStamp).toString(config.app.formats.date),
														timeStamp: weeks.next.period.last.timeStamp
													},
													ratios:    Stats.pies(weeks.next.data)
												}
											}
										});
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

									deferred.resolve(
										{
											id:    options.id,
											name:  options.name,
											weeks: {
												current: {
													data:      currentWeek,
													state:     currentWeek,
													shortages: weeks.current.shortages,
													start:     {
														date:      new Date(weeks.current.period.first.timeStamp).toString(config.app.formats.date),
														timeStamp: weeks.current.period.first.timeStamp
													},
													end:       {
														date:      new Date(weeks.current.period.last.timeStamp).toString(config.app.formats.date),
														timeStamp: weeks.current.period.last.timeStamp
													},
													ratios:    Stats.pies(currentWeek)
												},
												next:    {
													data:      nextWeek,
													shortages: weeks.next.shortages,
													start:     {
														date:      new Date(weeks.next.period.first.timeStamp).toString(config.app.formats.date),
														timeStamp: weeks.next.period.first.timeStamp
													},
													end:       {
														date:      new Date(weeks.next.period.last.timeStamp).toString(config.app.formats.date),
														timeStamp: weeks.next.period.last.timeStamp
													},
													ratios:    Stats.pies(nextWeek)
												}
											}
										});
								}
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};

					var preloader = {
						init: function (total)
						{
							$rootScope.app.preloader = {
								status: true,
								total:  total,
								count:  0
							}
						},

						count: function ()
						{
							$rootScope.app.preloader.count = Math.abs(
								Math.floor($rootScope.app.preloader.count + (100 / $rootScope.app.preloader.total))
							);
						}
					};

					Slots.prototype.all = function (options)
					{
						var deferred = $q.defer(),
						    periods = Dater.getPeriods(),
						    params = {
							    user: angular.fromJson(Storage.get('resources')).uuid, // user hardcoded!!
							    start: options.stamps.start / 1000,
							    end: options.stamps.end / 1000
						    },
						    data = {};

						Slots.query(
							params,
							function (user)
							{
								if (options.layouts.group)
								{
									var groupParams = {
										id:    options.groupId,
										start: params.start,
										end:   params.end,
										month: options.month
									};

									if (options.division != 'all') groupParams.division = options.division;

									Slots.prototype.aggs(groupParams)
										.then(
										function (aggs)
										{
											if (options.layouts.members)
											{
												var members = angular.fromJson(Storage.get(options.groupId)),
												    calls = [];

												preloader.init(members.length);

												angular.forEach(
													members, function (member)
													{
														calls.push(
															Slots.prototype.user(
																{
																	user:  member.uuid,
																	start: params.start,
																	end:   params.end,
																	type:  'both'
																}));
													});

												$q.all(calls)
													.then(
													function (members)
													{
														deferred.resolve(
															{
																user:    user,
																groupId: options.groupId,
																aggs:    aggs,
																members: members,
																synced:  new Date().getTime(),
																periods: {
																	start: options.stamps.start,
																	end:   options.stamps.end
																}
															});
													});
											}
											else
											{
												deferred.resolve(
													{
														user:    user,
														groupId: options.groupId,
														aggs:    aggs,
														synced:  new Date().getTime(),
														periods: {
															start: options.stamps.start,
															end:   options.stamps.end
														}
													});
											}
										});
								}
								else
								{
									deferred.resolve(
										{
											user:    user,
											synced:  new Date().getTime(),
											periods: {
												start: options.stamps.start,
												end:   options.stamps.end
											}
										});
								}
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};

					Slots.prototype.user = function (params)
					{
						var deferred = $q.defer();

						Slots.query(
							params,
							function (result)
							{
								preloader.count();

								deferred.resolve(
									{
										id:    params.user,
										data:  result,
										stats: Stats.member(result)
									});
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};

					Slots.prototype.local = function () { return angular.fromJson(Storage.get('slots')); };

					Slots.prototype.add = function (slot)
					{
						var deferred = $q.defer();

						Slots.save(
							slot,
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};

					Slots.prototype.update = function (slot)
					{
						var deferred = $q.defer();

						Slots.change(
							{
								taskId: slot.uuid
							},
							slot,
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};

					Slots.prototype.change = function (changed, user)
					{
						var deferred = $q.defer();

						Slots.change(
							angular.extend(naturalize(changed), { member: user }),
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};

					Slots.prototype.remove = function (tId)
					{
						var deferred = $q.defer();

						Slots.remove(
							{
								taskId: tId
							},
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};

					function naturalize (slot)
					{
						var content = angular.fromJson(slot.content);

						return {
							start: new Date(slot.start).getTime() / 1000,
							end: new Date(slot.end).getTime() / 1000,
							recursive: content.recursive,
							text:      content.state,
							id:        content.id
						}
					}

					return new Slots;
				}
			]);

	}
);
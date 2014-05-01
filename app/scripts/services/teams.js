define(
	['services/services', 'config'],
	function (services, config)
	{
		'use strict';

		services.factory(
			'Teams',
			[
				'$resource', '$q', 'Storage', '$rootScope',
				function ($resource, $q, Storage, $rootScope)
				{
					var Teams = $resource(
							config.app.host + config.app.namespace + '/team/',
							{},
							{
								query:  {
									method:  'GET',
									params:  {},
									isArray: true
								},
								get:    {
									method: 'GET',
									params: { id: '' }
								},
								save:   {
									method: 'POST',
									params: { id: '' }
								},
								edit:   {
									method: 'PUT',
									params: { id: '' }
								},
								remove: {
									method: 'DELETE',
									params: { id: '' }
								}
							}
					);

					var TeamStatus = $resource(
							config.app.host + config.app.namespace + '/team/status/:teamId/',
							{},
							{
								query: {
									method:  'GET',
									params:  {},
									isArray: true
								}
							});

					var Team = $resource(
							config.app.host + config.app.namespace + '/team/:teamId/',
							{},
							{
								edit: {
									method: 'PUT'
								},
								del:  {
									method: 'DELETE'
								}
							});

					var Members = $resource(
							config.app.host + config.app.namespace + '/team/:teamId/member',
							{},
							{
								save: {
									method: 'POST'
								}
							});

					var RemoveMembers = $resource(
							config.app.host + config.app.namespace + '/team/:teamId/removeMember',
							{},
							{
								remove: {
									method: 'PUT'
								}
							});

					var cGroup = $resource(
							config.app.host + config.app.namespace + '/team/:teamId/clientGroups',
							{},
							{
								query: {
									method:  'GET',
									params:  {},
									isArray: true
								},
								add:   {
									method: 'POST'
								}
							});

					var unAssignGroups = $resource(
							config.app.host + config.app.namespace + '/team/:teamId/unAssignClientGroups',
							{},
							{
								unssign: {
									method: 'PUT'
								}
							});

					var updateGroups = $resource(
							config.app.host + config.app.namespace + '/team/:teamId/updateClientGroups',
							{},
							{
								update: {
									method: 'PUT'
								}
							});

					var updateMembers = $resource(
							config.app.host + config.app.namespace + '/team/:teamId/updateMembers',
							{},
							{
								update: {
									method: 'PUT'
								}
							});

					var Member = $resource(
							config.app.host + config.app.namespace + '/team/member',
							{},
							{
								save: {
									method: 'POST'
								}
							});

					var TeamTasks = $resource(
							config.app.host + config.app.namespace + '/team/:teamId/tasks',
							{},
							{
								query: {
									method:  'GET',
									params:  {
										from: '',
										to:   ''
									},
									isArray: true
								}
							});

					var MembersNotInTeam = $resource(
							config.app.host + config.app.namespace + '/team/members',
							{},
							{
								query: {
									method:  'GET',
									isArray: true
								}
							});

					var RemoveMember = $resource(
							config.app.host + config.app.namespace + '/team/member/:memberId',
							{},
							{
								remove: {
									method: 'DELETE'
								}
							});


					Teams.prototype.addMember = function (id, memberIds)
					{
						var deferred = $q.defer();

						Members.save(
							{
								teamId: id
							},
							memberIds,
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};


					Teams.prototype.delMember = function (tId, memberIds)
					{
						var deferred = $q.defer();

						RemoveMembers.remove(
							{
								teamId: tId
							},
							memberIds,
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};


					Teams.prototype.addGroup = function (id, groupIds)
					{
						var deferred = $q.defer();

						cGroup.add(
							{
								teamId: id
							},
							groupIds,
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};


					Teams.prototype.delGroup = function (tId, groupIds)
					{
						var deferred = $q.defer();

						unAssignGroups.unssign(
							{
								teamId: tId
							},
							groupIds,
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};


					Teams.prototype.updateGroup = function (tId, changes)
					{
						var deferred = $q.defer();

						updateGroups.update(
							{
								teamId: tId
							},
							changes,
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};


					Teams.prototype.updateMemberRelation = function (tId, changes)
					{
						var deferred = $q.defer();

						updateMembers.update(
							{
								teamId: tId
							},
							changes,
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};


					Teams.prototype.query = function (only, routePara)
					{
						var deferred = $q.defer();

						Teams.query(
							function (teams)
							{
								Storage.add('Teams', angular.toJson(teams));

								if (! only)
								{
									var calls = [];

									angular.forEach(
										teams, function (team)
										{
											if (routePara.uuid)
											{
												if (routePara.uuid == team.uuid)
												{
													calls.push(Teams.prototype.get(team.uuid));
												}
											}
											else
											{
												calls.push(Teams.prototype.get(team.uuid));
											}
										});

									$q.all(calls)
										.then(
										function (results)
										{
											var data = {};

											data.members = {};

											angular.forEach(
												teams, function (team)
												{
													data.teams = teams;

													data.members[team.uuid] = [];

													angular.forEach(
														results, function (result)
														{
															if (routePara.uuid)
															{
																if (result.id == team.uuid && routePara.uuid == team.uuid)
																{
																	data.members[team.uuid] = result.data;
																}
																else
																{
																	data.members[team.uuid] = angular.fromJson(Storage.get(team.uuid));
																}
															}
															else
															{
																if (result.id == team.uuid)
																{
																	data.members[team.uuid] = result.data;
																}
															}
														});
												});

											deferred.resolve(data);
										});
								}
								else
								{
									deferred.resolve(teams);
								}

							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};


					Teams.prototype.queryLocal = function ()
					{
						var deferred = $q.defer();

						var teams_local = angular.fromJson(Storage.get("Teams"));
						var data = {};

						data.teams = teams_local;
						data.members = {};

						angular.forEach(
							teams_local, function (team)
							{
								data.members[team.uuid] = angular.fromJson(Storage.get(team.uuid));
							});

						deferred.resolve(data);

						return deferred.promise;
					};


					Teams.prototype.get = function (id)
					{
						var deferred = $q.defer();

						TeamStatus.query(
							{
								teamId: id
							},
							function (result)
							{
								var returned = (result.length == 4 && result[0][0] == 'n' && result[1][0] == 'u') ? [] : result;

								Storage.add(id, angular.toJson(returned));

								deferred.resolve(
									{
										id:   id,
										data: returned
									});
							},
							function (error) { deferred.resolve({error: error})}
						);

						return deferred.promise;
					};


					Teams.prototype.save = function (team)
					{
						var deferred = $q.defer();

						Teams.save(
							{
								id: $rootScope.app.resources.uuid
							},
							team,
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};


					Teams.prototype.saveMember = function (member)
					{
						var deferred = $q.defer();

						Member.save(
							{},
							member,
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};


					Teams.prototype.edit = function (team)
					{
						var deferred = $q.defer();

						if (team.uuid)
						{
							Team.edit(
								{
									teamId: team.uuid
								},
								team,
								function (result)
								{
									deferred.resolve(result);
								});
						}

						return deferred.promise;
					};


					Teams.prototype.loadImg = function (imgURL)
					{
						var LoadImg = $resource(
							imgURL,
							{
								width:  40,
								height: 40
							},
							{
								get: {
									method: 'GET'
								}
							}
						);

						var deferred = $q.defer();

						LoadImg.get(
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve(error) });

						return deferred.promise;
					};


					Teams.prototype.loadTeamCallinNumber = function (teamUuid)
					{
						var TeamNumber = $resource(
								config.app.host + config.app.namespace + '/team/:teamId/phone',
								{},
								{
									get: {
										method: 'GET'
									}
								});

						var deferred = $q.defer();

						TeamNumber.get(
							{
								teamId: teamUuid
							},
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error})}
						);

						return deferred.promise;
					};


					Teams.prototype.queryClientGroups = function (teams)
					{
						var deferred = $q.defer();

						var calls = [];

						angular.forEach(
							teams, function (team)
							{
								calls.push(Teams.prototype.getGroup(team.uuid));
							});

						$q.all(calls).then(
							function (results)
							{
								var data = {};

								data.groups = {};

								angular.forEach(
									teams, function (team)
									{
										data.teams = teams;

										data.groups[team.uuid] = [];

										angular.forEach(
											results, function (result)
											{
												data.groups[team.uuid] = result.data;
											});
									});

								deferred.resolve(data);
							});

						return deferred.promise;
					};


					Teams.prototype.getGroup = function (id)
					{
						var deferred = $q.defer();

						cGroup.query(
							{
								teamId: id
							},
							function (result)
							{
								var returned = (result.length == 4 && result[0][0] == 'n' && result[1][0] == 'u') ? [] : result;

								Storage.add("teamGroup_" + id, angular.toJson(returned));

								deferred.resolve(
									{
										id:   id,
										data: returned
									});
							},
							function (error) { deferred.resolve({error: error})}
						);

						return deferred.promise;
					};


					Teams.prototype.manage = function (changes)
					{
						var deferred = $q.defer();

						var calls = [];

						angular.forEach(
							changes, function (change, teamId)
							{
								if (change.a.length > 0 && change.r.length == 0)
								{
									calls.push(
										Teams.prototype.addMember(
											teamId, {
												ids: change.a
											}));
								}

								if (change.r.length > 0 && change.a.length == 0)
								{
									calls.push(
										Teams.prototype.delMember(
											teamId, {
												ids: change.r
											}));
								}

								if (change.a.length > 0 && change.r.length > 0)
								{
									calls.push(
										Teams.prototype.updateMemberRelation(
											teamId, {
												remove: change.r,
												add:    change.a
											}));
								}
							});

						$q.all(calls).then(
							function ()
							{
								var queryCalls = [];
								var data = {};

								angular.forEach(
									changes, function (change, teamId)
									{
										queryCalls.push(Teams.prototype.get(teamId));
									});

								$q.all(queryCalls).then(function () { deferred.resolve(data) });
							});

						return deferred.promise;
					};


					/**
					 * add or remove the client group from the teams
					 */
					Teams.prototype.manageGroups = function (changes)
					{
						var deferred = $q.defer();

						var calls = [];

						angular.forEach(
							changes, function (change, teamId)
							{
								if (change.a.length > 0 && change.r.length == 0)
								{
									calls.push(
										Teams.prototype.addGroup(
											teamId, {
												ids: change.a
											}));
								}

								if (change.r.length > 0 && change.a.length == 0)
								{
									calls.push(
										Teams.prototype.delGroup(
											teamId, {
												ids: change.r
											}));
								}

								if (change.a.length > 0 && change.r.length > 0)
								{
									// to prevent the race condition when do "removing and adding " on a team at same time
									// so just create new REST call to do it backend
									calls.push(
										Teams.prototype.updateGroup(
											teamId, {
												remove: change.r,
												add:    change.a
											}));
								}
							});

						$q.all(calls).then(
							function (changeResults)
							{
								var data = changeResults;
								var queryCalls = [];

								angular.forEach(
									changes, function (change, teamId)
									{
										queryCalls.push(Teams.prototype.getGroup(teamId));
									});

								$q.all(queryCalls).then(function () { deferred.resolve(data) });
							});

						return deferred.promise;
					};


					Teams.prototype.getTeamTasks = function (id, start, end)
					{
						var deferred = $q.defer();

						TeamTasks.query(
							{
								teamId: id, from: start, to: end
							},
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};


					Teams.prototype.queryMembersNotInTeams = function ()
					{
						var deferred = $q.defer();

						MembersNotInTeam.query(
							{},
							function (result)
							{
								Storage.add("members", angular.toJson(result));

								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error })}
						);

						return deferred.promise;
					};


					Teams.prototype.deleteTeam = function (id)
					{
						var deferred = $q.defer();

						Team.delete(
							{
								teamId: id
							},
							function (result)
							{
								deferred.resolve(result.result);
							},
							function (error) { deferred.resolve({error: error })}
						);

						return deferred.promise;
					};


					Teams.prototype.deleteMember = function (id)
					{
						var deferred = $q.defer();

						RemoveMember.remove(
							{
								memberId: id
							},
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error })}
						);

						return deferred.promise;
					};


					return new Teams;
				}
			]
		);
	}
);
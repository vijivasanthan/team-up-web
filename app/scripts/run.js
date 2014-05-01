define(
	['app', 'config', 'localization'],
	function (app, config, localization)
	{
		'use strict';

		app.run(
			[
				'$rootScope', '$location', '$timeout', 'Session', 'Storage', '$window', 'Teams', 'Dater',
				function ($rootScope, $location, $timeout, Session, Storage, $window, Teams, Dater)
				{
					$rootScope.config = config.app;

					$rootScope.config.init();

					$rootScope.browser = $.browser;

					angular.extend(
						$rootScope.browser, {
							screen: $window.screen
						});

					if ($rootScope.browser.ios)
					{
						angular.extend(
							$rootScope.browser, {
								landscape: Math.abs($window.orientation) == 90 ? true : false,
								portrait: Math.abs($window.orientation) != 90 ? true : false
							});
					}
					else
					{
						angular.extend(
							$rootScope.browser, {
								landscape: Math.abs($window.orientation) != 90 ? true : false,
								portrait: Math.abs($window.orientation) == 90 ? true : false
							});
					}

					$window.onresize = function () { $rootScope.browser.screen = $window.screen };

					$window.onorientationchange = function ()
					{
						$rootScope.$apply(
							function ()
							{
								if ($rootScope.browser.ios)
								{
									angular.extend(
										$rootScope.browser, {
											landscape: Math.abs($window.orientation) == 90 ? true : false,
											portrait: Math.abs($window.orientation) != 90 ? true : false
										});
								}
								else
								{
									angular.extend(
										$rootScope.browser, {
											landscape: Math.abs($window.orientation) != 90 ? true : false,
											portrait: Math.abs($window.orientation) == 90 ? true : false
										});
								}
							});
					};

					var ui = localization.ui;

					$rootScope.changeLanguage = function (lang) { $rootScope.ui = ui[lang] };
					$rootScope.ui = ui[$rootScope.config.lang];

					if (! Storage.get('periods') || Storage.get('periods') == null) Dater.registerPeriods();

					$rootScope.app = $rootScope.app || {};

					$rootScope.app.resources = angular.fromJson(Storage.get('resources'));

					$rootScope.statusBar =
					{
						init: function ()
						{
							$rootScope.loading = {
								status:  false,
								message: 'Loading..'
							};
						},

						display: function (message)
						{
							$rootScope.loading = {
								status:  true,
								message: message
							};
						},

						off: function () { $rootScope.loading.status = false }
					};

					$rootScope.statusBar.init();

					$rootScope.notification = {
						status:  false,
						type:    '',
						message: ''
					};

					$rootScope.notifier =
					{
						init: function (status, type, message)
						{
							$rootScope.notification.status = true;

							if ($rootScope.browser.mobile && status == true)
							{
								$window.alert(message);
							}
							else
							{
								$rootScope.notification = {
									status:  status,
									type:    type,
									message: message
								};
							}
						},

						success: function (message, permanent)
						{
							this.init(true, 'alert-success', message);

							if (! permanent) this.destroy();
						},

						error: function (message, permanent)
						{
							this.init(true, 'alert-danger', message);

							if (! permanent) this.destroy();
						},

						destroy: function ()
						{
							setTimeout(
								function ()
								{
									$rootScope.notification.status = false;
								}, 5000);
						}
					};

					$rootScope.notifier.init(false, '', '');

					$rootScope.nav = function (tabName)
					{
						if ($location.path() == "/manage")
						{
							if ($rootScope.checkDataChangedInManage())
							{
								return;
							}
						}

						switch (tabName)
						{
							case 'team':
								$location.path("/team").search({local: "true"}).hash("team");
								break;
							case 'client':
								$location.path("/client").search({local: "true"}).hash("client");
								break;
							case 'planboard':
								$location.path("/planboard").search({local: "true"}).hash("teams");
								break;
							case 'profile':
								$location.path("/profile").search({local: "true"}).hash("");
								break;
							case 'logout':
								$location.path("/logout");
								break;
							default:
								console.log("scope nav : " + tabName);
						}
					};

					$rootScope.checkDataChangedInManage = function ()
					{
						var changes = {};

						if ($location.hash() == "teamClients")
						{
							var argument = $rootScope.$$childTail.$$childTail.getData.teamClients();

							changes = $rootScope.$$childTail.getChangesFromTeamClients(argument);
						}
						else if ($location.hash() == "teams")
						{
							var preTeams = $rootScope.$$childTail.connections.teams;
							var afterTeams = $rootScope.$$childTail.$$childTail.getData.teams();

							changes = $rootScope.$$childTail.getChanges(preTeams, afterTeams);
						}
						else if ($location.hash() == "clients")
						{
							var preClients = $rootScope.$$childTail.connections.clients;
							var afterClients = $rootScope.$$childTail.$$childTail.getData.clients();

							changes = $rootScope.$$childTail.getChanges(preClients, afterClients);
						}

						if (angular.equals({}, changes))
						{
							// console.log("no changes ! ");
							return false;
						}
						else
						{
							if (! confirm($rootScope.ui.teamup.managePanelchangePrompt))
							{
								return true;
							}
						}
					};

					$rootScope.$on(
						'$routeChangeStart', function ()
						{

							function resetLoaders ()
							{
								$rootScope.loaderIcons = {
									general:  false,
									teams:    false,
									clients:  false,
									messages: false,
									manage:   false,
									profile:  false,
									settings: false
								};
							}

							resetLoaders();

							switch ($location.path())
							{
								case '/team':
									$rootScope.loaderIcons.team = true;

									$rootScope.location = 'team';
									break;

								case '/client':
									$rootScope.loaderIcons.client = true;

									$rootScope.location = 'cilent';
									break;

								case '/messages':
									$rootScope.loaderIcons.messages = true;

									$rootScope.location = 'messages';
									break;

								case '/manage':
									$rootScope.loaderIcons.messages = true;

									$rootScope.location = 'manage';
									break;

								case '/logout':

									$rootScope.location = 'logout';

									var logindata = angular.fromJson(Storage.get('logindata'));

									Storage.clearAll();

									if (logindata.remember)
									{
										Storage.add(
											'logindata', angular.toJson(
												{
													username: logindata.username,
													password: logindata.password,
													remember: logindata.remember
												}));
									}

									break;

								default:
									if ($location.path().match(/profile/))
									{
										$rootScope.loaderIcons.profile = true;

										$rootScope.location = 'profile';
									}
									else
									{
										$rootScope.loaderIcons.general = true;
									}
							}

							if (! Session.check()) $location.path("/login");

							$rootScope.loadingBig = true;

							$rootScope.statusBar.display('Loading..');

							$rootScope.location = $location.path().substring(1);

							$('div[ng-view]').hide();
						});

					$rootScope.$on(
						'$routeChangeSuccess', function ()
						{
							$rootScope.newLocation = $location.path();

							$rootScope.loadingBig = false;

							$rootScope.statusBar.off();

							$('div[ng-view]').show();
						});

					$rootScope.$on(
						'$routeChangeError', function (event, current, previous, rejection)
						{
							$rootScope.notifier.error(rejection);
						});

					/**
					 * Fix styles
					 */
					$rootScope.fixStyles = function ()
					{
						var tabHeight = $('.tabs-left .nav-tabs').height();

						$.each(
							$('.tab-content').children(), function ()
							{
								var $this = $(this).attr('id'),
								    contentHeight = $('.tabs-left .tab-content #' + $this).height();

								if (tabHeight > contentHeight)
								{
									$('.tabs-left .tab-content #' + $this).css(
										{
											height: $('.tabs-left .nav-tabs').height() + 6
										});
								}
								else if (contentHeight > tabHeight)
								{
									// $('.tabs-left .nav-tabs').css( { height: contentHeight } );
								}
							});

						if ($.os.mac || $.os.linux)
						{
							$('.nav-tabs-app li a span').css(
								{
									paddingTop:   '10px',
									marginBottom: '0px'
								});
						}
					};

					if ($.os.windows)
					{
						$('#loading p').css(
							{
								paddingTop: '130px'
							});
					}

					$rootScope.getTeamMemberById = function (memberId)
					{
						var teams_local = angular.fromJson(Storage.get("Teams"));
						var member;

						angular.forEach(
							teams_local, function (team)
							{
								var mems = angular.fromJson(Storage.get(team.uuid));

								angular.forEach(
									mems, function (mem)
									{
										if (mem.uuid == memberId)
										{
											member = mem;
											return;
										}
									});
							});

						if (typeof member == "undefined")
						{
							member = {
								uuid:      memberId,
								firstName: memberId,
								lastName:  ''
							};
						}

						return member;
					};

					$rootScope.getClientByID = function (clientId)
					{
						var ret;
						var clients_Not_In_Group = angular.fromJson(Storage.get("clients"));

						angular.forEach(
							clients_Not_In_Group, function (client)
							{
								if (clientId == client.uuid)
								{
									ret = client;
									return;
								}
							});

						if (ret == null)
						{
							var groups = angular.fromJson(Storage.get("ClientGroups"));
							angular.forEach(
								groups, function (group)
								{
									var cts = angular.fromJson(Storage.get(group.id));

									angular.forEach(
										cts, function (client)
										{
											if (client.uuid = clientId)
											{
												ret = client;
												return;
											}
										});

								});
						}

						return ret;
					};

					/**
					 * Here we need to find the clients for this team member,
					 * 1> get the team,
					 * 2> find the groups belong to this team,
					 * 3> get all the clients under the group
					 */
					$rootScope.getClientsByTeam = function (teamIds)
					{
						var clients = [];
						var clientIds = [];

						angular.forEach(
							teamIds, function (teamId)
							{
								var teamGroups = angular.fromJson(Storage.get('teamGroup_' + teamId));

								angular.forEach(
									teamGroups, function (teamGrp)
									{
										var gMembers = angular.fromJson(Storage.get(teamGrp.id));

										angular.forEach(
											gMembers, function (mem)
											{
												if (clientIds.indexOf(mem.uuid) == - 1)
												{
													clientIds.push(mem.uuid);

													var clt = {uuid: mem.uuid, name: mem.firstName + " " + mem.lastName};

													clients.push(clt);
												}
											});
									});
							});

						return clients;
					};

					/**
					 * Here we need to find the team members that can actually take this client
					 * 1> get the team link to this client group ,
					 * 2> get the members in the team.
					 */
					$rootScope.getMembersByClient = function (clientGroup)
					{
						var members = [];
						var memberIds = [];
						var teams = angular.fromJson(Storage.get('Teams'));

						angular.forEach(
							teams, function (team)
							{
								var teamGroups = angular.fromJson(Storage.get('teamGroup_' + team.uuid));

								angular.forEach(
									teamGroups, function (teamGrp)
									{
										if (clientGroup == teamGrp.id)
										{
											var mebrs = angular.fromJson(Storage.get(team.uuid));

											angular.forEach(
												mebrs, function (mem)
												{
													if (memberIds.indexOf(mem.uuid) == - 1)
													{
														memberIds.push(mem.uuid);

														var tm = {uuid: mem.uuid, name: mem.firstName + " " + mem.lastName};

														members.push(tm);
													}
												});
										}
									});
							});

						return members;
					};

					$rootScope.getAvatarURL = function (userId)
					{
						var avatarURLs = angular.fromJson(Storage.get("avatarUrls"));
						var ret = '';

						angular.forEach(
							avatarURLs, function (avatar)
							{
								if (avatar.userId == userId)
								{
									ret = avatar.url;
								}
							});
						return ret;
					};
				}
			]
		);
	}
);
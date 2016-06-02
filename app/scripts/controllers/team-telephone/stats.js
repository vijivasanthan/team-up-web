define(
	['../controllers'],
	function(controllers)
	{
		'use strict';

		controllers.controller(
			'stats',
			function($rootScope,
			         $location,
			         $filter,
			         $timeout,
			         TeamUp,
			         Logs,
			         CurrentSelection,
			         Teams,
			         data,
			         moment)
			{
				$rootScope.fixStyles();

				//viewmodel
				var self = this;

				//properties
				self.data    = data;
				self.current = CurrentSelection.getTeamId();
				//self.ordered = 'started.stamp';
				//self.reversed = false;
				self.daterange = $filter('date')(data.logData.periods.startTime, 'dd-MM-yyyy') + ' / ' +
					$filter('date')(data.logData.periods.endTime, 'dd-MM-yyyy');
				initChart();

				//methods
				self.fetchLogs         = fetchLogs;

				//event receiver
				$rootScope.$on('getLogRange', function()
				{
					var periods                    = arguments[1];
					data.logData.periods.startTime = periods.startTime;
					data.logData.periods.endTime   = periods.endTime;

					self.fetchLogs();
				});

				/**
				 * Fetch logs by range for everyone or per team,
				 * the last option depends on the logged user role
				 */
				function fetchLogs()
				{
					var options = {
						startTime: data.logData.periods.startTime,
						endTime: data.logData.periods.endTime
					};

					$timeout(function()
					         {
						         $rootScope.statusBar.display($rootScope.ui.logs.loadLogs);
						         self.loadLogs = true;
					         });

					(self.current == 'all')
						? fetchForAllTeams(options)
						: fetchForSingleTeam(options);
				}

				/**
				 * Fetch logs per team
				 */
				function fetchForSingleTeam(options)
				{
					var _TeamTelephoneSettings = null;
					CurrentSelection.local     = self.current;

					//Check if the requested team has teamtelephone functionality by the adapterId
					Teams.getTeamTelephoneOptions(self.current)
					     .then(function(TeamTelephoneSettings)
					           {
						           _TeamTelephoneSettings = TeamTelephoneSettings;
						           options.adapterId      = TeamTelephoneSettings.adapterId;
						           return Teams.getSingle(self.current);//get the members of the team, so the phonenumbers could be translated to names
					           })
					     .then(function(members)
					           {
						           return Logs.fetch(
							           _.extend(options,
							                    {
								                    adapterId: options.adapterId,
								                    members: _.map(members, _.partialRight(_.pick, ['fullName', 'phone'])),//get only the fullname and phonenumber of the members
								                    currentTeam: {
									                    fullName: (_.find(
											                    self.data.teams, {uuid: self.current})
									                    ).name,//find the name of the requested team by the teamId(self.current)
									                    phone: _TeamTelephoneSettings.phoneNumber
								                    }
							                    }
							           )
						           );
					           })
					     .then(receiveLogs);
				}

				/**
				 * Fetch all logs
				 * @param options
				 */
				function fetchForAllTeams(options)
				{
					options.adapterId = null;
					Logs.fetch(options)
					    .then(receiveLogs);
				}

				/**
				 * Initialize bar charts based on the selected periods
				 * colums based on the call status finished or missed, depending
				 * if the caller was a client or a teammember, the last one is everytime the last column
				 * TODO define Chart instead of chart requireJS
				 * TODO some sort of auto login from mobile devices, copy the session and the current teamId
				 * TODO Remove the teamselector and add the teamId to the top
				 * TODO Make a toggle for each of the statusses
				 * TODO make some filters based on the amount of days selected, for example divide a month in weeks,
				 * instead of days, because 30 columns wil be to much to show on small screens
				 */
				function initChart()
				{
					var logsByDateSelection = getAllDatesSelection(
						    data.logData.periods.startTime,
						    data.logData.periods.endTime
					    ),
					    dateSelectionLabels = _.keys(logsByDateSelection),
					    handled = [], missed = [], teamMembers = [];

					/**
					 * Per call log date filter all finished, missed and calls by teammembers
					 */
					_.each(self.data.logData.logs, function(log)
					{
						var date = $filter('date')(log.started.stamp, 'dd-MM-yyyy');

						if( log.caller === 'member' ) logsByDateSelection[date].teamMember.push(log);
						else if( log.status === 'FINISHED' ) logsByDateSelection[date].finished.push(log);
						else if( log.status === 'MISSED' ) logsByDateSelection[date].missed.push(log);
					});

					/**
					 * Create 3 arrays of the different statuses and the the length of a specific status,
					 * so for every date there will be a status column with the number of logs
					 */
					_.each(dateSelectionLabels, function(date)
					{
						var log = logsByDateSelection[date];
						handled.push(log.finished.length || 0);
						missed.push(log.missed.length || 0);
						teamMembers.push(log.teamMember.length || 0);
					});

					// self.chartData = [
					//            1  2  3
					//finished   [3, 5, 7, 9, 12, 5, 6],
					//missed     [3, 5, 7, 5, 12, 5, 6],
					//teamMember [3, 5, 7, 7, 12, 5, 6]
					// ];
					self.chartData = [handled, missed, teamMembers];
					self.chartLabels = dateSelectionLabels;//_.union(_.keys(logsPerStatus), dateSelection);
					self.chartSeries = ['Afgerond', 'Gemist', 'Teamleden'];
					//brown, red, 'turq'
					self.chartColours = [
						{
							fillColor: '#833c11'
						},
						{
							fillColor: '#c85a3c'
						},
						{
							fillColor: '#1dc8b6'
						}
					];

					/**
					 * Get all dates in between a selection, for every date a object
					 * is made with the different status of logs
					 * @param startTime start of selection
					 * @param endTime end of selection
					 * @returns {Array} start and enddate and all dates in between inside a array
					 */
					function getAllDatesSelection(startTime, endTime)
					{
						var dateStart  = moment(startTime),
						    dateEnd    = moment(endTime),
						    timeValues = [];

						while(dateEnd > dateStart)
						{
							timeValues[dateStart.format('DD-MM-YYYY')] = {
								finished: [],
								missed: [],
								teamMember: []
							};
							dateStart.add(1, 'day');
						}
						return timeValues;
					}
				}

				/**
				 * Receive logs if the promise is fullfilled
				 * @param logData The logs per team of all teams
				 */
				function receiveLogs(logData)
				{
					console.error("logData ->", logData);

					self.loadLogs     = false;
					self.data.logData = logData;
					initChart();

					$rootScope.statusBar.off();
				}
			}
		);
	});
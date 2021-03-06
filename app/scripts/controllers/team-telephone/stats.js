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

				if($location.search().session)
				{
					angular.element('.dateranger').hide();
					angular.element('.btn-group').hide();
					angular.element('#wrap .container-fluid').css('padding', 0);
					angular.element('#groupTab p').css('padding-left', '10px');
				}

				//viewmodel
				var self = this;

				//properties
				self.data    = data;
				//remove this specified viewportheight, if the view needs to be responsive
				//and maintainAspectRatio must be true
				self.data.viewportHeight = (window.innerHeight * 0.7);
				console.error("viewport height", self.data.viewportHeight);
				self.current = CurrentSelection.getTeamId();

				self.datePeriod = 'day';
				self.daterange = $filter('date')(data.logData.periods.startTime, 'dd-MM-yyyy') + ' / ' +
					$filter('date')(data.logData.periods.endTime, 'dd-MM-yyyy');
				initChart();

				//methods
				self.fetchLogs         = fetchLogs;
				self.changeDatePeriod = changeDatePeriod;

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
					$location.search('teamId', self.current);

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
				 * Change the current period, so the bars in the chart
				 * are divived into the changed period
				 * @param datePeriod day, week, month
				 */
				function changeDatePeriod(datePeriod)
				{
					if(self.datePeriod !== datePeriod) initChart(datePeriod);
					self.datePeriod = datePeriod;
				}

				/**
				 * Get all datesperiods in between a selection, this could be days, weeks or months
				 * return a array with the date periods and a label, what will show on the X axis
				 * is made with the different status of logs
				 * @param startTime start of selection
				 * @param endTime end of selection
				 * @param period day, week or month
				 * @returns {Array} with the date periods and a label, what will show on the X axis
				 */
				function getAllDatesSelection(startTime, endTime, period)
				{
					var dateStart  = moment(startTime),
					    dateEnd    = moment(endTime),
					    timeValues = [],
					    dateSelectObj = function(dateStart, period)
					    {
						    return {
							    date: period.format(dateStart),
							    label: period.label(dateStart)
						    }
					    };

					while(dateEnd >= dateStart)
					{
						timeValues.push(dateSelectObj(dateStart, period));
						dateStart.add(1, period.name);
					}
					if(dateStart > dateEnd &&
            period.name !== 'day') timeValues.push(dateSelectObj(dateStart, period));
					return timeValues;
				}

				/**
				 * Initialize bar charts based on the selected periods
				 * colums based on the call status finished or missed, depending
				 * if the caller was a client or a teammember, the last one is everytime the last column
				 * TODO define Chart instead of chart requireJS
				 */
				function initChart(format)
				{
					var startTime = data.logData.periods.startTime,
					    endTime = data.logData.periods.endTime,
							//durationDaysSelection = moment(endTime).diff(startTime, 'days') + 1,
							datePeriod = {
								'day' : {
									name: 'day',
									date: function(date) { return date; },
									format: function(date) { return date.format('DD-MM-YYYY'); },
									label: function(date) { return date.format('dd') + " " + date.format('DD MMM'); }
								},
								'week' : {
									name: 'week',
									date: function(date) { return date.isoWeek(); },
									format: function(date) { return date.isoWeek(); },
									label: function(date)
									{
										return date.startOf('isoweek').format('DD MMM') + " - " + date.endOf('isoweek').format('DD MMM');
									}
								},
								'month' : {
									name: 'month',
									date: function(date) { return date.month(); },
									format: function(date) { return date.month(); },
									label: function(date) {
										return date.format('MMMM');
									}
								}
							},
							periodFormats = datePeriod[format || 'day'],
							logsByDateSelection = getAllDatesSelection(startTime, endTime, periodFormats);

					self.chart = { 
						data: getCharts(self.data.logData.logs, logsByDateSelection, periodFormats.format), 
						labels: _.map(logsByDateSelection, 'label'), 
						series: [$rootScope.ui.teamup.finished, $rootScope.ui.teamup.missed, $rootScope.ui.teamup.teamMembers], 
						colors: [{ fillColor: '#833c11'}, {fillColor: '#c85a3c'}, {fillColor: '#1dc8b6'}], 
						options: { 		maintainAspectRatio: false 	}
					 };

					function getCharts(logs, dates, format)
					{
						var charts = {finished: [], missed: [], member: []},
						    sumLogsStatusPerDateFormat = function(status, caller, date, format)
						    {
							    return logs
							               .filter(function(log) { return log.status === status; })
							               .filter(function(log) { return log.caller === caller; })
							               .filter(function(log) { return format(moment(log.started.stamp)) === date; })
								             .length;
						    };

						_.each(dates, function(dateSelection)
						{
							charts.finished.push(sumLogsStatusPerDateFormat('FINISHED', 'client', dateSelection.date, format));
							charts.missed.push(sumLogsStatusPerDateFormat('MISSED', 'client', dateSelection.date, format));
							charts.member.push(sumLogsStatusPerDateFormat('FINISHED', 'member', dateSelection.date, format));
						});
						return [charts.finished, charts.missed, charts.member];
					}
				}

				/**
				 * Receive logs if the promise is fullfilled
				 * @param logData The logs per team of all teams
				 */
				function receiveLogs(logData)
				{
					self.loadLogs     = false;
					self.data.logData = logData;
					initChart(self.datePeriod);

					$rootScope.statusBar.off();
				}

        /**
         * Get the current range of two dates
         * @param startTime
         * @param endTime
                 * @param period
                 * @returns {Array}
                 */
        function currentRange(startTime, endTime, period)
        {
          return moment.range(moment(startTime).toDate(), moment(endTime).toDate())
                        .toArray(period.name, true)
                        .map(function (date)
                        {
                          return {
                            date: period.format(date),
                            label: period.label(date)
                          }
                        });
        }
			}
		);
	});
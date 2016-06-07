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
			         moment,
                      MomentRange)
			{
				$rootScope.fixStyles();

				//viewmodel
				var self = this;

				//properties
				self.data    = data;
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
				 * TODO some sort of auto login from mobile devices, copy the session and the current teamId
				 * TODO Remove the teamselector and add the teamId to the top
         * TODO maak maandag t/m zondag ipv zondag in daterange
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
							logsByDateSelection = getAllDatesSelection(startTime, endTime, periodFormats),
			        chartData = [ [], [], [] ];

					_.each(logsByDateSelection, function(dateSelection, index)
					{
						var dayLogs = self.data.logData.logs.filter(function(log)
            {
							return periodFormats.format(moment(log.started.stamp)) === dateSelection.date;
						});
						chartData[0][index] = dayLogs.filter(function(log) { return log.status === 'FINISHED' && log.caller === 'client'; }).length;
						chartData[1][index] = dayLogs.filter(function(log) { return log.status === 'MISSED' && log.caller === 'client'; }).length;
						chartData[2][index] = dayLogs.filter(function(log) { return log.caller === 'member'; }).length;
					});

					self.chartData = chartData;
					self.chartLabels = _.map(logsByDateSelection, 'label');
					self.chartSeries = [$rootScope.ui.teamup.finished, $rootScope.ui.teamup.missed, $rootScope.ui.teamup.teamMembers];
					self.chartColours = [{ fillColor: '#833c11'}, {fillColor: '#c85a3c'}, {fillColor: '#1dc8b6'}];
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
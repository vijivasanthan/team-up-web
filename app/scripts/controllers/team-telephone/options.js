define(
	['../controllers'],
	function(controllers)
	{
		'use strict';

		controllers.controller(
			'options',
			function($scope, $rootScope, $filter, TeamUp, Teams, CurrentSelection, data, $q)
			{
				$rootScope.fixStyles();

				//view model
				var self = this;

				//properties
				self.data          = data;
				self.currentTeamId = CurrentSelection.getTeamId();
				self.currentTeam   = setTeamIdToName(self.currentTeamId);
				//self.scenarioTemplates = data.scenarioTemplates;

				//methods
				self.fetch    = fetch;
				self.activate = activate;
				self.save     = save;

				//initialisation
				show(data.teamTelephoneOptions);

				/**
				 * Fetch team-telephone options
				 */
				function fetch()
				{
					CurrentSelection.local = self.currentTeamId;
					self.currentTeam       = setTeamIdToName(self.currentTeamId);
					$rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

					Teams.getTeamTelephoneOptions(self.currentTeamId)
					     .then(function(options)
					           {
						           self.data.teamTelephoneOptions = options;
						           return (self.data.teamTelephoneOptions.adapterId)
							           ? $q.defer()
							           : TeamUp._('TTAdaptersGet', {
							           adapterType: 'call',
							           excludeAdaptersWithDialog: 'true'
						           });
					           })
					     .then(function(phoneNumbers)
					           {
						           self.data.phoneNumbers = phoneNumbers;
						           show(self.data.teamTelephoneOptions);
						           $rootScope.statusBar.off();
					           }, function(error)
					           {
						           $rootScope.statusBar.off();
					           });
				}

				/**
				 * activate teamTelefone
				 */
				function activate(options)
				{
					var error = validate(options);
					if( error )
					{
						$rootScope.notifier.error(error);
						return;
					}
					//phonenumber is validated add the right format to the modal
					options.phoneNumberAlias = (options.phoneNumberAlias && $rootScope.phoneNumberParsed.format) || null;

					$rootScope.statusBar.display($rootScope.ui.teamup.refreshing);
					TeamUp._(
						'TTOptionsActivate',
						{second: self.currentTeamId},
						options
					).then(function(newOptions)
					       {
						       console.error("newOptions ->", newOptions);
						       show(newOptions);
						       $rootScope.statusBar.off();
					       });
				}

				/**
				 * Save team-telephone options
				 * @param newOptions The options to be saved
				 */
				function save(newOptions)
				{
					self.error = false;

					//if (self.scenarioTemplates.length && !newOptions.scenarioId)
					//{
					//  $rootScope.notifier.error("Kies een scenario");
					//  self.error = true;
					//  return;
					//}

					if( ! newOptions.ringingTimeOut )
					{
						$rootScope.notifier.error($rootScope.ui.options.durationDialTone);
						self.error = true;
						return;
					}

					if( $filter('number')(newOptions.ringingTimeOut, 0) == '' )
					{
						self.error = true;
						$rootScope.notifier.error($rootScope.ui.options.dialToneNumber);
						return;
					}

					$rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

					var teamTelephoneOptionsPromise = TeamUp._(
						'TTOptionsSave',
						{second: self.currentTeamId},
						{
							"ringing-timeout": parseInt(newOptions.ringingTimeOut),
							"sms-on-missed-call": newOptions.sms,
							"sms-on-new-team-voicemail": newOptions.sms,
							"voicemail-detection-menu": newOptions.voicemailDetection,
							"useExternalId": newOptions.useExternalId
							//"phoneNumberAlias": newOptions.phoneNumberAlias || null
						});
					//var teamScenarioTemplateId = TeamUp._('TTScenarioTemplateSave', {
					//    second: self.currentTeamId,
					//    templateId: newOptions.scenarioId
					//  });

					$q.all([teamTelephoneOptionsPromise])
					  .then(function(result)
					        {
						        // save the scenarioId of the team locally newOptions.scenarioId

						        $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
						        $rootScope.statusBar.off();
					        });
				}

				/**
				 * Filter to get the team name by id and finally set the firstletter as capital
				 * @param teamId The current team id
				 * @returns {*} The name of the team with the firstletter as capital
				 */
				function setTeamIdToName(teamId)
				{
					return $filter('groupIdToName')(teamId);
				}

				/**
				 * Check validation
				 * @param options
				 * @returns {*}
				 */
				function validate(options)
				{
					var error = null;
					if( ! options )
					{
						error = $rootScope.ui.validation.data;
					}
					else if( ! options.adapterId )
					{//Another check if there are phonenumbers in the pool
						error = (self.data.phoneNumbers.length)
							? $rootScope.ui.validation.phone.notValid //Error if no phonenumber is chosen
							: $rootScope.ui.options.noPhoneNumbers;//No phonenumbers error
					}
					else if( ! options.voicemailEmailAddress )
					{
						error = $rootScope.ui.validation.email.required;
					}
					else if( options.phoneNumberAlias && $rootScope.phoneNumberParsed.result == false )// phone alias could be empty
					{
						error = $rootScope.ui.validation.phone.notValid;
					}
					return error;
				}

				/**
				 * Show the TeamTelephone settings per Team
				 * if it's not a TeamTelephone team, the activate form will be shown
				 * This form will show up only if you have the role of coordinator
				 * @param options
				 */
				function show(options)
				{
					if( ! options || ! options.adapterId )
					{
						if( angular.isDefined(self.activateTTForm) )
						{//Empty form validation by changing the team
							$scope.formActivateTT.$setPristine();
						}

						if( $rootScope.app.resources.role == 1 && ! self.data.phoneNumbers.length )
						{
							$rootScope.notifier.error($rootScope.ui.options.noPhoneNumbers);
						}
					}
					else
					{
						console.error("TeamTelefoon team created ->");
						//this team is clearly a team with teamtelefoon functionality
						$rootScope.isTeamTelephoneTeam = true;

						self.scenarios = {
							voicemailDetection: options["voicemail-detection-menu"] || false,
							sms: options["sms-on-missed-call"] || false,
							ringingTimeOut: options["ringing-timeout"] || 20,
							useExternalId: options["useExternalId"] || false,
							scenarioTemplates: options['test'] || []
							//phoneNumberAlias: options['phoneNumberAlias'] || null
						};
						console.error("self.scenarios ->", self.scenarios);

						//TODO make this a directive, dom manipulation is bad
						//Use the range slider to selected the right amount of rinkeltijd
						angular.element('#ex1').slider({
							                               value: self.scenarios.ringingTimeOut,
							                               tooltip: 'hide',
							                               formatter: function(value)
							                               {
								                               angular.element(".slider-handle span").html(value);
								                               self.scenarios.ringingTimeOut = value;
								                               return value
							                               }
						                               });

						//add the current value inside the handler
						if( ! angular.element(".slider-handle").children('span').length )
						{
							angular.element(".slider-handle").append('<span></span>');
							angular.element(".slider-handle span").html(self.scenarios.ringingTimeOut);
						}
					}
				}
			}
		);
	});

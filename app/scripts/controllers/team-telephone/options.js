define(
  ['../controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'options',
      function ($scope, $rootScope, $filter, TeamUp, CurrentSelection, data, $q)
      {
        $rootScope.fixStyles();

        //view model
        var self = this;

        //properties
        self.data = data;
        self.currentTeamId = CurrentSelection.getTeamId();
        self.currentTeam = setTeamIdToName(self.currentTeamId);
        //self.scenarioTemplates = data.scenarioTemplates;

        //methods
        self.fetch = fetch;
        self.activate = activate;
        self.save = save;

        //initialisation
        show(data.teamTelephoneOptions);

        /**
         * Fetch team-telephone options
         */
        function fetch()
        {
          CurrentSelection.local = self.currentTeamId;
          self.currentTeam = setTeamIdToName(self.currentTeamId);
          $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

          TeamUp._(
            'TTOptionsGet',
            {second: self.currentTeamId}
          ).then(function (options)
            {
              self.data.teamTelephoneOptions = options;
              return (self.data.teamTelephoneOptions.adapterId)
                ? $q.defer()
                : TeamUp._('TTAdaptersGet', {
                    adapterType: 'call',
                    excludeAdaptersWithDialog: 'true'
                  });
            })
            .then(function (phoneNumbers)
            {
              self.data.phoneNumbers = phoneNumbers;
              show(self.data.teamTelephoneOptions);
              $rootScope.statusBar.off();
            });
        }

        /**
         * activate teamTelefone
         */
        function activate(options)
        {
          var error = validate(options);
          if (error)
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
          ).then(function (newOptions)
            {
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

          if (!newOptions.ringingTimeOut)
          {
            $rootScope.notifier.error($rootScope.ui.options.durationDialTone);
            self.error = true;
            return;
          }

          if ($filter('number')(newOptions.ringingTimeOut, 0) == '')
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
            });
          //var teamScenarioTemplateId = TeamUp._('TTScenarioTemplateSave', {
          //    second: self.currentTeamId,
          //    templateId: newOptions.scenarioId
          //  });

          $q.all([teamTelephoneOptionsPromise])
            .then(function (result)
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
          if (!options)
          {
            error = $rootScope.ui.validation.data;
          }
          else if (!options.adapterId)
          {//Another check if there are phonenumbers in the pool
            error = (self.data.phoneNumbers.length)
              ? $rootScope.ui.validation.phone.notValid //Error if no phonenumber is chosen
              : $rootScope.ui.options.noPhoneNumbers;//No phonenumbers error
          }
          else if (!options.voicemailEmailAddress)
          {
            error = $rootScope.ui.validation.email.required;
          }
          else if(options.phoneNumberAlias && $rootScope.phoneNumberParsed.result == false)// phone alias could be empty
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
          //TODO fix directive
          var tabs       = angular.element('.nav-tabs-app li');
          var tabsLength = tabs.length;

          //Only show TeamTelefoon Nieuw tab is the user has the role of coordinator
          var visibleTabs = ($rootScope.app.resources.role == 1) ? 2 : 1;
          tabs = angular.element('.nav-tabs-app li').slice(0, tabsLength - visibleTabs);

          if (!options || !options.adapterId)
          {
            if (angular.isDefined(self.activateTTForm))
            {//Empty form validation by changing the team
              $scope.formActivateTT.$setPristine();
            }

            if ($rootScope.app.resources.role == 1 && !self.data.phoneNumbers.length)
            {
              $rootScope.notifier.error($rootScope.ui.options.noPhoneNumbers);
            }
            self.activateTTForm = true;
            tabs.addClass('ng-hide');
          }
          else
          {
            self.scenarios = {
              voicemailDetection: options["voicemail-detection-menu"] || false,
              sms: options["sms-on-missed-call"] || false,
              ringingTimeOut: options["ringing-timeout"] || 20,
              useExternalId: options["useExternalId"] || false,
              scenarioTemplates: options['test'] || []
            };
            self.activateTTForm = false;
            tabs.removeClass('ng-hide');
            //TODO fix this in a directive
            (! $rootScope.app.domainPermission.teamSelfManagement
              || $rootScope.app.resources.role > 1)
              ? angular.element('.scenarioTab').addClass('ng-hide')
              : angular.element('.scenarioTab').removeClass('ng-hide');

            //TODO Add this one to a directive
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
            if(! angular.element(".slider-handle").children('span').length)
            {
              angular.element(".slider-handle").append('<span></span>');
              angular.element(".slider-handle span").html(self.scenarios.ringingTimeOut);
            }
          }
        }
      }
    );
  });

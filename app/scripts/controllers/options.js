define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'options',
      function ($scope, $rootScope, $filter, TeamUp, CurrentSelection, data, $q)
      {
        $rootScope.fixStyles();

        //view model
        var vm = this;
        vm.data = data;
        vm.currentTeamId = CurrentSelection.getTeamId();
        vm.currentTeam = setTeamIdToName(vm.currentTeamId);
        show(data.teamTelephoneOptions);

        /**
         * Fetch team-telephone options
         */
        vm.fetch = function ()
        {
          CurrentSelection.local = vm.currentTeamId;
          vm.currentTeam = setTeamIdToName(vm.currentTeamId);
          $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

          TeamUp._(
            'TTOptionsGet',
            {second: vm.currentTeamId}
          ).then(function (options)
            {
              vm.data.teamTelephoneOptions = options;
              return (vm.data.teamTelephoneOptions.adapterId)
                ? $q.defer()
                : TeamUp._('TTAdaptersGet', {
                    adapterType: 'call',
                    excludeAdaptersWithDialog: 'true'
                  });
            })
            .then(function (phoneNumbers)
            {
              vm.data.phoneNumbers = phoneNumbers;
              show(vm.data.teamTelephoneOptions);
              $rootScope.statusBar.off();
            });
        };

        /**
         * activate teamTelefone
         */
        vm.activate = function (options)
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
            {second: vm.currentTeamId},
            options
          ).then(function (newOptions)
            {
              show(newOptions);
              $rootScope.statusBar.off();
            });
        };

        /**
         * Save team-telephone options
         * @param newOptions The options to be saved
         */
        vm.save = function (newOptions)
        {
          vm.error = false;

          if (!newOptions.ringingTimeOut)
          {
            $rootScope.notifier.error($rootScope.ui.options.durationDialTone);
            vm.error = true;
            return;
          }

          if ($filter('number')(newOptions.ringingTimeOut, 0) == '')
          {
            vm.error = true;
            $rootScope.notifier.error($rootScope.ui.options.dialToneNumber);
            return;
          }

          $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

          TeamUp._(
            'TTOptionsSave',
            {second: vm.currentTeamId},
            {
              "ringing-timeout": parseInt(newOptions.ringingTimeOut),
              "sms-on-missed-call": newOptions.sms,
              "sms-on-new-team-voicemail": newOptions.sms,
              "voicemail-detection-menu": newOptions.voicemailDetection,
              "useExternalId": newOptions.useExternalId
            }
          ).then(function (result)
            {
              $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
              $rootScope.statusBar.off();
            });
        };

        /**
         * Filter to get the team name by id and finally set the firstletter as capital
         * @param teamId The current team id
         * @returns {*} The name of the team with the firstletter as capital
         */
        function setTeamIdToName(teamId)
        {
          var teamName = $filter('groupIdToName')(teamId);
          return $filter('toTitleCase')(teamName);
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
            error = (vm.data.phoneNumbers.length)
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
          var tabs = angular.element('.nav-tabs-app li:not(:last)');

          if (!options || !options.adapterId)
          {
            if (angular.isDefined(vm.activateTTForm))
            {//Empty form validation by changing the team
              $scope.formActivateTT.$setPristine();
            }

            if ($rootScope.app.resources.role == 1 && !vm.data.phoneNumbers.length)
            {
              $rootScope.notifier.error($rootScope.ui.options.noPhoneNumbers);
            }
            vm.activateTTForm = true;
            tabs.addClass('ng-hide');
          }
          else
          {
            vm.scenarios = {
              voicemailDetection: options["voicemail-detection-menu"] || false,
              sms: options["sms-on-missed-call"] || false,
              ringingTimeOut: options["ringing-timeout"] || 20,
              useExternalId: options["useExternalId"]
            };
            vm.activateTTForm = false;
            tabs.removeClass('ng-hide');
          }
        }
      }
    );
  });

define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'options',
      function ($rootScope, $filter, TeamUp, CurrentSelection, data)
      {
        $rootScope.fixStyles();

        //view model
        var vm = this;
        vm.teams = data.teams;
        vm.currentTeamId = CurrentSelection.getTeamId();
        vm.currentTeam = setTeamIdToName(vm.currentTeamId);

        //Default scenario options of teamtelephone
        vm.scenarios = {
          voicemailDetection: false,
          sms: true,
          ringingTimeOut: 20
        };

        show(data.teamTelephoneOptions);

        function show(options)
        {
          vm.activateTTForm = (! options.adapterId);
          vm.scenarios = {
            voicemailDetection: options["voicemail-detection-menu"],
            sms: options["sms-on-missed-call"],
            ringingTimeOut: options["ringing-timeout"]
          };
          //vm.defaults = angular.copy(vm.scenarios);
        }

        /**
         * Fetch team-telephone options
         */
        vm.fetch = function()
        {
          CurrentSelection.local = vm.currentTeamId;
          vm.currentTeam = setTeamIdToName(vm.currentTeamId);
          vm.loadTeam = $rootScope.ui.dashboard.load;

          TeamUp._(
            'TTSettingsGet',
            {second: vm.currentTeamId}
          ).then(
            function (result)
            {
              console.log('result', result);
              show(result);
              vm.loadTeam = '';
              $rootScope.statusBar.off();
            }
          );
        };

        /**
         * activate teamTelefone
         */
        vm.activate = function (settings)
        {
          console.log('settings', settings);

          if(! settings.email)
          {
            $rootScope.notifier.error(ui.validation.email.required);
            return;
          }
          $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

          TeamUp._(
            'TTSettingsPost',
            {second: vm.currentTeamId}
          ).then(
            function (result)
            {
              show(result);
              $rootScope.statusBar.off();
            }
          );
        };

        /**
         * Save team-telephone options
         * @param newOptions The options to be saved
         */
        vm.save = function (newOptions)
        {
          vm.error = false;

          if (! newOptions.ringingTimeOut)
          {
            $rootScope.notifier.error('Geef de duur van de kiestoon aan!');
            //$rootScope.ui.validation.role
            vm.error = true;
            return;
          }

          if($filter('number')(newOptions.ringingTimeOut, 0) == '')
          {
            vm.error = true;
            $rootScope.notifier.error('De duur van de kiestoon kan alleen een nummer zijn!');
            return;
          }

          $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

          TeamUp._(
            'TTSettingsSave',
            {second: vm.currentTeamId},
            {
              "ringing-timeout": parseInt(newOptions.ringingTimeOut),
              "sms-on-missed-call": newOptions.sms,
              "sms-on-new-team-voicemail": newOptions.sms,
              "voicemail-detection-menu": newOptions.voicemailDetection
            }
          ).then(
            function (result)
            {
              if (result.error)
              {
                console.log('Error by saving team-telephone settings ->', result.error);
              }
              else
              {
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
              }
              $rootScope.statusBar.off();
            }
          );
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
      }
    );
  });

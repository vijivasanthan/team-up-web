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

        vm.current = CurrentSelection.getTeamId();

        //Default scenario options of teamtelephone
        vm.scenarios = {
          voicemailDetection: false,
          smsMissedCall: true,
          smsVoicemail: true,
          ringingTimeOut: 20
        };

        /**
         * Fetch team-telephone options
         */
        vm.fetch = function()
        {
          CurrentSelection.local = vm.current;

          vm.loadTeam = $rootScope.ui.dashboard.load;

          TeamUp._(
            'TTSettingsGet',
            {second: vm.current}
          ).then(
            function (result)
            {
              if (result.error)
              {
                console.log('Error by fetching team-telephone settings ->', result.error);
              }
              else
              {
                vm.scenarios = result;
                vm.loadTeam = '';
              }

              $rootScope.statusBar.off();
            }
          );
        };

        vm.fetch();

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
            {second: vm.current},
            {
              "ringing-timeout": parseInt(newOptions.ringingTimeOut),
              "sms-on-missed-call": newOptions.smsMissedCall,
              "sms-on-new-team-voicemail": newOptions.smsVoicemail,
              "voicemail-detection-menu": newOptions.voicemailDetection
            }
          ).then(
            function (result)
            {
              if (result.error)
              {
                console.log('Error by saving team-telephone settings ->', result.error);
              }

              $rootScope.statusBar.off();
            }
          );
        };
      }
    );
  });
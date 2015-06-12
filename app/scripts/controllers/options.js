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
          sms: true,
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
              if (_.isUndefined(result["voicemail-detection-menu"]))
              {
                $rootScope.notifier.error('De instellingen konden niet geladen worden.');
              }
              else if(result.error)
              {
                console.log('Error by fetching team-telephone settings ->', result.error);
              }
              else
              {
                vm.scenarios = {
                  voicemailDetection: result["voicemail-detection-menu"],
                  sms: result["sms-on-missed-call"],
                  ringingTimeOut: result["ringing-timeout"]
                };

                vm.defaults = angular.copy(vm.scenarios);
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
              "sms-on-missed-call": vm.defaults.sms,//newOptions.sms
              "sms-on-new-team-voicemail": vm.defaults.sms,//newOptions.sms
              "voicemail-detection-menu": vm.defaults.voicemailDetection//newOptions.voicemailDetection
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
      }
    );
  });
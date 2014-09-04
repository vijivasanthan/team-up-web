define(
  ['services/services'],
  function (services)
  {
    'use strict';


    services.factory(
      'States',
      [
        '$location', '$rootScope', 'Session',
        function ($location, $rootScope, Session)
        {
          $rootScope.$on(
            '$routeChangeStart',
            function ()
            {
              Session.check();

              function resetLoaders ()
              {
                $rootScope.loaderIcons = {
                  general: false,
                  teams: false,
                  clients: false,
                  messages: false,
                  manage: false,
                  profile: false,
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

              $rootScope.loadingBig = true;

              $rootScope.statusBar.display('Loading..');

              $rootScope.location = $location.path().substring(1);

              angular.element('div[ng-view]').hide();
            }
          );

          $rootScope.checkDataChangedInManage = function ()
          {
            var changes = {};

            if ($location.hash() == 'teamClients')
            {
              console.log('!! location is team clients from states ->');

              var argument = $rootScope.$$childTail.$$childTail.getData.teamClients();

              changes = $rootScope.$$childTail.getChangesFromTeamClients(argument);
            }
            else if ($location.hash() == 'teams')
            {
              var preTeams = $rootScope.$$childTail.connections.teams;

              var afterTeams = $rootScope.$$childTail.$$childTail.getData.teams();

              changes = $rootScope.$$childTail.getChanges(preTeams, afterTeams);
            }
            else if ($location.hash() == 'clients')
            {
              var preClients = $rootScope.$$childTail.connections.clients;

              var afterClients = $rootScope.$$childTail.$$childTail.getData.clients();

              changes = $rootScope.$$childTail.getChanges(preClients, afterClients);
            }

            if (angular.equals({}, changes))
            {
              // console.log('no changes ! ');
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

          $rootScope.nav = function (tabName)
          {
            if ($location.path() == '/manage')
            {
              if ($rootScope.checkDataChangedInManage())
              {
                return;
              }
            }

            switch (tabName)
            {
              case 'tasks':
                $location.path('/tasks').search({}).hash('');
                break;

              case 'tasks2':
                $location.path('/tasks2').search({}).hash('');
                break;

              case 'team':
                $location.path('/team').search({local: 'true'}).hash('team');
                break;

              case 'client':
                $location.path('/client').search({local: 'true'}).hash('client');
                break;

              case 'planboard':
                $location.path('/planboard').search({local: 'true'}).hash('teams');
                break;

              case 'vis':
                $location.path('/vis').search({local: 'true'}).hash('teams');
                break;

              case 'support':
                $location.path('/support').search({}).hash('');
                break;

              case 'profile':
                $location.path('/profile').search({local: 'true'}).hash('');
                break;

              case 'logout':
                $location.path('/logout');
                $rootScope.logout();
                break;

              default:
                console.log('scope nav : ' + tabName);
            }
          };

          $rootScope.$on(
            '$routeChangeSuccess',
            function ()
            {
              $rootScope.newLocation = $location.path();

              $rootScope.loadingBig = false;

              $rootScope.statusBar.off();

              angular.element('div[ng-view]').show();
            }
          );

          $rootScope.$on(
            '$routeChangeError',
            function (event, current, previous, rejection)
            {
              $rootScope.notifier.error(rejection);
            }
          );
        }
      ]
    );


  }
);
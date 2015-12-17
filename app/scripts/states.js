define(
  ['services/services'],
  function (services)
  {
    'use strict';


    services.factory(
      'States',
      [
        '$location', '$rootScope',
        function ($location, $rootScope, Rejections)
        {
          $rootScope.$on(
            '$routeChangeStart',
            function ()
            {
              $rootScope.checkLocation($location.path());

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
                  $rootScope.loaderIcons.dashboard = true;

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

              case 'client':
                $location.path('/client').search({local: 'true'}).hash('client');
                break;

              case 'dashboard':
                $location.path('/dashboard').search({}).hash('');
                break;

              case 'logs':
                $location.path('/logs').search({}).hash('');
                break;

              case 'tasks2/alltasks':
                $location.path('/tasks2').search({}).hash('allTasks');
                break;

              case 'task/new':
                $location.path('/task/new').search({}).hash('');
                break;

              case 'task/mytasks':
                $location.path('/task/mytasks').search({}).hash('');
                break;

              case 'task/alltasks':
                $location.path('/task/alltasks').search({}).hash('');
                break;

              case 'tasks2/upload':
                $location.path('/tasks2').search({}).hash('upload');
                break;

              case 'tasks2/planboard':
                $location.path('/tasks2/planboard').search({}).hash('');
                break;

              case 'team/members':
                $location.path('/team/members').search({}).hash('');
                break;

              case 'team/new':
                $location.path('/team/new').search({}).hash('');
                break;

              case 'team/member/new':
                $location.path('/team/member/new').search({}).hash('');
                break;

              case 'team/member/search':
                $location.path('/team/member/search').search({}).hash('');
                break;

              case 'team-telefoon/agenda':
                $location.path('/team-telefoon/agenda/' + $rootScope.app.resources.uuid).search({}).hash('');
                break;

              case 'team-telefoon/logs':
                $location.path('/team-telefoon/logs').search({}).hash('');
                break;

              case 'team-telefoon/status':
                $location.path('/team-telefoon/status').search({}).hash('');
                break;

              case 'team-telefoon/order':
                $location.path('/team-telefoon/order').search({}).hash('');
                break;

              case 'team-telefoon/options':
                $location.path('/team-telefoon/options').search({}).hash('');
                break;

              case 'team-telefoon/scenario':
                $location.path('/team-telefoon/scenario').search({}).hash('');
                break;

              case 'vis':
                $location.path('/vis').search({local: 'true'}).hash('teams');
                break;

              case 'help':
                $location.path('/help').search({}).hash('');
                break;

              //profile tab links to the logged user profile
              case 'profile':
                $location.path('/profile/'+ $rootScope.app.resources.uuid).search({}).hash('profile');
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
              $rootScope.currentLocation = $location.path();

              $rootScope.loadingBig = false;

              $rootScope.statusBar.off();

              angular.element('div[ng-view]').show();


               //try {
               //ga('send', 'pageview', {
               //'dimension1': resources.uuid,
               //'dimension2': $rootScope.StandBy.environment.domain
               //});

              try {
                trackGa('send', 'pageview', {
                  title: $location.hash(),
                  page: $rootScope.currentLocation
                });
              } catch (err) {
                console.warn('Google analytics error!', err);
              }
            }
          );

          $rootScope.$on(
            '$routeChangeError',
            function (event, current, previous, rejection)
            {
              if(angular.isDefined(Rejections))
              {
                Rejections.trowError(rejection);
              }
            }
          );
          return true;
        }
      ]
    );


  }
);

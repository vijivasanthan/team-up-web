define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'CurrentSelection',
      [
        '$rootScope',
        'Store',
        'Teams',
        function ($rootScope, Store, Teams)
        {
          var teams = Store('app').get('teams'),
              teamsClientGroup = Teams.queryLocalClientGroup(teams);

          return {
            get local()
            {
              return Store('app').get('currentTeamClientGroup');
            },
            set local(id)
            {
              var clientGroupId = teamsClientGroup[id],
                  teamId = (_.invert(teamsClientGroup))[clientGroupId] || null;

              if(_.isNull(teamId))
              {
                teamId = (_.invert(teamsClientGroup))[id];
                clientGroupId = teamsClientGroup[teamId];
              }

              this.update(teamId, clientGroupId);
            },
            update: function(teamId, clientGroupId)
            {
              Store('app').save('currentTeamClientGroup', {teamId: teamId, clientGroupId: clientGroupId });
            },
            init: function()
            {
              if(Object.keys(this.local).length == 1)
              {
                var teamId = $rootScope.app.resources.teamUuids[0],
                  clientGroupId = teamsClientGroup[teamId];

                this.update(teamId, clientGroupId);
              }

              return this.local;
            },
            getTeamId: function()
            {
              return this.local.teamId || (this.init()).teamId;
            },
            getClientGroupId: function()
            {
              return this.local.clientGroupId || (this.init()).clientGroupId;
            }
          };
        }
      ]
    );


  }
);

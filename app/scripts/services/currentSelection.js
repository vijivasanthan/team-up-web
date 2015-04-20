define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'CurrentSelection',
        function ($rootScope, Store, Teams)
        {
          return {
            get local()
            {
              return Store('app').get('currentTeamClientGroup');
            },
            set local(id)
            {
              this.update(id);
            },
            update: function(id)
            {
              var teams = Store('app').get('teams'),
                  team = _.findWhere(teams, {uuid: id}),
                  teamId = team && team.uuid,
                  clientGroupId = null;

              //Check if there is ACL permission
              if($rootScope.app.domainPermission.clients)
              {
                var clientGroups = Store('app').get('ClientGroups'),
                    teamsClientGroup = Teams.queryLocalClientGroup(teams);

                //Check if id was a teamId, otherwise it's a clientId
                if(_.isUndefined(teamId))
                {
                  //find the clientGroup by id
                  var clientGroup = _.findWhere(clientGroups, {id: id});
                  clientGroupId = clientGroup && clientGroup.id;

                  //find the teamId matching with the clientgroup id
                  //if there is none, set the last selected teamId back
                  //if there is no last selected teamId, add the current teamId of the logged user
                  teamId = (_.invert(teamsClientGroup))[clientGroupId]
                          || this.getTeamId()
                          || $rootScope.app.resources.teamUuids[0];
                }
                else
                {
                  var firstClientGroupUuid = clientGroups[0] && (clientGroups[0]).id;

                  //if the clientGroupId doesn't match with the given teamId, set the last selected clientGroupId
                  //if there was not a selection of a clientGroupId before, set the first clientgroup id
                  clientGroupId = teamsClientGroup[teamId]
                    || this.clientGroupId
                    || clientGroups[0] && firstClientGroupUuid;
                }
              }

              console.log('teamId', teamId);

              Store('app').save('currentTeamClientGroup', {teamId: teamId, clientGroupId: clientGroupId });
            },
            init: function()
            {
              if(Object.keys(this.local).length == 1)
              {
                var id = $rootScope.app.resources.teamUuids[0];

                this.update(id);
              }

              return this.local;
            },
            getTeamId: function()
            {
              return this.local.teamId || (this.init()).teamId;
            },
            getClientGroupId: function()
            {
              return  this.local.clientGroupId || (this.init()).clientGroupId;
            }
          };
        }
    );
  }
);

'use strict';


angular.module('WebPaige.Modals.Teams', ['ngResource'])


/**
 * Teams modal
 */
.factory('Teams', 
[
    '$resource', '$config', '$q', 'Storage', '$rootScope', 
    function ($resource, $config, $q, Storage, $rootScope) 
    {
      var Teams = $resource(
        $config.host + 'teamup/team/',
        {
        },
        {
          query: {
            method: 'GET',
            params: {},
            isArray: true
          },
          get: {
            method: 'GET',
            params: {id:''}
          },
          save: {
            method: 'POST',
            params: {id:''}
          },
          edit: {
            method: 'PUT',
            params: {id:''}
          },
          remove: {
            method: 'DELETE',
            params: {id:''}
          }
//          search: {
//            method: 'POST',
//            params: {id:'', action:'searchPaigeUser'},
//            isArray: true
//          }
        }
      );


      var Containers = $resource(
        $config.host + '/node/:id/container',
        {
        },
        {
          get: {
            method: 'GET',
            params: {id:''},
            isArray: true
          }
        }
      );


      var Parents = $resource(
        $config.host + '/parent',
        {
        },
        {
          get: {
            method: 'GET',
            params: {},
            isArray: true
          }
        }
      );

      var TeamStatus = $resource(
          $config.host + 'teamup/team/status/:teamId/',{
          },{
              query : {
                  method: 'GET',
                  params: {},
                  isArray: true
              }
          }
              
      );
      
      var Team = $resource(
          $config.host + 'teamup/team/:teamId/',{
          },{
              edit : {
                  method: 'PUT',
              }
          }
              
      ); 
      
      var Member = $resource(
      		$config.host + 'teamup/team/member',{
      		},{
      			save : {
      				method: 'POST',
      			}
      		}
      );
      
      var cGroup = $resource(
          $config.host + 'teamup/team/:teamId/clientGroups',{
          },{
              query : {
                  method: 'GET',
                  params: {},
                  isArray: true
              }
          }
      ); 
//      /**
//       * Get parent team data
//       */
//      Teams.prototype.parents = function (all) 
//      {   
//        var deferred = $q.defer();
//
//        Parents.get(
//          null, 
//          function (result) 
//          {
//            if (!all)
//            {
//              // console.warn('returned ===>', result.length);
//
//              if (result.length == 0)
//              {
//                deferred.resolve(null);
//              }
//              else
//              {
//                deferred.resolve(result[0].uuid);
//              }
//            }
//            else
//            {
//              deferred.resolve(result);
//            }
//          },
//          function (error)
//          {
//            deferred.resolve({error: error});
//          }
//        );
//
//        return deferred.promise;
//      };
//
//
//      /**
//       * TODO
//       * Extract only the Teams which are in the local list
//       * 
//       * Get container (parent) team data
//       */
//      Teams.prototype.containers = function (id) 
//      {   
//        var deferred  = $q.defer(),
//            cons      = [];
//
//        Containers.get(
//          {id: id}, 
//          function (result) 
//          {
//            /**
//             * team save call returns only uuid and that is parsed as json
//             * by angular, this is a fix for converting returned object to plain string
//             */
//            angular.forEach(result, function (_r, _i)
//            {
//              var returned = [];
//
//              angular.forEach(_r, function (chr, i) { returned += chr });
//
//              cons.push(returned);
//            });
//            
//            deferred.resolve(cons);
//          },
//          function (error)
//          {
//            deferred.resolve({error: error});
//          }
//        );
//
//        return deferred.promise;
//      };
//
//
//      /**
//       * Add Member to a team
//       */
//      Teams.prototype.addMember = function (candidate)
//      {
//        var deferred = $q.defer();
//
//        Members.add(
//          { 
//            id: candidate.team.uuid, 
//            mid: candidate.id 
//          }, 
//          {}, 
//          function (result) 
//          {
//            deferred.resolve(result);
//          },
//          function (error)
//          {
//            deferred.resolve({error: error});
//          }
//        );
//
//        return deferred.promise;    
//      };
//
//
//      /**
//       * Remove member from team
//       */
//      Teams.prototype.removeMember = function (memberId, teamId)
//      {
//        var deferred = $q.defer();
//
//        Members.remove(
//          { 
//            id: teamId, 
//            mid: memberId 
//          }, 
//          function (result) 
//          {
//            deferred.resolve(result);
//          },
//          function (error)
//          {
//            deferred.resolve({error: error});
//          }
//        );
//
//        return deferred.promise;    
//      };
//
//
//      /**
//       * Remove members from a team (bulk action)
//       */
//      Teams.prototype.removeMembers = function (selection, team)
//      {
//        var deferred = $q.defer(),
//            calls = [];
//
//        angular.forEach(selection, function (value, id)
//        {
//          if (id) calls.push(Teams.prototype.removeMember(id, team.uuid));
//        });
//
//        $q.all(calls)
//        .then(function (result)
//        {
//          deferred.resolve(result);
//        });
//
//        return deferred.promise; 
//      };
//
//
//      Teams.prototype.wish = function (id)
//      {
//        var deferred  = $q.defer(),
//            count     = 0;
//
//        Slots.wishes({
//          id: id,
//          start:  255600,
//          end:    860400
//        }).then(function (results)
//        {
//          angular.forEach(results, function (slot, index)
//          {
//            if (slot.start == 255600 && slot.end == 860400 && slot.count != null) count = slot.count;
//          });
//
//          deferred.resolve({
//            count: count
//          });
//        });
//
//        return deferred.promise; 
//      }
//
//
//      /**
//       * General query function from Teams and their members
//       */
      Teams.prototype.query = function (only,routePara)
      {
        var deferred = $q.defer();
        
        Teams.query(
          function (teams) 
          {
            Storage.add('Teams', angular.toJson(teams));
            
            if (!only)
            {
              var calls = [];

              angular.forEach(teams, function (team, index)
              {
                if(routePara.uuid){
                    if(routePara.uuid == team.uuid){
                        calls.push(Teams.prototype.get(team.uuid));
                    }
                }else{
                    calls.push(Teams.prototype.get(team.uuid));
                }
              });

              $q.all(calls)
              .then(function (results)
              {
//                Teams.prototype.uniqueMembers();

                var data = {};

                data.members = {};

                angular.forEach(teams, function (team, gindex)
                {
                  data.teams = teams;

                  data.members[team.uuid] = [];

                  angular.forEach(results, function (result, mindex)
                  {
                      if(routePara.uuid){
                          if (result.id == team.uuid && routePara.uuid == team.uuid){
                              data.members[team.uuid] = result.data;
                          }else{
                              data.members[team.uuid] = angular.fromJson(Storage.get(team.uuid));
                          }
                      }else{
                          if (result.id == team.uuid){
                              data.members[team.uuid] = result.data;
                          }
                      }
                        
                  });
                });

                deferred.resolve(data);
              });
            }
            else
            {
              deferred.resolve(teams);
            }
            
          },
          function (error)
          {
            console.log("Error" + error);
            deferred.resolve({error: error});
          }
        );

        return deferred.promise;
      };
      
      /**
       * get members of the team
       */
      Teams.prototype.queryStatus = function( teamId){
          var deferred = $q.defer();
          TeamStatus.query({
          },function(result){
              deferred.resolve({
                  id: id,
                  data: returned
              });
          },function(error){
              deferred.resolve({error: error});
          });
          
      };
      
      /**
       * Get team data
       */
      Teams.prototype.get = function (id) 
      {   
        var deferred = $q.defer();

        TeamStatus.query(
          {teamId : id}, 
          function (result) 
          {
            /**
             * DIRTY CHECK!
             * 
             * Check for 'null' return from back-end
             * if team is empty
             */
            var returned;

            if (result.length == 4 && 
                result[0][0] == 'n' && 
                result[1][0] == 'u')
            {
              returned = [];
            }
            else
            {
              returned = result;
            };

            Storage.add(id, angular.toJson(returned));

            deferred.resolve({
              id: id,
              data: returned
            });
          },
          function (error)
          {
            deferred.resolve({error: error});
          }
        );

        return deferred.promise;
      };
//
//
//      /**
//       * Make an inuque list of members
//       */
//      Teams.prototype.uniqueMembers = function ()
//      {
//        angular.forEach(angular.fromJson(Storage.get('Teams')), function (team, index)
//        {
//          var members = angular.fromJson(Storage.get('members')) || {};
//
//          angular.forEach(angular.fromJson(Storage.get(team.uuid)), function (member, index)
//          {
//            members[member.uuid] = member;
//          });
//
//          Storage.add('members', angular.toJson(members));
//        });
//      };
//
//
      /**
       * Save team
       */
      Teams.prototype.save = function (team) 
      {
          var deferred = $q.defer();

       
          Teams.save(
            { id: $rootScope.app.resources.uuid }, 
            team, 
            function (result) 
            {
              deferred.resolve(result.uuid);
            },
            function (error)
            {
              deferred.resolve({error: error});
            }
          ); 
        

          return deferred.promise;
      };

      Teams.prototype.saveMember = function (member){
    	  var deferred = $q.defer();
    	  Member.save({},
			  member,
			  function(result){
				  deferred.resolve(result);
			  },function(error){
				  deferred.resolve({error: error});
			  }
    	  );
    	  
    	  return deferred.promise;
      };
//
//      /**
//       * Delete team
//       */
//      Teams.prototype.remove = function (id) 
//      {
//        var deferred = $q.defer();
//
//        Teams.remove(
//          {id: id}, 
//          function (result) 
//          {
//            deferred.resolve(result);
//          },
//          function (error)
//          {
//            deferred.resolve({error: error});
//          }
//        );
//
//        return deferred.promise;
//      };
//
//
//      /**
//       * Search candidate mambers
//       */
//      Teams.prototype.search = function (query) 
//      {
//        var deferred = $q.defer();
//
//        Teams.search(
//          null, 
//          {key: query}, 
//          function (results) 
//          {
//            var processed = [];
//
//            angular.forEach(results, function (result, index)
//            {
//              processed.push({
//                id: result.id,
//                name: result.name,
//                Teams: Teams.prototype.getMemberTeams(result.id)
//              });
//            });
//
//            deferred.resolve(processed);
//          },
//          function (error)
//          {
//            deferred.resolve({error: error});
//          }
//        );
//
//        return deferred.promise;
//      };
//
//
//      /**
//       * Get Teams of given member
//       */
//      Teams.prototype.getMemberTeams = function (id)
//      {
//        var Teams = angular.fromJson(Storage.get('Teams')),
//            memberTeams = [];
//
//        angular.forEach(Teams, function (team, index)
//        {
//          var localteam = angular.fromJson(Storage.get(team.uuid));
//
//          angular.forEach(localteam, function (member, index)
//          {
//            if (member.uuid === id)
//              memberTeams.push({
//                uuid: team.uuid,
//                name: team.name
//              });
//          });
//        });
//
//        return memberTeams;
//      };
//
//
        /**
        * Save team
        */
       Teams.prototype.edit = function (team) 
       {
         var deferred = $q.defer();
    
         /**
          * Check if team id supplied
          * if save submitted from add / edit form
          */
         if (team.uuid){
           Team.edit({teamId: team.uuid}, team, function (result) 
           {
             deferred.resolve(result);
           });
         }
         else
         {
         };
    
         return deferred.promise;
       };
      
       /**
        * try  to preload the image from here, that ng-src can use the cache.
        */
       Teams.prototype.loadImg = function(imgURL){
          
          var LoadImg = $resource(
               imgURL,{
               },{
                   get : {
                       method: 'GET',
                   }
               }
         );
          
         var deferred = $q.defer();
          
         LoadImg.get(function(result){
             deferred.resolve(result); 
         },function(error){
         	deferred.resolve(error);
         }); 
         
         return deferred.promise;
       }
       
       
       /**
        *  load the callin number for the team 
        */
       Teams.prototype.loadTeamCallinNumber = function(teamUuid){
           var TeamNumber = $resource(
               $config.host + 'teamup/team/:teamId/phone',{
               },{
                   get : {
                       method: 'GET',
                   }
               }
           );
           
           var deferred = $q.defer();
           
           TeamNumber.get(
               {teamId : teamUuid},
               function (result){
                   deferred.resolve(result);
               },
               function (error){
                   deferred.resolve({error: error});
               }
           );
           
           return deferred.promise;
       }
       
       
       /**
        * load the client groups belong to all the teams 
        */
       Teams.prototype.queryClientGroups = function(teams){
       	  var deferred = $q.defer();
       		
       	  var calls = [];
		  angular.forEach(teams, function (team, index){
		     calls.push(Teams.prototype.getGroup(team.uuid));
		  });
		  
		  $q.all(calls)
          .then(function (results)
          {
//                Teams.prototype.uniqueMembers();

            var data = {};

            data.groups = {};

            angular.forEach(teams, function (team, gindex)
            {
              data.teams = teams;

              data.groups[team.uuid] = [];

              angular.forEach(results, function (result, mindex){
                  data.groups[team.uuid] = result.data;
              });
            });

            deferred.resolve(data);
          });
          
          return deferred.promise;
       }
       
      /**
       * get  the client group for specific team
       */
       /**
       * Get team data
       */
      Teams.prototype.getGroup = function (id) 
      {   
        var deferred = $q.defer();

        cGroup.query(
          {teamId : id}, 
          function (result) 
          {
            /**
             * DIRTY CHECK!
             * 
             * Check for 'null' return from back-end
             * if team is empty
             */
            var returned;

            if (result.length == 4 && 
                result[0][0] == 'n' && 
                result[1][0] == 'u')
            {
              returned = [];
            }
            else
            {
              returned = result;
            };

            Storage.add("teamGroup_"+id, angular.toJson(returned));

            deferred.resolve({
              id: id,
              data: returned
            });
          },
          function (error)
          {
            deferred.resolve({error: error});
          }
        );

        return deferred.promise;
      };
       
      return new Teams;
    }
]);
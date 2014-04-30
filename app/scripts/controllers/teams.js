define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller('teamCtrl', [
      '$rootScope', '$scope', '$location', 'Teams', 'data', '$route', '$routeParams', 'Storage', 'MD5', 'Dater',
      function($rootScope, $scope, $location, Teams, data, $route, $routeParams, Storage, MD5, Dater) {
        /**
         * Fix styles
         */
        $rootScope.fixStyles();

        $scope.members = data.members;
        $scope.teams = data.teams;

        /**
         * Self this
         */
        var self = this, params = $location.search();

        $scope.imgHost = profile.host();
        $scope.ns = profile.ns();
        /**
         * Init search query
         */
        $scope.search = {
          query : ''
        };

        /**
         * Reset selection
         */
        $scope.selection = {};

        /**
         * Set groups
         */
        $scope.data = data;

        /**
         * Grab and set roles for view
         */
        $scope.roles = $rootScope.config.roles;
        $scope.mfuncs = $rootScope.config.mfunctions;
        var uuid, view;

        /**
         * If no params or hashes given in url
         */
        if(!params.uuid && !$location.hash()) {
          uuid = data.teams[0].uuid;
          view = 'team';

          $location.search({
            uuid : data.teams[0].uuid
          }).hash('team');
        } else if(!params.uuid){
          uuid = data.teams[0].uuid;
          view = $location.hash();
          $location.search({
            uuid : data.teams[0].uuid
          });
        }else{
          uuid = params.uuid;
          view = $location.hash();
        }

        /**
         * Set group
         */
        setTeamView(uuid);

        /**
         * Set Team View
         */
        $scope.views = {
          team : true,
          newTeam : false,
          newMember : false,
          editTeam : false,
        };

        /**
         * Set given team for view
         */
        function setTeamView(id) {

          angular.forEach(data.teams, function(team, index) {
            if(team.uuid == id)
              $scope.team = team;
          });

          $scope.members = data.members[id];

          $scope.current = id;

          // load image
          angular.forEach($scope.members, function(member, index) {
            var imgURL = $scope.imgHost+ $scope.ns +"/team/member/"+member.uuid+"/photourl";
            Teams.loadImg(imgURL).then(function(result){
              // console.log("loading pic " + imgURL);

              var imgId = member.uuid.replace(".","").replace("@","");
              if(result.status && (result.status == 404 || result.status == 403 || result.status == 500) ){
                console.log("no pics " ,result);
              }else{
                var realImgURL = $scope.imgHost + result.path;
                $('.tab-content #img_'+imgId).css('background-image','url('+realImgURL+')');
              }


            },function(error){
              console.log("error when load pic " + error);
            });

//			var tempURL = $scope.imgHost+ $scope.ns +"/team/member/"+member.uuid+"/photourl";
//			$scope.photoURL = tempURL;
//			Teams.loadImg(tempURL).then(function(result){
//				console.log(result);
//			});
          });

          $scope.team.phone = $rootScope.ui.teamup.loadingNumber;
          Teams.loadTeamCallinNumber($scope.team.uuid).then(function(result){
            $scope.team.phone = result.phone;
          });

        }

        /**
         * Request for a team
         */
        $scope.requestTeam = function(current, switched) {
          setTeamView(current);

          $scope.$watch($location.search(), function() {
            $location.search({
              uuid : current
            });
          });
          if(switched) {
            if($location.hash() != 'team')
              $location.hash('team');

            setView('team');
          }
        };
        /**
         * View setter
         */
        var setView = function(hash) {
          $scope.views = {
            team : false,
            newTeam : false,
            newMember : false,
            editTeam : false
          };

          $scope.views[hash] = true;
        };
        /**
         * Switch between the views and set hash accordingly
         */
        $scope.setViewTo = function(hash) {
          $scope.$watch(hash, function() {
            $location.hash(hash);

            setView(hash);
          });
        };
        /**
         * Set view
         */
        setView(view);

        /**
         * Selection toggler
         */
        $scope.toggleSelection = function(group, master) {
          var flag = (master) ? true : false, members = angular.fromJson(Storage.get(group.uuid));

          angular.forEach(members, function(member, index) {
            $scope.selection[member.uuid] = flag;
          });
        };
        /**
         * show edit mode of the Team
         */
        $scope.editTeam = function(team) {
          $scope.teamEditForm = {
            name : team.name,
            uuid : team.uuid
          };
          $scope.views.editTeam = true;
        };

        $scope.cancelTeamEdit = function(team) {
          $scope.teamEditForm = {
            name : team.name,
            uuid : team.uuid
          };
          $scope.views.editTeam = false;
        };
        /**
         * save the changes on the team
         */
        $scope.changeTeam = function(team) {

          if($.trim(team.name) == '') {
            $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
            return;
          }

          $rootScope.statusBar.display($rootScope.ui.teamup.saveTeam);

          Teams.edit(team).then(function(result) {
            if(result.error) {
              $rootScope.notifier.error("Error with saving team info : " + result.error);
            } else {
              $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

              Teams.query(false,result).then(function(result) {
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();

                $scope.team.name = team.name;
                $scope.views.editTeam = false;
              });
            }
          });
        };
        /**
         * create new Team
         */
        $scope.teamSubmit = function(team) {

          if( typeof team == 'undefined' || $.trim(team.name) == '') {
            $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
            return;
          }

          $rootScope.statusBar.display($rootScope.ui.teamup.saveTeam);

          Teams.save(team).then(function(result) {
            if(result.error) {
              $rootScope.notifier.error($rootScope.ui.teamup.teamSubmitError);
            } else {
              $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

              Teams.query(false,result).then(function(queryRs) {
                if(queryRs.error) {
                  $rootScope.notifier.error($rootScope.ui.teamup.queryTeamError);
                  console.warn('error ->', queryRs);
                } else {
                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                  $scope.closeTabs();

                  $scope.data = queryRs;

                  angular.forEach(queryRs.teams, function(t_obj) {
                    if(t_obj.uuid == result.uuid) {
                      $scope.teams = queryRs.teams;

                      angular.forEach(queryRs.teams, function(t) {
                        if(t.uuid == t_obj.uuid) {
                          $scope.team = t;
                        }
                      });

                      $scope.members = data.members[t_obj.uuid];

                      $scope.current = t_obj.uuid;

                      $scope.$watch($location.search(), function() {
                        $location.search({
                          uuid : t_obj.uuid
                        });
                      });
                    }
                  });
                }

                $rootScope.statusBar.off();

              });
            }
          });
        };
        /**
         * create a new team member
         */
        $scope.memberSubmit = function(member) {
          if( typeof member == 'undefined' || !member.username || !member.password || !member.reTypePassword) {
            $rootScope.notifier.error($rootScope.ui.teamup.accountInfoFill);
            return;
          }
          if(member.password != member.reTypePassword) {
            $rootScope.notifier.error($rootScope.ui.teamup.passNotSame);
            return;
          }
          if(!member.team) {
            $rootScope.notifier.error($rootScope.ui.teamup.selectTeam);
            return;
          }

          $rootScope.statusBar.display($rootScope.ui.teamup.savingMember);

          var obj = {
            uuid : member.username,
            userName : member.username,
            passwordHash : MD5(member.password),
            firstName : member.firstName,
            lastName : member.lastName,
            phone : member.phone,
            teamUuids : [member.team],
            role : member.role,
            birthDate : Dater.convert.absolute(member.birthDate, 0)
          };


          Teams.saveMember(obj).then(function(result) {
            // change the REST return to json.

            if(result.error) {
              $rootScope.notifier.error($rootScope.ui.teamup.teamSubmitError + " : " + result.error);
            } else {
              $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

              var routePara = {'uuid' : result.teamId};

              Teams.query(false,routePara).then(function(queryRs) {
                if(queryRs.error) {
                  $rootScope.notifier.error($rootScope.ui.teamup.queryTeamError);
                  console.warn('error ->', queryRs);
                } else {
                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                  $scope.closeTabs();

                  $scope.data = queryRs;

                  angular.forEach(queryRs.teams, function(t_obj) {
                    if(t_obj.uuid == routePara.uuid) {
                      $scope.teams = queryRs.teams;

                      angular.forEach(queryRs.teams, function(t) {
                        if(t.uuid == t_obj.uuid) {
                          $scope.team = t;
                        }
                      });

                      $scope.members = data.members[t_obj.uuid];

                      $scope.current = t_obj.uuid;

                      $scope.$watch($location.search(), function() {
                        $location.search({
                          uuid : t_obj.uuid
                        });
                      });
                    }
                  });
                }

                $rootScope.statusBar.off();

              });
            }
          });
        };

        /**
         * Close inline form
         */
        $scope.closeTabs = function() {
          $scope.teamForm = {};

          $scope.memberForm = {};

          $scope.setViewTo('team');
        };

        /**
         * edit the profile function
         * only for set the team Id in sessionStorage , for later saving
         */
        $scope.editProfile = function(memberId, teamId){
          sessionStorage.setItem(memberId+"_team", teamId);
        }

        /**
         * show the String "no shared states" if there is no shared states
         */
        $scope.noSharedStates = function(states){
          var flag = true;
          var ret = true;
          angular.forEach(states, function(state){
            if(state.share && flag){
              ret = false;
              flag = false;
            }
          });
          return ret;
        }

        /*
         * delete the team
         */
        $scope.deleteTeam = function(){
          console.log($scope.current);
          if(window.confirm($rootScope.ui.teamup.delTeamConfirm)){
            $rootScope.statusBar.display($rootScope.ui.teamup.deletingTeam);

            Teams.deleteTeam($scope.current).then(function(result){

              if(result){
                Teams.query(true,{}).then(function(teams){
                  $scope.requestTeam(teams[0].uuid);

                  // locally refresh
                  angular.forEach($scope.teams,function(team,i){
                    if(team.uuid == result){
                      $scope.teams.splice(i,1);
                    }
                  });

                  // 	try to get the members not in the teams Aync
                  Teams.queryMembersNotInTeams().then(function(result){
                    console.log("members not in any teams loaded ");
                    $rootScope.statusBar.off();
                  },function(error){
                    console.log(error);
                  });
                },function(error){
                  console.log(error);
                });

              }

              $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
              $rootScope.statusBar.off();

            },function(error){
              console.log(error);
            });
          }
        }

        /**
         * delete the team member
         */
        $scope.deleteMember = function(memberId){

          if(window.confirm($rootScope.ui.teamup.deleteConfirm)){
            $rootScope.statusBar.display($rootScope.ui.teamup.deletingMember);
            Teams.deleteMember(memberId).then(function(result){
              if(result.uuid){
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);

                // refresh the teams that contains  this user
                angular.forEach($scope.members,function(mem,i){
                  if(mem.uuid == memberId){
                    angular.forEach(mem.teamUuids,function(teamId,i){
                      $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                      var routePara = {'uuid' : teamId};
                      Teams.query(false,routePara).then(function(queryRs) {
                        $rootScope.statusBar.off();
                      });

                      angular.forEach(data.members[teamId],function(mem,j){
                        if(mem.uuid == memberId){
                          data.members[teamId].splice(j,1);
                        }
                      });

                    });

                  }
                });
                // 	try to get the members not in the teams Aync
                Teams.queryMembersNotInTeams().then(function(result){
                  console.log("members not in any teams loaded ");
                  $rootScope.statusBar.off();
                },function(error){
                  console.log(error);
                });

              }

            },function(error){
              console.log(error);
            });
          }
        }


        // brefoe I know there is a good place to put this code
        // load the login user's avatar


        var imgURL = profile.host() + profile.ns() +"/team/member/" + $rootScope.app.resources.uuid + "/photourl";
        Teams.loadImg(imgURL).then(function(result) {
          // console.log("loading pic " + imgURL);
          var mId = $rootScope.app.resources.uuid;
          var imgId = mId.replace(".", "").replace("@", "");
          if (result.status && (result.status == 404 || result.status == 403 || result.status == 500)) {
            console.log("no pics ", result);
          } else {
            if(result.path){
              var realImgURL = profile.host().replace("\\:",":") + result.path;
              $('.navbar-inner #img_'+imgId).css('background-image', 'url("' + realImgURL + '")');
            }

          }

        }, function(error) {
          console.log("error when load pic " + error);
        });

      }]);


  }
);
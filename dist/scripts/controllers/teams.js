define(["controllers/controllers","config"],function(e,t){e.controller("teamCtrl",["$rootScope","$scope","$location","Teams","data","$route","$routeParams","Store","Dater","TeamUp","$timeout",function(e,n,r,i,s,o,u,a,f,l,c){function b(){var e={};return e.team=m.team?m.team:"",e}function w(e){angular.forEach(s.teams,function(t){t.uuid==e&&(n.team=t)}),n.members=s.members[e],angular.forEach(n.members,function(e){angular.forEach(e.states,function(e){if(e.name=="Location"){e.value_rscoded="loading address";if(e.value!=null)var t=e.value.split(","),n=parseFloat(t[0]),r=parseFloat(t[1])}})}),n.current=e}e.fixStyles(),n.members=s.members,n.teams=s.teams;var h=i.queryLocal(),p=i.queryLocalClientGroup(h.teams),d=r.search();n.search={query:""},n.selection={},n.data=s,n.roles=t.app.roles,n.mfuncs=t.app.mfunctions;var v=function(e){var t=p[e];a("app").save("currentTeamClientGroup",{team:e,clientGroup:t})},m=a("app").get("currentTeamClientGroup");m.team||(v(s.teams[0].uuid),m=a("app").get("currentTeamClientGroup"));var g,y;!d.uuid&&!r.hash()?(g=s.teams[0].uuid,y="team",r.search({uuid:s.teams[0].uuid}).hash("team")):d.uuid?(g=d.uuid,y=r.hash()):(g=m.team,y=r.hash(),r.search({uuid:g})),w(g),n.memberForm=b(),n.views={team:!0,newTeam:!1,newMember:!1,editTeam:!1},n.requestTeam=function(e,t){v(e),w(e),n.$watch(r.search(),function(){r.search({uuid:e})}),t&&(r.hash()!="team"&&r.hash("team"),E("team"))};var E=function(e){n.views={team:!1,newTeam:!1,newMember:!1,editTeam:!1},n.views[e]=!0};n.setViewTo=function(e){n.$watch(e,function(){r.hash(e),E(e)})},E(y),n.toggleSelection=function(e,t){var r=t?!0:!1;angular.forEach(a("app").get(e.uuid),function(e){n.selection[e.uuid]=r})},n.editTeam=function(e){n.teamEditForm={name:e.name,uuid:e.uuid},n.views.editTeam=!0},n.cancelTeamEdit=function(e){n.teamEditForm={name:e.name,uuid:e.uuid},n.views.editTeam=!1},n.changeTeam=function(t){if($.trim(t.name)==""){e.notifier.error(e.ui.teamup.teamNamePrompt1);return}e.statusBar.display(e.ui.teamup.saveTeam),l._("teamUpdate",{second:t.uuid},t).then(function(r){r.error?e.notifier.error("Error with saving team info : "+r.error):(e.statusBar.display(e.ui.teamup.refreshing),i.query(!1,r).then(function(){e.notifier.success(e.ui.teamup.dataChanged),e.statusBar.off(),n.team.name=t.name,n.views.editTeam=!1}))})},n.teamSubmit=function(t){if(typeof t=="undefined"||$.trim(t.name)==""){e.notifier.error(e.ui.teamup.teamNamePrompt1);return}e.statusBar.display(e.ui.teamup.saveTeam),l._("teamAdd",{id:e.app.resources.uuid},t).then(function(t){t.error?e.notifier.error(e.ui.teamup.teamSubmitError):(e.statusBar.display(e.ui.teamup.refreshing),i.query(!1,t).then(function(o){o.error?(e.notifier.error(e.ui.teamup.queryTeamError),console.warn("error ->",o)):(e.notifier.success(e.ui.teamup.dataChanged),n.closeTabs(),n.data=o,i.queryClientGroups(o.teams).then(function(e){console.log("new team added to team-client list",e)}),angular.forEach(o.teams,function(e){e.uuid==t.uuid&&(n.teams=o.teams,angular.forEach(o.teams,function(t){t.uuid==e.uuid&&(n.team=t)}),n.members=s.members[e.uuid],n.current=e.uuid,n.$watch(r.search(),function(){r.search({uuid:e.uuid})}))})),e.statusBar.off()}))})},n.memberSubmit=function(t){if(typeof t=="undefined"||!t.username||!t.password||!t.reTypePassword||!t.birthDate){e.notifier.error(e.ui.teamup.accountInfoFill);return}if(t.password!=t.reTypePassword){e.notifier.error(e.ui.teamup.passNotSame);return}if(!t.team){e.notifier.error(e.ui.teamup.selectTeam);return}e.statusBar.display(e.ui.teamup.savingMember),l._("memberAdd",null,{uuid:t.username,userName:t.username,passwordHash:MD5.parse(t.password),firstName:t.firstName,lastName:t.lastName,phone:t.phone,teamUuids:[t.team],role:t.role,birthDate:f.convert.absolute(t.birthDate,0),"function":t.function}).then(function(t){t.error?e.notifier.error(e.ui.teamup.teamSubmitError+" : "+t.error):(e.statusBar.display(e.ui.teamup.refreshing),i.query(!1,{uuid:t.teamId}).then(function(i){if(i.error)e.notifier.error(e.ui.teamup.queryTeamError),console.warn("error ->",i);else{e.notifier.success(e.ui.teamup.dataChanged),n.closeTabs(),n.data=i;var o={uuid:t.teamId};angular.forEach(i.teams,function(e){e.uuid==o.uuid&&(n.teams=i.teams,angular.forEach(i.teams,function(t){t.uuid==e.uuid&&(n.team=t)}),n.members=s.members[e.uuid],n.current=e.uuid,n.$watch(r.search(),function(){r.search({uuid:e.uuid})}))})}e.statusBar.off()}))})},n.closeTabs=function(){n.teamForm={},n.memberForm=b(),n.setViewTo("team")},n.editProfile=function(e,t){sessionStorage.setItem(angular.lowercase(e)+"_team",t)},n.noSharedStates=function(e){var t=!0,n=!0;return angular.forEach(e,function(e){e.share&&t&&(n=!1,t=!1)}),n},n.confirmDeleteTeam=function(){c(function(){angular.element("#confirmTeamModal").modal("show")})},n.deleteTeam=function(){angular.element("#confirmTeamModal").modal("hide"),e.statusBar.display(e.ui.teamup.deletingTeam),l._("teamDelete",{second:n.current}).then(function(t){t&&i.query(!0,{}).then(function(r){n.requestTeam(r[0].uuid),angular.forEach(n.teams,function(e,r){e.uuid==t.result&&n.teams.splice(r,1)}),l._("teamMemberFree").then(function(t){a("app").save("members",t),e.statusBar.off()},function(e){console.log(e)})},function(e){console.log(e)}),e.notifier.success(e.ui.teamup.dataChanged),e.statusBar.off()},function(e){console.log(e)})},n._memberId={},n.confirmDeleteMember=function(e){c(function(){n._memberId=e,angular.element("#confirmMemberModal").modal("show")})},n.deleteMember=function(t){n._memberId={},angular.element("#confirmMemberModal").modal("hide"),e.statusBar.display(e.ui.teamup.deletingMember),t=angular.lowercase(t),l._("memberDelete",{third:t}).then(function(r){r.uuid&&(e.notifier.success(e.ui.teamup.dataChanged),angular.forEach(n.members,function(n){n.uuid==t&&angular.forEach(n.teamUuids,function(n){e.statusBar.display(e.ui.teamup.refreshing);var r={uuid:n};i.query(!1,r).then(function(){e.statusBar.off()}),angular.forEach(s.members[n],function(e,r){e.uuid==t&&s.members[n].splice(r,1)})})}),l._("teamMemberFree").then(function(t){a("app").save("members",t),e.statusBar.off()},function(e){console.log(e)}))},function(e){console.log(e)})},n.$on("$viewContentLoaded",function(){console.log("teams : viewContentLoaded"),e.taskVisit||(e.$broadcast("taskFinishLoading"),e.taskVisit=!0)}),n.convertUserName=function(){n.memberForm.username=angular.lowercase(n.memberForm.username)}}])});
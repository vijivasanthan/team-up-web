define(["controllers/controllers","config"],function(e,t){e.controller("teamCtrl",["$rootScope","$scope","$location","Teams","data","$route","$routeParams","Store","Dater","TeamUp","$timeout",function(e,n,r,i,s,o,u,a,f,l,c){function y(e){angular.forEach(s.teams,function(t){t.uuid==e&&(n.team=t)}),n.members=s.members[e],angular.forEach(n.members,function(e){angular.forEach(e.states,function(t,n){if(t.name=="Location"){t.value_rscoded="loading address";if(t.value&&e.address&&e.address.street)var r=t.value.split(","),i=parseFloat(r[0]),s=parseFloat(r[1]);else e.states.splice(n,1)}})}),n.current=e}e.fixStyles(),n.members=s.members,n.teams=s.teams;var h=i.queryLocal(),p=i.queryLocalClientGroup(h.teams),d=r.search();n.search={query:""},n.selection={},n.data=s,n.roles=t.app.roles,n.mfuncs=t.app.mfunctions;var v=function(e){var t=p[e];a("app").save("currentTeamClientGroup",{team:e,clientGroup:t})},m,g;!d.uuid&&!r.hash()?(m=s.teams[0].uuid,g="team",r.search({uuid:s.teams[0].uuid}).hash("team")):d.uuid?(m=d.uuid,g=r.hash()):(a("app").get("currentTeamClientGroup").team||v(s.teams[0].uuid),m=a("app").get("currentTeamClientGroup").team,g=r.hash(),r.search({uuid:m})),y(m),n.memberForm={},n.memberForm.team=m,n.views={team:!0,newTeam:!1,newMember:!1,editTeam:!1},n.requestTeam=function(e,t){v(e),y(e),n.$watch(r.search(),function(){r.search({uuid:e})},n.memberForm.team=e),t&&(r.hash()!="team"&&r.hash("team"),b("team"))};var b=function(e){n.views={team:!1,newTeam:!1,newMember:!1,editTeam:!1},n.views[e]=!0};n.setViewTo=function(e){n.$watch(e,function(){r.hash(e),b(e)})},b(g),n.toggleSelection=function(e,t){var r=t?!0:!1;angular.forEach(a("app").get(e.uuid),function(e){n.selection[e.uuid]=r})},n.editTeam=function(e){n.teamEditForm={name:e.name,uuid:e.uuid},n.views.editTeam=!0},n.cancelTeamEdit=function(e){n.teamEditForm={name:e.name,uuid:e.uuid},n.views.editTeam=!1},n.changeTeam=function(t){if($.trim(t.name)==""){e.notifier.error(e.ui.teamup.teamNamePrompt1);return}e.statusBar.display(e.ui.teamup.saveTeam),l._("teamUpdate",{second:t.uuid},t).then(function(r){r.error?e.notifier.error("Error with saving team info : "+r.error):(e.statusBar.display(e.ui.teamup.refreshing),i.query(!1,r).then(function(){e.notifier.success(e.ui.teamup.dataChanged),e.statusBar.off(),n.team.name=t.name,n.views.editTeam=!1}))})},n.teamSubmit=function(t){if(typeof t=="undefined"||$.trim(t.name)==""){e.notifier.error(e.ui.teamup.teamNamePrompt1);return}e.statusBar.display(e.ui.teamup.saveTeam),l._("teamAdd",{id:e.app.resources.uuid},t).then(function(t){t.error?e.notifier.error(e.ui.teamup.teamSubmitError):(e.statusBar.display(e.ui.teamup.refreshing),i.query(!1,t).then(function(o){o.error?(e.notifier.error(e.ui.teamup.queryTeamError),console.warn("error ->",o)):(e.notifier.success(e.ui.teamup.dataChanged),n.closeTabs(),n.data=o,i.queryClientGroups(o.teams).then(function(e){console.log("new team added to team-client list",e)}),angular.forEach(o.teams,function(e){e.uuid==t.uuid&&(n.teams=o.teams,angular.forEach(o.teams,function(t){t.uuid==e.uuid&&(n.team=t)}),n.members=s.members[e.uuid],n.current=e.uuid,n.$watch(r.search(),function(){r.search({uuid:e.uuid})}))})),e.statusBar.off()}))})},n.memberSubmit=function(t){if(typeof t=="undefined"||!t.username||!t.password||!t.reTypePassword||!t.birthDate){e.notifier.error(e.ui.teamup.accountInfoFill);return}if(t.password!=t.reTypePassword){e.notifier.error(e.ui.teamup.passNotSame);return}if(!t.team){e.notifier.error(e.ui.teamup.selectTeam);return}e.statusBar.display(e.ui.teamup.savingMember),l._("memberAdd",null,{uuid:t.username,userName:t.username,passwordHash:MD5.parse(t.password),firstName:t.firstName,lastName:t.lastName,phone:t.phone,teamUuids:[t.team],role:t.role,birthDate:f.convert.absolute(t.birthDate,0),"function":t.function}).then(function(t){t.error?e.notifier.error(e.ui.teamup.teamSubmitError+" : "+t.error):(e.statusBar.display(e.ui.teamup.refreshing),i.query(!1,{uuid:t.teamId}).then(function(i){if(i.error)e.notifier.error(e.ui.teamup.queryTeamError),console.warn("error ->",i);else{e.notifier.success(e.ui.teamup.dataChanged),n.closeTabs(),n.data=i;var s={uuid:t.teamId};angular.forEach(i.teams,function(e){e.uuid==s.uuid&&(n.teams=i.teams,angular.forEach(i.teams,function(t){t.uuid==e.uuid&&(n.team=t)}),n.members=n.data.members[e.uuid],n.current=e.uuid,n.$watch(r.search(),function(){r.search({uuid:e.uuid})}))})}e.statusBar.off()}))})},n.closeTabs=function(){n.teamForm={},n.memberForm={},n.memberForm.team=m,n.setViewTo("team")},n.editProfile=function(e,t){sessionStorage.setItem(angular.lowercase(e)+"_team",t)},n.noSharedStates=function(e){var t=!0,n=!0;return angular.forEach(e,function(e){e.share&&t&&(n=!1,t=!1)}),n},n.confirmDeleteTeam=function(){c(function(){angular.element("#confirmTeamModal").modal("show")})},n.deleteTeam=function(){angular.element("#confirmTeamModal").modal("hide"),e.statusBar.display(e.ui.teamup.deletingTeam),l._("teamDelete",{second:n.current}).then(function(t){t&&i.query(!0,{}).then(function(r){n.requestTeam(r[0].uuid),angular.forEach(n.teams,function(e,r){e.uuid==t.result&&n.teams.splice(r,1)}),l._("teamMemberFree").then(function(t){a("app").save("members",t),e.statusBar.off()},function(e){console.log(e)})},function(e){console.log(e)}),e.notifier.success(e.ui.teamup.dataChanged),e.statusBar.off()},function(e){console.log(e)})},n._memberId={},n.confirmDeleteMember=function(e){c(function(){n._memberId=e,angular.element("#confirmMemberModal").modal("show")})},n.deleteMember=function(t){angular.element("#confirmMemberModal").modal("hide"),e.statusBar.display(e.ui.teamup.deletingMember),t=angular.lowercase(t);var r=[];r.push(t),l._("teamMemberDelete",{second:n.team.uuid},{ids:r}).then(function(){angular.forEach(n.members,function(r,s){r.uuid==t&&angular.forEach(r.teamUuids,function(t){var r={uuid:t};i.query(!1,r).then(function(){e.statusBar.off(),i.updateMembersLocal(),n.data.members[t].splice(s,1),e.notifier.success(e.ui.teamup.dataChanged)})})})}),function(e){console.log(e)}},n.$on("$viewContentLoaded",function(){console.log("teams : viewContentLoaded"),e.taskVisit||(e.$broadcast("taskFinishLoading"),e.taskVisit=!0)}),n.convertUserName=function(){n.memberForm.username=angular.lowercase(n.memberForm.username)}}])});
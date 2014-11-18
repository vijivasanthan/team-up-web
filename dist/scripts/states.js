define(["services/services"],function(e){e.factory("States",["$location","$rootScope","Session",function(e,t,n){t.$on("$routeChangeStart",function(){function r(){t.loaderIcons={general:!1,teams:!1,clients:!1,messages:!1,manage:!1,profile:!1,settings:!1}}n.check(),r();switch(e.path()){case"/team":t.loaderIcons.team=!0,t.location="team";break;case"/client":t.loaderIcons.client=!0,t.location="cilent";break;case"/messages":t.loaderIcons.messages=!0,t.location="messages";break;case"/manage":t.loaderIcons.messages=!0,t.location="manage";break;case"/logout":t.location="logout";break;default:e.path().match(/profile/)?(t.loaderIcons.profile=!0,t.location="profile"):t.loaderIcons.general=!0}t.loadingBig=!0,t.statusBar.display("Loading.."),t.location=e.path().substring(1),angular.element("div[ng-view]").hide()}),t.checkDataChangedInManage=function(){var n={};if(e.hash()=="teamClients"){console.log("!! location is team clients from states ->");var r=t.$$childTail.$$childTail.getData.teamClients();n=t.$$childTail.getChangesFromTeamClients(r)}else if(e.hash()=="teams"){var i=t.$$childTail.connections.teams,s=t.$$childTail.$$childTail.getData.teams();n=t.$$childTail.getChanges(i,s)}else if(e.hash()=="clients"){var o=t.$$childTail.connections.clients,u=t.$$childTail.$$childTail.getData.clients();n=t.$$childTail.getChanges(o,u)}if(angular.equals({},n))return!1;if(!confirm(t.ui.teamup.managePanelchangePrompt))return!0},t.nav=function(n){if(e.path()=="/manage"&&t.checkDataChangedInManage())return;switch(n){case"tasks":e.path("/tasks").search({}).hash("");break;case"tasks2":e.path("/tasks2").search({}).hash("");break;case"team":e.path("/team").search({local:"true"}).hash("team");break;case"client":e.path("/client").search({local:"true"}).hash("client");break;case"dashboard":e.path("/dashboard").search({}).hash("");break;case"logs":e.path("/logs").search({}).hash("");break;case"tasks2/alltasks":e.path("/tasks2").search({}).hash("allTasks");break;case"tasks2/newtask":e.path("/tasks2").search({}).hash("newTask");break;case"tasks2/upload":e.path("/tasks2").search({}).hash("upload");break;case"tasks2/planboard":e.path("/tasks2/planboard").search({local:"true"}).hash("teams");break;case"agenda":e.path("/agenda").search({local:"true"}).hash("teams");break;case"vis":e.path("/vis").search({local:"true"}).hash("teams");break;case"support":e.path("/support").search({}).hash("");break;case"profile":e.path("/profile/"+t.app.resources.uuid).search({local:"true"}).hash("profile");break;case"logout":e.path("/logout"),t.logout();break;default:console.log("scope nav : "+n)}},t.$on("$routeChangeSuccess",function(){t.newLocation=e.path(),t.loadingBig=!1,t.statusBar.off(),angular.element("div[ng-view]").show()}),t.$on("$routeChangeError",function(e,n,r,i){t.notifier.error(i)})}])});
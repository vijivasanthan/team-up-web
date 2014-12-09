define(["controllers/controllers"],function(e){e.controller("tasks2Ctrl",["$rootScope","$scope","$location","$timeout","$filter","Store","TeamUp","Task","Teams","Clients","Dater",function(e,t,n,r,i,s,o,u,a,f,l){function m(){t.tasks={mine:{loading:!0,list:[]},all:{loading:!0,list:[]}},t.views={myTasks:!1,allTasks:!1,newTask:!1,upload:!1},t.showAllTasks=!1,t.showOnlyAvailable=!0,t.reversed=!0,t.order="plannedStartVisitTime"}function y(e,n){u.queryMine().then(function(e){t.tasks.mine={loading:!1,list:e.on},n&&n.call(this,e)}),e||b()}function b(e){y(!0),u.queryAll().then(function(n){t.tasks.all={loading:!1,list:n.on},e&&e.call(this,n)})}function S(e,t){return i("date")(e,t)}function x(e,t){var n=S(e,"m");n%=15;var r=new Date(e.getTime()-n*6e4+t*6e4);return r}function T(t,n){u.update(t).then(function(r){if(r.error){e.notifier.error(e.transError(r.error.data?r.error.data.result:r.error)),t.assignedTeamMemberUuid=null;return}y(n)})}e.fixStyles();var c=n.hash()?n.hash():"myTasks",h=s("app").get("currentTeamClientGroup"),p=a.queryLocal(),d=f.queryLocal(),v=a.queryLocalClientGroup(p.teams);t.teams=p.teams,t.currentTeam=t.teams[0].uuid,h.team&&(t.task={team:h.team},t.currentTeam=h.team),t.task={},t.task.team=t.currentTeam;var g=function(e){m(),t.tasks=t.tasks?t.tasks:{},t.views[e]=!0,n.hash(e);switch(e){case"myTasks":var i=s("app").get("myTasks2"),o=0;if(i.on||i.off)t.tasks.mine={loading:!1,list:i},o=250;r(function(){y()},o);break;case"allTasks":var u=s("app").get("allTasks2");if(u.on||u.off)t.tasks.all={loading:!1,list:u.on};r(function(){b()},250);break;case"newTask":break;case"upload":}};t.setViewTo=function(e){t.$watch(e,function(){n.hash(e),g(e)})},g(c),t.$watch("showFinishedTasks",function(e){var n=s("app").get("myTasks2");t.tasks.mine.list=e?n.on.concat(n.off):n.on}),t.$watch("showAllTasks",function(e){var n=s("app").get("allTasks2");e?t.tasks.all.list=n.on.concat(n.off):t.tasks.all.list=n.on});if(t.views.newTask==1){var w=x(new Date,15),E=x(new Date,30);t.task||(t.task={},t.task.start={},t.task.end={}),t.task.start={date:new Date,time:w},t.task.end={date:new Date,time:E}}t.newTime=function(e){t.task.end.time=x(e,15)},t.newDate=function(e){t.task.end.date=e},t.openTask=function(e){t.task=e,t.task.team=e.assignedTeamUuid,console.log(e),e.assignedTeamUuid&&(e.assignedTeamFullName=t.$root.getTeamName(e.assignedTeamUuid)),e.relatedClient.clientGroupUuid&&(e.relatedClient.clientGroupName=t.$root.getClientGroupName(e.relatedClient.clientGroupUuid));var n=t.$root.getTeamMemberById(e.authorUuid);t.author=n.firstName+" "+n.lastName,angular.element("#taskModal").modal("show")},t.orderBy=function(e){t.ordered=e,t.reversed=!t.reversed},t.assignTask=function(t){t.assignedTeamMemberUuid=e.app.resources.uuid,T(t,!0),g("myTasks")},t.unAssignTask=function(e){e.assignedTeamMemberUuid=null,e.assignedTeamUuid=null,T(e)},t._task={},t.confirmDeleteTask=function(e){r(function(){t._task=e,angular.element("#confirmTaskModal").modal("show")})},t.deleteTask=function(n){t._task={},angular.element("#confirmTaskModal").modal("hide"),o._("taskDelete",{second:n.uuid},n).then(function(t){t.error?t.error.data?e.notifier.error(t.error.data):e.notifier.error(t.error):(e.notifier.success(e.ui.task.taskDeleted),y())})},t.members=p.members[t.currentTeam],t.groups=[],t.clients=[],t.teamAffectGroup=function(){angular.forEach(d.clientGroups,function(e){t.currentGroup==e.id&&(t.groups=[],t.groups.push(e))}),t.groupAffectClient(t.currentGroup)},t.groupAffectClient=function(e){t.clients=d.clients[e],(t.curentClient==null||typeof t.curentClient=="undefined")&&t.clients&&t.clients.length>0?t.curentClient=t.clients[0].uuid:t.curentClient=null,t.task&&t.task.client&&(t.task.client=t.curentClient)},typeof v[t.currentTeam]=="undefined"?t.currentGroup=null:(t.currentGroup=v[t.currentTeam],t.teamAffectGroup(),t.groupAffectClient(t.currentGroup)),t.changeClientGroup=function(e){t.groupAffectClient(e)},t.changeTeam=function(e){t.members=p.members[e],t.currentGroup=v[e],t.teamAffectGroup()},t.changeTeam(t.currentTeam),u.chains(),t.validateTaskForm=function(n){return!n||!n.start||!n.end?(e.notifier.error(e.ui.task.filltheTime),!1):n.start.date==""||n.start.time==""||!n.start.time?(e.notifier.error(e.ui.task.startTimeEmpty),!1):n.end.date==""||n.end.time==""||!n.end.time?(e.notifier.error(e.ui.task.endTimeEmpty),!1):(t.task.startTime=e.browser.mobile?(new Date(n.start.date)).getTime():l.convert.absolute(S(n.start.date,"dd-MM-yyyy"),S(n.start.time,"HH:mm"),!1),t.task.endTime=e.browser.mobile?(new Date(n.end.date)).getTime():l.convert.absolute(S(n.end.date,"dd-MM-yyyy"),S(n.end.time,"HH:mm"),!1),t.task.startTime<=Date.now().getTime()||t.task.endTime<=Date.now().getTime()?(e.notifier.error(e.ui.task.planTaskInFuture),!1):t.task.startTime>=t.task.endTime?(e.notifier.error(e.ui.task.startLaterThanEnd),!1):!n.client||n.client==null?(e.notifier.error(e.ui.task.specifyClient),!1):!0)},t.createTask=function(n){if(!t.validateTaskForm(n))return;e.statusBar.display(e.ui.task.creatingTask);var r={uuid:"",status:2,plannedStartVisitTime:t.task.startTime,plannedEndVisitTime:t.task.endTime,relatedClientUuid:n.client,assignedTeamUuid:n.team,description:n.description,assignedTeamMemberUuid:n.member};o._("taskAdd",null,r).then(function(t){t.error?(t.error.data?e.notifier.error(e.transError(t.error.data.result)):e.notifier.error(e.transError(t.error)),e.statusBar.off()):(n.member==e.app.resources.uuid?y(!0,function(){g("myTasks"),e.notifier.success(e.ui.task.taskSaved)}):b(function(){g("allTasks"),e.notifier.success(e.ui.task.taskSaved)}),e.statusBar.off())})}}])});
define(["controllers/controllers"],function(e){e.controller("tasksCtrl",["$rootScope","$scope","$location","Store","Teams","Clients","Dater","TeamUp","$filter","$route",function(e,t,n,r,i,s,o,u,a,f){function v(){console.log("resetViews ->",t.views),t.views={myTasks:!1,allTasks:!1,newTask:!1}}e.fixStyles(),t.myTasks=r("app").get("myTasks"),t.allTasks=r("app").get("allTasks"),t.orders=[{id:1,name:e.ui.task.orderType1},{id:2,name:e.ui.task.orderType2}];var l=n.search();l.orderType?t.currentOrder=l.orderType:t.currentOrder=1,t.orderItem="plannedEndVisitTime",t.reverse=!1,t.resort=function(e){if(e=="clientName"){var n=function(e){return a("getObjAttr")(e.relatedClientUuid,"client","name")+""};t.orderItem=n}else if(e=="memberName"){var r=function(e){return a("getObjAttr")(e.assignedTeamMemberUuid,"member","name")+""};t.orderItem=r}else t.orderItem=e;t.reverse=!t.reverse};var c=i.queryLocal(),h=s.queryLocal(),p=i.queryLocalClientGroup(c.teams);t.teams=c.teams;if(t.currentTeam==null||typeof t.currentTeam=="undefined")t.currentTeam=c.teams[0].uuid;t.members=c.members[t.currentTeam],t.groups=[],t.clients=[],t.teamAffectGroup=function(e){angular.forEach(h.clientGroups,function(e){t.currentGroup==e.id&&(t.groups=[],t.groups.push(e))}),t.groupAffectClient(t.currentGroup)},t.groupAffectClient=function(e){t.clients=h.clients[e],(t.curentClient==null||typeof t.curentClient=="undefined")&&t.clients&&t.clients.length>0?t.curentClient=t.clients[0].uuid:t.curentClient=null,t.task&&t.task.client&&(t.task.client=t.curentClient)},typeof p[t.currentTeam]=="undefined"?t.currentGroup=null:(t.currentGroup=p[t.currentTeam],t.teamAffectGroup(t.currentTeam),t.groupAffectClient(t.currentGroup)),t.changeClientGroup=function(e){console.log("client group id",e),t.groupAffectClient(e)},t.changeTeam=function(e){t.members=c.members[e],t.currentGroup=p[e],t.teamAffectGroup(e)},t.validateTaskForm=function(n){return console.log(t.curentClient),!n||!n.start||!n.end?(e.notifier.error(e.ui.task.filltheTime),!1):n.start.date==""||n.start.time==""||!n.start.time?(e.notifier.error(e.ui.task.startTimeEmpty),!1):n.end.date==""||n.end.time==""||!n.end.time?(e.notifier.error(e.ui.task.endTimeEmpty),!1):(t.task.startTime=e.browser.mobile?(new Date(n.start.date)).getTime():o.convert.absolute(n.start.date,n.start.time,!1),t.task.endTime=e.browser.mobile?(new Date(n.end.date)).getTime():o.convert.absolute(n.end.date,n.end.time,!1),t.task.startTime<=Date.now().getTime()||t.task.endTime<=Date.now().getTime()?(e.notifier.error(e.ui.task.planTaskInFuture),!1):t.task.startTime>=t.task.endTime?(e.notifier.error(e.ui.task.startLaterThanEnd),!1):(console.log(t.curentClient),console.log(n.client),!n.client||n.client==null?(e.notifier.error(e.ui.task.specifyClient),!1):!0))},t.reloadAndSaveTask=function(t,i){u._("taskById",{second:t},null).then(function(s){if(s.error&&i!="delete")e.notifier.error(s.error);else{var o=r("app").get("allTasks"),u=r("app").get("myTasks"),l="",c=function(e,t){var n=0;for(;n<e.length;n++)t==e[n].uuid&&(e.splice(n,1),n--);return e};if(i=="assign"||i=="unAssign"||i=="add"){var h=a("getByUuid")(o,s.uuid),p=a("getByUuid")(u,s.uuid);if(s.assignedTeamMemberUuid&&s.assignedTeamMemberUuid==e.app.resources.uuid){h&&(o=c(o,h.uuid)),p&&(u=c(u,p.uuid));if(!u.length||u.length==0)u=[];u.push(s)}else if(!s.assignedTeamMemberUuid){h&&(o=c(o,h.uuid)),p&&(u=c(u,p.uuid));if(!o.length||o.length==0)o=[];o.push(s)}s.assignedTeamMemberUuid&&s.assignedTeamMemberUuid==e.app.resources.uuid?l="myTasks":l="allTasks"}else i=="delete"?(o=c(o,t),u=c(u,t),l=n.hash(),f.reload()):i=="update";r("app").save("allTasks",o),r("app").save("myTasks",u),n.hash(l)}})},t.createTask=function(n){if(!t.validateTaskForm(n))return;var r={uuid:"",status:2,plannedStartVisitTime:t.task.startTime,plannedEndVisitTime:t.task.endTime,relatedClientUuid:n.client,assignedTeamUuid:n.team,description:n.description,assignedTeamMemberUuid:n.member};u._("taskAdd",null,r).then(function(n){n.error?e.notifier.error(n.error):(e.notifier.success(e.ui.task.taskSaved),t.reloadAndSaveTask(n.result,"add"))})};var d;n.hash()?d=n.hash():d="myTasks";var m=function(e){console.log("setView -> ",e),v(),t.views[e]=!0};t.setViewTo=function(e){console.log("setViewTo ->",e),t.$watch(e,function(){n.hash(e),m(e)})},m(d),t.assignYourself=function(n){n.assignedTeamMemberUuid=e.app.resources.uuid,u._("taskUpdate",{second:n.uuid},n).then(function(r){console.log(r),r.error?(r.error.data.result?e.notifier.error(r.error.data.result):e.notifier.error(r.error),n.assignedTeamMemberUuid=null):(console.log(r),t.reloadAndSaveTask(r.result,"assign"))})},t.unassignYourself=function(n){n.assignedTeamMemberUuid=null,u._("taskUpdate",{second:n.uuid},n).then(function(r){console.log(r),r.error?(r.error.data?e.notifier.error(r.error.data.result):e.notifier.error(r.error),n.assignedTeamMemberUuid=null):(console.log(r),t.reloadAndSaveTask(r.result,"unAssign"))})},t.deleteTask=function(n){if(!confirm(e.ui.task.deleteTaskConfirm))return;u._("taskDelete",{second:n.uuid},n).then(function(n){console.log("after delete action , ",n),n.error?n.error.data?e.notifier.error(n.error.data):e.notifier.error(n.error):(e.notifier.success(e.ui.task.taskDeleted),t.reloadAndSaveTask(n.uuid,"delete"))})},t.updateTask=function(e){},d!="myTasks"&&d!="allTasks"&&(t.map={center:{latitude:52,longitude:4},zoom:8,bounds:{}}),t.$on("$viewContentLoaded",function(){console.log("$viewContentLoaded"),$("#task-map .angular-google-map-container").height(500),google.maps.event.trigger($("#task-map"),"resize")}),t.clientCoords={latitude:0,longitude:0},t.changeClient=function(e){console.log("latlong "+a("getObjAttr")(e,"client","latlong"));var n=a("getObjAttr")(e,"client","latlong"),r=n.split(",");r.length==2&&(t.clientCoords.latitude=r[0],t.clientCoords.longitude=r[1],t.map.center.latitude=r[0],t.map.center.longitude=r[1])}}])});
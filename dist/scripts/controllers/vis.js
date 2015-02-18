define(["controllers/controllers","config"],function(e,t){e.controller("vis",["$rootScope","$scope","$location","Store","Dater","TeamUp",function(e,n,r,i,s,o){function u(){n.views={teams:!1,clients:!1}}function p(){switch(n.section){case"teams":n.list=n.data.teams.list,typeof n.currentTeam=="undefined"&&(n.currentTeam=n.data.teams.list[0].uuid),n.changeCurrent(n.currentTeam);break;case"clients":n.list=n.data.clients.list,typeof n.currentClientGroup=="undefined"&&(n.currentClientGroup=n.data.clients.list[0].uuid),n.changeCurrent(n.currentClientGroup)}}var a=function(e){u(),n.views[e]=!0};n.setViewTo=function(e){n.$watch(e,function(){r.hash(e),a(e)})},a("teams"),p(),n.items={team_1:[{id:1,content:"item 1",start:"2014-05-22",end:"2014-05-29"},{id:2,content:"item 2",start:"2014-05-20"}],team_2:[{id:3,content:"item 3",start:"2014-05-18"},{id:4,content:"item 4",start:"2014-05-16",end:"2014-05-19"}],team_3:[{id:5,content:"item 5",start:"2014-05-25"},{id:6,content:"item 6",start:"2014-05-27"}]};var f=!1;n.simplifyItems=function(e){var t=[];return angular.forEach(e,function(e,n){angular.forEach(e,function(e){e.group=n,t.push(e)})}),t},n.timeline={select:function(e){f&&console.log("selected items: ",e.items);var t=n.simplifyItems(n.items),r="YYYY-MM-DDTHH:mm";angular.forEach(t,function(t){t.id==e.items[0]&&(n.slot={id:t.id,start:Moment(t.start).format(r),end:t.end?Moment(t.end).format(r):null,content:t.content},n.$apply())})},range:{},rangeChange:function(e){this.range=n.timeline.getWindow(),n.$$phase||n.$apply(),f&&console.log("rangeChange: start-> ",e.start," end-> ",e.end)},rangeChanged:function(e){f&&console.log("rangeChange(d): start-> ",e.start," end-> ",e.end)},customTime:null,timeChange:function(e){f&&console.log("timeChange: ",e.time),n.$apply(function(){n.timeline.customTime=e.time})},timeChanged:function(e){f&&console.log("timeChange(d): ",e.time)},slot:{add:function(e,t){e.content=prompt("Enter text content for new item:",e.content),e.content!=null?t(e):t(null)},move:function(e,t){confirm("Do you really want to move the item to\nstart: "+e.start+"\n"+"end: "+e.end+"?")?t(e):t(null)},update:function(e,t){e.content=prompt("Edit items text:",e.content),e.content!=null?t(e):t(null)},remove:function(e,t){confirm("Remove item "+e.content+"?")?t(e):t(null)}}},n.getCustomTime=function(){n.gotCustomDate=n.timeline.getCustomTime()},n.getSelection=function(){n.gotSelection=n.timeline.getSelection()},n.setSelection=function(e){e=angular.isArray(e)?e:[].concat(e),n.timeline.setSelection(e)},n.getWindow=function(){n.gotWindow=n.timeline.getWindow()},n.setWindow=function(e,t){n.timeline.setScope("custom"),n.timeline.setWindow(e,t)},n.setOptions=function(e){n.timeline.setOptions(e)};var l=r.search();n.imgHost=t.app.host,n.ns=t.app.ns;var c=i("app").get("teams"),h=i("app").get("ClientGroups");n.data={teams:{list:[],members:{},tasks:[]},clients:{list:[],members:{},tasks:[]},user:[{count:0,end:1378681200,recursive:!0,start:1378504800,text:"com.ask-cs.State.Available",type:"availability",wish:0},{count:0,end:1378850400,recursive:!0,start:1378720800,text:"com.ask-cs.State.Available",type:"availability",wish:0}],members:[],synced:Number(Date.today()),periods:{start:Number(Date.today())-6048e5,end:Number(Date.today())+6048e5}},angular.forEach(c,function(e){var t=i("app").get(e.uuid);t&&t.length>0&&(n.data.teams.list.push({uuid:e.uuid,name:e.name}),n.data.teams.members[e.uuid]=[],angular.forEach(t,function(t){var r="",i='<div class="roundedPicSmall memberStateNone" style="float: left; background-image: url('+r+');" memberId="'+t.uuid+'"></div>',s=i+'<div style="float: left; margin: 15px 0 0 5px; font-size: 14px;">'+t.firstName+" "+t.lastName+"</div>",o={head:s,memId:t.uuid};n.data.teams.members[e.uuid].push(o)}))}),angular.forEach(h,function(e){var r=i("app").get(e.id);r&&r.length>0&&(n.data.clients.list.push({uuid:e.id,name:e.name}),n.data.clients.members[e.id]=[],angular.forEach(r,function(r){var i="",s=n.imgHost+i;typeof i=="undefined"&&(s=t.app.noImgURL);var o='<div class="roundedPicSmall memberStateNone" style="float: left; background-image: url('+s+');" memberId="'+r.uuid+'"></div>',u=o+'<div style="float: left; margin: 15px 0 0 5px; font-size: 14px;">'+r.firstName+" "+r.lastName+"</div>",a={head:u,memId:r.uuid};n.data.clients.members[e.id].push(a)}))}),n.changeCurrent=function(t){console.log("current ->",t),angular.forEach(n.data[n.section].list,function(e){e.uuid==t&&(n.currentName=e.name)}),n.section=="teams"?(n.currentTeam=t,n.data.members=n.data[n.section].members[n.currentTeam]):n.section=="clients"&&(n.currentClientGroup=t,n.data.members=n.data[n.section].members[n.currentClientGroup]),n.data.section=n.section;var i=Number(Date.today())-6048e5,s=Number(Date.today())+6048e5,u=function(t,r,i){n.data[n.section].tasks=[],angular.forEach(t,function(e,t){if(e!=null){var r="";n.section=="teams"&&(r=e.assignedTeamMemberUuid),n.section=="clients"&&(r=e.relatedClientUuid),typeof n.data[n.section].tasks[r]=="undefined"&&(n.data[n.section].tasks[r]=new Array),n.data[n.section].tasks[r].push(e)}}),e.$broadcast("timeliner",{start:r,end:i})};n.data.section=="teams"?(r.search({uuid:n.currentTeam}).hash("teams"),o._("teamTaskQuery",{second:n.currentTeam,from:i,to:s}).then(function(e){u(e,i,s)},function(e){console.log("error happend when getting the tasks for the team members "+e)})):n.data.section=="clients"&&(r.search({uuid:n.currentClientGroup}).hash("clients"),o._("clientGroupTasksQuery",{second:n.currentClientGroup,from:i,to:s},null,{error:function(e){console.log("error happend when getting the tasks for the team members "+e)}}).then(function(e){u(e,i,s)}))},n.self=this,n.current={layouts:{user:!0,group:!1,members:!1},day:s.current.today()+1,week:s.current.week(),month:s.current.month(),division:"all"},s.registerPeriods(),n.periods=s.getPeriods(),n.slot={};var d=s.current.today()-7<1?1:s.current.today()-7;n.__timeline={id:"mainTimeline",main:!0,user:{id:e.app.resources.uuid,role:e.app.resources.role},current:n.current,options:{start:n.periods.days[d].last.day,end:n.periods.days[s.current.today()+7].last.day,min:n.periods.days[d].last.day,max:n.periods.days[s.current.today()+7].last.day},range:{start:n.periods.days[d].last.day,end:n.periods.days[s.current.today()+7].last.day},scope:{day:!1,week:!0,month:!1},config:{bar:t.app.timeline.config.bar,layouts:t.app.timeline.config.layouts,wishes:t.app.timeline.config.wishes,legenda:{},legendarer:t.app.timeline.config.legendarer,states:t.app.timeline.config.states,divisions:t.app.timeline.config.divisions,densities:t.app.timeline.config.densities}},$.browser.msie&&$.browser.version=="8.0"&&(n.timeline.options={start:n.periods.days[s.current.today()-7].last.timeStamp,end:n.periods.days[s.current.today()+7].last.timeStamp,min:n.periods.days[s.current.today()-7].last.timeStamp,max:n.periods.days[s.current.today()+7].last.timeStamp}),angular.forEach(t.app.timeline.config.states,function(e,t){n.timeline.config.legenda[t]=!0}),n.__timeline.config.legenda.groups={more:!0,even:!0,less:!0},n.daterange=s.readable.date(n.timeline.range.start)+" / "+s.readable.date(n.timeline.range.end),n.processRelatedUsers=function(t){var r=[],i=angular.element(t.group).attr("memberId");if(n.views.teams){n.relatedUserLabel=e.ui.teamup.clients;var s=e.getTeamMemberById(i);typeof s.teamUuids!="undefined"&&s.teamUuids.length>0&&(r=e.getClientsByTeam(s.teamUuids))}else if(n.views.clients){n.relatedUserLabel=e.ui.planboard.members;var o=e.getClientByID(i);typeof o.clientGroupUuid!="undefined"&&o.clientGroupUuid!=""&&(r=e.getMembersByClient(o.clientGroupUuid))}return r},n.resetInlineForms=function(){n.slot={},n.original={},n.resetViews(),n.section=="teams"?n.changeCurrent(n.currentTeam):n.section=="clients"&&n.changeCurrent(n.currentClientGroup)}}])});
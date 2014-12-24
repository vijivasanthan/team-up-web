define(["controllers/controllers","config"],function(e,t){e.controller("timeline",["$rootScope","$scope","$q","$location","$timeout","$route","$window","Dater","TeamUp","Store","Teams",function(e,n,r,i,s,o,u,a,f,l,c){function d(e,t){var n=0;for(;n<e.length;n++)t==e[n].uuid&&(e.splice(n,1),n--);return e}function v(t,i,s){var o=[];c.getTasksRange(t).then(function(u){u.length==0?(e.notifier.error(e.ui.planboard.noTasksFounded),e.statusBar.off()):u.error?e.notifier.error(result.error):(angular.forEach(u,function(e){i=d(i,e.uuid),s=d(s,e.uuid),o.push(f._("taskDelete",{second:e.uuid},e))}),r.all(o).then(function(r){r.error&&console.log("failed to remove task ",task),e.notifier.success(e.ui.planboard.tasksDeleted(t)),e.statusBar.off(),n.resetInlineForms(),e.planboardSync.start()}))})}var h,p;n.removeTasksRange,n.$watch(function(){n.timeline&&n.timeline.main?(h=n.self.timeline.getVisibleChartRange(),p=a.calculate.diff(h),p<=864e5?n.timeline.scope={day:!0,week:!1,month:!1}:p<6048e5?n.timeline.scope={day:!1,week:!0,month:!1}:p>6048e5&&(n.timeline.scope={day:!1,week:!1,month:!0}),n.timeline.range={start:(new Date(h.start)).toString(),end:(new Date(h.end)).toString()},n.daterange=a.readable.date(n.timeline.range.start)+" / "+a.readable.date(n.timeline.range.end)):o.current.params.userId!=e.app.resources.uuid&&n.self.timeline&&(h=n.self.timeline.getVisibleChartRange(),n.timeline.range={start:(new Date(h.start)).toString(),end:(new Date(h.end)).toString()})}),e.$on("slotInitials",function(){n.slot={},n.slot={start:{date:(new Date).toString(t.app.formats.date),time:(new Date).toString(t.app.formats.time),datetime:(new Date).toISOString()},end:{date:(new Date).toString(t.app.formats.date),time:(new Date).addHours(1).toString(t.app.formats.time),datetime:(new Date).toISOString()},state:"com.ask-cs.State.Available",recursive:!1,id:""}}),n.timeliner={init:function(){n.self.timeline=new links.Timeline(document.getElementById(n.timeline.id)),links.events.addListener(n.self.timeline,"rangechanged",this.getRange),links.events.addListener(n.self.timeline,"add",this.onAdd),links.events.addListener(n.self.timeline,"delete",this.onRemove),links.events.addListener(n.self.timeline,"change",this.onChange),links.events.addListener(n.self.timeline,"select",this.onSelect),this.render(n.timeline.options)},getRange:function(){n.timelineGetRange()},onAdd:function(){n.timelineOnAdd()},onRemove:function(){n.timelineOnRemove()},onChange:function(){n.timelineChanging()},onSelect:function(){n.timelineOnSelect()},process:function(t){var n=[],r=Number(Date.now());return angular.forEach(t.members,function(i){var s=[];t.section=="teams"?t.teams.tasks[i.memId]!=null&&s.push(t.teams.tasks[i.memId]):t.section=="clients"&&t.clients.tasks[i.memId]!=null&&s.push(t.clients.tasks[i.memId]),angular.forEach(s,function(s){angular.forEach(s,function(s){var o="";t.section=="teams"?o=e.getClientByID(s.relatedClientUuid):t.section=="clients"&&(o=e.getTeamMemberById(s.assignedTeamMemberUuid));var u="";o!=null&&(u=o.firstName+" "+o.lastName),s.plannedEndVisitTime==0&&(s.plannedEndVisitTime=r);var a="<span>"+u+"</span>"+"<input type=hidden value='"+angular.toJson({type:"slot",id:s.uuid,mid:s.authorUuid,description:s.description,clientUuid:s.relatedClientUuid,memberId:s.assignedTeamMemberUuid})+"'>";n.push({start:Math.round(s.plannedStartVisitTime),end:Math.round(s.plannedEndVisitTime),group:i.head,content:a,className:"state-available",editable:!1})})});var o=function(e,t,n){return angular.forEach(n,function(e){t.push({start:15778368e5,end:15778368e5,group:e,content:"loading",className:"state-loading-right",editable:!1}),t.push({start:0,end:0,group:e,content:"loading",className:"state-loading-left",editable:!1})}),t};n=o(t,n,[i.head])}.bind(this)),n},render:function(e,r){var i,s;n.timeline.range?(typeof n.timeline.range.start!=Date&&(n.timeline.range.start=new Date(n.timeline.range.start)),typeof n.timeline.range.end!=Date&&(n.timeline.range.end=new Date(n.timeline.range.end)),i=n.timeline.range.start,s=n.timeline.range.end):(i=new Date(e.start),s=new Date(e.end)),n.timeline={id:n.timeline.id,main:n.timeline.main,user:n.timeline.user,current:n.timeline.current,scope:n.timeline.scope,config:n.timeline.config,options:{start:r?i:new Date(e.start),end:r?s:new Date(e.end),min:new Date(e.start),max:new Date(e.end)}},$.browser.msie&&$.browser.version=="8.0"&&(n.timeline.options.start=new Date(e.start),n.timeline.options.end=new Date(e.end)),angular.extend(n.timeline.options,t.app.timeline.options),n.self.timeline.draw(this.process(n.data),n.timeline.options),r?n.self.timeline.setVisibleChartRange(i,s):n.self.timeline.setVisibleChartRange(n.timeline.options.start,n.timeline.options.end)},refresh:function(){n.slot={},n.timeline.main?e.$broadcast("resetPlanboardViews"):n.forms={add:!0,edit:!1},this.render({start:n.periods.weeks[(new Date).getWeek()].first.timeStamp,end:n.periods.weeks[(new Date).getWeek()].last.timeStamp},!0)},redraw:function(){n.self.timeline.redraw()},isAdded:function(){return angular.element(".timeline-event-selected .timeline-event-content").text()=="Nieuw"?!0:!1},cancelAdd:function(){n.self.timeline.cancelAdd()}},n.timeline&&n.timeliner.init(),e.$on("timeliner",function(){n.timeliner.render({start:(new Date(arguments[1].start)).getTime(),end:(new Date(arguments[1].end)).getTime()})}),n.requestTimeline=function(e){switch(e){case"group":n.timeline.current.layouts.group=!n.timeline.current.layouts.group,n.timeline.current.layouts.members&&!n.timeline.current.layouts.group&&(n.timeline.current.layouts.members=!1);break;case"members":n.timeline.current.layouts.members=!n.timeline.current.layouts.members,n.timeline.current.layouts.members&&!n.timeline.current.layouts.group&&(n.timeline.current.layouts.group=!0)}n.timeliner.render({start:n.data.periods.start,end:n.data.periods.end})},n.timelineGetRange=function(){var e=n.self.timeline.getVisibleChartRange();n.$apply(function(){n.timeline.range={start:(new Date(e.from)).toString(),end:(new Date(e.till)).toString()},n.timeline.main&&(n.daterange={start:a.readable.date((new Date(e.start)).getTime()),end:a.readable.date((new Date(e.end)).getTime())})})},n.selectedSlot=function(){var r;n.timeliner.isAdded()>0;if(r=n.self.timeline.getSelection()[0]){var i=n.self.timeline.getItem(r.row),s=n.getSlotContentJSON(i.content);n.relatedUsers=n.processRelatedUsers(i),n.original={start:i.start,end:i.end,content:s},n.timeline.main&&i.content!="Nieuw"?e.$broadcast("resetPlanboardViews"):i.content!="Nieuw"&&(n.forms={add:!1,edit:!0}),i.content=="Nieuw"?s={type:"slot"}:s.clientUuid&&typeof s.id=="undefined"&&(s=$.extend(s,{type:"slot"}));if(s.type){if(n.timeline.main)switch(s.type){case"slot":i.content=="Nieuw"||s.relatedUser&&typeof s.id=="undefined"?n.views.slot.add=!0:n.views.slot.edit=!0;break;case"group":n.views.group=!0;break;case"wish":n.views.wish=!0;break;case"member":n.views.member=!0}var o;n.views.teams?o=s.clientUuid:n.views.clients&&(o=s.memberId),n.slot={start:{date:(new Date(i.start)).toString(t.app.formats.date),time:(new Date(i.start)).toString(t.app.formats.time),datetime:(new Date(i.start)).toISOString()},end:{date:(new Date(i.end)).toString(t.app.formats.date),time:(new Date(i.end)).toString(t.app.formats.time),datetime:(new Date(i.end)).toISOString()},state:s.state,recursive:s.recursive,id:s.id,memberId:s.memberId,mid:s.mid,clientUuid:s.clientUuid,relatedUser:o,description:s.description};if(n.timeline.main)switch(s.type){case"group":n.slot.diff=s.diff,n.slot.group=s.group;break;case"wish":n.slot.wish=s.wish,n.slot.group=s.group,n.slot.groupId=s.groupId;break;case"member":n.slot.member=s.mid}}return i}},n.timelineOnSelect=function(){n.$apply(function(){console.log(" $scope.selectedSlot();",n.selectedSlot()),n.selectedOriginal=n.selectedSlot(),typeof n.selectedOriginal!="undefined"&&n.redrawSlot(n.selectedOriginal)})},n.refreshTasks=function(t,n){f._("taskById",{second:t},null).then(function(t){var r=l("app").get("allTasks"),i=l("app").get("myTasks");n=="add"||n=="update"?t.error?e.notifier.error(t.error):(r.length||(r=[]),n=="update"&&(r=d(r,t.uuid)),r.push(t),t.assignedTeamMemberUuid==e.app.resources.uuid&&(i.length||(i=[]),n=="update"&&(i=d(i,t.uuid)),i.push(t))):n=="delete"&&(r=d(r,t.uuid),i=d(i,t.uuid)),l("app").save("allTasks",r),l("app").save("myTasks",i)})},n.confirmDeleteTasks=function(e,t){i.hash()=="clients"?n.removeTaskOptions={groupId:n.currentClientGroup,name:n.currentName,group:"clientgroep",range:{}}:i.hash()=="teams"&&(n.removeTaskOptions={groupId:n.currentTeam,name:n.currentName,group:"team",range:{}}),_.isUndefined(t)||(n.removeTaskOptions.userId=t.uuid),_.isUndefined(e)||(n.removeTaskOptions.range.start=moment(e.start).format("DD MMM. YYYY"),n.removeTaskOptions.range.end=moment(e.end).format("DD MMM. YYYY")),s(function(){angular.element("#confirmTasksDeleteModal").modal("show")})},n.deleteTasksByRange=function(t){var n=l("app").get("allTasks"),r=l("app").get("myTasks");e.planboardSync.clear(),angular.element("#confirmTasksDeleteModal").modal("hide"),e.statusBar.display(e.ui.task.taskDeleted);switch(t.group){case"team":v(t,n,r);break;case"client":console.log("client");break;default:console.log("Voor het verwijderen van taken is geen team, clientgroep, client of member geselecteert.")}},n.timelineOnAdd=function(r,i){e.planboardSync.clear();var s;if(!r)s=n.self.timeline.getItem(n.self.timeline.getSelection()[0].row),n.relatedUsers=n.processRelatedUsers(s),n.timeliner.isAdded()>1&&n.self.timeline.cancelAdd(),n.$apply(function(){n.timeline.main?(e.$broadcast("resetPlanboardViews"),n.views.slot.add=!0):n.forms={add:!0,edit:!1},n.slot={start:{date:(new Date(s.start)).toString(t.app.formats.date),time:(new Date(s.start)).toString(t.app.formats.time),datetime:(new Date(s.start)).toISOString()},end:{date:(new Date(s.end)).toString(t.app.formats.date),time:(new Date(s.end)).toString(t.app.formats.time),datetime:(new Date(s.end)).toISOString()},recursive:s.group.match(/recursive/)?!0:!1,state:"com.ask-cs.State.Available"},n.original={start:new Date(s.start),end:new Date(s.end),content:{recursive:n.slot.recursive,state:n.slot.state}}});else{s=n.self.timeline.getItem(n.self.timeline.getSelection()[0].row),s={startTime:e.browser.mobile?(new Date(i.start.datetime)).getTime():a.convert.absolute(i.start.date,i.start.time,!1),endTime:e.browser.mobile?(new Date(i.end.datetime)).getTime():a.convert.absolute(i.end.date,i.end.time,!1),description:typeof i.description=="undefined"?"":i.description,relatedUserId:i.relatedUser};if(typeof i.relatedUser=="undefined"||i.relatedUser==""){if(n.views.teams){e.notifier.error(e.ui.teamup.selectClient);return}n.views.clients,i.relatedUser=null}var o=n.self.timeline.getItem(n.self.timeline.getSelection()[0].row),u=angular.element(o.group).attr("memberId");if(typeof u=="undefined"){e.notifier.error(e.ui.teamup.selectSlot);return}e.statusBar.display(e.ui.planboard.addTimeSlot),s=$.extend(s,{memberId:u}),s=n.convertTaskJsonObject(s),f._("taskAdd",null,s).then(function(t){e.$broadcast("resetPlanboardViews"),t.error?t.error.data?e.notifier.error(e.transError(t.error.data.result)):e.notifier.error(e.transError(t.error)):e.notifier.success(e.ui.planboard.slotAdded),n.section=="teams"?n.changeCurrent(n.currentTeam,{start:n.timeline.range.start,end:n.timeline.range.end}):n.section=="clients"&&n.changeCurrent(n.currentClientGroup,{start:n.timeline.range.start,end:n.timeline.range.end}),n.refreshTasks(t.result,"add"),e.statusBar.off()})}},n.convertTaskJsonObject=function(t){var r,i,s;if(n.views.teams)r=t.memberId,i=t.relatedUserId,s=n.currentTeam;else if(n.views.clients){if(t.relatedUserId){r=t.relatedUserId;var o=e.getTeamMemberById(r);s=o.teamUuids[0]}else s=null;i=t.memberId}return{uuid:t.uuid,status:2,plannedStartVisitTime:t.startTime,plannedEndVisitTime:t.endTime,relatedClientUuid:i,assignedTeamUuid:s,description:t.description,assignedTeamMemberUuid:r}},n.redrawSlot=function(){var t=a.convert.absolute(n.slot.start.date,n.slot.start.time,!1),r=a.convert.absolute(n.slot.end.date,n.slot.end.time,!1),i=n.self.timeline.getSelection()[0];if(typeof i!="undefined"){var s=n.processSlotContent(i.row);n.self.timeline.changeItem(i.row,{content:s,start:new Date(t),end:new Date(r)})}else alert(e.ui.teamup.selectSlot)},n.processSlotContent=function(e){var t=n.self.timeline.getItem(e),r="";angular.forEach(n.relatedUsers,function(e){e.uuid==n.slot.relatedUser&&(r=e.name)});var i=t.content;i!="Nieuw"?(i=n.getSlotContentJSON(t.content),i.clientUuid=n.slot.clientUuid,i.memberId=n.slot.memberId):i={clientUuid:n.slot.clientUuid,memberId:n.slot.memberId};var s="<span>"+r+"</span>"+'<input type="hidden" value="'+angular.toJson(i)+'">';if(typeof n.slot.clientUuid=="undefined"&&n.views.teams||typeof n.slot.memberId=="undefined"&&n.views.clients)if(typeof n.slot.relatedUser=="undefined"||n.slot.relatedUser=="")s="Nieuw";return s},n.timelineChanging=function(){e.planboardSync.clear();var r=n.self.timeline.getItem(n.self.timeline.getSelection()[0].row),i=n.getSlotContentJSON(r.content);i!=undefined&&n.$apply(function(){n.slot={start:{date:(new Date(r.start)).toString(t.app.formats.date),time:(new Date(r.start)).toString(t.app.formats.time),datetime:(new Date(r.start)).toISOString()},end:{date:(new Date(r.end)).toString(t.app.formats.date),time:(new Date(r.end)).toString(t.app.formats.time),datetime:(new Date(r.end)).toISOString()},state:i.state,id:i.id,memberId:i.memberId,mid:i.mid,clientUuid:i.clientUuid,relatedUser:n.slot.relatedUser}})},n.getRelatedUserId=function(e){var t="";return angular.forEach(n.relatedUsers,function(n){n.name==e&&(t=n.uuid)}),t},n.timelineOnChange=function(t,r,i){e.planboardSync.clear();var s,o=n.self.timeline.getItem(n.self.timeline.getSelection()[0].row),u=n.getSlotContentJSON(o.content),l=angular.element(o.group).attr("memberId");t?s={startTime:e.browser.mobile?(new Date(i.start.datetime)).getTime():a.convert.absolute(i.start.date,i.start.time,!1),endTime:e.browser.mobile?(new Date(i.end.datetime)).getTime():a.convert.absolute(i.end.date,i.end.time,!1),description:i.description,relatedUserId:i.relatedUser,uuid:u.id,memberId:l}:s={startTime:o.start,endTime:o.end,description:i.description,relatedUserId:i.relatedUser,uuid:u.id,memberId:l};var c=n.convertTaskJsonObject(s);f._("taskUpdate",{second:c.uuid},c).then(function(t){e.$broadcast("resetPlanboardViews"),t.error?e.notifier.error(t.error.data.result):(e.notifier.success(e.ui.planboard.slotChanged),n.section=="teams"?n.changeCurrent(n.currentTeam,{start:n.timeline.range.start,end:n.timeline.range.end}):n.section=="clients"&&n.changeCurrent(n.currentClientGroup,{start:n.timeline.range.start,end:n.timeline.range.end})),n.refreshTasks(t.result,"update"),e.statusBar.off()})},n.confirmDeleteTask=function(){s(function(){angular.element("#confirmTaskModal").modal("show")})},n.timelineOnRemove=function(){e.planboardSync.clear(),angular.element("#confirmTaskModal").modal("hide");if(n.timeliner.isAdded()>0)n.self.timeline.cancelAdd(),n.$apply(function(){n.resetInlineForms()});else{var t=n.self.timeline.getItem(n.self.timeline.getSelection()[0].row),r=n.getSlotContentJSON(t.content),i=angular.element(t.group).attr("memberId");if(typeof r=="undefined"){n.timeliner.refresh();return}if(typeof r.id=="undefined")return;e.statusBar.display(e.ui.planboard.deletingTimeslot),f._("taskDelete",{second:r.id}).then(function(t){e.$broadcast("resetPlanboardViews"),t.error?e.notifier.error(t.error.data.result):(e.notifier.success(e.ui.planboard.timeslotDeleted),n.section=="teams"?n.changeCurrent(n.currentTeam,{start:n.timeline.range.start,end:n.timeline.range.end}):n.section=="clients"&&n.changeCurrent(n.currentClientGroup,{start:n.timeline.range.start,end:n.timeline.range.end})),n.refreshTasks(r.id,"delete"),e.statusBar.off(),e.planboardSync.start()})}},n.timeline&&n.timeline.main&&setTimeout(function(){n.self.timeline.redraw()},100),e.planboardSync={start:function(){u.planboardSync=u.setInterval(function(){i.path()=="/planboard"&&(n.slot={},e.$broadcast("resetPlanboardViews"),n.timeliner.render({start:n.data.periods.start,end:n.data.periods.end},!0))},6e4)},clear:function(){u.clearInterval(u.planboardSync)}},e.planboardSync.start(),n.getSlotContentJSON=function(e){if(e!="Nieuw")return angular.fromJson(e.substring(e.indexOf("value=")+7,e.length-2))}}])});
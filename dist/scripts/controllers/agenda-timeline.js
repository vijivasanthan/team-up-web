define(["controllers/controllers","config"],function(e,t){e.controller("agenda-timeline",["$rootScope","$scope","$q","$location","$route","$timeout","$window","Slots","Dater","Sloter","TeamUp","Store",function(e,n,r,i,s,o,u,a,f,l,c,h){function v(){n.timeline.current.layouts.group&&(e.statusBar.display(e.ui.message.getWishes),a.wishes({id:n.timeline.current.group,start:n.data.periods.start/1e3,end:n.data.periods.end/1e3}).then(function(t){e.statusBar.off(),n.data.aggs.wishes=t,n.timeliner.render({start:n.timeline.range.start,end:n.timeline.range.end},!0)}))}var p,d;e.$on("slotInitials",function(){n.slot={},n.slot={start:{date:(new Date).toString(t.app.formats.date),time:(new Date).toString(t.app.formats.time),datetime:(new Date).toISOString()},end:{date:(new Date).toString(t.app.formats.date),time:(new Date).addHours(1).toString(t.app.formats.time),datetime:(new Date).toISOString()},state:"com.ask-cs.State.Available",recursive:!1,id:""}}),n.timeliner={init:function(){n.self.timeline=new links.Timeline(document.getElementById(n.timeline.id)),links.events.addListener(n.self.timeline,"rangechanged",this.getRange),links.events.addListener(n.self.timeline,"add",this.onAdd),links.events.addListener(n.self.timeline,"delete",this.onRemove),links.events.addListener(n.self.timeline,"change",this.onChange),links.events.addListener(n.self.timeline,"select",this.onSelect),this.render(n.timeline.options)},getRange:function(){n.timelineGetRange()},onAdd:function(){n.timelineOnAdd()},onRemove:function(){n.timelineOnRemove()},onChange:function(){n.timelineChanging()},onSelect:function(){n.timelineOnSelect()},render:function(r,s){var o,u;n.timeline.range?(typeof n.timeline.range.start!=Date&&(n.timeline.range.start=new Date(n.timeline.range.start)),typeof n.timeline.range.end!=Date&&(n.timeline.range.end=new Date(n.timeline.range.end)),o=n.timeline.range.start,u=n.timeline.range.end):(o=new Date(r.start),u=new Date(r.end)),n.timeline={id:n.timeline.id,main:n.timeline.main,user:n.timeline.user,current:n.timeline.current,scope:n.timeline.scope,config:n.timeline.config,options:{start:s?o:new Date(r.start),end:s?u:new Date(r.end),min:new Date(r.start),max:new Date(r.end)}},$.browser.msie&&$.browser.version=="8.0"&&(n.timeline.options.start=new Date(r.start),n.timeline.options.end=new Date(r.end)),angular.extend(n.timeline.options,t.app.timeline.options);if(n.timeline.main)n.self.timeline.draw(l.process(n.data,n.timeline.config,n.divisions,n.timeline.user.role,n.timeline.current),n.timeline.options);else{var a=i.hash()=="timeline"?t.app.timers.TICKER:t.app.timers.MEMBER_TIMELINE_RENDER;e.timelineLoaded=!1,setTimeout(function(){e.timelineLoaded=!0,e.$apply(),n.self.timeline.draw(l.profile(n.data.slots.data,n.timeline.config),n.timeline.options)},a)}n.self.timeline.setVisibleChartRange(n.timeline.options.start,n.timeline.options.end)},load:function(t,r){var i=this;e.statusBar.display(e.ui.agenda.refreshTimeline),n.timeline.main?a.all({groupId:n.timeline.current.group,division:n.timeline.current.division,layouts:n.timeline.current.layouts,month:n.timeline.current.month,stamps:t}).then(function(s){s.error?(e.notifier.error(e.ui.agenda.query),console.warn("error ->",s)):(n.data=s,i.render(t,r)),e.statusBar.off(),n.timeline.config.wishes&&v()}):Profile.getSlots(n.timeline.user.id,t).then(function(s){s.error?(e.notifier.error(e.ui.agenda.query),console.warn("error ->",s)):(s.user=s.slots.data,n.data=s,i.render(t,r),e.statusBar.off())})},refresh:function(){n.slot={},n.timeline.main?e.$broadcast("resetPlanboardViews"):n.forms={add:!0,edit:!1},this.load({start:n.data.periods.start,end:n.data.periods.end},!0)},redraw:function(){n.self.timeline.redraw()},isAdded:function(){return $(".state-new").length},cancelAdd:function(){n.self.timeline.cancelAdd()}},n.$watch(function(){if(n.timeline&&n.timeline.main){p=n.self.timeline.getVisibleChartRange();var t={hour:36e5,day:864e5,week:6048e5};i=f.calculate.diff(p)-t.hour,i<=t.day?n.timeline.scope={day:!0,week:!1,month:!1}:i<=t.week?n.timeline.scope={day:!1,week:!0,month:!1}:n.timeline.scope={day:!1,week:!1,month:!0},n.timeline.range={start:(new Date(p.start)).toString(),end:(new Date(p.end)).toString()},n.daterange=f.readable.date(n.timeline.range.start)+" / "+f.readable.date(n.timeline.range.end)}else s.current.params.userId!=e.app.resources.uuid&&n.self.timeline&&(p=n.self.timeline.getVisibleChartRange(),n.timeline.range={start:(new Date(p.start)).toString(),end:(new Date(p.end)).toString()});if(n.timeline){var r=(new Date(Number(f.current.year())+1,11)).moveToLastDayOfMonth().addDays(1),i=r-new Date(p.end);if(i<=0)$("#timelineAfterBtn").attr("disabled","disabled");else if(n.timeline.current.year==f.current.year()&&(n.timeline.scope.month&&n.timeline.current.month===1||n.timeline.scope.week&&n.timeline.current.week===1&&n.timeline.current.month!=12||n.timeline.scope.day&&n.timeline.current.day===1))$("#timelineBeforeBtn").attr("disabled","disabled");else{var o=$("#timelineBeforeBtn"),u=$("#timelineAfterBtn"),a=o.attr("disabled"),l=u.attr("disabled");typeof a!="undefined"&&a!==!1&&o.removeAttr("disabled"),typeof l!="undefined"&&l!==!1&&u.removeAttr("disabled")}}}),n.timeline&&n.timeliner.init(),e.$on("timeliner",function(){var e={start:(new Date(arguments[1].start)).getTime(),end:(new Date(arguments[1].end)).getTime()};e.start==e.end&&(e.end=(new Date.create(arguments[1].end)).addDays(1)),n.timeliner.load(e)}),n.requestTimeline=function(e){switch(e){case"group":n.timeline.current.layouts.group=!n.timeline.current.layouts.group,n.timeline.current.layouts.members&&!n.timeline.current.layouts.group&&(n.timeline.current.layouts.members=!1);break;case"members":n.timeline.current.layouts.members=!n.timeline.current.layouts.members,n.timeline.current.layouts.members&&!n.timeline.current.layouts.group&&(n.timeline.current.layouts.group=!0)}n.timeliner.load({start:n.data.periods.start,end:n.data.periods.end})},n.timelineGetRange=function(){var e=n.self.timeline.getVisibleChartRange();n.$apply(function(){n.timeline.range={start:(new Date(e.from)).toString(),end:(new Date(e.till)).toString()},n.timeline.main&&(n.daterange={start:f.readable.date((new Date(e.start)).getTime()),end:f.readable.date((new Date(e.end)).getTime())})})},n.selectedSlot=function(){var r;n.timeliner.isAdded()>0;if(r=n.self.timeline.getSelection()[0]){var i=n.self.timeline.getItem(r.row),s=angular.fromJson(i.content.match(/<span class="secret">(.*)<\/span>/)[1])||null;n.original={start:i.start,end:i.end,content:{recursive:s.recursive,state:s.state}},n.timeline.main?e.$broadcast("resetPlanboardViews"):n.forms={add:!1,edit:!0};if(s.type){if(n.timeline.main)switch(s.type){case"slot":n.views.slot.edit=!0;break;case"group":n.views.group=!0;break;case"wish":n.views.wish=!0;break;case"member":n.views.member=!0}var o=function(e){var t=new Date(e);return t.setMinutes(t.getMinutes()-t.getTimezoneOffset()),t.toISOString().replace("Z","")};n.slot={start:{date:(new Date(i.start)).toString(t.app.formats.date),time:(new Date(i.start)).toString(t.app.formats.time),datetime:o(i.start)},end:{date:(new Date(i.end)).toString(t.app.formats.date),time:(new Date(i.end)).toString(t.app.formats.time),datetime:o(i.end)},state:s.state,recursive:s.recursive,id:s.id};if(n.timeline.main)switch(s.type){case"group":n.slot.diff=s.diff,n.slot.group=s.group;break;case"wish":n.slot.wish=s.wish,n.slot.group=s.group,n.slot.groupId=s.groupId;break;case"member":n.slot.member=s.mid}}return i}},n.timelineOnSelect=function(){e.planboardSync.clear(),n.$apply(function(){n.selectedOriginal=n.selectedSlot()})},n.destroy={timeline:function(){},statistics:function(){setTimeout(function(){n.timeliner.redraw()},t.app.timers.TICKER)}},n.changeDivision=function(){_.each(n.divisions,function(e){n.groupPieHide[e.id]=!1}),n.timeline.current.division!=="all"&&(n.groupPieHide[n.timeline.current.division]=!0),n.timeliner.render({start:n.timeline.range.start,end:n.timeline.range.end})},n.barCharts=function(){n.timeline.config.bar=!n.timeline.config.bar,n.timeliner.render({start:n.timeline.range.start,end:n.timeline.range.end})},n.groupWishes=function(){n.timeline.config.wishes?(n.timeline.config.wishes=!1,delete n.data.aggs.wishes,n.timeliner.render({start:n.timeline.range.start,end:n.timeline.range.end},!0)):(n.timeline.config.wishes=!0,v())},n.showLegenda=function(){console.log(123),n.timeline.config.legendarer=!n.timeline.config.legendarer},n.alterLegenda=function(e){n.timeline.config.legenda=e,n.timeliner.render({start:n.timeline.range.start,end:n.timeline.range.end})},n.setAvailability=function(t,r){var i=Math.abs(Math.floor(Date.now().getTime()/1e3)),s=3600,o={start:i,end:Number(i+r*s),state:t?"com.ask-cs.State.Available":"com.ask-cs.State.Unavailable"},u={start:o.start,end:o.end,recursive:!1,text:o.state};e.statusBar.display(e.ui.agenda.addTimeSlot),a.add(u,n.timeline.user.id).then(function(t){h("environment").remove("setPrefixedAvailability"),e.$broadcast("resetPlanboardViews"),t.error?(e.notifier.error(e.ui.agenda.errorAdd),console.warn("error ->",t)):e.notifier.success(e.ui.agenda.slotAdded),n.timeliner.refresh(),e.planboardSync.start()})};if(i.search().setPrefixedAvailability){var m=h("environment").get("setPrefixedAvailability");n.setAvailability(m.availability,m.period)}var g=function(e){if(typeof e=="undefined"||e==null||e=="")return"";var t=new Date(e),n=t.getTimezoneOffset(),r=t.addMinutes(n);return r.toISOString()};n.timelineOnAdd=function(r,i){e.planboardSync.clear();var s,o=Date.now().getTime(),u=Math.abs(Math.floor(o/1e3));if(!r){s=n.self.timeline.getItem(n.self.timeline.getSelection()[0].row);var l=angular.element(s.content),c=angular.fromJson(l.html());if(c.recursive||(new Date(s.start)).getTime()>=o&&(new Date(s.end)).getTime()>o)n.timeliner.isAdded()>1&&n.self.timeline.cancelAdd(),n.$apply(function(){n.timeline.main?(e.$broadcast("resetPlanboardViews"),n.views.slot.add=!0):n.forms={add:!0,edit:!1},n.slot={start:{date:(new Date(s.start)).toString(t.app.formats.date),time:(new Date(s.start)).toString(t.app.formats.time),datetime:(new Date(s.start)).toISOString()},end:{date:(new Date(s.end)).toString(t.app.formats.date),time:(new Date(s.end)).toString(t.app.formats.time),datetime:(new Date(s.end)).toISOString()},recursive:s.group.match(/recursive/)?!0:!1,state:"com.ask-cs.State.Available"}});else{var h=/#timeline/.test(s.group)?e.ui.agenda.notAuth:e.ui.agenda.pastAdding;n.self.timeline.cancelAdd(),e.notifier.error(h),e.$apply()}}else{var p=e.browser.mobile?Math.abs(Math.floor((new Date(g(i.start.datetime))).getTime()/1e3)):f.convert.absolute(i.start.date,i.start.time,!0),d=e.browser.mobile?Math.abs(Math.floor((new Date(g(i.end.datetime))).getTime()/1e3)):f.convert.absolute(i.end.date,i.end.time,!0);p<u&&d<u&&i.recursive==0?(e.notifier.error(e.ui.agenda.pastAdding),n.timeliner.refresh()):(p<u&&i.recursive==0&&(p=u),s={start:p,end:d,recursive:i.recursive?!0:!1,text:i.state},s.start*1e3+12e4<o&&s.recursive==0?(e.notifier.error(e.ui.agenda.pastAdding),n.timeliner.refresh()):(e.statusBar.display(e.ui.agenda.addTimeSlot),a.add(s,n.timeline.user.id).then(function(t){e.$broadcast("resetPlanboardViews"),t.error?(e.notifier.error(e.ui.agenda.errorAdd),console.warn("error ->",t)):e.notifier.success(e.ui.agenda.slotAdded),n.timeliner.refresh(),e.planboardSync.start()})))}},n.timelineChanging=function(){e.planboardSync.clear();var r=n.self.timeline.getItem(n.self.timeline.getSelection()[0].row),i={start:r.start,end:r.end,content:angular.fromJson(r.content.match(/<span class="secret">(.*)<\/span>/)[1])},s=function(e){var t=new Date(e);return t.setMinutes(t.getMinutes()-t.getTimezoneOffset()),t.toISOString().replace("Z","")};n.$apply(function(){n.slot={start:{date:(new Date(r.start)).toString(t.app.formats.date),time:(new Date(r.start)).toString(t.app.formats.time),datetime:s(r.start)},end:{date:(new Date(r.end)).toString(t.app.formats.date),time:(new Date(r.end)).toString(t.app.formats.time),datetime:s(r.end)},state:i.content.state,recursive:i.content.recursive,id:i.content.id}})},n.timelineOnChange=function(t,r,i,s){e.planboardSync.clear();var o=n.self.timeline.getItem(n.self.timeline.getSelection()[0].row);t?s={start:e.browser.mobile?(new Date(g(i.start.datetime))).getTime():f.convert.absolute(i.start.date,i.start.time,!1),end:e.browser.mobile?(new Date(g(i.end.datetime))).getTime():f.convert.absolute(i.end.date,i.end.time,!1),content:{recursive:i.recursive,state:i.state}}:s={start:o.start,end:o.end,content:angular.fromJson(o.content.match(/<span class="secret">(.*)<\/span>/)[1])},r.start=(new Date(r.start)).getTime(),r.end=(new Date(r.end)).getTime();var u=Date.now().getTime(),l=function(t,r,i){e.$broadcast("resetPlanboardViews"),t.error?(e.notifier.error(r.error),console.warn("error ->",t)):(!i&&e.notifier.success(r.success),i&&h(i)),n.timeliner.refresh(),e.planboardSync.start()},c=function(t,r){e.statusBar.display(e.ui.agenda.changingSlot),a.change(n.original,t,n.timeline.user.id).then(function(t){l(t,{error:e.ui.agenda.errorChange,success:e.ui.agenda.slotChanged},r)})},h=function(t){a.add(t,n.timeline.user.id).then(function(t){l(t,{error:e.ui.agenda.errorAdd,success:e.ui.agenda.slotChanged})})},p=function(e,t){c(e,{start:Math.abs(Math.floor(t.start/1e3)),end:Math.abs(Math.floor(t.end/1e3)),recursive:t.content.recursive?!0:!1,text:t.content.state})},d=function(){e.notifier.error(e.ui.agenda.pastChanging),n.timeliner.refresh()};if(/#timeline/.test(o.group))e.notifier.error(e.ui.agenda.notAuth),n.timeliner.refresh();else if(s.content.recursive)c(s);else{if(s.start<u&&s.end<u){d();return}if(s.start>u&&s.end>u){if(r.start<u&&r.end<u){d();return}r.start<u&&r.end>u&&p({start:n.original.start,end:u,content:{recursive:n.original.content.recursive,state:n.original.content.state}},{start:s.start+(u-n.original.start),end:s.end,content:{recursive:s.content.recursive,state:s.content.state}}),r.start>u&&r.end>u&&c(s)}if(s.start<u&&s.end>u){if(r.start<u&&r.end<u){d();return}r.start<u&&r.end>u&&(s.content.state==r.content.state?c({start:n.original.start,end:s.end,content:{recursive:s.content.recursive,state:s.content.state}}):p({start:n.original.start,end:u,content:{recursive:n.original.content.recursive,state:n.original.content.state}},{start:u,end:s.end,content:{recursive:s.content.recursive,state:s.content.state}})),r.start>u&&r.end>u&&c({start:u,end:s.end,content:{recursive:s.content.recursive,state:s.content.state}})}}},n.timelineOnRemove=function(){e.planboardSync.clear();if(n.timeliner.isAdded()>0)n.self.timeline.cancelAdd(),n.$apply(function(){n.resetInlineForms()});else{var t=function(t){e.$broadcast("resetPlanboardViews"),t.error?(e.notifier.error(e.ui.agenda.remove),console.warn("error ->",t)):e.notifier.success(e.ui.agenda.timeslotDeleted),n.timeliner.refresh(),e.planboardSync.start()},r=Date.now().getTime();n.original.end.getTime()<=r&&n.original.content.recursive==0?(e.notifier.error(e.ui.agenda.pastDeleting),n.timeliner.refresh()):n.original.start.getTime()<=r&&n.original.end.getTime()>=r&&n.original.content.recursive==0?a.change(n.original,{start:Math.abs(Math.floor((new Date(n.original.start)).getTime())),end:Math.abs(Math.floor(r)),content:{recursive:n.original.content.recursive,state:n.original.content.state}},n.timeline.user.id).then(function(e){t(e)}):(e.statusBar.display(e.ui.agenda.deletingTimeslot),a.remove(n.original,n.timeline.user.id).then(function(e){t(e)}))}},n.wisher=function(t){e.statusBar.display(e.ui.agenda.changingWish),a.setWish({id:t.groupId,start:e.browser.mobile?(new Date(t.start.datetime)).getTime()/1e3:f.convert.absolute(t.start.date,t.start.time,!0),end:e.browser.mobile?(new Date(t.end.datetime)).getTime()/1e3:f.convert.absolute(t.end.date,t.end.time,!0),recursive:!1,wish:t.wish}).then(function(t){e.$broadcast("resetPlanboardViews"),t.error?(e.notifier.error(e.ui.agenda.wisher),console.warn("error ->",t)):e.notifier.success(e.ui.agenda.wishChanged),n.timeliner.refresh()})},n.timeline&&n.timeline.main&&setTimeout(function(){n.self.timeline.redraw()},t.app.timers.TICKER),e.planboardSync={start:function(){u.planboardSync=u.setInterval(function(){i.path()=="/agenda"&&(n.slot={},e.$broadcast("resetPlanboardViews"),n.timeliner.load({start:n.data.periods.start,end:n.data.periods.end},!0))},t.app.timers.PLANBOARD_SYNC)},clear:function(){u.clearInterval(u.planboardSync)}},e.planboardSync.start()}])});
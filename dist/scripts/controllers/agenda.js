define(["controllers/controllers","config"],function(e,t){e.controller("agenda",["$rootScope","$scope","$q","$window","$location","Dater","$timeout","Store","Teams","Clients","TeamUp","Session","Slots","data",function(e,n,r,i,s,o,u,a,f,l,c,h,p,d){e.notification.status=!1,e.fixStyles(),n.self=this,n.data=d;var v=a("app").get("teams"),m=v[0].uuid;n.current={layouts:{user:!0,group:!0,members:!1},day:o.current.today()+1,week:o.current.week(),month:o.current.month(),year:o.current.year(),group:m,division:"all"},n.periods=o.getPeriods(),n.periodsNext=o.getPeriods(!0),n.slot={};var g=o.current.today()>360?{start:n.periods.days[358].last.timeStamp,end:n.periods.days[365].last.timeStamp}:{start:n.periods.days[o.current.today()-1].last.timeStamp,end:n.periods.days[o.current.today()+6].last.timeStamp},y=t.app.timeline;n.timeline={id:"mainTimeline",main:!0,user:{id:e.app.resources.uuid,role:e.app.resources.role},current:n.current,options:{start:g.start,end:g.end,min:g.start,max:g.end},range:{start:g.start,end:g.end},scope:{day:!1,week:!0,month:!1},config:{bar:y.config.bar,layouts:y.config.layouts,wishes:y.config.wishes,legenda:{},legendarer:y.config.legendarer,states:y.config.states,divisions:y.config.divisions,densities:y.config.densities}},$.browser.msie&&$.browser.version=="8.0"&&(n.timeline.options={start:n.periods.days[o.current.today()].last.timeStamp,end:n.periods.days[o.current.today()+7].last.timeStamp,min:n.periods.days[o.current.today()].last.timeStamp,max:n.periods.days[o.current.today()+7].last.timeStamp}),_.each(t.app.statesall,function(e,t){n.timeline.config.legenda[t]=!0}),n.timeline.config.legenda.groups={more:!0,even:!0,less:!0},n.daterange=o.readable.date(n.timeline.range.start)+" / "+o.readable.date(n.timeline.range.end),u(function(){n.states={},_.each(n.timeline.config.states,function(e,t){n.states[t]=e.label})}),n.groups=v,n.divisions=n.timeline.config.divisions,n.timeline.config.divisions.length>0&&(n.divisions[0].id!=="all"&&n.divisions.unshift({id:"all",label:"Alle divisies"}),n.groupPieHide={},_.each(n.divisions,function(e){n.groupPieHide[e.id]=!1})),n.resetViews=function(){n.views={slot:{add:!1,edit:!1},group:!1,wish:!1,member:!1}},n.resetViews(),e.$on("resetPlanboardViews",function(){n.resetViews()}),n.toggleSlotForm=function(){n.views.slot.add?(e.planboardSync.start(),n.resetInlineForms()):(e.planboardSync.clear(),e.$broadcast("slotInitials"),n.resetViews(),n.views.slot.add=!0)},n.resetInlineForms=function(){n.slot={},n.original={},n.resetViews()}}])});
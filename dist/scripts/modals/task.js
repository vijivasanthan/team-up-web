define(["services/services","config"],function(e,t){e.factory("Task",["$rootScope","$resource","$q","$filter","Store","TeamUp",function(e,n,r,i,s,o){function l(e){var t={on:[],off:[]};if(e.length>0){var n=_.groupBy(e,function(e){return e.status});n[1]!=null&&(t.on=t.on.concat(n[1])),n[2]!=null&&(t.on=t.on.concat(n[2])),n[3]!=null&&(t.off=t.off.concat(n[3])),n[4]!=null&&(t.off=t.off.concat(n[4]))}return t}var u=n(),a=function(n){_.each(n,function(n){n.statusLabel=t.app.taskStates[n.status],n.relatedClient=e.getClientByID(n.relatedClientUuid),n.relatedClient==null&&(n.relatedClient={firstName:"*",lastName:"Niet gevonden"}),n.relatedClient.fullName=n.relatedClient.firstName+" "+n.relatedClient.lastName,n.relatedClient.address!=null?n.relatedClient.fullAddress=n.relatedClient.address.street+" "+n.relatedClient.address.no+", "+n.relatedClient.address.city:n.relatedClient.address={address:{street:null,no:null,zip:null,city:null,country:null,latitude:0,longitude:0}},n.plannedTaskDuration={difference:n.plannedEndVisitTime-n.plannedStartVisitTime},n.plannedTaskDuration.label=n.plannedTaskDuration.difference/1e3/60/60<=24?i("date")(n.plannedStartVisitTime,"d MMM y")+" "+i("date")(n.plannedStartVisitTime,"EEEE")+" "+i("date")(n.plannedStartVisitTime,"HH:mm")+" - "+i("date")(n.plannedEndVisitTime,"HH:mm")+" uur":i("date")(n.plannedStartVisitTime,"d MMM y")+" "+i("date")(n.plannedStartVisitTime,"EEEE")+" "+i("date")(n.plannedStartVisitTime,"HH:mm")+" uur - "+i("date")(n.plannedEndVisitTime,"d MMM y")+" "+i("date")(n.plannedEndVisitTime,"EEEE")+" "+i("date")(n.plannedEndVisitTime,"HH:mm")+" uur",n.assignedTeamMemberUuid!=""&&(n.assignedTeamMember=e.getTeamMemberById(n.assignedTeamMemberUuid))})},f=function(e){return _.each(["statusLabel","relatedClient","plannedTaskDuration","assignedTeamMember"],function(t){delete e[t]}),e};return u.prototype.queryMine=function(){return o._("taskMineQuery").then(function(e){e=_.sortBy(e,"plannedStartVisitTime"),a(e);var t=l(e);return s("app").save("myTasks2",t),t}.bind(this))},u.prototype.queryAll=function(){var e=r.defer(),t=[],n={};return _.each(s("app").get("teams"),function(e){t.push(o._("taskByTeam",{fourth:e.uuid}).then(function(t){n[e.uuid]=t}))}),r.all(t).then(function(){var t=[];_.each(n,function(e){e.length>0&&_.each(e,function(e){t.push(e)})});var r=_.map(_.indexBy(t,function(e){return e.uuid}),function(e){return e});r=_.sortBy(r,"plannedStartVisitTime"),a(r);var i=l(r);s("app").save("allTasks2",i),e.resolve(i)}.bind(n)),e.promise},u.prototype.queryByTeam=function(e){return o._("taskByTeam",{fourth:e}).then(function(e){return e}.bind(this))},u.prototype.byId=function(e){return o._("taskById",{second:e}).then(function(e){return e}.bind(this))},u.prototype.getWeek=function(e,t,n){return this.queryByTeam(e).then(function(e){return e=_.filter(e,function(e){var r=moment(e.plannedStartVisitTime);return r.week()==t&&r.get("year")==n}),e}.bind(this))},u.prototype.byRange=function(e){return o._("taskQuery",{fourth:teamId}).then(function(e){return e}.bind(this))},u.prototype.update=function(e){return o._("taskUpdate",{second:e.uuid},f(_.clone(e)))},u.prototype.chains=function(){var e={},t=s("app").get("teams"),n=s("app").get("clients"),r=s("app").get("ClientGroups"),i;_.each(t,function(t){i=s("app").get("teamGroup_"+t.uuid)[0],e[t.uuid]={team:t,members:s("app").get(t.uuid)}})},new u}])});
define(["services/services","config"],function(e,t){e.factory("Slots",["$rootScope","$resource","$q","Dater","Sloter","Store","Stats","Teams",function(e,n,r,i,s,o,u,a){function p(e){var t=angular.fromJson(e.content);return{start:Math.floor((new Date(e.start)).getTime()/1e3),end:Math.floor((new Date(e.end)).getTime()/1e3),recursive:t.recursive,text:t.state,id:t.id}}var f=n(t.app.host+"askatars/:user/slots",{user:""},{query:{method:"GET",params:{start:"",end:""},isArray:!0},change:{method:"PUT",params:{start:"",end:"",text:"",recursive:""}},save:{method:"POST",params:{}},remove:{method:"DELETE",params:{}}}),l=n(t.app.host+"calc_planning/:id",{},{query:{method:"GET",params:{id:"",start:"",end:""},isArray:!0}}),c=n(t.app.host+"network/:id/wish",{},{query:{method:"GET",params:{id:"",start:"",end:""},isArray:!0},save:{method:"PUT",params:{id:""}}}),h=n(t.app.host+"network/:id/member/slots2",{},{query:{method:"GET",params:{id:"",start:"",end:""}},get:{method:"GET",params:{id:"",start:"",end:""},interceptor:{response:function(e){return e}}}});return f.prototype.wishes=function(e){var t=r.defer(),n={id:e.id,start:e.start,end:e.end};return c.query(n,function(e){t.resolve(e)},function(e){t.resolve({error:e})}),t.promise},f.prototype.setWish=function(e){var t=r.defer(),n={start:e.start,end:e.end,wish:e.wish,recurring:e.recursive};return c.save({id:e.id},n,function(e){t.resolve(e)},function(e){t.resolve({error:e})}),t.promise},f.prototype.aggs=function(e){var n=r.defer(),i=[];return t.app.timeline.config.divisions.length>0?_.each(t.app.timeline.config.divisions,function(t){if(t.id!=="all"){var n={id:e.id,start:e.start,end:e.end,stateGroup:t.id,division:{id:t.id,label:t.label}};i.push(f.prototype.agg(n))}}):i.push(f.prototype.agg({id:e.id,start:e.start,end:e.end})),r.all(i).then(function(e){n.resolve(e)}),n.promise},f.prototype.agg=function(e){var t=r.defer();return l.query(e,function(n){var r=u.aggs(n,e.start,e.end);t.resolve({id:e.id,division:e.division,data:n,ratios:r.ratios,durations:r.durations})},function(e){t.resolve({error:e})}),t.promise},f.prototype.pie=function(e){function p(n){var r;if(n.length>1){_.each(n,function(e){s>=e.start&&s<=e.end&&(r=e),c<=e.start*1e3?f.next.data.push(e):c>=e.start*1e3&&f.current.data.push(e)});var i=f.current.data[f.current.data.length-1],o=f.next.data[0],a=i.end*1e3-c,l=[];return f.current.data[0].start=f.current.period.first.timeStamp/1e3,a>0&&f.next.data.unshift({diff:i.diff,start:c/1e3,end:i.end,wish:i.wish}),_.each(f.current.data,function(e){e.end-e.start>0&&l.push(e),e.diff<0&&f.current.shortages.push(e)}),l[0].start=f.current.period.first.timeStamp/1e3,_.each(f.next.data,function(e){e.diff<0&&f.next.shortages.push(e)}),{id:e.id,division:e.division,name:e.name,weeks:{current:{data:l,state:r,shortages:f.current.shortages,start:{date:(new Date(f.current.period.first.timeStamp)).toString(t.formats.date),timeStamp:f.current.period.first.timeStamp},end:{date:(new Date(f.current.period.last.timeStamp)).toString(t.formats.date),timeStamp:f.current.period.last.timeStamp},ratios:u.pies(l,h.start,h.end)},next:{data:f.next.data,shortages:f.next.shortages,start:{date:(new Date(f.next.period.first.timeStamp)).toString(t.formats.date),timeStamp:f.next.period.first.timeStamp},end:{date:(new Date(f.next.period.last.timeStamp)).toString(t.formats.date),timeStamp:f.next.period.last.timeStamp},ratios:u.pies(f.next.data,h.start,h.end)}}}}n[0].diff==null&&(n[0].diff=0),n[0].wish==null&&(n[0].wish=0);var p=[{start:f.current.period.first.timeStamp/1e3,end:f.current.period.last.timeStamp/1e3,wish:n[0].wish,diff:n[0].diff}],d=[{start:f.next.period.first.timeStamp/1e3,end:f.next.period.last.timeStamp/1e3,wish:n[0].wish,diff:n[0].diff}];return p[0].diff<0&&f.current.shortages.push(p[0]),d[0].diff<0&&f.next.shortages.push(d[0]),{id:e.id,division:e.division,name:e.name,weeks:{current:{data:p,state:p,shortages:f.current.shortages,start:{date:(new Date(f.current.period.first.timeStamp)).toString(t.formats.date),timeStamp:f.current.period.first.timeStamp},end:{date:(new Date(f.current.period.last.timeStamp)).toString(t.formats.date),timeStamp:f.current.period.last.timeStamp},ratios:u.pies(p,h.start,h.end)},next:{data:d,shortages:f.next.shortages,start:{date:(new Date(f.next.period.first.timeStamp)).toString(t.formats.date),timeStamp:f.next.period.first.timeStamp},end:{date:(new Date(f.next.period.last.timeStamp)).toString(t.formats.date),timeStamp:f.next.period.last.timeStamp},ratios:u.pies(d,h.start,h.end)}}}}var n=r.defer(),s=Math.floor(Date.now().getTime()/1e3),o=i.getPeriods(),a=i.current.week(),f={current:{period:o.weeks[a],data:[],shortages:[]},next:{period:o.weeks[a+1],data:[],shortages:[]}},c=f.current.period.last.timeStamp,h={id:e.id,start:f.current.period.first.timeStamp/1e3,end:f.next.period.last.timeStamp/1e3};return e.division!="both"&&(h.stateGroup=e.division),l.query(h,function(e){n.resolve(p(e))},function(e){n.resolve({error:e})}),n.promise},f.prototype.currentState=function(){var t=r.defer(),n=o("user").get("resources");if(n){var i;i=String(Date.now().getTime()),i=Number(i.substr(0,i.length-3));var s={user:n.uuid,start:i,end:i+1};f.query(s,function(n){t.resolve(n.length>0?e.config.app.statesall[n[0].text]:{color:"gray",label:"Mogelijk inzetbaar"})})}else t.resolve([]);return t.promise},f.prototype.all=function(e){var t=r.defer(),n=i.getPeriods(),s={user:e.user,start:e.stamps.start/1e3,end:e.stamps.end/1e3},a={};return f.query(s,function(n){_.each(n,function(e){e.recursive||(e.recursive=!1)});if(e.layouts.group){var r={id:e.groupId,start:s.start,end:s.end,month:e.month};f.prototype.aggs(r).then(function(r){if(e.layouts.members){var i=o("app").get(e.groupId),a=[];f.prototype.memberSlots2.query({id:e.groupId,start:s.start,end:s.end,type:"both"},function(o){var a=[];_.each(o,function(e,t){_.each(e,function(e){e.text=e.state});var n;_.each(i,function(e){t==e.uuid&&(n=e)}),n!=null&&a.push({id:t,lastName:n.lastName,role:n.role,data:e,stats:u.member(e,s.start,s.end)})}),t.resolve({user:n,groupId:e.groupId,aggs:r,members:a,synced:(new Date).getTime(),periods:{start:e.stamps.start,end:e.stamps.end}})},function(e){t.resolve({error:e})})}else t.resolve({user:n,groupId:e.groupId,aggs:r,synced:(new Date).getTime(),periods:{start:e.stamps.start,end:e.stamps.end}})})}else t.resolve({user:n,synced:(new Date).getTime(),periods:{start:e.stamps.start,end:e.stamps.end}})},function(e){t.resolve({error:e})}),t.promise},f.prototype.getMemberAvailabilitiesPerTeam=function(e,t){var n=r.defer(),i=Math.floor(Date.now().getTime()/1e3);return h.get({id:e,type:t,start:i,end:i+1e3},function(e){n.resolve({members:e.data,synced:i})},function(e){n.reject({error:e})}),n.promise},f.prototype.getAllMemberReachabilities=function(e,t){var n=r.defer(),i=[],s=Math.floor(Date.now().getTime()/1e3);return _.each(e,function(e){var n=r.defer();i.push(n.promise),h.get({id:e.uuid,type:t,start:s,end:s+1e3},function(e){n.resolve(e.data)})}),r.all(i).then(function(e){var t={};_.each(e,function(e){_.each(e,function(e,n){t[n]=e})}),n.resolve({members:t,synced:s})},function(e){n.resolve({error:e})}),n.promise},f.prototype.memberSlots2={query:function(t,n,i){var s=[],u=[],l=a.query();l.then(function(i){t.id=="all"?u=e.unique(o("app").get("members")):typeof i.members[t.id]!="undefined"&&(u=e.unique(i.members[t.id])),_.each(u,function(e){var n=r.defer(),i;s.push(n.promise),i={user:e.uuid,start:t.start,end:t.end},t.type&&(i.type=t.type),f.query(i,function(t){_.each(t,function(e){e.state=e.text,e.text=null}),n.resolve({uuid:e.uuid,content:t})},function(e){n.resolve({error:e})})}),r.all(s).then(function(e){var t={};_.each(e,function(e){e.error?console.log(e.error):t[e.uuid]=e.content}),n(t)})})}},f.prototype.user=function(e){var t=r.defer();return f.query(e,function(n){t.resolve({id:e.user,data:n,stats:u.member(n,e.start,e.end)})},function(e){t.resolve({error:e})}),t.promise},f.prototype.users=function(e){var t=r.defer(),n=[],i=Math.floor(Date.now().getTime()/1e3);return _.each(e,function(e){var t=r.defer();n.push(t.promise),f.query({user:e.uuid,start:i,end:i+1e3},function(n){_.each(n,function(e){e.state=e.text,e.text=null}),t.resolve({uuid:e.uuid,content:n})},function(e){t.resolve({error:e})})}),r.all(n).then(function(e){var n={};_.each(e,function(e){e.error||(n[e.uuid]=e.content)}),t.resolve({members:n,synced:i})}),t.promise},f.prototype.local=function(){return o("user").get("slots")},f.prototype.add=function(e,t){var n=r.defer(),i=moment.unix(e.start).seconds(0);return e.start=i.unix(),f.save({user:t},e,function(e){n.resolve(e)},function(e){n.resolve({error:e})}),n.promise},f.prototype.change=function(e,t,n){var i=r.defer();return f.change(angular.extend(p(t),{user:n}),p(e),function(e){i.resolve(e)},function(e){i.resolve({error:e})}),i.promise},f.prototype.remove=function(e,t){var n=r.defer();return f.remove(angular.extend(p(e),{user:t}),function(e){n.resolve(e)},function(e){n.resolve({error:e})}),n.promise},new f}])});
define(["services/services","config"],function(e,t){e.factory("Sloter",["$rootScope","Store",function(e,n){return{get:{groups:function(){var e={};return _.each(n("app").get("teams"),function(t){e[t.uuid]=t.name}),e},members:function(){var t={};return _.each(e.unique(n("app").get("members")),function(e){e!=null&&e.uuid!=null&&(t[e.uuid]=e.firstName+" "+e.lastName)}),t}},wrapper:function(e){return'<span style="display:none;">'+e+"</span>"},secret:function(e){return'<span class="secret">'+e+"</span>"},addLoading:function(e,t,n){return _.each(n,function(n){t.push({start:e.periods.end,end:15778368e5,group:n,content:"loading",className:"state-loading-right",editable:!1}),t.push({start:0,end:e.periods.start,group:n,content:"loading",className:"state-loading-left",editable:!1})}),t},tooltip:function(e){var n=function(e){return(new Date(e*1e3)).toString(t.app.formats.datetime)},r=n(e.start)+" / "+n(e.end);return e.hasOwnProperty("min")&&(r+=" / Huidig aantal beschikbaar: "+e.min),e.hasOwnProperty("wish")&&(r+=" / Gewenst aantal mensen: "+e.wish),e.hasOwnProperty("member")&&(r+=" / "+e.member),e.hasOwnProperty("state")&&(r+=" / "+e.state),'<div class="time-tip" title="'+r+'">'+r+"</div>"},user:function(t,n,r,i,s,o){var u=this,a=e.ui.planboard.planning,f=e.ui.planboard.weeklyPlanning;return i!=o&&(a=e.ui.planboard.planningOf+s,f=e.ui.planboard.weeklyPlanningOf+s),_.each(t.user,function(e,t){_.each(r.legenda,function(i,s){e.text==s&&i&&n.push({start:Math.round(e.start*1e3),end:Math.round(e.end*1e3),group:e.recursive?u.wrapper("b")+f+u.wrapper("recursive"):u.wrapper("a")+a+u.wrapper("planning"),content:this.tooltip({start:e.start,end:e.end})+u.secret(angular.toJson({type:"slot",id:t,recursive:e.recursive,state:e.text})),className:"slot-"+t+" "+r.states[e.text].className,editable:!0})}.bind(this))}.bind(this)),n=u.addLoading(t,n,[u.wrapper("b")+f+u.wrapper("recursive"),u.wrapper("a")+a+u.wrapper("planning")]),n},profile:function(t,n){var r=this,i=[];return _.each(t,function(t,s){_.each(n.legenda,function(o,u){t.text==u&&o&&i.push({start:Math.round(t.start*1e3),end:Math.round(t.end*1e3),group:t.recursive?r.wrapper("b")+e.ui.planboard.weeklyPlanning+r.wrapper("recursive"):r.wrapper("a")+e.ui.planboard.planning+r.wrapper("planning"),content:r.secret(angular.toJson({type:"slot",id:s,recursive:t.recursive,state:t.text})),className:"slot-"+s+" "+n.states[t.text].className,editable:!0})})}),i.push({start:0,end:1,group:r.wrapper("b")+e.ui.planboard.weeklyPlanning+r.wrapper("recursive"),content:"",className:null,editable:!1}),i.push({start:0,end:1,group:r.wrapper("a")+e.ui.planboard.planning+r.wrapper("planning"),content:"",className:null,editable:!1}),i},namer:function(e,t){var n=this.get.groups(),r=n[e.id];r=r.charAt(0).toUpperCase()+r.slice(1);var i='<a href="#/team?uuid='+e.id+'#team">'+r+"</a>",s;if(!e.division)s=t<=1?i:"<span>"+r+"</span>";else{var o;s=t<=1?i:"<span>"+r+"</span>",s+=' <span class="label label-default">'+e.division.label+"</span>"}return s},bars:function(e,t,n,r,i){var s=this;return _.each(s.filtered(e,i),function(r){var i=_.pluck(r.data,"diff"),o=_.min(i),u=_.max(i),a=u-o,f=a/.8,l=f-a;_.each(r.data,function(r){var i=r.diff,u=Math.round((i-o+l)/f*100),a="height: 100px;",c='<div class="requirement" style="'+a+'" '+'title="'+"Minimum aantal benodigden"+": "+i+' personen"></div>';if(r.diff>=0&&r.diff<7){var h;switch(r.diff){case 0:h="bars-even";break;case 1:h="bars-more";break;case 2:h="bars-more";break;case 3:h="bars-more";break;case 4:h="bars-more";break;case 5:h="bars-more";break;case 6:h="bars-more"}}else r.diff>=7?h="bars-more":h="bars-less";var p='<span class="badge badge-inverse">'+r.diff+"</span>";a="height:"+u+"px;";var d='<div class="bar '+h+'" style="'+a+'" '+' title="Huidig aantal beschikbaar: '+i+' personen">'+p+"</div>";(r.diff>0&&n.legenda.groups.more||r.diff==0&&n.legenda.groups.even||r.diff<0&&n.legenda.groups.less)&&t.push({start:Math.round(r.start*1e3),end:Math.round(r.end*1e3),group:s.wrapper("c")+name,content:c+d+s.secret(angular.toJson({type:"group",diff:r.diff,group:name})),className:"group-aggs",editable:!1}),t=s.addLoading(e,t,[s.wrapper("c")+name])})}),t},aggs:function(e,t,n,r,i){var s=this;return _.each(s.filtered(e,i),function(i){var o=s.namer(i,r);_.each(i.data,function(r){var i;if(r.diff>=0&&r.diff<7)switch(r.diff){case 0:i="even";break;case 1:i=1;break;case 2:i=2;break;case 3:i=3;break;case 4:i=4;break;case 5:i=5;break;case 6:i=6}else r.diff>=7?i="more":i="less";(r.diff>0&&n.legenda.groups.more||r.diff==0&&n.legenda.groups.even||r.diff<0&&n.legenda.groups.less)&&t.push({start:Math.round(r.start*1e3),end:Math.round(r.end*1e3),group:s.wrapper("c")+o,content:this.tooltip({start:r.start,end:r.end,min:r.wish+r.diff})+s.secret(angular.toJson({type:"group",diff:r.diff,group:o})),className:"agg-"+i,editable:!1}),t=s.addLoading(e,t,[s.wrapper("c")+o])}.bind(this))}.bind(this)),t},wishes:function(e,t,n){var r=this,i=this.get.groups(),s=i[e.aggs[0].id],o='<a href="#/teams?uuid='+e.aggs[0].id+'#view">'+s+"</a>",u;return u=n==1?o:"<span>"+s+"</span>",u+=' <span class="label label-default">Behoefte (elke divisie)</span>',_.each(e.aggs.wishes,function(n){var i;n.count==0?i="wishes-even":i="wishes-"+n.count,t.push({start:Math.round(n.start*1e3),end:Math.round(n.end*1e3),group:r.wrapper("c")+u,content:this.tooltip({start:n.start,end:n.end,wish:n.count})+r.secret(angular.toJson({type:"wish",wish:n.count,group:u,groupId:e.aggs[0].id})),className:i,editable:!1}),t=r.addLoading(e,t,[r.wrapper("c")+u])}.bind(this)),t},members:function(t,n,r,i,s,o){var u=this,a=this.get.members(),f=[];return _.each(t.members,function(e){e.lastName!=undefined&&e.role!=4&&e.role!=0&&f.push(e)}),t.members=f,t.members.sort(function(e,t){var n=e.lastName.toLowerCase(),r=t.lastName.toLowerCase();return n<r?-1:n>r?1:0}),_.each(t.members,function(i){var s=u.wrapper("d-"+i.lastName[0].toLowerCase())+'<a href="#/profile/'+i.id+'#profile">'+a[i.id]+"</a>";s+='<a class="edit-timeline-icon" title="'+e.ui.agenda.editTimeline+a[i.id]+'"',s+='href="#/team-telefoon/agenda/'+i.id+'"',s+='><i class="icon-edit"></a>',_.each(i.data,function(e){_.each(r.legenda,function(t,o){if(e.text==o&&t){var f={start:e.start,end:e.end,member:a[i.id],state:r.states[e.text].label};n.push({start:Math.round(e.start*1e3),end:Math.round(e.end*1e3),group:s,content:this.tooltip(f)+u.secret(angular.toJson({type:"member",id:e.id,mid:i.id,recursive:e.recursive,state:e.text})),className:r.states[e.text].className,editable:!1})}}.bind(this))}.bind(this)),n.push({start:0,end:0,group:s,content:null,className:null,editable:!1}),n=u.addLoading(t,n,[s]),_.each(i.stats,function(e){var t=e.state.split(".");t.reverse(),e.state=e.state.match(/bar-(.*)/)?e.state:"bar-"+t[0]})}.bind(this)),n},pies:function(e,n){var r=this;_.each(r.filtered(e,n),function(e){var n;n=t.app.timeline.config.divisions.length>0?e.division.id:"",$.browser.msie&&$.browser.version=="8.0"?$("#groupPie-"+n).html(""):document.getElementById("groupPie-"+n).innerHTML="";var r=[],i={more:"#6cad6c",even:"#e09131",less:"#d34545"},s=[],o=[];_.each(e.ratios,function(e,t){e!=0&&r.push({ratio:e,color:i[t]})}),r=r.sort(function(e,t){return t.ratio-e.ratio}),_.each(r,function(e){s.push(e.color),o.push(e.ratio)});var u=Raphael("groupPie-"+n),a=u.piechart(120,120,100,o,{colors:s})})},filtered:function(e,t){var n=[];return t.division=="all"?n=e.aggs:_.each(e.aggs,function(e){t.division==e.division.id&&n.push(e)}),n},process:function(e,t,n,r,i,s,o,u){var a=this,f=[];return e.user&&(f=a.user(e,f,t,r,s,u)),e.aggs&&(t.bar?f=a.bars(e,f,t,i,o):f=a.aggs(e,f,t,i,o)),t.wishes&&e.aggs&&(f=a.wishes(e,f,i)),e.members&&(f=a.members(e,f,t,i,r,u)),f}}}])});
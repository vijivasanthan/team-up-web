define(["app","config","locals"],function(e,t,n){e.run(["$rootScope","$location","$timeout","Session","Store","$window","Teams","Offline","States","Browsers","Dater","TeamUp",function(e,r,i,s,o,u,a,f,l,c,h,p){h.getPeriods()||h.registerPeriods(),new f,e.$on("connection",function(){console.log(arguments[1]?"connection lost :["+Date.now():"connection restored :]"+Date.now())}),s.check(),e.config=t,e.ui=n.ui[t.app.lang],e.app=e.app||{},e.app.resources=o("app").get("resources"),e.loading={status:!1,message:"Loading.."},e.statusBar={display:function(t){e.loading={status:!0,message:t}},off:function(){e.loading.status=!1}},e.notification={status:!1,type:"",message:""},e.notifier={init:function(t,n,r){e.notification.status=!0,e.browser.mobile&&t==1?u.alert(r):e.notification={status:t,type:n,message:r}},success:function(e,t){this.init(!0,"alert-success",e),t||this.destroy()},error:function(e,t){this.init(!0,"alert-danger",e),t||this.destroy()},destroy:function(){setTimeout(function(){e.notification.status=!1},5e3)}},e.notifier.init(!1,"",""),e.fixStyles=function(){var e=angular.element(".tabs-left .nav-tabs").height();$.each(angular.element(".tab-content").children(),function(){var t=angular.element(this).attr("id"),n=angular.element(".tabs-left .tab-content #"+t).height();e>n?angular.element(".tabs-left .tab-content #"+t).css({height:angular.element(".tabs-left .nav-tabs").height()+6}):n>e}),($.os.mac||$.os.linux)&&angular.element(".nav-tabs-app li a span").css({paddingTop:"10px",marginBottom:"0px"})},e.getTeamMemberById=function(e){var t;return angular.forEach(o("app").get("teams"),function(n){angular.forEach(o("app").get(n.uuid),function(n){if(n.uuid==e){t=n;return}})}),typeof t=="undefined"&&(t={uuid:e,firstName:e,lastName:""}),t},e.getClientByID=function(e){var t;return angular.forEach(o("app").get("clients"),function(n){if(e==n.uuid){t=n;return}}),t==null&&angular.forEach(o("app").get("ClientGroups"),function(n){angular.forEach(o("app").get(n.id),function(n){if(n.uuid=e){t=n;return}})}),t},e.getClientsByTeam=function(e){var t=[],n=[];return angular.forEach(e,function(e){angular.forEach(o("app").get("teamGroup_"+e),function(e){var r=o("app").get(e.id);r.length>0&&angular.forEach(r,function(e){console.log("member ->",e),n.indexOf(e.uuid)==-1&&(n.push(e.uuid),t.push({uuid:e.uuid,name:e.firstName+" "+e.lastName}))})})}),t},e.getMembersByClient=function(e){var t=[],n=[];return angular.forEach(o("app").get("teams"),function(r){angular.forEach(o("app").get("teamGroup_"+r.uuid),function(i){e==i.id&&angular.forEach(o("app").get(r.uuid),function(e){n.indexOf(e.uuid)==-1&&(n.push(e.uuid),t.push({uuid:e.uuid,name:e.firstName+" "+e.lastName}))})})}),t},e.logout=function(){angular.element(".navbar").hide(),angular.element("#footer").hide();var e=o("app").get("loginData");p._("logout").then(function(t){t.error?console.warn("error ->",t):(s.clear(),o("app").nuke(),o("app").save("loginData",e),u.location.href="logout.html")})},e.avatarChange=function(e){var t=o("app").get("avatarChangeRecord");angular.isArray(t)||(t=[]),t.push(e),o("app").save("avatarChangeRecord",t)},e.getAvatarChangeTimes=function(e){var t=0,n=o("app").get("avatarChangeRecord");return angular.forEach(n,function(n){n==e&&t++}),t}}])});
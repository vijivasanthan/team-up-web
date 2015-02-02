define(["app","config","locals"],function(e,t,n){e.run(["$rootScope","$location","$timeout","Session","Store","$window","$filter","Teams","Offline","States","Browsers","Dater","TeamUp","Permission","$route","Pincode",function(e,r,i,s,o,u,a,f,l,c,h,p,d,v,m,g){p.getPeriods()||p.registerPeriods(),new l,e.$on("connection",function(){console.log(arguments[1]?"connection lost :["+Date.now():"connection restored :]"+Date.now())}),(o("app").get("periods")==null||o("app").get("periods").value==null)&&p.registerPeriods(),angular.element("#notification").css({display:"block"}),s.check(),e.config=t,e.config.app.init(),e.ui=n.ui[t.app.lang],e.app=e.app||{},e.app.resources=o("app").get("resources"),e.app.domainPermission=o("app").get("permissionProfile"),_.isEmpty(e.config.app.timeline.states)&&(e.config.app.timeline.config.states=e.config.app.statesall,delete e.config.app.timeline.config.states["com.ask-cs.State.Unreached"]),e.loading={status:!1,message:"Loading.."},e.statusBar={display:function(t){e.loading={status:!0,message:t}},off:function(){e.loading.status=!1}},e.notification={status:!1,type:"",message:""},e.notifier={init:function(t,n,r){e.notification.status=!0,e.notification={status:t,type:n,message:r}},success:function(e,t){this.init(!0,"alert-success",e),t||this.destroy()},error:function(e,t){this.init(!0,"alert-danger",e),t||this.destroy()},destroy:function(){i(function(){e.notification.status=!1},5e3)}},e.notifier.init(!1,"",""),e.fixStyles=function(){var e=angular.element(".tabs-left .nav-tabs").height();$.each(angular.element(".tab-content").children(),function(){var t=angular.element(this).attr("id"),n=angular.element(".tabs-left .tab-content #"+t).height();e>n?angular.element(".tabs-left .tab-content #"+t).css({minHeight:angular.element(".tabs-left .nav-tabs").height()+6}):n>e}),($.os.mac||$.os.linux)&&angular.element(".nav-tabs-app li a span").css({paddingTop:"10px",marginBottom:"0px"})},e.getTeamMemberById=function(e){if(e==null)return null;var t;return angular.forEach(o("app").get("teams"),function(n){angular.forEach(o("app").get(n.uuid),function(n){if(n.uuid==e){t=n;return}})}),typeof t=="undefined"&&(t={uuid:e,firstName:e,lastName:""}),t.fullName=t.firstName+" "+t.lastName,t},e.getTeamsofMembers=function(e){if(e==null)return null;var t=[];return angular.forEach(o("app").get("teams"),function(n){angular.forEach(o("app").get(n.uuid),function(r){r.uuid==e&&t.push(n)})}),t},e.getClientByID=function(e){var t;return angular.forEach(o("app").get("clients"),function(n){if(e==n.uuid){t=n;return}}),t==null&&angular.forEach(o("app").get("ClientGroups"),function(n){angular.forEach(o("app").get(n.id),function(n){if(n.uuid==e){t=n;return}})}),t},e.getClientGroupName=function(e){var t=o("app").get("ClientGroups"),n=e;return angular.forEach(t,function(t){t.id==e&&(n=t.name)}),n},e.checkUpdatedStatesLoggedUser=function(t){e.app.resources.uuid==t.uuid&&!_.isEqual(e.app.resources.states,t.states)&&(e.app.resources.states=t.states,o("app").save("resources",e.app.resources))},e.getTeamName=function(e){var t=o("app").get("teams"),n=e;return angular.forEach(t,function(t){t.uuid==e&&(n=t.name)}),n},e.getClientsByTeam=function(e){var t=[],n=[];return angular.forEach(e,function(e){angular.forEach(o("app").get("teamGroup_"+e),function(e){var r=o("app").get(e.id);r.length>0&&angular.forEach(r,function(e){n.indexOf(e.uuid)==-1&&(n.push(e.uuid),t.push({uuid:e.uuid,firstName:e.firstName,lastName:e.lastName,fullName:e.firstName+" "+e.lastName,name:e.firstName+" "+e.lastName}))})})}),t},e.getMembersByClient=function(e){var t=[],n=[];return angular.forEach(o("app").get("teams"),function(r){angular.forEach(o("app").get("teamGroup_"+r.uuid),function(i){e==i.id&&angular.forEach(o("app").get(r.uuid),function(e){n.indexOf(e.uuid)==-1&&(n.push(e.uuid),t.push({uuid:e.uuid,name:e.firstName+" "+e.lastName}))})})}),t},e.logout=function(){angular.element(".navbar").hide(),angular.element("#footer").hide();var e=o("app").get("loginData");d._("logout").then(function(t){t.error?console.warn("error ->",t):(s.clear(),o("app").nuke(),o("app").save("loginData",e),u.location.href="logout.html")})},e.showChangedAvatar=function(t,n){var r=a("avatar")(n,t,"80"),i=[];t=="team"?(n==e.app.resources.uuid&&i.push(".profile-avatar"),i.push(".team-avatar")):i.push(".client-avatar"),angular.forEach(i,function(e,t){angular.element(e).css({background:"url("+r+")","background-size":"cover"})})},e.avatarChange=function(e){var t=o("app").get("avatarChangeRecord");angular.isArray(t)||(t=[]),t.push(e),o("app").save("avatarChangeRecord",t)},e.getAvatarChangeTimes=function(e){var t=0,n=o("app").get("avatarChangeRecord");return angular.forEach(n,function(n){n==e&&t++}),t},e.transError=function(t){var n=t.split(" "),r=t;return angular.forEach(n,function(t){t.indexOf("_cg")>-1?r=r.replace(t,e.getClientGroupName(t)):t.indexOf("_team")>-1&&(r=r.replace(t,e.getTeamName(t)))}),r},e.resetPhoneNumberChecker=function(){e.phoneNumberParsed={}},e.resetPhoneNumberChecker(),e.parsePhoneNumber=function(t,n){if(t!=""){var r=_.isUndefined(n)?".inputPhoneNumber":".inputPhoneNumber"+n;if(t&&t.length>0){var i,s;i=s=phoneNumberParser(t,"NL"),e.phoneNumberParsed.result=!0;if(i){var o=e.ui.validation.phone.notValid,u=e.ui.validation.phone.invalidCountry,a;if(i.error)e.phoneNumberParsed={result:!1,message:o};else if(!i.validation.isPossibleNumber){switch(i.validation.isPossibleNumberWithReason){case"INVALID_COUNTRY_CODE":a=u;break;case"TOO_SHORT":a=o+e.ui.validation.phone.tooShort;break;case"TOO_LONG":a=o+e.ui.validation.phone.tooLong}e.phoneNumberParsed={result:!1,message:a}}else if(!i.validation.isValidNumber)e.phoneNumberParsed={result:!1,message:o};else if(!i.validation.isValidNumberForRegion)e.phoneNumberParsed={result:!1,message:u};else{var f;switch(i.validation.getNumberType){case"FIXED_LINE":f=e.ui.validation.phone.fixedLine;break;case"MOBILE":f=e.ui.validation.phone.mobile;break;case"FIXED_LINE_OR_MOBILE":f=e.ui.validation.phone.mobileOrFixedLine}e.phoneNumberParsed={result:!0,message:e.ui.validation.phone.message+i.validation.phoneNumberRegion+e.ui.validation.phone.as+f,format:i.formatting.e164},angular.element(r).val(i.formatting.e164).removeClass("error")}}e.phoneNumberParsed.all=s}else e.phoneNumberParsed.result=!0,delete e.phoneNumberParsed.message,angular.element(r).removeClass("error")}},e.directToChatLink=function(e){u.location.href=e,m.reload()},e.pincodeExists=function(t,n){g.pincodeExists(t,e.pincodeExistsValidation,e.checkPincode,n).then(function(t){e.pincodeExistsValidation=t.pincodeExistsValidation,e.pincodeExistsValidationMessage=t.pincodeExistsValidationMessage,e.checkPincode=t.check})},e.unique=function(e){var t=function(e){return e.role>0&&e.role<4};return _.indexBy(_.filter(_.map(_.indexBy(e,function(e){return e.uuid}),function(e){return e}),t),function(e){return e.uuid})}}])});
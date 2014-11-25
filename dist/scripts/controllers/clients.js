define(["controllers/controllers","config"],function(e,t){e.controller("clientCtrl",["$rootScope","$scope","$location","Clients","Teams","data","$route","$routeParams","Store","Dater","$filter","$modal","TeamUp","$timeout",function(e,n,r,i,s,o,u,a,f,l,c,h,p,d){function x(e){angular.forEach(o.clientGroups,function(t){t.id==e&&(n.clientGroup=t)}),n.clients=o.clients[e],n.current=e,n.views.reports&&(n.currentCLient="0",n.currentMonth="0",S())}function C(e){var t=_.invert(N)[e];f("app").save("currentTeamClientGroup",{team:t,clientGroup:e})}e.fixStyles(),e.resetPhoneNumberChecker();if(o.clientId){var v=!1;o.clientGroups=f("app").get("ClientGroups"),o.clients={},angular.forEach(o.clientGroups,function(e){o.clients[e.id]=f("app").get(e.id),angular.forEach(o.clients[e.id],function(e){e.uuid==o.clientId&&(n.client=e,n.contacts=e.contacts,e.birthDate=moment(e.birthDate).format("DD-MM-YYYY"),n.clientmeta=e,v=!0)})}),v||(o.clients=f("app").get("clients"),o.client=_.where(o.clients,{uuid:o.clientId})[0],n.client=o.client,n.contacts=o.client.contacts,o.client.birthDate=moment(client.birthDate).format("DD-MM-YYYY"),n.clientmeta=o.client)}n.imgHost=t.app.host,n.ns=t.app.namespace,n.clients=o.clients,n.clientGroups=o.clientGroups;var m=l.getMonthTimeStamps();n.Months=[],angular.forEach(m,function(e,t){n.Months[t]={number:t,name:t,start:e.first.timeStamp,end:e.last.timeStamp}}),n.Months[0]={number:0,name:e.ui.teamup.selectMonth};var g=r.search();n.search={query:""},n.selection={},n.data=o;var y,b;!g.uuid&&!r.hash()?(y=o.clientGroups[0].id,b="client",r.search({uuid:o.clientGroups[0].id}).hash("client")):g.uuid?(y=g.uuid,typeof y=="undefined"&&(y=n.client.clientGroupUuid),b=r.hash()):(f("app").get("currentTeamClientGroup").clientGroup||C(o.clientGroups[0].id),y=f("app").get("currentTeamClientGroup").clientGroup,b=r.hash(),r.search({uuid:y})),n.views={client:!0,newClientGroup:!1,newClient:!1,reports:!1,editClientGroup:!1,editClient:!1,viewClient:!1,editImg:!1};var w=function(e){n.views={client:!1,newClientGroup:!1,newClient:!1,reports:!1,editImg:!1},e=="viewClient"&&E(),e=="reports"&&S(),n.views[e]=!0},E=function(){console.log("loadReports-> ",n.client),e.statusBar.display(e.ui.teamup.loadingReports),p._("clientReportsQuery",{second:n.client.uuid},null,{success:function(e){f("app").save("reports_"+n.client.uuid,e)}}).then(function(t){e.statusBar.off(),n.reports=n.processReports(t)},function(e){console.log(e)})},S=function(){e.statusBar.display(e.ui.teamup.loadingReports),n.clientGroup||(n.clientGroup=o.clientGroups[0]),p._("clientGroupReportsQuery",{second:n.clientGroup.id}).then(function(t){e.statusBar.off(),n.groupReports=n.processReports(t),n.currentCLient!=0&&n.requestReportsByFilter();var i=r.search().reportUuid,s=null;if(i){angular.forEach(n.groupReports,function(e){e.uuid==i&&(s=e)});if(s==null){r.search().reportUuid&&r.search("reportUuid",null),e.notifier.error(e.ui.teamup.reportNotExists);return}n.openReport(s)}},function(e){console.log(e)})};w(b),x(y);var T=s.queryLocal(),N=s.queryLocalClientGroup(T.teams);n.requestClientGroup=function(e,t){x(e),C(e),n.$watch(r.search(),function(){r.search({uuid:e})}),t&&(r.hash()!="client"&&r.hash("client"),w("client"))},n.processReports=function(e){var t=[];return angular.forEach(e,function(e){t.push({uuid:e.uuid,title:e.title,creationTime:e.creationTime,clientUuid:e.clientUuid,body:e.body,media:e.media||[],author:n.$root.getTeamMemberById(e.authorUuid),client:n.$root.getClientByID(e.clientUuid),filtered:"false"})}),t},n.setViewTo=function(e){n.$watch(e,function(){n.clientGroup||(n.clientGroup=n.clientGroups[0]),(r.hash()=="viewClient"||r.hash()=="editClient"||r.hash()=="editImg")&&e=="client"&&r.path("/client").search({uuid:n.clientGroup.id}),r.hash(e),w(e)})},n.editClientGroup=function(e){n.cGroupEditForm={name:e.name,id:e.id},n.views.editClientGroup=!0},n.cancelClientGroupEdit=function(e){n.cGroupEditForm={name:e.name,id:e.id},n.views.editClientGroup=!1},n.changeClientGroup=function(t){if($.trim(t.name)=="")return;p._("clientGroupUpdate",{second:t.id},t.id).then(function(r){r.error?e.notifier.error(e.ui.teamup.errorSaveClientGroup):(e.statusBar.display(e.ui.teamup.refreshing),i.query(!1).then(function(){e.notifier.success(e.ui.teamup.dataChanged),e.statusBar.off(),n.clientGroup.name=t.name,n.views.editClientGroup=!1}))})};var k=function(t){i.query(!1,t).then(function(i){i.error?console.warn("error ->",i):(e.notifier.success(e.ui.teamup.dataChanged),n.closeTabs(),n.data=i,n.clientGroups=i.clientGroups,n.clients=i.clients,angular.forEach(i.clientGroups,function(e){e.id==t.uuid&&(n.clientGroup=e,n.current=e.id,r.url("/client?uuid="+e.id).hash("client"))})),e.statusBar.off()})};n.cGroupSubmit=function(t){if(typeof t=="undefined"||$.trim(t.name)==""){e.notifier.error(e.ui.teamup.teamNamePrompt1);return}p._("clientGroupAdd",null,t,{success:function(e){f("app").save(e.id,e)}}).then(function(t){t.error||(e.statusBar.display(e.ui.teamup.refreshing),k({uuid:t.id}))})},n.closeTabs=function(){n.clientGroupForm={},n.clientForm={},w("client")},n.changeContacts=function(t){if(typeof n.contactForm=="undefined"||n.contactForm.func==""||n.contactForm.name!=null){e.notifier.error(e.ui.teamup.teamNamePrompt2);return}if(e.phoneNumberParsed.result==0){e.notifier.error(e.ui.validation.phone.notValid);return}e.phoneNumberParsed.result==1&&(n.contactForm.phone=e.phoneNumberParsed.format);if(!_.isNumber(t)){var r={firstName:"",lastName:"","function":"",phone:""};r.firstName=n.contactForm.firstName,r.lastName=n.contactForm.lastName,r.function=n.contactForm.function,r.phone=n.contactForm.phone,typeof n.contacts=="undefined"&&(n.contacts=[]),n.contacts==null&&(n.contacts=[]),n.contacts.push(r)}n.contactForm=null,e.resetPhoneNumberChecker()},n.editContact=function(e,t){n.contactForm=e,n.contactForm.index=t},n.clientSubmit=function(t){if(typeof t=="undefined"||!t.firstName||!t.lastName||!t.phone){e.notifier.error(e.ui.teamup.clinetInfoFill);return}e.statusBar.display(e.ui.teamup.savingClient);try{t.birthDate=l.convert.absolute(t.birthDate,0)}catch(r){e.notifier.error(e.ui.teamup.birthdayError);return}if(e.phoneNumberParsed.result==0){e.notifier.error(e.ui.validation.phone.notValid);return}e.phoneNumberParsed.result==1&&(t.phone=e.phoneNumberParsed.format),t.clientGroupUuid=n.clientGroup.id,p._("clientAdd",null,t,{success:function(e){f("app").save(e.id,e)}}).then(function(t){t.error?e.notifier.error(e.ui.teamup.clientSubmitError):(n.contactForm=null,e.resetPhoneNumberChecker(),k({uuid:t.clientGroupUuid}))})},n.clientChange=function(t){t.address&&!t.address.city&&!t.address.country&&!t.address.latitude&&!t.address.longitude&&!t.address.street&&!t.address.zip&&(t.address=null);if(e.phoneNumberParsed.result==0){e.notifier.error(e.ui.validation.phone.notValid);return}e.phoneNumberParsed.result==1&&(t.phone=e.phoneNumberParsed.format),e.statusBar.display(e.ui.teamup.savingClient);var r=angular.copy(t);try{r.birthDate=l.convert.absolute(t.birthDate,0)}catch(i){e.notifier.error(e.ui.teamup.birthdayError);return}p._("clientUpdate",{second:t.uuid},r).then(function(t){if(t.error)e.notifier.error(e.ui.teamup.clientSubmitError);else{e.resetPhoneNumberChecker(),e.statusBar.display(e.ui.teamup.refreshing),e.notifier.success(e.ui.teamup.dataChanged);var r=t.clientGroupUuid?t.clientGroupUuid:n.clientGroups[0].id;k({uuid:r})}})},n.saveContacts=function(t){var r=n.client;try{r.birthDate=l.convert.absolute(r.birthDate,0)}catch(s){e.notifier.error(e.ui.teamup.birthdayError);return}r.contacts=t,e.statusBar.display(e.ui.teamup.savingContacts),p._("clientUpdate",{second:r.uuid},r).then(function(t){t.error?e.notifier.error(e.ui.teamup.clientSubmitError):(e.notifier.success(e.ui.teamup.dataChanged),e.statusBar.off(),i.query(!1,{uuid:t.clientGroupUuid}).then(function(e){})),n.client.birthDate=c("nicelyDate")(n.client.birthDate)})},n.removeContact=function(e){var t=n.contacts.indexOf(e);n.contacts.splice(t,1),angular.element("#confirmContactModal").modal("hide")},n.confirmationRemoveContact=function(e){d(function(){n._contact=e,angular.element("#confirmContactModal").modal("show")})},n.confirmDeleteClientGroup=function(){d(function(){angular.element("#confirmClientGroupModal").modal("show")})},n.deleteClientGroup=function(){angular.element("#confirmClientGroupModal").modal("hide"),e.statusBar.display(e.ui.teamup.deletingClientGroup),p._("clientGroupDelete",{second:n.current}).then(function(t){t.id&&i.query(!0,{}).then(function(e){n.requestClientGroup(e[0].id),angular.forEach(n.clientGroups,function(e,r){e.id==t.id&&n.clientGroups.splice(r,1)})},function(e){console.log(e)}),e.notifier.success(e.ui.teamup.dataChanged),e.statusBar.off()},function(e){console.log(e)})},n._clientId={},n.confirmDeleteClient=function(e){d(function(){n._clientId=e,angular.element("#confirmClientModal").modal("show")})},n.deleteClient=function(t){n._clientId={},angular.element("#confirmClientModal").modal("hide"),e.statusBar.display(e.ui.teamup.deletingClient),p._("clientDelete",{second:t}).then(function(){p._("clientsQuery").then(function(e){f("app").save("clients",e),n.views.viewClient==1?n.setViewTo("client"):u.reload()})},function(e){console.log(e)})},n.requestReportsByFilter=function(){angular.forEach(n.groupReports,function(e){e.clientUuid!=n.currentCLient&&n.currentCLient!="0"?e.filtered="true":e.filtered="false";var t=(new Date(e.creationTime)).getMonth()+1;t!=n.currentMonth&&n.currentMonth!="0"||e.filtered=="true"?e.filtered="true":e.filtered="false"})};var L=function(t,n,i){t.report=i,t.view={editReport:!!i.editMode,viewReport:!i.editMode&&typeof i.uuid!="undefined",newReport:typeof i.uuid=="undefined"},t.close=function(){n.dismiss(),r.search().reportUuid&&r.search("reportUuid",null)},t.saveReport=function(t){t.editMode?p._("clientReportUpdate",{second:t.clientUuid,fourth:t.uuid},{uuid:t.uuid,title:t.title,body:t.body,creationTime:t.creationTime}).then(function(r){n.close(t),e.notifier.success(e.ui.teamup.dataChanged)}):p._("clientReportAdd",{second:t.clientUuid},{uuid:t.uuid,title:t.title,body:t.body,creationTime:t.creationTime}).then(function(r){n.close(t),e.notifier.success(e.ui.teamup.dataChanged)})}};L.$inject=["$scope","$modalInstance","report"],n.openReport=function(e){n.report=e,n.report.editMode=!1,h.open({templateUrl:"./views/reportTemplate.html",controller:L,resolve:{report:function(){return n.report}}})},n.newReport=function(){n.report={title:e.ui.teamup.newReport,creationTime:(new Date).getTime(),clientUuid:n.currentCLient,body:null,author:n.$root.getTeamMemberById(e.app.resources.uuid),client:n.$root.getClientByID(n.currentCLient),editMode:!1};var t=h({template:"views/reportTemplate.html",controller:L,resolve:{report:function(){return n.report},editMode:!1}});t.$promise.then(function(){S()},function(){console.log("Modal dismissed at: "+new Date)})},n.editReport=function(e){n.report=e,n.report.editMode=!0,h.open({templateUrl:"./views/reportTemplate.html",controller:L,resolve:{report:function(){return n.report}}})},n._report={},n.confirmDeleteReport=function(e){d(function(){n._report=e,angular.element("#confirmReportModal").modal("show")})},n.removeReport=function(t){e.statusBar.display(e.ui.teamup.loading),n._report={},angular.element("#confirmReportModal").modal("hide"),p._("clientReportDelete",{second:t.clientUuid,reportId:t.uuid}).then(function(t){t.result=="ok"?(e.notifier.success(e.ui.teamup.dataChanged),S(),n.views.viewClient==1&&E()):e.notifier.error(t.error)},function(e){console.log(e)})},n.editImg=function(){n.uploadURL=n.imgHost+n.ns+"/client/"+n.client.uuid+"/photo?square=true",n.setViewTo("editImg")},n.$on("$locationChangeSuccess",function(t,i,s){var o=t.currentScope;if(r.hash()=="reports"){var u=r.search().uuid,a=r.search().reportUuid;if(u)if(u!=o.clientGroup.id)angular.forEach(o.data.clientGroups,function(e){e.id==u&&(o.clientGroup=e)}),o.setViewTo("reports");else if(a){var f=null;angular.forEach(n.groupReports,function(e){e.uuid==a&&(f=e)});if(f==null){e.notifier.error(e.ui.teamup.reportNotExists),r.search().reportUuid&&r.search("reportUuid",null);return}o.openReport(f)}}})}])});
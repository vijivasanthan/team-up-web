define(["controllers/controllers","config"],function(e,t){e.controller("messagesCtrl",["$scope","$rootScope","$q","$location","$route","$filter","Teams","TeamUp",function(e,n,r,i,s,o,u,a){var f=2e3,l=5e3,c=6048e5;e.messages=[],e.messagesShow=[],e.teamName="",e.latestMsgTime=0,n.$on("taskFinishLoading",function(t,r){angular.isArray(n.app.resources.teamUuids)&&(e.teamName=n.getTeamName(n.app.resources.teamUuids[0]),e.chatTeamId=n.app.resources.teamUuids[0].uuid,e.chatTeamId&&!e.toggleChat&&setTimeout(e.checkMessage,l))}),e.formatMessage=function(t){var r=[];angular.forEach(t,function(i,s){var u=o("getByUuid")(e.messages,i.uuid);if(u)return;var a=o("nicelyDate")(parseInt(i.sendTime));s>0&&a==o("nicelyDate")(parseInt(t[s-1].sendTime))&&(a="");var f={date:a,role:"",member:{},senderName:"",sendTime:parseInt(i.sendTime),body:i.body,msgRole:"",senderUuid:i.senderUuid,uuid:i.uuid,type:i.type,title:i.title},l=n.getTeamMemberById(i.senderUuid);i.senderUuid==e.$root.app.resources.uuid?(f.role="own",f.msgRole="messageOwn",f.member=e.$root.app.resources,f.senderName=f.member.firstName+" "+f.member.lastName):(f.role="other",f.msgRole="messageOther",f.member=l,f.senderName=l.firstName+" "+l.lastName);if(f.type=="REPORT_NEW"){var h=JSON.parse(i.body),p=n.getClientByID(h.clientUuid);p!=null&&(angular.extend(h,{clientGroupId:p.clientGroupUuid}),f.body=h,f.title=e.ui.message.reportMessage+" "+p.firstName+" "+p.lastName)}e.messages.push(f);var d=new Date;d.getTime()-parseInt(i.sendTime)<=c&&e.messagesShow.push(f),r.indexOf(i.senderUuid)==-1&&r.push(i.senderUuid)})},e.renderMessage=function(t){a._("chats",{third:e.chatTeamId,since:e.latestMsgTime}).then(function(t){if(t.error){n.notifier.error(t.error.data);return}t=o("orderBy")(t,"sendTime"),e.formatMessage(t),e.moveToBottom&&setTimeout(function(){angular.element("#chat-content #messageField").focus(),angular.element("#chat-content .mainContent").scrollTop(angular.element("#chat-content .mainContent")[0].scrollHeight),e.moveToBottom=!1},1e3),e.toggleChat&&(e.latestMsgTime=t[t.length-1].sendTime,setTimeout(e.renderMessage,f))},function(e){console.log(e)})},e.checkMessage=function(t){a._("chats",{third:e.chatTeamId,since:e.latestMsgTime}).then(function(t){if(t.error){n.notifier.error(t.error.data);return}e.newCount=0,angular.forEach(t,function(t){o("getByUuid")(e.messages,t.uuid)||e.newCount++}),e.newCount==0||e.messages.length==0?e.unReadCount==0||typeof e.unReadCount=="undefined"?e.newCountShow="":e.newCountShow="("+e.unReadCount+")":(e.unReadCount=e.newCount+(typeof e.unReadCount=="undefined"?0:e.unReadCount),e.newCountShow="("+e.unReadCount+")"),$("#chat-btn").animate({"background-color":"yellow"},"slow").animate({"background-color":"#1dc8b6"},"slow"),e.toggleChat||(t=o("orderBy")(t,"sendTime"),(e.messages.length==0||!e.newCount==0&&!e.newCount=="")&&e.formatMessage(t),e.latestMsgTime=t[t.length-1].sendTime,setTimeout(e.checkMessage,l))})},e.openChat=function(){e.toggleChat=!e.toggleChat;var t=n.app.resources.teamUuids;e.chatTeamId=t[0];var r=o("orderBy")(e.messages,"sendTime"),i=0;r.length>0&&(e.latestMsgTime=r[r.length-1].sendTime),e.chatTeamId?e.toggleChat?(e.renderMessage(i),e.newCountShow="",e.unReadCount=0,e.moveToBottom=!0):setTimeout(e.checkMessage,l):console.log("login user doesn't belong to any team.")},e.sendMessage=function(r){if(typeof r=="undefined"||r==""){n.notifier.error(n.ui.message.emptyMessageBody);return}n.statusBar.display(n.ui.message.sending);var i=new Date;a._("message",{},{title:"Van: TeamUp"+i.toString(t.app.formats.date),body:r,sendTime:i.getTime()}).then(function(){n.statusBar.off(),e.newMessage="",e.moveToBottom=!0},function(e){n.notifier.error(e),n.statusBar.off()})}}])});
define({app:{version:"1.2.0-snapshot",released:"Wednesday, January 14th, 2015, 4:23:35 PM",title:profile.title,lang:profile.lang,statesall:profile.statesall,tabs:profile.tabs,namespace:"",host:profile.host,formats:{date:"dd-MM-yyyy",time:"HH:mm",datetime:"dd-MM-yyyy HH:mm",datetimefull:"dd-MM-yyyy HH:mm"},roles:profile.roles,mfunctions:[{id:"1",label:"Doctor"},{id:"2",label:"Nurse"}],stateIcons:[{name:"Availability",data_icon:"&#xe04d;",class_name:"icon-user-block"},{name:"Location",data_icon:"&#xe21a;",class_name:"icon-location4"},{name:"Emotion",data_icon:"&#xe0f2;",class_name:"icon-smiley"},{name:"Activity",data_icon:"&#xe4f2;",class_name:"icon-accessibility"},{name:"Reachability",data_icon:"&#xe169;",class_name:"icon-podcast2"}],stateColors:{availalbe:"memberStateAvailalbe",busy:"memberStateBusy",offline:"memberStateOffline",none:"memberStateNone"},noImgURL:"/images/defaultAvatar.png",timeline:{options:{axisOnTop:!0,width:"100%",height:"auto",selectable:!0,editable:!0,style:"box",groupsWidth:"200px",eventMarginAxis:0,showCustomTime:!1,groupsChangeable:!0,showNavigation:!1,intervalMin:36e5},config:{zoom:"0.4",bar:!1,layouts:{groups:!0,members:!0},wishes:!1,legenda:{},legendarer:!1,states:{},divisions:[],densities:{less:"#a0a0a0",even:"#ba6a24",one:"#415e6b",two:"#3d5865",three:"#344c58",four:"#2f4550",five:"#2c424c",six:"#253943",more:"#486877"}}},pie:{colors:["#415e6b","#ba6a24","#a0a0a0"]},defaults:{settingsWebPaige:{user:{language:"nl"},app:{widgets:{groups:{}}}}},states:["com.ask-cs.State.Available","com.ask-cs.State.Unavailable","com.ask-cs.State.Unreached"],taskStates:{1:"Active",2:"Planning",3:"Finished",4:"Cancelled"},timers:profile.timers,init:function(){angular.forEach(this.states,function(e){this.timeline.config.states[e]=this.statesall[e]}.bind(this))}}});
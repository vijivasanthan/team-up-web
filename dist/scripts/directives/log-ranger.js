define(["directives/directives"],function(e){e.directive("logRanger",["$rootScope",function(e){return{restrict:"A",link:function(n,r,i,s){var o={startDate:Date.today(),endDate:Date.today(),format:"DD-MM-YYYY",separator:" / ",minDate:!1,maxDate:!1,changed:!1,cleared:!1,showDropdowns:!1,dateLimit:!1,locale:{applyLabel:"Toepassen",cancelLabel:"Annuleren",fromLabel:"van",toLabel:"tot",weekLabel:"W",customRangeLabel:"Aangepaste periode",daysOfWeek:Date.CultureInfo.shortestDayNames,monthNames:Date.CultureInfo.monthNames,firstDay:0},ranges:{}};o.ranges[e.ui.planboard.daterangerToday]=[new Date.today,(new Date.today).addDays(1)],o.ranges[e.ui.planboard.daterangerYesterday]=[moment().subtract(1,"day").toDate(),new Date.today],o.ranges[e.ui.planboard.daterangerLast7Days]=[moment().subtract(7,"day").toDate(),new Date.today],r.daterangepicker(o,function(t,r){n.$apply(function(){t._isAMomentObject&&r._isAMomentObject&&(t=t.toDate(),r=r.startOf("day").toDate()),e.$broadcast("getLogRange",{start:t.getTime(),end:r.getTime()})})}),r.attr("data-toggle","daterangepicker")}}}])});
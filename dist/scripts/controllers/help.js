define(["controllers/controllers"],function(e){e.controller("helpCtrl",["$rootScope","$scope","$location",function(e,t,n){function i(){t.views={web:!1,ios:!1,android:!1}}e.fixStyles();var r=n.hash()?n.hash():"web",s=function(e){i(),t.views[e]=!0,n.hash(e)};t.setViewTo=function(e){t.$watch(e,function(){n.hash(e),s(e)})},s(r)}])});
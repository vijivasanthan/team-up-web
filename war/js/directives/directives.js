/*jslint node: true */
/*global angular */
/*global $ */
'use strict';


angular.module('WebPaige.Directives', ['ngResource'])


/**
 * Chosen
 */
.directive('chosen',
  function ()
  {
    var linker = function (scope,element,attr)
    {
      scope.$watch('receviersList', function ()
      {
         element.trigger('liszt:updated');
      });

      scope.$watch('message.receviers', function ()
      {
        $(element[0]).trigger('liszt:updated');
      });

      element.chosen();
    };

    return {
      restrict: 'A',
      link:     linker
    };
  }
)

/**
 * uploader (file upload)
 */
.directive('uploader', [function() {

    return {
        restrict: 'E',
        scope: {
            action: '@'
            // scope
            // define a new isolate scope

        },
        controller: ['$scope','$rootScope', 'Storage' ,function ($scope,$rootScope,Storage) {

            // controller:
            // here you should define properties and methods
            // used in the directive's scope
            
            $scope.progress = 0;
            $scope.avatar = '';
            $scope.uploadLabel = $rootScope.ui.profile.click2upload;
            
            var session = angular.fromJson(Storage.cookie.get('session'));
            if(session){
                $scope.sessionId = session.id;
            }else{
                $rootScope.notifier.success($rootScope.ui.profile.sessionExpired);
                return false;
            }
         
            $scope.sendFile = function(el) {

                var $form = $(el).parents('form');

                if ($(el).val() == '') {
                    return false;
                }

                $form.attr('action', $scope.action);

                $scope.$apply(function() {
                    $scope.progress = 0;
                });             

                $form.ajaxSubmit({
                    type: 'POST',
                    headers: {'X-SESSION_ID' : $scope.sessionId},
                    uploadProgress: function(event, position, total, percentComplete) { 
                        
                        $scope.$apply(function() {
                            // upload the progress bar during the upload
                            $scope.progress = percentComplete;
                        });

                    },
                    error: function(event, statusText, responseText, form) { 

                        // remove the action attribute from the form
                        $form.removeAttr('action');

                        /*
                            handle the error ...
                        */
                        console.log("response : ",responseText);
                    },
                    success: function(responseText, statusText, xhr, form) { 

                        var ar = $(el).val().split('\\'), 
                            filename =  ar[ar.length-1];

                        // remove the action attribute from the form
                        $form.removeAttr('action');

                        $scope.$apply(function() {
                            $scope.avatar = filename;
                        });

                    },
                });

            }
        }],
        link: function(scope, elem, attrs, ctrl) {
            
            // link function 
            // here you should register listeners
            elem.find('.fake-uploader').click(function() {
                elem.find('input[type="file"]').click();
            });
        },
        replace: false,    
        templateUrl: 'js/views/uploader.html'
    };

}])

/**
 * uploader (file upload)
 */
.directive('loadimg', [function() {

    return {
        restrict: 'E',
        scope: {
            url: '@'
            // scope
            // define a new isolate scope

        },
        controller: ['$scope','$rootScope', 'Storage' ,function ($scope,$rootScope,Storage,$element) {

            // controller:
            // here you should define properties and methods
            // used in the directive's scope
            
            
            
            var session = angular.fromJson(Storage.cookie.get('session'));
            if(session){
                $scope.sessionId = session.id;
            }else{
                $rootScope.notifier.success($rootScope.ui.profile.sessionExpired);
                return false;
            }
//            console.log('scope',$scope);
//            console.log('url',$scope.url);
//            console.log('session',$scope.sessionId);
//            $scope.url = "http://192.168.128.205:8888//teamup/team/member/richard@ask-cs.com/photo";
            $scope.loadImg = function(el){
                $.ajax({ 
                    url: $scope.url,
                    type:"GET", 
                    headers: {'X-SESSION_ID' : $scope.sessionId},
                    success: function(data)
                    {
//                        console.log($element);
                        console.log(el);
                        
                        //var f = $element.attr("src", data); // use self instead of this
                        //console.log(f);
                    },
                    error: function(jqXHR, textStatus, errorThrow)
                    {
                        debugger;
                    }
               });  
            }
            
            
        }],
        link: function(scope, elem, attrs, ctrl) {
            
            // link function 
            // here you should register listeners
//            elem.find('.fake-uploader').click(function() {
//                elem.find('input[type="file"]').click();
//            });
//            console.log('elem',elem);
//            console.log('scope',scope);
            console.log('url',scope.url);
        },
        replace: true    ,
        template : '<div onReady="angular.element(this).scope().loadImg(this);">click</div>'
    };

}])

/**
 * Notification item
 */
// .directive('notificationItem',
//   function ($compile)
//   {
//     return {
//       restrict: 'E',
//       rep1ace:  true,
//       templateUrl: 'dist/views/messages-scheadule-item.html',
//       link: function (scope, element, attrs)
//       {
//         /**
//          * Pass the scheadule data
//          */
//         scope.s = scope.scheadule;

//         // element.html(template).show();
//         // $compile(element.contents())(scope);

//         /**
//          * Serve to the controller
//          */
//         scope.remover = function (key)
//         {
//           console.log('coming to remover');

//           scope.$parent.$parent.remover(key);
//         };
//       },
//       scope: {
//         scheadule: '='
//       }
//     };

//   }
// )


/**
 * Daterangepicker
 */
// .directive('daterangepicker',
// [
//   '$rootScope',
//   function ($rootScope)
//   {
//     return {
//       restrict: 'A',

//       link: function postLink(scope, element, attrs, controller)
//       {
//         // var startDate = Date.create().addDays(-6),
//         //     endDate   = Date.create();       
//         //element.val(startDate.format('{MM}-{dd}-{yyyy}') + ' / ' + endDate.format('{MM}-{dd}-{yyyy}'));

//         element.daterangepicker({
//           // startDate: startDate,
//           // endDate: endDate,
//           ranges: {
//             'Today':        ['today',     'tomorrow'],
//             'Tomorrow':     ['tomorrow',  new Date.today().addDays(2)],
//             'Yesterday':    ['yesterday', 'today'],
//             'Next 3 Days':  ['today',     new Date.create().addDays(3)],
//             'Next 7 Days':  ['today',     new Date.create().addDays(7)]
//           }
//         },
//         function (start, end)
//         {
//           scope.$apply(function ()
//           {
//             var diff = end.getTime() - start.getTime();

//             /**
//              * Scope is a day
//              */
//             if (diff <= 86400000)
//             {
//               scope.timeline.range = {
//                 start:  start,
//                 end:    start
//               };
//               scope.timeline.scope = {
//                 day:    true,
//                 week:   false,
//                 month:  false
//               };
//             }
//             /**
//              * Scope is less than a week
//              */
//             else if (diff < 604800000)
//             {
//               scope.timeline.range = {
//                 start:  start,
//                 end:    end
//               };
//               scope.timeline.scope = {
//                 day:    false,
//                 week:   true,
//                 month:  false
//               };
//             }
//             /**
//              * Scope is more than a week
//              */
//             else if (diff > 604800000)
//             {
//               scope.timeline.range = {
//                 start:  start,
//                 end:    end
//               };
//               scope.timeline.scope = {
//                 day:    false,
//                 week:   false,
//                 month:  true
//               };
//             }

//             $rootScope.$broadcast('timeliner', {
//               start:  start,
//               end:    end
//             });

//           });
//         });

//         /**
//          * Set data toggle
//          */
//         element.attr('data-toggle', 'daterangepicker');

//         /**
//          * TODO
//          * Investigate if its really needed!!
//          */
//         element.daterangepicker({
//           autoclose: true
//         });
//       }
//     };
//   }
// ])

/**
 * show the member's profile
 */
.directive('profile', [function() {

    return {
        restrict: 'E',
        scope: {
            memberId: '@'
            // scope
            // define a new isolate scope

        },
        controller: ['$scope','$rootScope', 'Storage' ,function ($scope,$rootScope,Storage) {
            console.log($scope.memberId );
            
            $scope.loadMember = function(el){
                
            }
            
        }],
        link: function(scope, elem, attrs, ctrl) {
            // link function 
            console.log(attrs.memberId );
        },
        replace: false,    
        templateUrl: 'js/views/profileTemplate.html'
    };

}])


;


/**
 * ???
 */
// .directive('wpName', 
// [
//   'Storage', 
//   function (Storage)
//   {
//     return {
//       restrict : 'A',
//       link : function linkfn(scope, element, attrs)
//       {
//         var getmemberName = function (uid)
//         {
//           var members = angular.fromJson(Storage.get('members')),
//               retName = uid;

//           angular.forEach(members , function (mem, i)
//           {
//             if (mem.uuid == uid)
//             {
//               retName = mem.name;

//               return false;
//             };
//           });

//           return retName;
//         };
//         scope.$watch(attrs.wpName, function (uid)
//         {
//           element.text(getmemberName(uid)); 
//         });
//       }
//     }
//   }
// ]);


/**
 * 
 */
// .directive('shortcuts', 
// [
//   '$rootScope', 
//   function ($rootScope)
//   {
//     return {
//       restrict: 'E',
//       template: '<link rel="shortcut icon" ng-href="js/profiles/{{profile}}/img/ico/favicon.ico">' +
//                 '<link rel="apple-touch-icon-precomposed" sizes="144x144" ng-href="js/profiles/{{profile}}/img/ico/apple-touch-icon-144-precomposed.png">' +
//                 '<link rel="apple-touch-icon-precomposed" sizes="114x114" ng-href="js/profiles/{{profile}}/img/ico/apple-touch-icon-114-precomposed.png">' +
//                 '<link rel="apple-touch-icon-precomposed" sizes="72x72"   ng-href="js/profiles/{{profile}}/img/ico/apple-touch-icon-72-precomposed.png">' +
//                 '<link rel="apple-touch-icon-precomposed" sizes="57x57"   ng-href="js/profiles/{{profile}}/img/ico/apple-touch-icon-57-precomposed.png">',
//       replace: true,
//       scope: {
//         profile: '@profile'
//       },
//       link: function (scope, element, attrs)
//       {
//       }
//     }
//   }
// ]);


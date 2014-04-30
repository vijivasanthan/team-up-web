define(
  ['directives/directives'],
  function (directives)
  {
    'use strict';

    directives.directive(
      'chosen',
      function ()
      {
        var linker = function (scope, element, attr)
        {
          scope.$watch(
            'receviersList', function ()
            {
              element.trigger('liszt:updated');
            });

          scope.$watch(
            'message.receviers', function ()
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
    );

    directives.directive(
      'uploader', [function ()
                   {

                     return {
                       restrict:    'E',
                       scope:       {
                         action: '@'
                         // scope
                         // define a new isolate scope

                       },
                       controller:  ['$scope', '$rootScope', 'Storage' , function ($scope, $rootScope, Storage)
                       {

                         // controller:
                         // here you should define properties and methods
                         // used in the directive's scope

                         $scope.progress = 0;
                         $scope.avatar = '';
                         $scope.uploadLabel = $rootScope.ui.profile.click2upload;

                         var session = angular.fromJson(Storage.cookie.get('session'));
                         if (session)
                         {
                           $scope.sessionId = session.id;
                         }
                         else
                         {
                           $rootScope.notifier.success($rootScope.ui.profile.sessionExpired);
                           return false;
                         }

                         $scope.sendFile = function (el)
                         {

                           var $form = $(el).parents('form');

                           if ($(el).val() == '')
                           {
                             return false;
                           }

                           $form.attr('action', $scope.action);

                           $scope.$apply(
                             function ()
                             {
                               $scope.progress = 0;
                             });

                           $form.ajaxSubmit(
                             {
                               type:           'POST',
                               headers:        {'X-SESSION_ID': $scope.sessionId},
                               uploadProgress: function (event, position, total, percentComplete)
                               {

                                 $scope.$apply(
                                   function ()
                                   {
                                     // upload the progress bar during the upload
                                     $scope.progress = percentComplete;
                                   });

                               },
                               error:          function (event, statusText, responseText, form)
                               {

                                 // remove the action attribute from the form
                                 $form.removeAttr('action');

                                 /*
                                  handle the error ...
                                  */
                                 console.log("response : ", responseText);
                               },
                               success:        function (responseText, statusText, xhr, form)
                               {

                                 var ar = $(el).val().split('\\'),
                                     filename = ar[ar.length - 1];

                                 // remove the action attribute from the form
                                 $form.removeAttr('action');

                                 $scope.$apply(
                                   function ()
                                   {
                                     $scope.avatar = filename;
                                   });

                               }
                             });

                         };
                       }],
                       link:        function (scope, elem, attrs, ctrl)
                       {

                         // link function
                         // here you should register listeners
                         elem.find('.fake-uploader').click(
                           function ()
                           {
                             elem.find('input[type="file"]').click();
                           });
                       },
                       replace:     false,
                       templateUrl: 'views/uploader.html'
                     };

                   }]);

    directives.directive(
      'profile', [function ()
                  {

                    return {
                      restrict:    'E',
                      scope:       {
                        memberId: '@'
                        // scope
                        // define a new isolate scope

                      },
                      controller:  ['$scope', '$rootScope', 'Storage' , function ($scope, $rootScope, Storage)
                      {
                        console.log($scope.memberId);

                        $scope.loadMember = function (el)
                        {

                        }

                      }],
                      link:        function (scope, elem, attrs, ctrl)
                      {
                        // link function
                        console.log(attrs.memberId);
                      },
                      replace:     false,
                      templateUrl: 'views/profileTemplate.html'
                    };

                  }]);

    directives.directive(
      'ngenter', function ()
      {
        return function (scope, element, attrs)
        {
          element.bind(
            "keydown keypress", function (event)
            {
              if (event.which === 13)
              {
                scope.$apply(
                  function ()
                  {
                    scope.$eval(attrs.ngenter);
                  });
                event.preventDefault();
              }
            });
        };
      });
  }
);
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
            'receviersList',
            function () { element.trigger('liszt:updated') }
          );

          scope.$watch(
            'message.receviers',
            function () { $(element[0]).trigger('liszt:updated') }
          );

          element.chosen();
        };

        return {
          restrict: 'A',
          link:     linker
        };
      }
    );

    directives.directive(
      'uploader', [
        function ()
        {
          return {
            restrict:    'E',
            scope:       {
              action: '@'
            },
            controller:  [
              '$scope', '$rootScope', 'Store' ,
              function ($scope, $rootScope, Store)
              {
                $scope.progress = 0;
                $scope.avatar = '';
                $scope.uploadLabel = $rootScope.ui.profile.click2upload;

                // var session = angular.fromJson(Storage.cookie.get('session'));
                var session = Store('app').get('session');

                if (session)
                {
                  $scope.sessionId = session.id;
                }
                else
                {
                  console.log('session expired!!');
                  // FIXME: Message does not exist!
                  // $rootScope.notifier.success($rootScope.ui.profile.sessionExpired);
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
                    function () { $scope.progress = 0 }
                  );

                  $form.ajaxSubmit(
                    {
                      type:           'POST',
                      headers:        {
                        'X-SESSION_ID': $scope.sessionId
                      },
                      uploadProgress: function (event, position, total, percentComplete)
                      {
                        $scope.$apply(
                          function () { $scope.progress = percentComplete }
                        );
                      },
                      error:          function (event, statusText, responseText, form)
                      {
                        $form.removeAttr('action');

                        console.log("response : ", responseText);
                      },
                      success:        function (responseText, statusText, xhr, form)
                      {
                        var ar = $(el).val().split('\\'),
                            filename = ar[ar.length - 1];
                        $form.removeAttr('action');

                        $scope.$apply(
                          function () { $scope.avatar = filename }
                        );
                      }
                    });
                };
              }
            ],
            link:        function (scope, elem, attrs, ctrl)
            {
              elem.find('.fake-uploader').click(
                function () { elem.find('input[type="file"]').click() }
              );
            },
            replace:     false,
            templateUrl: 'views/uploader.html'
          };
        }
      ]);

    directives.directive(
      'profile', [
        function ()
        {
          return {
            restrict:    'E',
            scope:       {
              memberId: '@'
            },
            controller:  [
              '$scope',
              function ($scope)
              {
                $scope.loadMember = function (el) {}
              }
            ],
            link:        function (scope, elem, attrs, ctrl)
            {
              console.log(attrs.memberId);
            },
            replace:     false,
            templateUrl: 'views/profileTemplate.html'
          };

        }
      ]);

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
                  function () { scope.$eval(attrs.ngenter) }
                );

                event.preventDefault();
              }
            });
        };
      });
  }
);
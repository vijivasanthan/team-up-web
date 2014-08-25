define(
  ['directives/directives'],
  function (directives)
  {
    'use strict';

    // Chosen multiple selection
    directives.directive(
      'chosen',
      function ()
      {
        var linker = function (scope, element)
        {
          scope.$watch(
            'receviersList',
            function () { element.trigger('liszt:updated') }
          );

          scope.$watch(
            'message.receviers',
            function () { angular.element(element[0]).trigger('liszt:updated') }
          );

          element.chosen();
        };

        return {
          restrict: 'A',
          link: linker
        };
      }
    );

    // Upload images
    directives.directive(
      'uploader', [
        function ()
        {
          return {
            restrict: 'E',
            scope: {
              action: '@'
            },
            controller: [
              '$scope', '$rootScope', 'Session' ,
              function ($scope, $rootScope, Session)
              {
                $scope.progress = 0;
                $scope.avatar = '';
                $scope.uploadLabel = $rootScope.ui.profile.click2upload;

                var session = Session.get();

                if (session)
                {
                  $scope.sessionId = session;
                }

                $scope.sendFile = function (el)
                {
                  var $form = angular.element(el).parents('form');

                  if (angular.element(el).val() == '')
                  {
                    return false;
                  }

                  $form.attr('action', $scope.action);

                  $scope.$apply(
                    function () { $scope.progress = 0 }
                  );

                  $form.ajaxSubmit(
                    {
                      type: 'POST',
                      headers: {
                        'X-SESSION_ID': $scope.sessionId
                      },
                      uploadProgress: function (event, position, total, percentComplete)
                      {
                        $scope.$apply(
                          function () { $scope.progress = percentComplete;}
                        );
                      },
                      error: function (event, statusText, responseText, form)
                      {
                        $form.removeAttr('action');

                        console.log('response : ', responseText);
                      },
                      success: function (responseText, statusText, xhr, form)
                      {
                        var ar = angular.element(el).val().split('\\'),
                            filename = ar[ar.length - 1];

                        $form.removeAttr('action');

                        $scope.$apply(
                          function ()
                          {
                            $scope.avatar = filename;

                            console.log($scope, $scope.$parent.data.uuid);

                            if ($scope.$parent.data.clientId)
                            {
                              $scope.$parent.$root.avatarChange($scope.$parent.data.clientId);
                            }
                            else if ($scope.$parent.data.uuid)
                            {
                              $scope.$parent.$root.avatarChange($scope.$parent.data.uuid);
                            }

                            var avatarType = '';
                            var avatarTagStyle = $('.roundedPicLarge').attr('style');
                            var size = 0;
                            try
                            {
                              size = parseInt(avatarTagStyle.split('?')[1].split('&')[0].split('=')[1], 10);
                            }
                            catch (e)
                            {
                              console.log(e);
                            }

                            var newSize = parseInt(size, 10) + $scope.$parent.$root.getAvatarChangeTimes($scope.$parent.data.uuid);
                            var newStyle = avatarTagStyle.replace("width=" + size, "width=" + newSize);

                            $('.roundedPicLarge').attr('style', newStyle);
                          }
                        );
                      }
                    });
                };
              }
            ],
            link: function (scope, elem, attrs, ctrl)
            {
              elem.find('.fake-uploader').click(
                function () { elem.find('input[type="file"]').click() }
              );
            },
            replace: false,
            templateUrl: 'views/uploader.html'
          };
        }
      ]
    );

    // TODO: Check whether it is being used.
    directives.directive(
      'profile', [
        function ()
        {
          return {
            restrict: 'E',
            scope: {
              memberId: '@'
            },
            controller: [
              '$scope',
              function ($scope)
              {
                $scope.loadMember = function (el) {}
              }
            ],
            link: function (scope, elem, attrs, ctrl)
            {
              console.log('profile directive ->', attrs.memberId);
            },
            replace: false,
            templateUrl: 'views/profileTemplate.html'
          };

        }
      ]
    );

    // TODO: Is it really needed? Maybe use ng-submit
    directives.directive(
      'ngenter',
      function ()
      {
        return function (scope, element, attrs)
        {
          element.bind(
            'keydown keypress',
            function (event)
            {
              if (event.which === 13)
              {
                scope.$apply(
                  function () { scope.$eval(attrs.ngenter) }
                );

                event.preventDefault();
              }
            }
          );
        };
      }
    );

    // Setup the background image
    directives.directive(
      'backImg', function ()
      {
        return function (scope, element, attrs)
        {
          var url = attrs.backImg;
          element.css(
            {
              'background-image': 'url(' + url + ')',
              'background-size': 'cover'
            });
        };
      }
    );


    directives.directive(
      'linkIconHovered',
      function ()
      {
        return {
          link: function (scope, element, attrs)
          {
            element.parent().bind(
              'mouseenter',
              function ()
              {
                element.removeClass('icon-link');
                element.addClass('icon-link2');
              }
            );

            element.parent().bind(
              'mouseleave',
              function ()
              {
                element.removeClass('icon-link2');
                element.addClass('icon-link');
              }
            );
          }
        };
      }
    );


  }
);
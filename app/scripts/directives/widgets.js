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
            function ()
            {
              element.trigger('liszt:updated')
            }
          );

          scope.$watch(
            'message.receviers',
            function ()
            {
              angular.element(element[0]).trigger('liszt:updated')
            }
          );

          element.chosen();
        };

        return {
          restrict: 'A',
          link: linker
        };
      }
    );

    //TODO custom team switch selectbox
    directives.directive(
      'selectBox', function ()
      {
        return {
          replace: true,
          restrict: 'E',
          scope: false,
          template: function (element, attrs)
          {
            if (!angular.isDefined(attrs.defaultLabel))
            {
              attrs.defaultLabel = "";
            }



            return '<div class="selectBox selector">' +
              '<span>' + attrs.name + '</span>' +
              '<select name="' + attrs.name + '" ng-model="' + attrs.ngModel + '" ng-options="' + attrs.optexp + '"' + ((attrs.required) ? ' required' : '') + '></select>' +
              '</div>';
          },
          link: function (scope, el, attrs)
          {
            scope.$watch(attrs.ngModel, function ()
            {
              var model = scope.$eval(attrs.ngModel);
              //when value changes, update the selectBox text
              if (angular.isDefined(model) && angular.isDefined(model.name))
              {
                el[0].firstChild.innerText = model.name;
              }
            });
          }
        }
      });

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
              '$scope', '$rootScope', 'Session',
              function ($scope, $rootScope, Session)
              {
                $scope.progress = 0 + '%';
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

                  var fileUpload = angular.element(el).val(),
                      fileExtension = fileUpload.substr(fileUpload.lastIndexOf('.') + 1).toLocaleLowerCase(),
                      whiteListFileTypes = ['png', 'jpeg', 'jpg', 'gif', 'bpg', 'tiff'];

                  if(whiteListFileTypes.indexOf(fileExtension) === -1)
                  {
                    $scope.$apply(
                        function ()
                        {
                          $rootScope.notifier.error($rootScope.ui.validation.upload.fileTypeNotAloud);
                        }
                      );
                    return false;
                  }

                  $form.attr('action', $scope.action);

                  $scope.$apply(
                    function ()
                    {
                      $scope.progress = 0 + '%'
                    }
                  );

                  $form.ajaxSubmit(
                    {
                      type: 'POST',
                      headers: {
                        'X-SESSION_ID': $scope.sessionId
                      },
                      uploadProgress: function (event, position, total, percentComplete)
                      {
                        console.log('event', event);

                        $scope.$apply(
                          function ()
                          {
                            $scope.progress = percentComplete + '%';
                          }
                        );
                      },
                      error: function (event, statusText, responseText, form)
                      {
                        console.error("$scope.action error ->", $form.attr('action'));
                        $form.removeAttr('action');
                      },
                      success: function ()
                      {
                        console.error("action success ->", $form.attr('action'));
                        var ar = angular.element(el).val().split('\\'),
                          filename = ar[ar.length - 1];

                        //$form.removeAttr('action');

                        $scope.$apply(
                          function ()
                          {
                            $scope.avatar = filename;

                            var roundPicture = $('.roundedPicLarge');
                            var avatarTagStyle = roundPicture.attr('style');
                            var size = 0,
                              id,
                              type,
                              message;

                            try
                            {
                              size = parseInt(avatarTagStyle.split('?')[1].split('&')[0].split('=')[1], 10);
                            }
                            catch (e)
                            {
                              console.log(e);
                            }

                            if (angular.isDefined($scope.$parent.client))
                            {
                              id = $scope.$parent.client.uuid;
                              message = $rootScope.ui.profile.profileImgSuccessfullyUploaded;
                              type = 'client';

                            }
                            else if (angular.isDefined($scope.$parent.view))
                            {
                              id = $scope.$parent.view.uuid;
                              message = $rootScope.ui.profile.profileImgSuccessfullyUploaded;
                              type = 'team';
                            }

                            $scope.$parent.$root.avatarChange(id);
                            //empty value so the onchange will upload even the file with the same
                            angular.element(el).val("");

                            $rootScope.notifier.success(message);
                            $rootScope.showChangedAvatar(type, id);

                            var newSize = parseInt(size, 10) + $scope.$parent.$root.getAvatarChangeTimes(id);
                            var newStyle = avatarTagStyle.replace("width=" + size, "width=" + newSize);

                            roundPicture.attr('style', newStyle);
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
                function ()
                {
                  elem.find('input[type="file"]').click()
                }
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
                $scope.loadMember = function (el)
                {
                }
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

    /**
     * Focus the selected field
     */
    directives.directive(
      'focus',
      function ($timeout)
      {

        return {
          link: function (scope, element)
          {
              $timeout(function ()
              {
                element[0].autoFocus = true;
                element[0].focus();
              });
          }
        };
      }
    );

    directives.directive(
      'focusOnClick',
      function ()
      {
        return function (scope, element, attrs)
        {
          element.on('click', function ()
          {
            var focusClass = '.' + attrs.focusOnClick;

            angular.element(focusClass).focus();
          });
        };
      }
    );

    directives.directive(
      'selectAllPhones',
      function ()
      {
        return function (scope, element, attrs)
        {
          //function SelectText() {
          //  var s = window.getSelection();
          //  var referenceNode = document.getElementsByClassName(attrs.selectAllPhones);
          //  var range = document.createRange();
          //  var end = (referenceNode.length - 1);
          //
          //  if(s.rangeCount > 0)
          //  {
          //    s.removeAllRanges();
          //  }
          //  console.log('referenceNode[0]', referenceNode[0]);
          //  //range.setStart(referenceNode[0], 0);
          //  //range.setEnd(referenceNode[end], 1);
          //  //console.log('range', range);
          //  s.addRange(range);
          //};

          function SelectText(element)
          {
            var doc = document
              , text = doc.getElementById(element)
              , range, selection
              ;
            if (doc.body.createTextRange)
            {
              range = document.body.createTextRange();
              range.moveToElementText(text);
              range.select();
            }
            else if (window.getSelection)
            {
              selection = window.getSelection();
              range = document.createRange();
              range.selectNodeContents(text);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }

          element.on('click', function ()
          {
            SelectText(attrs.selectAllPhones);
          });
        };
      }
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
                  function ()
                  {
                    scope.$eval(attrs.ngenter)
                  }
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
          //			console.log(element.parent('a'));
          //			console.log('attrs-> ', attrs);
          //			console.log('attrs->backImg-> ', attrs.backImg);
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
      'checkAvailabilityTeamname',
      function (Store)
      {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attr, ngModel)
          {
            if(ngModel)//testtttrrrTT
            {
              if(! ngModel.$validators)
              {
                ngModel.$validators = {};
                ngModel.$asyncValidators = {};
                ngModel.$error = [];
              }

              ngModel.$validators.invalidTeamname = function(modelValue, viewValue)
              {
                if(viewValue)
                {
                  //check if the teamname is available
                  var teamName = viewValue.toLowerCase(),
                      teams    = Store('app').get('teams'),
                      exist = _.result(_.find(teams, function(team)
                      {
                        return team.name.toLowerCase() === teamName;
                      }), 'name');
                  //if false no errormessage is shown
                  return (exist) ? false : true;
                }
              }
            }
          }
        };
      }
    );

    directives.directive(
      'checkAvailabilityUsername',
      function (Profile, $parse, $q)
      {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attr, ngModel)
          {
            if(ngModel)
            {
              if(! ngModel.$validators)
              {
                ngModel.$validators = {};
                ngModel.$asyncValidators = {};
                ngModel.$error = [];
              }

              ngModel.$asyncValidators.invalidUsername = function(modelValue, viewValue)
              {
                if(attr.checkAvailabilityUsername && viewValue)
                {
                  var userName1 = scope['memberFieldForm1'].email,
                      userName2 = scope['memberFieldForm2'].email,
                      userName3 = scope['memberFieldForm3'].email,
                      userNames = [userName1.$viewValue, userName2.$viewValue, userName3.$viewValue],
                      deferred = $q.defer();
                  attr.checkAvailabilityUsername = parseInt(attr.checkAvailabilityUsername);

                    //get the duplicate values and remove the "" empty values
                    var duplicates = _.filter(
                      _.without(userNames, ""),
                      function (value, index, iteratee)
                      {
                        return _.includes(iteratee, value, index + 1);
                      });

                    //check the duplicates and show the error if the username already exist in the backend or
                    //create teamtelefoon team form
                    _.each(userNames, function(userNameVal, index)
                    {
                      var formIndex = (index + 1);

                      //check if username has a duplicate in the form
                      if(userNameVal === duplicates[0])
                      {
                        scope['memberFieldForm' + formIndex]
                          .email
                          .$setValidity("invalidUsername", false);
                        if(attr.checkAvailabilityUsername === formIndex) deferred.reject();
                      }
                      //if there is no duplicate in the form check if username exist in the backend
                      else if(userNameVal) //only if the username is not empty
                      {
                        Profile.userExists(userNameVal)
                               .then(function()
                                     {
                                       if(attr.checkAvailabilityUsername === formIndex)  deferred.resolve();
                                       scope['memberFieldForm' + formIndex]
                                         .email
                                         .$setValidity("invalidUsername", true);
                                     },
                                     function()
                                     {
                                       if(attr.checkAvailabilityUsername === formIndex) deferred.reject();
                                       scope['memberFieldForm' + formIndex]
                                         .email
                                         .$setValidity("invalidUsername", false);
                                     });
                      }
                    });
                    return deferred.promise;
                }
              }
            }
          }
        };
      }
    );


    directives.directive(
      'linkIconHovered',
      function ()
      {
        return {
          link: function (scope, element)
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

    directives.directive(
      'dragEnterLeave',
      function ()
      {
        return {
          link: function (scope, element, attrs)
          {
            var className = attrs.dragEnterLeave,
              defaultText = element.text();

            element.bind(
              'dragenter',
              function ()
              {
                element
                  .addClass(className)
                  .text('Drop de spreadsheet.');
              }
            );
            element.bind(
              'dragleave',
              function ()
              {
                element
                  .removeClass(className)
                  .text(defaultText);
              }
            );
          }
        };
      }
    );

    directives.directive(
      'setPositionSlotForm',
      function ($window)
      {
        return {
          restrict: 'A',
          link: function (scope, element, attrs)
          {
            element.bind(
              'mouseup',
              function (ev)
              {
                var footer = angular.element('#footer').height(),
                  form = angular.element('.time-slot-form'),
                  modal = form.height(),
                  slot = 105,

                  minNeededHeight = (modal + slot),
                  clickY = (ev.clientY + $window.pageYOffset),//(current view y + scroll top height)
                  heightToBottom = ($window.outerHeight - clickY) + minNeededHeight,
                  position = (minNeededHeight > ev.clientY)
                    ? clickY
                    : (clickY - minNeededHeight);

                //TODO FIx position bottom
                //The height needed for the modal is less then the height in the current view
                form.css('top', position + 'px');
              }
            );
          }
        };
      }
    );

    directives.directive(
      'dynamic',
      function ($compile)
      {
        return function (scope, element, attrs)
        {
          console.log('attrs', attrs.dynamicType);

          var ensureCompileRunsOnce = scope.$watch(
            function (scope)
            {
              return scope.$eval(attrs.dynamic);
            },
            function (value)
            {
              console.log('value', value);
              element.html(value);
              $compile(element.contents())(scope);

              ensureCompileRunsOnce();
            });
        };
      }
    );

    //directives.directive(
    //  'hideTeamTelephoneTabs',
    //  function ()
    //  {
    //    return {
    //      restrict: 'A',
    //      link: function (scope, element, attrs)
    //      {
    //        var tabsParent = angular.element('li:not(:last)', element);
    //
    //        if (attrs.hideTeamTelephoneTabs)
    //        {
    //          tabsParent.addClass('ng-hide');
    //        }
    //        else
    //        {
    //          tabsParent.removeClass('ng-hide');
    //        }
    //      }
    //    };
    //  }
    //);

    directives.directive(
      'showHideOnRole',
      function ($rootScope)
      {
        //
        return {
          restrict: 'A',
          link: function (scope, element)
          {
            if(! element.hasClass('ng-hide')
              && (! $rootScope.app.domainPermission.teamSelfManagement
              || $rootScope.app.resources.role > 1))
            {
              element.addClass('ng-hide');
            }
          }
        };
      }
    );

    directives.directive(
      'requiredForm',
      function ()
      {
        return {
          restrict: 'A', // only for attributes
          compile: function(element) {
            // insert asterisk after elment
            element.after("<span class='required'>*</span>");
          }
        };
      }
    );

    directives.directive(
      'requiredFormOneLine',
      function ()
      {
        return {
          restrict: 'A', // only for attributes
          compile: function(element) {
            // insert asterisk after elment
            element.after("<span class='required required-small'>*</span>");
          }
        };
      }
    );

    directives.directive(
      'inputRuleToggle',
      function ()
      {
        return {
          restrict: 'A',
          link: function (scope, element, attrs)
          {
            var index = attrs.inputRuleToggle,
              parentFormGroup = element
                .parents('.form-group');

            element.bind('click',
              function ()
              {
                if (element.hasClass('add-button'))
                {
                  parentFormGroup.next()
                    .removeClass('ng-hide')
                    .find('input')
                    .focus();
                }
                else if (element.hasClass('remove-button'))
                {
                  //empty current input value
                  parentFormGroup
                    .addClass('ng-hide')
                    .find('input')
                    .val('');

                  //empty error message
                  parentFormGroup
                    .find('.text-danger small i')
                    .text('');

                  //focus on previous input
                  var prevElement = angular.element(parentFormGroup[0].previousElementSibling);
                  prevElement
                    .find('input')
                    .focus();

                  //empty model scope value
                  if (scope.edit.phoneNumbers[index])
                  {
                    scope.edit.phoneNumbers.splice(index, 1);
                    scope.parsedPhoneNumbers[index] = {};
                  }
                }
              }
            );
          }
        };
      }
    );

    //TODO use this one for date (difference in view and model)
    directives.directive(
      'formattedDate',
      function ($filter)
      {
        return {
          link: function (scope, element, attrs, ctrl)
          {
            ctrl.$formatters.unshift(
              function (modelValue)
              {
                return $filter('date')(modelValue, 'dd-MM-yyyy');
              }
            );

            ctrl.$parsers.unshift(
              function (viewValue)
              {
                return $filter('date')(viewValue, 'dd-MM-yyyy');
              }
            );
          },
          restrict: 'A',
          require: 'ngModel'
        }
      }
    );

    directives.directive(
      'currentSelection',
      function (CurrentSelection)
      {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attrs, ngModel)
          {
            var id = null;

            switch (attrs.currentSelection)
            {
              case "team":
                id = CurrentSelection.getTeamId();
                break;
              case "client":
                id = CurrentSelection.getClientGroupId();
                break;
              default:
                console.log("No current selection");
            }

            ngModel.$setViewValue(id);

            ngModel.$viewChangeListeners.push(
              function ()
              {
                CurrentSelection.local = ngModel.$viewValue;
              }
            );
          }
        }
      }
    );


    //directives.directive(
    //  'scroll',
    //  function($window)
    //  {
    //    return function(scope, element, attrs) {
    //      angular.element($window).bind("scroll", function()
    //      {
    //        //scope.currentScroll(this.pageYOffset);
    //        //scope.$apply();
    //      });
    //    };
    //  }
    //);
  }
);

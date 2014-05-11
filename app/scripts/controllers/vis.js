define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'vis',
      [
        '$rootScope', '$scope',
        function ($rootScope, $scope)
        {


          // $rootScope.fixStyles();


          function resetViews ()
          {
            $scope.views = {
              teams:  false,
              clients: false
            };
          }

          var setView = function (hash)
          {
            resetViews();

            $scope.views[hash] = true;
          };

          $scope.setViewTo = function (hash)
          {
            $scope.$watch(
              hash, function ()
              {
                $location.hash(hash);

                setView(hash);
              });
          };

          setView('teams');



          $scope.items = {
            team_1: [
              {id: 1, content: 'item 1', start: '2014-05-20'},
              {id: 2, content: 'item 2', start: '2014-05-20'}
            ],
            team_2: [
              {id: 3, content: 'item 3', start: '2014-05-18'},
              {id: 4, content: 'item 4', start: '2014-05-16', end: '2014-05-19'}
            ],
            team_3: [
              {id: 5, content: 'item 5', start: '2014-05-25'},
              {id: 6, content: 'item 6', start: '2014-05-27'}
            ]
          };


          var debug = false;


          $scope.simplifyItems = function (items)
          {
            var simplified = [];

            angular.forEach(
              items,
              function (group, label)
              {
                angular.forEach(
                  group,
                  function (item)
                  {
                    item.group = label;

                    simplified.push(item);
                  });
              }
            );

            return simplified;
          };

          /**
           * Timeline stuff
           */
          $scope.timeline = {

            select: function (selected)
            {
              if (debug)
              {
                console.log('selected items: ', selected.items);
              }

              var items = $scope.simplifyItems($scope.items);

              var format = 'YYYY-MM-DDTHH:mm';

              angular.forEach(
                items,
                function (item)
                {
                  if (item.id == selected.items[0])
                  {
                    $scope.slot = {
                      id:      item.id,
                      start:   moment(item.start).format(format),
                      end: (item.end) ? moment(item.end).format(format) : null,
                      content: item.content
                    };

                    $scope.$apply();
                  }
                }
              );
            },

            range: {},

            rangeChange: function (period)
            {
              this.range = $scope.timeline.getWindow();

              if (! $scope.$$phase)
              {
                $scope.$apply();
              }

              if (debug)
              {
                console.log(
                  'rangeChange: start-> ',
                  period.start, ' end-> ', period.end);
              }
            },

            rangeChanged: function (period)
            {
              if (debug)
              {
                console.log(
                  'rangeChange(d): start-> ',
                  period.start, ' end-> ', period.end);
              }
            },

            customTime: null,

            timeChange: function (period)
            {
              if (debug)
              {
                console.log('timeChange: ', period.time);
              }

              $scope.$apply(
                function ()
                {
                  $scope.timeline.customTime = period.time;
                }
              );
            },

            timeChanged: function (period)
            {
              if (debug)
              {
                console.log('timeChange(d): ', period.time);
              }
            },

            slot: {
              add: function (item, callback)
              {
                item.content = prompt('Enter text content for new item:', item.content);

                if (item.content != null)
                {
                  callback(item); // send back adjusted new item
                }
                else
                {
                  callback(null); // cancel item creation
                }
              },

              move: function (item, callback)
              {
                if (confirm(
                    'Do you really want to move the item to\n' +
                    'start: ' + item.start + '\n' +
                    'end: ' + item.end + '?'))
                {
                  callback(item); // send back item as confirmation (can be changed
                }
                else
                {
                  callback(null); // cancel editing item
                }
              },

              update: function (item, callback)
              {
                item.content = prompt('Edit items text:', item.content);

                if (item.content != null)
                {
                  callback(item); // send back adjusted item
                }
                else
                {
                  callback(null); // cancel updating the item
                }
              },

              remove: function (item, callback)
              {
                if (confirm('Remove item ' + item.content + '?'))
                {
                  callback(item); // confirm deletion
                }
                else
                {
                  callback(null); // cancel deletion
                }
              }
            }
          };

          $scope.getCustomTime = function ()
          {
            $scope.gotCustomDate = $scope.timeline.getCustomTime();
          };

          $scope.getSelection = function ()
          {
            $scope.gotSelection = $scope.timeline.getSelection();
          };

          $scope.setSelection = function (selection)
          {
            selection = (angular.isArray(selection)) ? selection : [].concat(selection);

            $scope.timeline.setSelection(selection);
          };

          $scope.getWindow = function ()
          {
            $scope.gotWindow = $scope.timeline.getWindow();
          };

          $scope.setWindow = function (start, end)
          {
            $scope.timeline.setScope('custom');

            $scope.timeline.setWindow(start, end);
          };

          $scope.setOptions = function (options)
          {
            $scope.timeline.setOptions(options);
          };





        }
      ]
    );
  }
);
/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.TreeGrid', [])


  .controller('treegrid',
    [
      '$rootScope', '$scope', '$window',
      function ($rootScope, $scope, $window)
      {

        /**
         * TreeGrid
         */
        $scope.treegrid = {

          /**
           * Options
           */
          options: {
            grid: {
              width: 'auto',
              height: null,
              items: {
                minHeight: 50
              }
            }
          },

          stores: {},

          /**
           * Calculate height of available area
           */
          calcHeight: function ()
          {
            this.options.grid.height = $('#wrap').height() - (270 + 200) + 'px'
          },


          /**
           * Build TreeGrid
           */
          build: function (id, data, options)
          {
            var TreeGrid  = new links.TreeGrid(id, this.options.grid);

            TreeGrid.draw(this.store(id, data, options));
          },

          store: function (id, data, options)
          {
            this.stores[id] = new links.DataTable(data, options);

            // Implement event triggers

            return this.stores[id];
          },

          /**
           * Init TreeGrid
           */
          init: function (grid)
          {
            /**
             * Calculate the height
             */
            this.calcHeight();

            /**
             * Processed
             */
            $scope.processed = {
              left:  [],
              right: []
            };

            /**
             * Populate left side
             */
            angular.forEach($scope.data.left, function (left)
            {
              $scope.processed.left.push({
                name: left.name,
                _id:  left._id,
                _actions: [
                  {
                    'event': 'remove'
                  }
                ]
              });
            });

            /**
             * Populate right side
             */
            angular.forEach($scope.data.right, function (right)
            {
              $scope.processed.right.push({
                name: 	  right.name,
                clients: 	new links.DataTable([], {
                  showHeader: false,
                  dataTransfer : {
                    allowedEffect: 	'move',
                    dropEffect: 		'move'
                  }

                }),
                _id: right.id
              });
           });



            var data = {
              /**
               * Left column
               */
              left: {
                content: $scope.processed.left,
                options: {
                  columns: [
                    {
                      name: 'name', text: 'Name', title: 'Name'
                    }
                  ],
                  showHeader: false,
                  dataTransfer: {
                    allowedEffect: 	'move',
                    dropEffect: 		'move'
                  }
                }
              },
              /**
               * Right column
               */
              right: {
                content: $scope.processed.right,
                options: {
                  showHeader: false,
                  dataTransfer : {
                    allowedEffect: 	'move',
                    dropEffect: 		'move'
                  }
                }
              }
            };


            /**
             * Build left part of TreeGrid
             */
            this.build(
              document.getElementById(grid + '-left'),
              data.left.content,
              data.left.options
            );

            /**
             * Build right part of TreeGrid
             */
            this.build(
              document.getElementById(grid + '-right'),
              data.right.content,
              data.right.options
            );
          }

        };


        /**
         * TreeGrid manager listener
         */
        $rootScope.$on('manager', function ()
        {
          var grid  = arguments[1];

          /**
           * Draw TreeGrid
           */
          setTimeout(function ()
          {
            $scope.treegrid.init(grid);
          }, 1);
        });


        /**
         * Attach listener for window resizing
         */
        $window.onresize = function ()
        {
          $scope.treegrid.init();
        };

      }
    ]);
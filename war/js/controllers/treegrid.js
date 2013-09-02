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
                minHeight: 40
              }
            }
          },

          /**
           * Calculate height of available area
           */
          calcHeight: function ()
          {
            this.options.grid.height = $('#wrap').height() - (270 + 200) + 'px'
          },


          /**
           * Remove trigger
           */
          onRemove: function (params)
          {
            var item = (params && params.items) ? params.items[0] : undefined;

            if (item)
            {
              console.log('params ->', item._description);
            }
          },


          /**
           * Build TreeGrid
           */
          build: function (id, data, options)
          {

            /**
             * Initializers
             */
            var TreeGrid  = new links.TreeGrid(id, this.options.grid),
                DataTable = new links.DataTable(data, options);

            /**
             * Draw TreeGrid
             */
            TreeGrid.draw(DataTable);

            /**
             * Add some listeners
             */
            links.events.addListener(DataTable, 'remove', function (params)
            {
              alert('params ->', params);
            });

            links.events.addListener(DataTable, 'change', function ()
            {
              console.log('changed stuff --->', DataTable);
            });

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
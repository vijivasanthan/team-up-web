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
                // defaultHeight: 46,
                minHeight: 32
              }
            },
            parts: {
              left: document.getElementById('left'),
              right: document.getElementById('right')
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
           * Build TreeGrid
           */
          build: function (id, data, options)
          {
            this.self = new links.TreeGrid(id, this.options.grid);
            this.self.draw(new links.DataTable(data, options));
          },

          /**
           * Init TreeGrid
           */
          init: function ()
          {
            this.calcHeight();

            this.build(
              this.options.parts.left,
              $scope.files,
              {
                columns: [
                  {name: 'name', text: 'Name', title: 'Name of the files'},
                  {name: 'size', text: 'Size', title: 'Size of the files in kB (kilo bytes)'},
                  {name: 'date', text: 'Date', title: 'Date the file is last updated'}
                ],
                dataTransfer: {
                  allowedEffect: 	'move',
                  dropEffect: 		'none'
                }
              }
            );

            this.build(
              this.options.parts.right,
              $scope.folders,
              {
                dataTransfer : {
                  allowedEffect: 	'move',
                  dropEffect: 		'move'
                }
              }
            );
          }

        };


        /**
         * Draw TreeGrid
         */
        setTimeout(function ()
        {
          $scope.treegrid.init();
        }, 100);


        /**
         * Attach listener for window resizing
         */
        $window.onresize = function ()
        {
          $scope.treegrid.init();
        };

      }
    ]);
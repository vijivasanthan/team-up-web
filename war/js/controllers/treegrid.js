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
           * Data being passed to TreeGrid
           */
          data: $scope.treegrid.data,

          /**
           * Options
           */
          options: {
            grid: {
              width: 'auto',
              height: null,
              items: {
                // defaultHeight: 46,
                minHeight: 40
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
              this.data.left.content,
              this.data.left.options
            );

            this.build(
              this.options.parts.right,
              this.data.right.content,
              this.data.right.options
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
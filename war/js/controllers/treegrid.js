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
            width: 'auto',
            height: $('#wrap').height() - (270 + 200) + 'px'
          },

          /**
           * Build TreeGrid
           */
          build: function (id, data, options)
          {
            new links.TreeGrid(id, this.options)
              .draw(new links.DataTable(data, options));
          },

          /**
           * Init TreeGrid
           */
          init: function ()
          {
            this.build(
              document.getElementById('left'),
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
              document.getElementById('right'),
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
         * Draw treegrid
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
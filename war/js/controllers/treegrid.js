/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.TreeGrid', [])


  .controller('treegrid',
    [
      '$rootScope', '$scope', '$window',
      function ($rootScope, $scope, $window)
      {


        function drawGrid()
        {
          var treeGridOptions = {
              width: 'auto',
              height: $('#wrap').height() - (270 + 200) + 'px'
            },
            filesContainer 	= document.getElementById('files'),
            filesOptions 		= {
              columns: [
                {name: 'name', text: 'Name', title: 'Name of the files'},
                {name: 'size', text: 'Size', title: 'Size of the files in kB (kilo bytes)'},
                {name: 'date', text: 'Date', title: 'Date the file is last updated'}
              ],
              dataTransfer: {
                allowedEffect: 	'move',
                dropEffect: 		'none'
              }
            },
            filesTreeGrid 			= new links.TreeGrid(filesContainer, treeGridOptions),
            filesDataConnector 	= new links.DataTable($scope.files, filesOptions),
            foldersOptions = {},
            foldersOptions = {
              dataTransfer : {
                allowedEffect: 	'move',
                dropEffect: 		'move'
              }
            },
            foldersContainer 			= document.getElementById('folders'),
            foldersDataConnector 	= new links.DataTable($scope.folders, foldersOptions),
            foldersTreeGrid 			= new links.TreeGrid(foldersContainer, treeGridOptions);

          filesTreeGrid.draw(filesDataConnector);
          foldersTreeGrid.draw(foldersDataConnector);
        }




        $window.onresize = function () { drawGrid(); };


        setTimeout(function ()
        {
          drawGrid();
        }, 100);



      }
    ]);
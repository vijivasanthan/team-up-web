/*jslint node: true */
/*global angular */
'use strict';







angular.module('WebPaige.Controllers.Manage', [])

/**
 * Groups controller
 */
.controller('manageCtrl',[
    '$rootScope', '$scope', '$location', 'Clients','data', '$route', '$routeParams', 'Storage','Teams', '$window',
    function ($rootScope, $scope, $location, Clients, data, $route, $routeParams, Storage , Teams, $window){


      /**
       * View setter
       */
      function setView (hash)
      {
        $scope.views = {
          teamClients:  false,
          teams:        false,
          clients:      false
        };

        $scope.views[hash] = true;
      }


      /**
       * Switch between the views and set hash accordingly
       */
      $scope.setViewTo = function (hash)
      {
        $scope.$watch(hash, function ()
        {
          $location.hash(hash);

          setView(hash);
        });
      };

      $scope.setViewTo('teamClients');










      function drawGrid()
      {
        var files = [];

        for (var i=0; i<50; i++)
        {
          files.push({
            name: 'File ' + i,
            size: (Math.round(Math.random() * 50) * 10 + 100) + ' kB',
            date: (new Date()).toDateString(),
            _id: 	i
          });
        }

        var folders = [],
          chars 	= 'ABCDE';

        for (var i in chars)
        {
          var c = chars[i],
            options = {
              dataTransfer : {
                allowedEffect: 	'move',
                dropEffect: 		'move'
              }
            },
            dataConnector = new links.DataTable([], options),
            item = {
              name: 	'Folder ' + c,
              files: 	dataConnector,
              _id: 		c
            };
          folders.push(item);
        }

        folders.push({name: 'File X', _id: 'X'});
        folders.push({name: 'File Y', _id: 'Y'});
        folders.push({name: 'File Z', _id: 'Z'});




        var filesData = [{"name":"File 0","size":"310 kB","date":"Mon May 27 2013","_id":0},{"name":"File 1","size":"250 kB","date":"Mon May 27 2013","_id":1},{"name":"File 2","size":"390 kB","date":"Mon May 27 2013","_id":2},{"name":"File 3","size":"280 kB","date":"Mon May 27 2013","_id":3},{"name":"File 4","size":"220 kB","date":"Mon May 27 2013","_id":4},{"name":"File 5","size":"560 kB","date":"Mon May 27 2013","_id":5},{"name":"File 6","size":"560 kB","date":"Mon May 27 2013","_id":6},{"name":"File 7","size":"560 kB","date":"Mon May 27 2013","_id":7},{"name":"File 8","size":"500 kB","date":"Mon May 27 2013","_id":8},{"name":"File 9","size":"550 kB","date":"Mon May 27 2013","_id":9},{"name":"File 10","size":"240 kB","date":"Mon May 27 2013","_id":10},{"name":"File 11","size":"130 kB","date":"Mon May 27 2013","_id":11},{"name":"File 12","size":"110 kB","date":"Mon May 27 2013","_id":12},{"name":"File 13","size":"590 kB","date":"Mon May 27 2013","_id":13},{"name":"File 14","size":"580 kB","date":"Mon May 27 2013","_id":14},{"name":"File 15","size":"150 kB","date":"Mon May 27 2013","_id":15},{"name":"File 16","size":"300 kB","date":"Mon May 27 2013","_id":16},{"name":"File 17","size":"160 kB","date":"Mon May 27 2013","_id":17},{"name":"File 18","size":"340 kB","date":"Mon May 27 2013","_id":18},{"name":"File 19","size":"320 kB","date":"Mon May 27 2013","_id":19},{"name":"File 20","size":"410 kB","date":"Mon May 27 2013","_id":20},{"name":"File 21","size":"140 kB","date":"Mon May 27 2013","_id":21},{"name":"File 22","size":"290 kB","date":"Mon May 27 2013","_id":22},{"name":"File 23","size":"550 kB","date":"Mon May 27 2013","_id":23},{"name":"File 24","size":"120 kB","date":"Mon May 27 2013","_id":24},{"name":"File 25","size":"300 kB","date":"Mon May 27 2013","_id":25},{"name":"File 26","size":"130 kB","date":"Mon May 27 2013","_id":26},{"name":"File 27","size":"470 kB","date":"Mon May 27 2013","_id":27},{"name":"File 28","size":"580 kB","date":"Mon May 27 2013","_id":28},{"name":"File 29","size":"530 kB","date":"Mon May 27 2013","_id":29},{"name":"File 30","size":"600 kB","date":"Mon May 27 2013","_id":30},{"name":"File 31","size":"210 kB","date":"Mon May 27 2013","_id":31},{"name":"File 32","size":"200 kB","date":"Mon May 27 2013","_id":32},{"name":"File 33","size":"300 kB","date":"Mon May 27 2013","_id":33},{"name":"File 34","size":"580 kB","date":"Mon May 27 2013","_id":34},{"name":"File 35","size":"130 kB","date":"Mon May 27 2013","_id":35},{"name":"File 36","size":"290 kB","date":"Mon May 27 2013","_id":36},{"name":"File 37","size":"450 kB","date":"Mon May 27 2013","_id":37},{"name":"File 38","size":"400 kB","date":"Mon May 27 2013","_id":38},{"name":"File 39","size":"430 kB","date":"Mon May 27 2013","_id":39},{"name":"File 40","size":"160 kB","date":"Mon May 27 2013","_id":40},{"name":"File 41","size":"530 kB","date":"Mon May 27 2013","_id":41},{"name":"File 42","size":"220 kB","date":"Mon May 27 2013","_id":42},{"name":"File 43","size":"520 kB","date":"Mon May 27 2013","_id":43},{"name":"File 44","size":"520 kB","date":"Mon May 27 2013","_id":44},{"name":"File 45","size":"320 kB","date":"Mon May 27 2013","_id":45},{"name":"File 46","size":"420 kB","date":"Mon May 27 2013","_id":46},{"name":"File 47","size":"530 kB","date":"Mon May 27 2013","_id":47},{"name":"File 48","size":"330 kB","date":"Mon May 27 2013","_id":48},{"name":"File 49","size":"220 kB","date":"Mon May 27 2013","_id":49}];

        var foldersData = [{"name":"Folder A","files":{"data":[],"options":{"dataTransfer":{"allowedEffect":"move","dropEffect":"move"}},"filteredData":[]},"_id":"A"},{"name":"Folder B","files":{"data":[],"options":{"dataTransfer":{"allowedEffect":"move","dropEffect":"move"}},"filteredData":[]},"_id":"B"},{"name":"Folder C","files":{"data":[],"options":{"dataTransfer":{"allowedEffect":"move","dropEffect":"move"}},"filteredData":[]},"_id":"C"},{"name":"Folder D","files":{"data":[],"options":{"dataTransfer":{"allowedEffect":"move","dropEffect":"move"}},"filteredData":[]},"_id":"D"},{"name":"Folder E","files":{"data":[],"options":{"dataTransfer":{"allowedEffect":"move","dropEffect":"move"}},"filteredData":[]},"_id":"E"}];




        var treeGridOptions = {
            width: 	$('#groupsManagerTab .row-fluid .span6').width() + 'px',
            height: $('#wrap').height() - (270 + 135) + 'px',
            // items: {
            // 	defaultHeight: 38
            // }
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
        // filesDataConnector 	= new links.DataTable(angular.fromJson(filesData), filesOptions),
          filesDataConnector 	= new links.DataTable(files, filesOptions),
        // folder options
          foldersOptions = {},
          foldersOptions = {
            dataTransfer : {
              allowedEffect: 	'move',
              dropEffect: 		'move'
            }
          },
          foldersContainer 			= document.getElementById('folders'),
        // foldersDataConnector 	= new links.DataTable(angular.fromJson(foldersData), foldersOptions),
          foldersDataConnector 	= new links.DataTable(folders, foldersOptions),
          foldersTreeGrid 			= new links.TreeGrid(foldersContainer, treeGridOptions);

        /*
         filesDataConnector.setFilters([{
         field: 'size',
         order: 'ASC'
         //startValue: '300 kB',
         //endValue: 	'500 kB',
         }]);
         */


        console.log('files Connector ->', filesDataConnector);
        console.log('folders Connector ->', foldersDataConnector);

        filesTreeGrid.draw(filesDataConnector);
        foldersTreeGrid.draw(foldersDataConnector);
      }




      $window.onresize = function () { drawGrid(); };


      drawGrid();


      /**
       * Groups Manager
       */
      $scope.groupsManager = function ()
      {
        $location.search({});

        var filesTreeGrid,
          foldersTreeGrid;

        setTimeout(function ()
        {
          drawGrid();
        }, 100);
      }












        
    }
    
]);



















/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Manage', [])

/**
 * Groups controller
 */
.controller('manageCtrl',[
    '$rootScope', '$scope', '$location', 'Clients','data', '$route', '$routeParams', 'Storage', 'Teams', '$window',
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


      /**
       * Populate sample data for treegrid
       */
      $scope.files = [];

      for (var i=0; i<50; i++)
      {
        $scope.files.push({
          name: 'File ' + i,
          size: (Math.round(Math.random() * 50) * 10 + 100) + ' kB',
          date: (new Date()).toDateString(),
          _id: 	i
        });
      }



      $scope.folders = [];

      var chars 	= 'ABCDE';

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
        $scope.folders.push(item);
      }

      $scope.folders.push({name: 'File X', _id: 'X'});
      $scope.folders.push({name: 'File Y', _id: 'Y'});
      $scope.folders.push({name: 'File Z', _id: 'Z'});

        
    }
    
]);



















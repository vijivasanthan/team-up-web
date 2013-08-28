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
       * Define data sources
       * These sources should be populated from modals
       */
      var data = {

        /**
         * Members
         */
        members: [
          {
            id:   1,
            name: 'Cengiz Ulusoy'
          },
          {
            id:   2,
            name: 'Leonie van Dinten'
          },
          {
            id:   3,
            name: 'Michael Jan Kun'
          }
        ],

        /**
         * Teams
         */
        teams: [
          {
            id:   1,
            name: 'Verpleegkundigen Rotterdam'
          },
          {
            id:   2,
            name: 'Thuiszorgers'
          },
          {
            id:   3,
            name: 'Groep Schiedam'
          }],

        /**
         * Clients
         */
        clients: [
          {
            id:   1,
            name: 'Gerda Bloom'
          },
          {
            id:   2,
            name: 'Arjan Smit'
          },
          {
            id:   3,
            name: 'Johan Pieters'
          }
        ],

        /**
         * Groups
         */
        groups: [
          {
            id:   1,
            name: 'Erasmus Ziekenhuis'
          },
          {
            id:   2,
            name: 'Delfshaven Bejaardenhuis'
          },
          {
            id:   3,
            name: 'Schiedam Senioren'
          }
        ]
      };


      /**
       * Processed
       */
      var processed = {
        left:  [],
        right: []
      };


      /**
       * Populate clients
       */
      angular.forEach(data.clients, function (client)
      {
        processed.left.push({
          name: client.name,
          _id:  client._id,
          _actions: [
            /*
            {
              'event': 'edit'
            }
            */
          ]
        });
      });


      /**
       * Populate groups
       */
      angular.forEach(data.groups, function (group)
      {
        processed.right.push({
          name: 	group.name,
          clients: 	new links.DataTable([], {
            dataTransfer : {
              allowedEffect: 	'move',
              dropEffect: 		'move'
            }
          }),
          _id: group.id
        });
      });


      /**
       * TreeGrid data constructor
       */
      $scope.treegrid = {
        data: {
          /**
           * Left column
           */
          left: {
            content: processed.left,
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
            content: processed.right,
            options: {
              dataTransfer : {
                allowedEffect: 	'move',
                dropEffect: 		'move'
              }
            }
          }
        }
      }

        
    }
    
]);



















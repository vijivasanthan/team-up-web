/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Manage', [])

/**
 * Groups controller
 */
.controller('manageCtrl',[
    '$rootScope', '$scope', '$location', 'Clients', '$route', '$routeParams', 'Storage', 'Teams', '$window',
    function ($rootScope, $scope, $location, Clients, $route, $routeParams, Storage , Teams, $window){


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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
        ]
      };

      
      // start to populate data from storage 
      if(typeof data.teams == 'undefined'){
          
      }
    
      if(typeof data.clientGroups == 'undefined'){
          
      }




      $scope.data = {
        left: [],
        right: []
      };






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

          $scope.manage(hash);

        });
      };

      $scope.setViewTo('teamClients');




      $scope.manage = function (grid)
      {
        switch (grid)
        {
          case 'teamClients':
            $scope.data = {
              left: data.groups,
              right: data.teams
            };
            break;

          case 'teams':
            $scope.data = {
              left: data.members,
              right: data.teams
            };
            break;

          case 'clients':
            $scope.data = {
              left: data.clients,
              right: data.groups
            };
            break;
        }


        $rootScope.$broadcast('manager', grid);


      };

    }
    
]);



















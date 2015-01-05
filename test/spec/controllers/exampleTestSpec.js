define(
  [ // The following items should always be loaded
    'angular-mocks', // app and angular-mocks both require angular,
    'app',           // so no need to load angular
    // Add all needed test files below
    'controllers/exampleTest'
  ],
  function() {
    'use strict';

    // You can have multiple describe functions, each with its own tests
    describe('Example Test Controller', function () {

      // Current structure uses one module per category,
      // on which the controllers/directives/services/filters are bound.
      // These are defined and loaded in app.js
      beforeEach(module('controllers'));

      var exampleCtrl, scope;

      // Initialize the controller and a mock scope
      beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        exampleCtrl = $controller('exampleTestCtrl', {
          $scope: scope
        });
      }));

      it('should assign a string to the scope', function () {
        expect(scope.exampleTestString).toBe('Controller testing works!');
      });

    });
  }
);
define(
  [ // The following items should always be loaded
    'angular-mocks', // app and angular-mocks both require angular,
    'app',           // so no need to load angular
    // Add all needed test files below
    'controllers/exampleTest',
    'modals/testModal'
  ],
  function() {
    'use strict';

    // You can have multiple describe functions, each with its own tests
    describe('Example Test Controller', function () {

      // Current structure uses one module per category,
      // on which the controllers/directives/services/filters are bound.
      // These are defined and loaded in app.js
      beforeEach(
        module(
          'controllers',
          'services',
          'ngResource'
        )
      );

      var exampleCtrl,
          rootScope,
          scope,
          testModal,
          $q,
          $resource,
          $httpBackend;

      // Initialize the controller and a mock scope
      beforeEach(
        inject
        (
          function (
            $controller,
            $rootScope,
            _TestModal_,
            _$q_,
            _$resource_,
            _$httpBackend_
          )
          {
            scope = $rootScope.$new();
            exampleCtrl = $controller('exampleTestCtrl', {
              $scope: scope
            });
            rootScope = $rootScope;
            testModal = _TestModal_;
            $q = _$q_;
            $resource = _$resource_;
            $httpBackend = _$httpBackend_;
          }
        )
      );

      it('should assign a string to the scope', function () {
        expect(scope.exampleTestString).toBe('Controller testing works');
      });

      it('should check if the password is strong enough', function () {
        scope.passWord = 'dasd2135';
        scope.testLengthPassword();

        expect(scope.strength).toBe('strong');
      });

      it('should check if there is a permissionprofile', function () {
        var promise = testModal.getPermissionProfile(),
            jsonResponse  = {
              clientReports: true,
              clients: true,
              tasks: true,
              teamTelephone: true,
              teams: true
            },
            result = null;

        $httpBackend
            .whenGET('http://dev.ask-cs.com/acl')
            .respond(jsonResponse);

        promise.then(
            function(permissionData)
            {
              result = permissionData;
            },
            function(reason)
            {
              result = reason;
            }
          );

        $httpBackend.flush();

        expect(result.teamTelephone).toBe(true);
      });
    });
  }
);
define(
  [ // The following items should always be loaded
    'angular-mocks', // app and angular-mocks both require angular,
    'app',           // so no need to load angular
    // Add all needed test files below
    'controllers/profile',
    'modals/testModal',
    'modals/profile',
    'modals/slots',
    'services/dater',
    'services/store',
    'services/sloter',
    'services/stats',
    'services/teams',
    'services/teamup',
    'services/md5',
    'services/pincode',
    'daterangepicker',
  ],
  function() {
    'use strict';

    // You can have multiple describe functions, each with its own tests
    describe('Profile Controller', function () {

      // Current structure uses one module per category,
      // on which the controllers/directives/services/filters are bound.
      // These are defined and loaded in app.js
      beforeEach(
        module(
          'controllers',
          'services',
          'ngResource',
          'ngRoute'
        )
      );

      afterEach(inject(function($httpBackend)
      {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      }));

      var exampleCtrl,
          rootScope,
          scope,
          route,
          testModal,
          $q,
          $resource,
          $httpBackend,
          profile,
          data,
          pincode;

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
            _$httpBackend_,
            _$route_,
            _Profile_,
            _Pincode_
          )
          {
            rootScope = $rootScope;
            scope = rootScope.$new();
            data = {
              "uuid": "henkie",
              "birthDate": 0
            };
            exampleCtrl = $controller('profileCtrl', {
              $rootScope: rootScope,
              $scope: scope,
              data: data
            });
            route = _$route_;
            testModal = _TestModal_;
            $q = _$q_;
            $resource = _$resource_;
            $httpBackend = _$httpBackend_;
            profile = _Profile_;
            pincode = _Pincode_
          }
        )
      );

      it('Should check if there is userData', function () {
        scope.view = data;

        expect(scope.view).toBe(data);
      });

      //it("Should check if the logged user can't create a new member with the same teamlid-code",
      //  function()
      //  {
      //    var result = null,
      //        userId = 'henkie',
      //        pincode = 8701,
      //        currentUser = true;
      //        //expectedResult = 'pincode not found';
      //
      //    $httpBackend.expect(
      //      'GET',
      //      'http://dev.ask-cs.com/node/' + userId + '/pincode_exists' +
      //       '?pincode=' + pincode + '&returnExistsWhenAssignedToUuid=' + currentUser,
      //      null
      //    ).respond(409);
      //
      //    profile
      //      .pincodeExists(userId, pincode, currentUser)
      //      .then(
      //      function(checkResult)
      //      {
      //        result = checkResult;
      //      },
      //      function(error)
      //      {
      //        result = error;
      //      }
      //    );
      //
      //    $httpBackend.flush();
      //    expect(result).toBe(false);
      //  }
      //);
    });
  }
);
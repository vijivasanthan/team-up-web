define(
  [
    'angular-mocks',
    'app',
    'modals/profile'
  ],
  function()
  {
    'use strict';

    describe('Profile Modal',
      function ()
      {
        beforeEach(
          module(
            'services',
            'ngResource'
          ));

        afterEach(inject(function($httpBackend)
        {
          $httpBackend.verifyNoOutstandingExpectation();
          $httpBackend.verifyNoOutstandingRequest();
        }));

        var profileModal,
          rootScope,
          userId;

        beforeEach(
          inject
          (
            function (
              _profile_,
              _$q_,
              _$resource_,
              _$httpBackend_
            )
            {
              profileModal = _profile_;
              $q = _$q_;
              $resource = _$resource_;
              $httpBackend = _$httpBackend_;
              rootScope = $rootScope;
              userId = rootScope.app.resources.uuid;
            }
          )
        );

        it('Check if pincode exist',
            function()
            {
              var result,
                pincode = 8701,
                currentUser = true;

              $httpBackend.expect(
                'GET',
                'http://dev.ask-cs.com/node/' + userId + '/pincode_exists' + '?pincode=' + pincode + '&returnExistsWhenAssignedToUuid=' + currentUser
              ).respond(200, 'success');

              profileModal
                .pincodeExists(userId, pincode, currentUser)
                .then(
                  function(checkResult)
                  {
                    result = checkResult;
                  },
                  function(error)
                  {
                    result = error;
                  }
                );

              $httpBackend.flush();
              expect(result).toBe(true);
            }
        );
      }
    );
  }
);
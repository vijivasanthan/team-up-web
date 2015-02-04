define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Pincode',
      [
        '$rootScope', 'Profile', '$q',
        function ($rootScope, Profile, $q)
        {
          return  {
            pincodeExists: function (pincode, pincodeExist, checkPincode, userId, assignedId)
            {
              var deferred = $q.defer(),
                _userId = (! userId) ? $rootScope.app.resources.uuid : userId,
                pinValidation = {
                  pincodeExistsValidation : pincodeExist,
                  pincodeExistsValidationMessage : '',
                  check : checkPincode
                };

              if (! pincode || _.isEmpty(pincode))
              {
                pinValidation.pincodeExistsValidation = false;
                pinValidation.pincodeExistsValidationMessage = $rootScope.ui.profile.pincodeNotValid;
                deferred.resolve(pinValidation);
              }
              else
              {
                if (pinValidation.check)
                {
                  clearTimeout(pinValidation.check);

                  pinValidation.check = null;
                }

                pinValidation.check = setTimeout(function ()
                {
                  pinValidation.check = null;

                  Profile.pincodeExists(_userId, pincode, assignedId)
                    .then(
                    function (result)
                    {
                      console.log('resultaat pincode', result);

                      pinValidation.pincodeExistsValidation = result;
                      pinValidation.pincodeExistsValidationMessage = $rootScope.ui.profile.pincodeInUse;
                      deferred.resolve(pinValidation);
                    }
                  );
                }, 250);
              }

              return deferred.promise;
            }
          };
        }
      ]
    );
  }
);
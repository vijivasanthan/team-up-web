define(
  ['services/services', 'config'],
  function (services, config) {
    'use strict';

    services.factory(
      'Phone',
      [
        function ()
        {
          function phoneNumberParser(number, country, carrier) {
            var result = phoneNumberParser(number, country, carrier);

            result.parsed = angular.fromJson(result.parsed);

            return result;
          };

          function resetPhoneNumberChecker ()
          {

          };

          return {
            parse: parse
          };

        }
      ]
    );


  }
);





//$rootScope.resetPhoneNumberChecker = function () {
//  $rootScope.phoneNumberParsed = {};
//
//  $rootScope.phoneNumberParsed.result = false;
//};
//
//$rootScope.resetPhoneNumberChecker();
//
//$rootScope.phoneNumberParser = function (checked) {
//  if (checked != '') {
//    if (checked && checked.length > 0) {
//      var result, all;
//
//      result = all = phoneNumberParser(checked, 'NL');
//
//      $rootScope.phoneNumberParsed.result = true;
//
//      if (result) {
//        var error = $rootScope.ui.errors.phone.notValid,
//          invalidCountry = $rootScope.ui.errors.phone.invalidCountry,
//          message;
//
//        if (result.error) {
//          $rootScope.phoneNumberParsed = {
//            result: false,
//            message: error
//          };
//        } else {
//          if (!result.validation.isPossibleNumber) {
//            switch (result.validation.isPossibleNumberWithReason) {
//              case 'INVALID_COUNTRY_CODE':
//                message = invalidCountry;
//                break;
//              case 'TOO_SHORT':
//                message = error + $rootScope.ui.errors.phone.tooShort;
//                break;
//              case 'TOO_LONG':
//                message = error + $rootScope.ui.errors.phone.tooLong;
//                break;
//            }
//
//            $rootScope.phoneNumberParsed = {
//              result: false,
//              message: message
//            };
//          } else {
//            if (!result.validation.isValidNumber) {
//              $rootScope.phoneNumberParsed = {
//                result: false,
//                message: error
//              };
//            } else {
//              if (!result.validation.isValidNumberForRegion) {
//                $rootScope.phoneNumberParsed = {
//                  result: false,
//                  message: invalidCountry
//                };
//              } else {
//                $rootScope.phoneNumberParsed = {
//                  result: true,
//                  message: $rootScope.ui.success.phone.message +
//                  result.validation.phoneNumberRegion +
//                  $rootScope.ui.success.phone.as +
//                  result.validation.getNumberType
//                };
//
//                $('#inputPhoneNumber').removeClass('error');
//              }
//            }
//          }
//        }
//      }
//
//      $rootScope.phoneNumberParsed.all = all;
//    } else {
//      $rootScope.phoneNumberParsed.result = true;
//
//      delete $rootScope.phoneNumberParsed.message;
//
//      $('#inputPhoneNumber').removeClass('error');
//    }
//  }
//};

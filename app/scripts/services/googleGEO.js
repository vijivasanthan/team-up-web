define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'GoogleGEO',
      [
        '$rootScope', 
        function ($rootScope)
        {
            return new google.maps.Geocoder();          
        }
      ]
    );
  }
);
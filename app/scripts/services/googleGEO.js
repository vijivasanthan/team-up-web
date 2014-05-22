define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'GoogleGEO',
      [
        function ()
        {
          return new google.maps.Geocoder();
        }
      ]
    );
  }
);
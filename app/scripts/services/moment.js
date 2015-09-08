define(['services/services', 'moment-timezone'],
  function(services, moment)
  {
  'use strict';

  services.factory('moment', function(){
    return moment;
  });

});
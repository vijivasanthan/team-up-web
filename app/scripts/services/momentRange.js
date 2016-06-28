define(['services/services', 'momentrange'],
  function (services, momentrange)
{
  'use strict';
  services.factory('MomentRange', function ()
  {
    return momentrange;
  });
});
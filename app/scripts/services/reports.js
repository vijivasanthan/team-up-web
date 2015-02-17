define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Reports',
      [
        '$rootScope', '$q', 'Report',
        function ($rootScope, $q, Report)
        {
          var reports = [],
            reportService = {},
            clientId = '',
            clientGroupId = '';

          return reportService;
        }
      ]
    );
  }
);
define(
  ['filters/filters', 'config'],
  function (filters, config)
  {
    'use strict';

    filters.filter('escape',
      [
        function ()
        {
          return function (string)
          {
            if(!string || string.indexOf(".") == -1){
              return string;
            }
            var ret = string.replace(".","").replace("@","")

            return ret;
          }
        }
      ]);


    filters.filter('stateColor',
      [
        function ()
        {
          return function (states)
          {
            var ret = config.stateColors.none;

            angular.forEach(states, function (state, index){
              /**
               *    WORKING
               *    OFFLINE
               *    AVAILABLE
               *    UNAVAILABLE
               *    UNKNOWN
               */
              if(angular.lowercase(state.name) == "availability" && state.share){
                if(angular.lowercase(state.value) == "available" || angular.lowercase(state.value) == "working" ){
                  ret = $config.stateColors.availalbe;
                }else if(angular.lowercase(state.value) == "unavailable"){
                  ret = $config.stateColors.busy;
                }else if(angular.lowercase(state.value) == "offline"){
                  ret = $config.stateColors.offline;
                }
              }
            });

            return ret;
          }
        }
      ]);


    filters.filter('nicelyDate',
      [
        '$rootScope',
        function ($rootScope)
        {
          return function (date)
          {
            if (typeof date == 'string')
            {
              date = Number(date);
            }



            if (String(date).length == 10)
            {
              date *= 1000
            }

            return new Date(date).toString($rootScope.config.formats.date);
          };
        }
      ]);


    filters.filter('nicelyTime',
      [
        '$rootScope',
        function ($rootScope)
        {
          return function (date)
          {
            if (typeof date == 'string') date = Number(date);

            return new Date(date).toString($rootScope.config.formats.time);
          };
        }
      ]);


  }
);

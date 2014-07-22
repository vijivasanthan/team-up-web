define(
  ['filters/filters', 'config'],
  function (filters, config)
  {
    'use strict';

    filters.filter(
      'escape',
      [
        function ()
        {
          return function (string)
          {
            return (! string || string.indexOf('.') == - 1) ?
                   string :
                   string.replace('.', '').replace('@', '');
          }
        }
      ]
    );

    filters.filter(
      'stateColor',
      [
        function ()
        {
          return function (states)
          {
            var result = config.app.stateColors.none;

            angular.forEach(
              states,
              function (state)
              {
                /**
                 *    WORKING
                 *    OFFLINE
                 *    AVAILABLE
                 *    UNAVAILABLE
                 *    UNKNOWN
                 */
                if (angular.lowercase(state.name) == 'availability' && state.share)
                {
                  if (angular.lowercase(state.value) == 'available' ||
                      angular.lowercase(state.value) == 'working')
                  {
                    result = config.app.stateColors.availalbe;
                  }
                  else if (angular.lowercase(state.value) == 'unavailable')
                  {
                    result = config.app.stateColors.busy;
                  }
                  else if (angular.lowercase(state.value) == 'offline')
                  {
                    result = config.app.stateColors.offline;
                  }
                }
              }
            );

            return result;
          }
        }
      ]
    );

    filters.filter(
      'nicelyDate',
      [
        function ()
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

            return new Date(date).toString(config.app.formats.date);
          };
        }
      ]
    );

    filters.filter(
      'nicelyTime',
      [
        function ()
        {
          return function (date)
          {
            if (typeof date == 'string') date = Number(date);

            return new Date(date).toString(config.app.formats.time);
          };
        }
      ]
    );

    filters.filter(
      'translateRole',
      [
        function ()
        {
          return function (role)
          {
            var userRole;

            angular.forEach(
              config.app.roles,
              function (_role)
              {
                if (_role.id == role)
                {
                  userRole = _role.label;
                }
              }
            );

            return userRole;
          }
        }
      ]
    );

    filters.filter(
      'translateFunc',
      [
        function ()
        {
          return function (func)
          {
            var userFunction;

            angular.forEach(
              config.app.mfunctions,
              function (_func)
              {
                if (_func.id == func) userFunction = _func.label;
              });

            return userFunction;
          }
        }
      ]
    );

    filters.filter(
      'stateDataIcon',
      [
        function ()
        {
          return function (name, type)
          {
            var result;

            angular.forEach(
              config.app.stateIcons,
              function (stateIcon)
              {
                if (angular.lowercase(stateIcon.name) == angular.lowercase(name))
                {
                  if (type == 'data_icon')
                  {
                    result = stateIcon.data_icon;
                  }
                  else if (type == 'class_name')
                  {
                    result = stateIcon.class_name;
                  }
                }
              });

            return result;
          }
        }
      ]
    );

    filters.filter(
      'stateValue',
      [
        function ()
        {
          return function (state, type)
          {
            if (angular.lowercase(state.name) == 'location')
            {
              var value = state.value,
                  match = value.match(/\((.*?)\)/);

              if (match == null)
              {
                return value;
              }
              else
              {
                return (type == 'data') ?
                       match[1] :
                       value.replace(match[0], '');
              }
            }
            else
            {
              return state.value;
            }
          }
        }
      ]
    );

    filters.filter(
      'rangeMainFilter',
      [
        'Dater','$filter',
        function (Dater,$filter)
        {
          var periods = Dater.getPeriods();

          return function (dates)
          {      
            var startTime = new Date(dates.start).getTime();
            var endTime =  new Date(dates.end).getTime();
            if (( endTime - startTime ) == 86401000)
            {
              dates.start = new Date(dates.end).addDays(- 1);
              startTime = new Date(dates.start).getTime();
            }

            
            var dates = {
                  start: {                    
                    real:  $filter('date')(startTime,'EEEE, MMMM d'),
                    month: $filter('date')(startTime,'MMMM'),
                    day:   $filter('date')(startTime,'d')
                  },
                  end:   {                    
                    real:  $filter('date')(endTime,'EEEE, MMMM d'),
                    month: $filter('date')(endTime,'MMMM'),
                    day:   $filter('date')(endTime,'d')
                  }
                },                
                monthNumber = $filter('date')(endTime,'M') - 1; 

            if ((((Math.round(dates.start.day) + 1) == dates.end.day && dates.start.hour == dates.end.hour) ||
                 dates.start.day == dates.end.day) && dates.start.month == dates.end.month)
            {
              return  dates.start.real +
                      ', ' +
                      Dater.getThisYear();
            }
            else if (dates.start.day == 1 && dates.end.day == periods.months[monthNumber + 1].totalDays)
            {
              return  dates.start.month +
                      ', ' +
                      Dater.getThisYear();
            }
            else
            {
              return  dates.start.real +
                      ' / ' +
                      dates.end.real +
                      ', ' +
                      Dater.getThisYear();
            }
          }
        }
      ]
    );

    filters.filter(
      'rangeMainWeekFilter',
      [
        'Dater',
        function (Dater)
        {
          return function (dates)
          {
            if (dates)
            {
              var _dates = {
                start: new Date(dates.start).toString('dddd, MMMM d'),
                end:   new Date(dates.end).toString('dddd, MMMM d')
              };

              return  _dates.start +
                      ' / ' +
                      _dates.end +
                      ', ' +
                      Dater.getThisYear();
            }
          }
        }
      ]);

    filters.filter(
      'rangeInfoFilter',
      [
        'Dater','$rootScope',
        function (Dater,$rootScope)
        {
          var periods = Dater.getPeriods();

          return function (timeline)
          {
            var diff = new Date(timeline.range.end).getTime() - new Date(timeline.range.start).getTime();

            if (diff > (2419200000 + 259200000))
            {
              return 'Total selected days: ' + Math.round(diff / 86400000);
            }
            else
            {
              if (timeline.scope.day)
              {
                var hours = {
                  start: new Date(timeline.range.start).toString('HH:mm'),
                  end:   new Date(timeline.range.end).toString('HH:mm')
                };

                /**
                 *  00:00 fix => 24:00
                 */
                if (hours.end == '00:00') hours.end = '24:00';

                return  $rootScope.ui.planboard.time + 
                        hours.start +
                        ' / ' +
                        hours.end;
              }
              else if (timeline.scope.week)
              {
                return  $rootScope.ui.planboard.weekNumber + 
                        timeline.current.week;
              }
              else if (timeline.scope.month)
              {
                return  $rootScope.ui.planboard.monthNumber + 
                        timeline.current.month +
                        ','  + $rootScope.ui.planboard.totalDays + 
                        periods.months[timeline.current.month].totalDays;
              }
            }
          };
        }
      ]
    );

    filters.filter(
      'rangeInfoWeekFilter',
      [
        function ()
        {
          return function (timeline)
          {
            if (timeline)
            {
              return 'Week number: ' + timeline.current.week;
            }
          };
        }
      ]
    );

    filters.filter(
      'i18n_spec',
      [
        '$rootScope',
        function ($rootScope)
        {
          return function (string, type)
          {
            var types = type.split('.');
            var ret;
            if(types[1] == 'stateValue'){
                var statesTrans = $rootScope.ui[types[0]][types[1]];
                angular.forEach(statesTrans,function(v,k){
                    if(k == string){
                      ret = v;
                    }                    
                });
                return ret;
            }

            ret = ($rootScope.ui[types[0]][types[1]]).replace('$v', string);
            if(typeof ret == 'undefined'){
                ret = string;
            }
           
            return ret;
          }
        }
      ]
    );

    filters.filter(
      'stateIcon',
      [
        function ()
        {
          return function (state)
          {
            switch (state)
            {
              case 'emotion':
                return 'icon-face';
                break;

              case 'availability':
                return 'icon-avail';
                break;

              case 'location':
                return 'icon-location';
                break;

              case 'activity':
                return 'icon-activity';
                break;

              case 'reachability':
                return 'icon-reach';
                break;

              default:
                return 'icon-info-sign';
            }
          }
        }
      ]
    );

    filters.filter(
      'avatar',
      [
        'Session','Store',
        function (Session,Store)
        {
          return function (id, type, size)
          {
            var session = Session.get();

            if (session && id)
            {
              var path;

              switch (type)
              {
                case 'team':
                  path = '/team/member/';
                  break;

                case 'client':
                  path = '/client/';
                  break;
              }
              
              var avatarChanged = function(id){

                  var changedTimes = 0;                  
                  
                  var list = Store('app').get('avatarChangeRecord');
                  angular.forEach(list,function(avatarId){
                      if(avatarId == id){
                          changedTimes++;                        
                      }
                  });
                  
                  return parseInt(changedTimes,10);
              }
              // better use a special para to specify the avatar is changed. 
              
              var newsize = parseInt(size,10) + parseInt(avatarChanged(id), 10);
              
              return config.app.host +
                     config.app.namespace +
                     path +
                     id +
                     '/photo?width=' + newsize + '&height=' + newsize + '&sid=' +
                     session;
            }
          }
        }
      ]
    );

    filters.filter(
      'getObjAttr',
      [
        '$rootScope',
        function($rootScope){
          return function(id,usertype,itemName){
            if(usertype == 'client'){
                var client = $rootScope.getClientByID(id);
                if(client == null || typeof client == 'undefined'){
                    return "";
                }

                if(itemName == 'name'){
                    return client.firstName + ' ' + client.lastName;  
                }else if(itemName == 'address'){
                    return client.address.street + ' ' + client.address.no + ', ' + client.address.zip + ' ' + client.address.city ;
                }else if(itemName == 'latlong'){
                    if(typeof client.address.latitude == 'undefined' || typeof client.address.longitude == 'undefined' || 
                        (client.address.longitude == 0 && client.address.latitude == 0)){
                        return client.address.street + ' ' + client.address.no + ', ' + client.address.zip + ' ,' + client.address.city ;
                    }else{
                        return client.address.latitude + ',' + client.address.longitude;
                    }                    
                }    
            }else if(usertype == "member"){
                if(id == null){
                  return "";
                }
                var member = $rootScope.getTeamMemberById(id);                
                if(itemName == 'name'){
                    return member.firstName + ' ' + member.lastName; 
                }else if(itemName == 'states'){
                    return member.states;
                }
                
            }else if(usertype == 'clientGroup'){
                if(id == null){
                    return "";
                }
                if(itemName == 'name'){
                    return $rootScope.getClientGroupName(id); 
                }                
            }else{
                return "no name";
            }

          }
        }
      ]
    );   

    filters.filter(
      'getByUuid',function(){
         return function(input,uuid){
            var i = 0;
            var len = input.length;
            for(; i < len ; i++){
              if(input[i].uuid == uuid){
                return input[i];
              }
            }
            return null;
         }
      }
    );     

    filters.filter(
        'dateReverse' ,  [
            '$filter', function($filter){
              return function(date,pattern){
                 var timestamp = new Date(date).getTime();
                 var ret = $filter('date')(timestamp,pattern);
                 return ret;
              }
          }  
        ] 
    );
  }
);

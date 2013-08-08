'use strict';


angular.module('WebPaige.Filters', ['ngResource'])


/**
 * Translate package
 */
.filter('translatePackage', 
[
	'$config', 
	function ($config)
	{
		return function (selected)
		{
			if (selected)
			{
				var gem;

				angular.forEach($config.packages, function (pack, index)
				{
					if (pack.id == selected) gem = pack;
				});

				return gem.label;
			}
		}
	}
])


/**
 * Translate country
 */
.filter('translateCountry', 
[
	'$config', 
	function ($config)
	{
		return function (selected)
		{
			if (selected)
			{
				var gem;

				angular.forEach($config.countries, function (country, index)
				{
					if (country.id == selected) gem = country;
				});

				return gem.label;
			}
		}
	}
])


/**
 * Translate region
 */
.filter('translateRegion', 
[
	'$config', 
	function ($config)
	{
		return function (selected, country)
		{
			if (selected && country)
			{
				var gem;

				angular.forEach($config.regions[country], function (region, index)
				{
					if (region.id == selected) gem = region;
				});

				return gem.label;
			}
		}
	}
])



/**
 * Translate service
 */
.filter('translateService', 
[
	'$config', 
	function ($config)
	{
		return function (selected)
		{
			if (selected)
			{
				var gem;

				angular.forEach($config.virtuals, function (virtual, index)
				{
					if (virtual.id == selected) gem = virtual;
				});

				return gem.label;
			}
		}
	}
])






















/**
 * Translate roles
 */
// .filter('translateRole', 
// [
// 	'$config', 
// 	function ($config)
// 	{
// 		return function (role)
// 		{
// 			var urole;

// 			angular.forEach($config.roles, function (prole, index)
// 			{
// 				if (prole.id == role) urole = prole.label;
// 			});

// 			return urole;
// 		}
// 	}
// ])








/**
 * Main range filter
 */
// .filter('rangeMainFilter', 
// [
// 	'Dater', 'Storage', 
// 	function (Dater, Storage)
// 	{
// 		var periods = Dater.getPeriods();

// 		return function (dates)
// 		{
// 			if ((new Date(dates.end).getTime() - new Date(dates.start).getTime()) == 86401000)
// 				dates.start = new Date(dates.end).addDays(-1);

// 			var dates = {
// 						start: {
// 							real: 	new Date(dates.start).toString('dddd, MMMM d'),
// 							month: 	new Date(dates.start).toString('MMMM'),
// 							day: 		new Date(dates.start).toString('d')
// 						},
// 						end: {
// 							real: 	new Date(dates.end).toString('dddd, MMMM d'),
// 							month: 	new Date(dates.end).toString('MMMM'),
// 							day: 		new Date(dates.end).toString('d')
// 						}
// 					},
// 					monthNumber = Date.getMonthNumberFromName(dates.start.month);

// 			if ((((Math.round(dates.start.day) + 1) == dates.end.day && dates.start.hour == dates.end.hour) || dates.start.day == dates.end.day) && dates.start.month == dates.end.month)
// 			{
// 				return 	dates.start.real + 
// 								', ' + 
// 								Dater.getThisYear();
// 			}
// 			else if(dates.start.day == 1 && dates.end.day == periods.months[monthNumber + 1].totalDays)
// 			{
// 				return 	dates.start.month + 
// 								', ' + 
// 								Dater.getThisYear();
// 			}
// 			else
// 			{
// 				return 	dates.start.real + 
// 								' / ' + 
// 								dates.end.real + 
// 								', ' + 
// 								Dater.getThisYear();
// 			};

// 		}
// 	}
// ])








/**
 * Main range week filter
 */
// .filter('rangeMainWeekFilter', 
// [
// 	'Dater', 'Storage', 
// 	function (Dater, Storage)
// 	{
// 		var periods = Dater.getPeriods();

// 		return function (dates)
// 		{
// 			if (dates)
// 			{
// 				var dates = {
// 					start: 	new Date(dates.start).toString('dddd, MMMM d'),
// 					end: 		new Date(dates.end).toString('dddd, MMMM d')
// 				};

// 				return 	dates.start + 
// 								' / ' + 
// 								dates.end + 
// 								', ' + 
// 								Dater.getThisYear();
// 			};
// 		}
// 	}
// ])








/**
 * Range info filter
 */
// .filter('rangeInfoFilter', 
// [
// 	'Dater', 'Storage', 
// 	function (Dater, Storage)
// 	{
// 		var periods = Dater.getPeriods();

// 		return function (timeline)
// 		{
// 			var diff = new Date(timeline.range.end).getTime() - new Date(timeline.range.start).getTime();

// 			if (diff > (2419200000 + 259200000))
// 			{
// 				return 'Total selected days: ' + Math.round(diff / 86400000);
// 			}
// 			else
// 			{
// 				if (timeline.scope.day)
// 				{
// 					var hours = {
// 						start: new Date(timeline.range.start).toString('HH:mm'),
// 						end: new Date(timeline.range.end).toString('HH:mm')
// 					};

// 					/**
// 					 *  00:00 fix => 24:00
// 					 */
// 					if (hours.end == '00:00') hours.end = '24:00';

// 					return 	'Time: ' + 
// 									hours.start + 
// 									' / ' + 
// 									hours.end;
// 				}
// 				else if (timeline.scope.week)
// 				{
// 					return 	'Week number: ' + 
// 									timeline.current.week;
// 				}
// 				else if (timeline.scope.month)
// 				{
// 					return 	'Month number: ' + 
// 									timeline.current.month + 
// 									', Total days: ' + 
// 									periods.months[timeline.current.month].totalDays;
// 				};
// 			};
// 		};
// 	}
// ])







/**
 * Range info week filter
 */
// .filter('rangeInfoWeekFilter', 
// [
// 	'Dater', 'Storage', 
// 	function (Dater, Storage)
// 	{
// 		var periods = Dater.getPeriods();

// 		return function (timeline)
// 		{
// 			if (timeline) return 'Week number: ' + timeline.current.week;
// 		};
// 	}
// ])








/**
 * BUG!
 * Maybe not replace bar- ?
 * 
 * TODO
 * Implement state conversion from config later on!
 * 
 * Convert ratios to readable formats
 */
// .filter('convertRatios', 
// [
// 	'$config', 
// 	function ($config)
// 	{
// 		return function (stats)
// 		{
// 			var ratios = '';

// 			angular.forEach(stats, function (stat, index)
// 			{
// 				ratios += stat.ratio.toFixed(1) + '% ' + stat.state.replace(/^bar-+/, '') + ', ';
// 			});

// 			return ratios.substring(0, ratios.length - 2);
// 		};
// 	}
// ])








/** 
 * Calculate time in days
 */
// .filter('calculateTimeInDays', 
// 	function ()
// 	{
// 		return function (stamp)
// 		{
// 			var day 		= 1000 * 60 * 60 * 24,
// 					hour		=	1000 * 60 * 60,
// 					days 		= 0,
// 					hours 	= 0,
// 					stamp 	= stamp * 1000,
// 					hours 	= stamp % day,
// 					days 		= stamp - hours;

// 			return 	Math.floor(days / day);
// 		};
// 	}
// )








/**
 * Calculate time in hours
 */
// .filter('calculateTimeInHours', 
// 	function ()
// 	{
// 		return function (stamp)
// 		{
// 			var day 		= 1000 * 60 * 60 * 24,
// 					hour		=	1000 * 60 * 60,
// 					days 		= 0,
// 					hours 	= 0,
// 					stamp 	= stamp * 1000,
// 					hours 	= stamp % day,
// 					days 		= stamp - hours;

// 			return 	Math.floor(hours / hour);
// 		};
// 	}
// )







/**
 * Calculate time in minutes
 */
// .filter('calculateTimeInMinutes', 
// 	function ()
// 	{
// 		return function (stamp)
// 		{
// 			var day 		= 1000 * 60 * 60 * 24,
// 					hour		=	1000 * 60 * 60,
// 					minute 	= 1000 * 60,
// 					days 		= 0,
// 					hours 	= 0,
// 					minutes = 0,
// 					stamp 	= stamp * 1000,
// 					hours 	= stamp % day,
// 					days 		= stamp - hours,
// 					minutes = stamp % hour;

// 			return 	Math.floor(minutes / minute);
// 		};
// 	}
// )







/**
 * Convert eve urls to ids
 */
// .filter('convertEve', 
// 	function ()
// 	{
// 	  return function (url)
// 	  {
// 	  	var eve = url;

// 	  	eve = (typeof url != "undefined") ? url.split("/") : ["", url, ""];

// 	    return eve[eve.length-2];
// 	  };
// 	}
// )







/** 
 * Convert user uuid to name
 */
// .filter('convertUserIdToName', 
// [
// 	'Storage', 
// 	function (Storage)
// 	{
// 		var members = angular.fromJson(Storage.get('members'));

// 		return function (id)
// 		{	
// 	    if (members == null || typeof members[id] == "undefined")
// 	    {
// 	      return id;
// 	    }
// 	    else
// 	    {
// 	      return members[id].name;
// 	    };
// 		};
// 	}
// ])







/**
 * Convert timeStamps to dates
 */
// .filter('nicelyDate', 
// [
// 	'$rootScope', 
// 	function ($rootScope)
// 	{
// 	 	return function (date)
// 	 	{
// 	 		if (typeof date == 'string') date = Number(date);

// 	 		return new Date(date).toString($rootScope.config.formats.datetime);
// 	 	};
// 	}
// ])







/**
 * TODO
 * Not used probably!
 *
 * Combine this either with nicelyDate or terminate!
 * 
 * Convert timeStamp to readable date and time
 */
// .filter('convertTimeStamp', 
// 	function ()
// 	{
// 		return function (stamp)
// 		{
// 			console.warn(typeof stamp);

// 			return new Date(stamp).toString('dd-MM-yyyy HH:mm');
// 		};
// 	}
// )







/**
 * TODO
 * Still used?
 * 
 * No title filter
 */
// .filter('noTitle',
// 	function ()
// 	{
// 		return function (title)
// 		{
// 			return (title == "") ? "- No Title -" : title;
// 		}
// 	}
// )







/**
 * TODO
 * Finish it!
 * 
 * Strip span tags
 */
// .filter('stripSpan', 
// 	function ()
// 	{
// 	  return function (string)
// 	  {
// 	    return string.match(/<span class="label">(.*)<\/span>/);
// 	  }
// 	}
// )







/**
 * Strip html tags
 */
// .filter('stripHtml', 
// 	function ()
// 	{
// 	  return function (string)
// 	  {
// 	  	if (string) return string.split('>')[1].split('<')[0];
// 	  }
// 	}
// )







/**
 * Convert group id to name
 */
// .filter('groupIdToName', 
// [
// 	'Storage', 
// 	function (Storage)
// 	{
// 	  return function (id)
// 	  {
// 	  	var groups = angular.fromJson(Storage.get('groups'));

// 	  	for (var i in groups)
// 	  	{
// 	  		if (groups[i].uuid == id) return groups[i].name;
// 	  	};
// 	  }
// 	}
// ])








/**
 * TODO
 * Unknown filter
 */
// .filter('i18n_spec',
// [
// 	'$rootScope', 
// 	function ($rootScope)
// 	{
// 		return function (string, type)
// 		{
// 			var types = type.split("."),
// 					ret 	= $rootScope.ui[types[0]][types[1]],
// 					ret 	= ret.replace('$v',string);
			
// 			return ret;
// 		}
// 	}
// ])







/**
 * Truncate group titles for dashboard pie widget
 */
// .filter('truncateGroupTitle', 
// [
// 	'Strings', 
// 	function (Strings) 
// 	{
// 		return function (title)
// 		{
// 	     return Strings.truncate(title, 20, true);
// 	  }
// 	}
// ])







/**
 * Make first letter capital
 */
// .filter('toTitleCase', 
// [
// 	'Strings', 
// 	function (Strings) 
// 	{
// 		return function (txt)
// 		{
// 	     return Strings.toTitleCase(txt);
// 	  }
// 	}
// ])







/**
 * Count messages in box
 */
// .filter('countBox',
// 	function () 
// 	{
// 		return function (box)
// 		{
// 			var total = 0;

// 			angular.forEach(box, function (bulk, index)
// 			{
// 				total = total + bulk.length;
// 			});

// 	    return total;
// 	  }
// 	}
// )








/**
 * Convert offsets array to nicely format in scheaduled jobs
 */
// .filter('nicelyOffsets', 
// [
// 	'Dater', 'Storage', 'Offsetter',
// 	function (Dater, Storage, Offsetter)
// 	{
// 		return function (data)
// 		{
// 			var offsets 	= Offsetter.factory(data),
// 					compiled 	= '';

// 			angular.forEach(offsets, function (offset, index)
// 			{
// 				compiled += '<div style="display:block; margin-bottom: 5px;">';

// 				compiled += '<span class="badge">' + offset.time + '</span>&nbsp;';

// 				if (offset.mon) compiled += '<span class="muted"><small><i> maandag,</i></small></span>';
// 				if (offset.tue) compiled += '<span class="muted"><small><i> dinsdag,</i></small></span>';
// 				if (offset.wed) compiled += '<span class="muted"><small><i> woensdag,</i></small></span>';
// 				if (offset.thu) compiled += '<span class="muted"><small><i> donderdag,</i></small></span>';
// 				if (offset.fri) compiled += '<span class="muted"><small><i> vrijdag,</i></small></span>';
// 				if (offset.sat) compiled += '<span class="muted"><small><i> zaterdag,</i></small></span>';
// 				if (offset.sun) compiled += '<span class="muted"><small><i> zondag,</i></small></span>';

// 				compiled = compiled.substring(0, compiled.length - 20);

// 				compiled = compiled += '</i></small></span>';

// 				compiled += '</div>';

// 				compiled = compiled.substring(0, compiled.length);
// 			});

// 			return compiled;
// 		}
// 	}
// ])








/**
 * Convert array of audience to a nice list
 */
// .filter('nicelyAudience', 
// [
// 	'Storage',
// 	function (Storage)
// 	{
// 		return function (data)
// 		{
// 			var members 	= angular.fromJson(Storage.get('members')),
// 	    		groups 		= angular.fromJson(Storage.get('groups')),
// 	    		audience 	= [];

// 			angular.forEach(data, function (recipient, index)
// 			{
// 	  		var name;

// 	  		if (members[recipient])
// 	  		{
// 		  		name = members[recipient].name;
// 	  		}
// 	  		else
// 	  		{
// 	  			angular.forEach(groups, function (group, index)
// 	  			{
// 	  				if (group.uuid == recipient) name = group.name;
// 	  			});
// 	  		}

// 		  	audience += name + ', ';
// 			});

// 			return audience.substring(0, audience.length - 2);
// 		}
// 	}
// ])
;
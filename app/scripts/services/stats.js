define(
  ['services/services', 'config'],
  function (services, config) {
    'use strict';

    services.factory(
      'Stats',
      [
        function () {
          return {
            /**
             * Group agg stats
             */
            aggs: function (data, start, end) {
              var stats = {
                  less: 0,
                  even: 0,
                  more: 0
                },
                durations = {
                  less: 0,
                  even: 0,
                  more: 0,
                  total: 0
                },
                total = 0;

              angular.forEach(
                data,
                function (slot) {
                  var slotStart = slot.start;

                  if (slotStart < start) {
                    slotStart = start;
                  }

                  var slotEnd = slot.end;

                  if (slotEnd > end) {
                    slotEnd = end;
                  }

                  var slotDiff = slotEnd - slotStart;

                  if (slot.diff < 0) {
                    stats.less += slotDiff;
                  }
                  else if (slot.diff == 0) {
                    stats.even += slotDiff;
                  }
                  else {
                    stats.more += slotDiff;
                  }
                  ;
                  total += slotDiff;

                  if (slot.diff < 0) {
                    durations.less += slotDiff;
                  }
                  else if (slot.diff == 0) {
                    durations.even += slotDiff;
                  }
                  else {
                    durations.more += slotDiff;
                  }

                  durations.total += slotDiff;
                }
              );

              // console.log('Total duration: ', durations.total, ' Total range: ', (end - start));

              return {
                ratios: {
                  less: Math.round((stats.less / total) * 100),
                  even: Math.round((stats.even / total) * 100),
                  more: Math.round((stats.more / total) * 100)
                },
                durations: durations
              }
            },

            /**
             * Group pie stats
             */
            pies: function (data, start, end) {
              var stats = {
                  less: 0,
                  even: 0,
                  more: 0
                },
                total = 0;

              angular.forEach(
                data,
                function (slot) {
                  var slotStart = slot.start;

                  if (slotStart < start) {
                    slotStart = start;
                  }

                  var slotEnd = slot.end;

                  if (slotEnd > end) {
                    slotEnd = end;
                  }

                  var slotDiff = slotEnd - slotStart;

                  if (slot.diff < 0) {
                    stats.less += slotDiff;
                  }
                  else if (slot.diff == 0) {
                    stats.even += slotDiff;
                  }
                  else {
                    stats.more += slotDiff;
                  }

                  total += slotDiff;
                }
              );

              // If the total is 0 that means there were not slots.
              if (total == 0) {
                total = end - start;
              }

              return {
                less: Math.round((stats.less / total) * 100),
                even: Math.round((stats.even / total) * 100),
                more: Math.round((stats.more / total) * 100)
              };
            },

            /**
             * Member stats
             */
            member: function (data, start, end) {
              var stats = {},
                total = 0;

              angular.forEach(
                data,
                function (slot) {
                  // Make sure calculations only go over the period which is requested!
                  var slotStart = slot.start;

                  if (slotStart < start) {
                    slotStart = start;
                  }

                  var slotEnd = slot.end;

                  if (slotEnd > end) {
                    slotEnd = end;
                  }

                  var delta = slotEnd - slotStart;

                  if (stats[slot.text]) {
                    stats[slot.text] += delta;
                  }
                  else {
                    stats[slot.text] = delta;
                  }

                  total += delta;
                }
              );

              // Based on the total requested period calculate the 'empty' time. And insert is as no planning.
              var totalDiff = (end - start) - total;

              if (totalDiff > 0) {
                stats["com.ask-cs.State.NoPlanning"] = totalDiff;
              }

              total += totalDiff;

              // console.warn('stats ->', stats, total);

              var ratios = [];

              angular.forEach(
                stats,
                function (stat, index) {
                  ratios.push(
                    {
                      state: index,
                      ratio: (stat / total) * 100
                    }
                  );
                }
              );

              return ratios;
            }
          }
        }
      ]
    );


  }
);
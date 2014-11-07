define(['services/services'], function (services) {
  'use strict';

  services.factory('Sloter', function ($rootScope, Store) {
    return {
      get: {
        groups: function () {
          var groups = {};

          _.each(Store('network').get('groups'), function (group) {
              groups[group.uuid] = group.name;
            });

          return groups;
        },

        members: function () {
          var members = {};

          _.each(Store('network').get('unique'), function (member) {
            if(member!=null && member.uuid!=null) {
              members[member.uuid] = member.resources.firstName + ' ' + member.resources.lastName;
            }
          });

          return members;
        }
      },

      wrapper: function (rank) {
        return '<span style="display:none;">' + rank + '</span>'
      },

      secret: function (content) {
        return '<span class="secret">' + content + '</span>'
      },

      addLoading: function (data, timedata, rows) {
        _.each(rows, function (row) {
          timedata.push({
            start: data.periods.end,
            end: 1577836800000,
            group: row,
            content: 'loading',
            className: 'state-loading-right',
            editable: false
          });

          timedata.push({
            start: 0,
            end: data.periods.start,
            group: row,
            content: 'loading',
            className: 'state-loading-left',
            editable: false
          });
        });

        return timedata;
      },

      tooltip: function (periods) {
        var convertTimestamp = function (stamp) {
          return new Date(stamp * 1000).toString($rootScope.StandBy.config.formats.datetime)
        };

        var content = convertTimestamp(periods.start) + ' / ' +
          convertTimestamp(periods.end);

        if (periods.hasOwnProperty('min')) {
          content += ' / Huidig aantal beschikbaar: ' + periods.min;
        }

        if (periods.hasOwnProperty('wish')) {
          content += ' / Gewenst aantal mensen: ' + periods.wish;
        }

        if (periods.hasOwnProperty('member')) {
          content += ' / ' + periods.member;
        }

        if (periods.hasOwnProperty('state')) {
          content += ' / ' + periods.state;
        }

        return '<div class="time-tip" title="' + content + '">' + content + '</div>'
      },

      user: function (data, timedata, config) {
        var _this = this;

        _.each(data.user, function (slot, index) {
          _.each(config.legenda, function (value, legenda) {
            if (slot.text == legenda && value) {
              timedata.push({
                start: Math.round(slot.start * 1000),
                end: Math.round(slot.end * 1000),
                group: (slot.recursive) ?
                  _this.wrapper('b') + $rootScope.ui.planboard.weeklyPlanning + _this.wrapper('recursive') :
                  _this.wrapper('a') + $rootScope.ui.planboard.planning + _this.wrapper('planning'),
                content: this.tooltip({ start: slot.start, end: slot.end }) +
                  _this.secret(
                    angular.toJson({
                      type: 'slot',
                      id: index, // slot.id,
                      recursive: slot.recursive,
                      state: slot.text
                    })
                  ),
                className: 'slot-' + index + ' ' + config.states[slot.text].className,
                editable: true
              });
            }
          }.bind(this));
        }.bind(this));

        timedata = _this.addLoading(data, timedata, [
            _this.wrapper('b') + $rootScope.ui.planboard.weeklyPlanning + _this.wrapper('recursive'),
            _this.wrapper('a') + $rootScope.ui.planboard.planning + _this.wrapper('planning')
        ]);

        return timedata;
      },

      profile: function (data, config) {
        var _this = this,
          timedata = [];

        _.each(data, function (slot, index) {
          _.each(config.legenda, function (value, legenda) {
            if (slot.text == legenda && value) {
              timedata.push({
                start: Math.round(slot.start * 1000),
                end: Math.round(slot.end * 1000),
                group: (slot.recursive) ?
                  _this.wrapper('b') + $rootScope.ui.planboard.weeklyPlanning + _this.wrapper('recursive') :
                  _this.wrapper('a') + $rootScope.ui.planboard.planning + _this.wrapper('planning'),
                content: _this.secret(
                  angular.toJson(
                    {
                      type: 'slot',
                      id: index, // slot.id,
                      recursive: slot.recursive,
                      state: slot.text
                    }
                  )
                ),
                className: 'slot-' + index + ' ' + config.states[slot.text].className,
                editable: true
              });
            }
          });
        });

        timedata.push({
          start: 0,
          end: 1,
          group: _this.wrapper('b') + $rootScope.ui.planboard.weeklyPlanning + _this.wrapper('recursive'),
          content: '',
          className: null,
          editable: false
        });

        timedata.push({
          start: 0,
          end: 1,
          group: _this.wrapper('a') + $rootScope.ui.planboard.planning + _this.wrapper('planning'),
          content: '',
          className: null,
          editable: false
        });

        return timedata;
      },

      namer: function (agg, privilage) {
        var groups = this.get.groups(),
          name = groups[agg.id];

        name = name.charAt(0).toUpperCase() + name.slice(1);

        var link = '<a href="#/groups?uuid=' +
            agg.id +
            '#view">' +
            name +
            '</a>',
          title;

        if (!agg.division) {
          title = (privilage <= 1) ? link : '<span>' + name + '</span>';
        } else {
          var label;

          title = (privilage <= 1) ? link : '<span>' + name + '</span>';

          title += ' <span class="label label-default">' + agg.division.label + '</span>';
        }

        return title;
      },

      bars: function (data, timedata, config, privilage, current) {
        var _this = this,
          maxh = 0;

        _.each(_this.filtered(data, current), function (agg) {
          var name = _this.namer(agg, privilage);

          _.each(agg.data, function (slot) {
            if (slot.wish > maxh) {
              maxh = slot.wish;
            }
          });

          _.each(agg.data, function (slot) {
            var maxNum = maxh,
              num = slot.wish,
              xwish = num,
              height = Math.round(num / maxNum * 80 + 20), // a percentage, with a lower bound on 20%
              minHeight = height,
              style = 'height:' + height + 'px;',
              requirement = '<div class="requirement" style="' +
                style +
                '" ' +
                'title="' + 'Minimum aantal benodigden' + ': ' +
                num +
                ' personen"></div>';

            num = slot.wish + slot.diff;

            var xcurrent = num;

            height = Math.round(num / maxNum * 80 + 20);

            if (slot.diff >= 0 && slot.diff < 7) {
              var color;

              switch (slot.diff) {
                case 0:
                  color = 'bars-even';
                  break;
                case 1:
                  color = 'bars-more';
                  break;
                case 2:
                  color = 'bars-more';
                  break;
                case 3:
                  color = 'bars-more';
                  break;
                case 4:
                  color = 'bars-more';
                  break;
                case 5:
                  color = 'bars-more';
                  break;
                case 6:
                  color = 'bars-more';
                  break;
              }
            } else if (slot.diff >= 7) {
              color = 'bars-more';
            } else {
              color = 'bars-less';
            }

            var span = '<span class="badge badge-inverse">' + slot.diff + '</span>';

            if (xcurrent > xwish) height = minHeight;

            style = 'height:' + height + 'px;';

            var actual = '<div class="bar ' + color + '" style="' +
              style +
              '" ' +
              ' title="Huidig aantal beschikbaar: ' +
              num +
              ' personen">' +
              span +
              '</div>';

            if ((slot.diff > 0 && config.legenda.groups.more) ||
              (slot.diff == 0 && config.legenda.groups.even) ||
              (slot.diff < 0 && config.legenda.groups.less)) {
              timedata.push({
                start: Math.round(slot.start * 1000),
                end: Math.round(slot.end * 1000),
                group: _this.wrapper('c') + name,
                content: requirement +
                  actual +
                  _this.secret(angular.toJson(
                    {
                      type: 'group',
                      diff: slot.diff,
                      group: name
                    })),
                className: 'group-aggs',
                editable: false
              });
            }

            timedata = _this.addLoading(data, timedata, [ _this.wrapper('c') + name ]);
          });
        });

        return timedata;
      },

      aggs: function (data, timedata, config, privilage, current) {
        var _this = this;

        _.each(_this.filtered(data, current), function (agg) {
          var name = _this.namer(agg, privilage);

          _.each(agg.data, function (slot) {
            var cn;

            if (slot.diff >= 0 && slot.diff < 7) {
              switch (slot.diff) {
                case 0:
                  cn = 'even';
                  break;
                case 1:
                  cn = 1;
                  break;
                case 2:
                  cn = 2;
                  break;
                case 3:
                  cn = 3;
                  break;
                case 4:
                  cn = 4;
                  break;
                case 5:
                  cn = 5;
                  break;
                case 6:
                  cn = 6;
                  break;
              }
            } else if (slot.diff >= 7) {
              cn = 'more';
            } else {
              cn = 'less'
            }

            if ((slot.diff > 0 && config.legenda.groups.more) ||
              (slot.diff == 0 && config.legenda.groups.even) ||
              (slot.diff < 0 && config.legenda.groups.less)) {
              timedata.push({
                start: Math.round(slot.start * 1000),
                end: Math.round(slot.end * 1000),
                group: _this.wrapper('c') + name,
                content: this.tooltip({ start: slot.start, end: slot.end, min: slot.wish + slot.diff }) +
                  _this.secret(angular.toJson({
                    type: 'group',
                    diff: slot.diff,
                    group: name
                  })),
                className: 'agg-' + cn,
                editable: false
              });
            }

            timedata = _this.addLoading(data, timedata, [ _this.wrapper('c') + name ]);
          }.bind(this));
        }.bind(this));

        return timedata;
      },

      wishes: function (data, timedata, privilage) {
        var _this = this;

        var groups = this.get.groups(),
          name = groups[data.aggs[0].id],
          link = '<a href="#/groups?uuid=' +
            data.aggs[0].id +
            '#view">' +
            name +
            '</a>',
          title;

        title = (privilage == 1) ? link : '<span>' + name + '</span>';

        title += ' <span class="label label-default">Behoefte (elke divisie)</span>';

        _.each(data.aggs.wishes, function (wish) {
            var cn;

            if (wish.count >= 7) {
              cn = 'wishes-more';
            } else if (wish.count == 0) {
              cn = 'wishes-even';
            } else {
              cn = 'wishes-' + wish.count;
            }

            timedata.push({
              start: Math.round(wish.start * 1000),
              end: Math.round(wish.end * 1000),
              group: _this.wrapper('c') + title,
              content: this.tooltip({ start: wish.start, end: wish.end, wish: wish.count }) +
                _this.secret(angular.toJson({
                  type: 'wish',
                  wish: wish.count,
                  group: title,
                  groupId: data.aggs[0].id
                })),
              className: cn,
              editable: false
            });

            timedata = _this.addLoading(data, timedata, [ _this.wrapper('c') + title ]);
          }.bind(this)
        );

        return timedata;
      },

      members: function (data, timedata, config, privilage) {
        var _this = this,
          members = this.get.members(),
          filtered = [];

        _.each(data.members, function (member) {
          if (member.lastName != undefined && member.role != 4 && member.role != 0) {
            filtered.push(member);
          }
        });

        data.members = filtered;

        data.members.sort(function (a, b) {
          var aName = a.lastName.toLowerCase(),
            bName = b.lastName.toLowerCase();

          if (aName < bName) {
            return -1;
          }

          if (aName > bName) {
            return 1;
          }

          return 0;
        });

        _.each(data.members, function (member) {
            var user = ($rootScope.StandBy.resources.uuid == member.id) ? 'profile' : 'timeline';

            var link = (privilage <= 1) ?
              _this.wrapper('d-' + member.lastName[0].toLowerCase()) +
              '<a href="#/profile/' +
              member.id +
              '#' + user + '">' +
              members[member.id] +
              '</a>' :
              _this.wrapper('d-' + member.lastName[0].toLowerCase()) +
              members[member.id];

            _.each(member.data, function (slot) {
              _.each(config.legenda, function (value, legenda) {
                if (slot.text == legenda && value) {
                  var tooltip = {
                    start: slot.start,
                    end: slot.end,
                    member: members[member.id],
                    state: config.states[slot.text].label
                  };

                  timedata.push({
                    start: Math.round(slot.start * 1000),
                    end: Math.round(slot.end * 1000),
                    group: link,
                    content: this.tooltip(tooltip) +
                      _this.secret(
                        angular.toJson(
                          {
                            type: 'member',
                            id: slot.id,
                            mid: member.id,
                            recursive: slot.recursive,
                            state: slot.text
                          }
                        )
                      ),
                    className: config.states[slot.text].className,
                    editable: false
                  });
                }
              }.bind(this));
            }.bind(this));

            timedata.push({
              start: 0,
              end: 0,
              group: link,
              content: null,
              className: null,
              editable: false
            });

            timedata = _this.addLoading(data, timedata, [link]);

            /**
             * TODO: Good place to host this here?
             */
            _.each(member.stats, function (stat) {
              var state = stat.state.split('.');
              state.reverse();

              stat.state = (stat.state.match(/bar-(.*)/)) ? stat.state : 'bar-' + state[0];
            });
          }.bind(this)
        );

        return timedata;
      },

      pies: function (data, current) {
        var _this = this;

        _.each(_this.filtered(data, current), function (agg) {
          var id;

          id = ($rootScope.StandBy.config.timeline.config.divisions.length > 0) ? agg.division.id : '';

          if ($.browser.msie && $.browser.version == '8.0') {
            $('#' + 'groupPie-' + id).html('');
          } else {
            document.getElementById('groupPie-' + id).innerHTML = '';
          }

          var ratios = [],
            colorMap = {
              more: '#6cad6c',
              even: '#e09131',
              less: '#d34545'
            },
            colors = [],
            xratios = [];

          _.each(agg.ratios, function (ratio, index) {
            if (ratio != 0) {
              ratios.push({
                ratio: ratio,
                color: colorMap[index]
              });
            }
          });

          ratios = ratios.sort(function (a, b) {
            return b.ratio - a.ratio
          });

          _.each(ratios, function (ratio) {
            colors.push(ratio.color);
            xratios.push(ratio.ratio);
          });

          var r = Raphael('groupPie-' + id),
            pie = r.piechart(120, 120, 100, xratios, { colors: colors });
        });
      },

      filtered: function (data, current) {
        var filtered = [];

        if (current.division == 'all') {
          filtered = data.aggs;
        } else {
          _.each(data.aggs, function (agg) {
            if (current.division == agg.division.id) {
              filtered.push(agg);
            }
          });
        }

        return filtered;
      },

      process: function (data, config, divisions, privilage, current) {
        var _this = this,
          timedata = [];

        if (data.user) timedata = _this.user(data, timedata, config);

        if (data.aggs) {
          if (config.bar) {
            timedata = _this.bars(data, timedata, config, privilage, current);
          } else {
            timedata = _this.aggs(data, timedata, config, privilage, current);
          }
        }

        if (config.wishes && data.aggs) timedata = _this.wishes(data, timedata, privilage);

        if (data.members) timedata = _this.members(data, timedata, config, privilage);

        if (data.aggs) {
          setTimeout(function () {
            _this.pies(data, current)
          }, $rootScope.StandBy.config.timers.TICKER);
        }

        return timedata;
      }
    }
  });
});
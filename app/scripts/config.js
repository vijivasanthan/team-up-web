define(
  {
    app: {
      // version: '@@version',
      version: '0.6.0-SNAPSHOT',
      // version: '0.5.2',
      released: '@@released',

      title: 'TeamUp',
      lang: 'nl',

      statesall: {
        'com.ask-cs.State.Available': {
          className: 'state-available',
          label: 'Beschikbaar',
          color: '#4f824f',
          type: 'Beschikbaar'
        },
        'com.ask-cs.State.Unavailable': {
          className: 'state-unavailable',
          label: 'Niet Beschikbaar',
          color: '#a93232',
          type: 'Niet Beschikbaar'
        },
        'com.ask-cs.State.Unreached': {
          className: 'state-unreached',
          label: 'Niet Bereikt',
          color: '#65619b',
          type: 'Niet Beschikbaar'
        }
      },

      // host: "http://test.ask-cs.com/",
      // namespace: "teamup-test",

      // host: "http://askpack.ask-cs.com/",
      // namespace: "teamup-demo",

      host: "http://dev.ask-cs.com/",
      namespace: "teamup-dev",

      formats: {
        date: 'dd-MM-yyyy',
        time: 'HH:mm',
        datetime: 'dd-MM-yyyy HH:mm',
        datetimefull: 'dd-MM-yyyy HH:mm'
      },

      roles: [
        {
          id: '1',
          label: 'coordinator'
        },
        {
          id: '2',
          label: 'team_member'
        },
        {
          id: '3',
          label: 'client'
        }
      ],

      mfunctions: [
        {
          id: '1',
          label: 'Doctor'
        },
        {
          id: '2',
          label: 'Nurse'
        }
      ],

      stateIcons: [
        {
          name: 'Availability',
          data_icon: '&#xe04d;',
          class_name: 'icon-user-block'
        },
        {
          name: 'Location',
          data_icon: '&#xe21a;',
          class_name: 'icon-location4'
        },
        {
          name: 'Emotion',
          data_icon: '&#xe0f2;',
          class_name: 'icon-smiley'
        },
        {
          name: 'Activity',
          data_icon: '&#xe4f2;',
          class_name: 'icon-accessibility'
        },
        {
          name: 'Reachability',
          data_icon: '&#xe169;',
          class_name: 'icon-podcast2'
        }
      ],

      stateColors: {
        availalbe: 'memberStateAvailalbe',
        busy: 'memberStateBusy',
        offline: 'memberStateOffline',
        none: 'memberStateNone'
      },

      noImgURL: '/images/defaultAvatar.png',

      timeline: {
        options: {
          axisOnTop: true,
          width: '100%',
          height: 'auto',
          selectable: true,
          editable: true,
          style: 'box',
          groupsWidth: '200px',
          eventMarginAxis: 0,
          showCustomTime: false,
          groupsChangeable: true,
          showNavigation: false,
          intervalMin: 1000 * 60 * 60 * 1
        },
        // TODO: Remove unused config properties
        config: {
          zoom: '0.4',
          bar: false,
          layouts: {
            groups: true,
            members: true
          },
          wishes: false,
          legenda: {},
          legendarer: false,
          states: {},
          divisions: [
            {
              id: 'all',
              label: 'All divisions'
            },
            {
              id: 'knrm.StateGroup.BeschikbaarNoord',
              label: 'Noord'
            },
            {
              id: 'knrm.StateGroup.BeschikbaarZuid',
              label: 'Zuid'
            }
          ],
          densities: {
            less: '#a0a0a0',
            even: '#ba6a24',
            one: '#415e6b',
            two: '#3d5865',
            three: '#344c58',
            four: '#2f4550',
            five: '#2c424c',
            six: '#253943',
            more: '#486877'
          }
        }
      },

      pie: {
        colors: ['#415e6b', '#ba6a24', '#a0a0a0']
      },

      defaults: {
        settingsWebPaige: {
          user: {
            language: 'nl'
          },
          app: {
            widgets: {
              groups: {}
            }
          }
        }
      },

      states: [
        'com.ask-cs.State.Available',
        'com.ask-cs.State.Unavailable',
        'com.ask-cs.State.Unreached'
      ],

      // 1 - active - Task is being executed by a team member (a team member can have only 1 active task at a time)
      // 2 - planning - task is in planning and can be picked up by a team member

      // 3 - finished - task has been executed by a team member and cannot be picked up anymore
      // 4 - cancelled - task is cancelled and cannot be picked up anymore by any team member

      taskStates: {
        1: 'Active',
        2: 'Planning',
        3: 'Finished',
        4: 'Cancelled'
      },

      init: function ()
      {
        angular.forEach(
          this.states,
          (function (state) { this.timeline.config.states[state] = this.statesall[state] }).bind(this)
        );
      }
    }
  }
);
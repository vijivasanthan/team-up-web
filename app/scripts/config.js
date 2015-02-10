define(
  {
    app: {
      // version: '@@version',
      version: '1.2.0-snapshot',
      // version: '0.5.2',
      released: '@@released',

      title: (localConfig.otapRole.indexOf('live') > -1 ? '' : localConfig.otapRole + '-') + profile.name,
      lang: profile.lang,
      profileName: profile.name,

      statesall: profile.statesall,

      tabs: profile.tabs,

      namespace: "",

      host: localConfig.host,

      //analytics: {
      //  status: profile.analytics.status,
      //  code: profile.analytics.code
      //},

      formats: {
        date: 'dd-MM-yyyy',
        time: 'HH:mm',
        datetime: 'dd-MM-yyyy HH:mm',
        datetimefull: 'dd-MM-yyyy HH:mm'
      },

      roles: profile.roles,

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
          wishes: true,
          legenda: {},
          legendarer: false,
          states: {},
          divisions: [
            //{
            //  id: 'all',
            //  label: 'All divisions'
            //},
            //{
            //  id: 'knrm.StateGroup.BeschikbaarNoord',
            //  label: 'Noord'
            //},
            //{
            //  id: 'knrm.StateGroup.BeschikbaarZuid',
            //  label: 'Zuid'
            //}
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

      //states: [
      //  'reachable',
      //  'unreachable'//com.ask-cs.State.U
      //],

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

      timers: profile.timers,

      init: function ()
      {
        angular.forEach(
          this.states,
          (function (state)
          {
            this.timeline.config.states[state] = this.statesall[state]
          }).bind(this)
        );
      }
    }
  }
);

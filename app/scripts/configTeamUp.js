define(['profile'], function(profile){
  return {
    app: {
      version: '@@version',
      released: '@@released',
      versionInfo: '@@versionInfo',

      title: (localConfig.otapRole.indexOf('production') > -1 ? '' : localConfig.otapRole + '-') + profile.name,
      otapRole: localConfig.otapRole,
      lang: getLanguage(),
      profileName: profile.name,

      statesall: profile.statesall,

      tabs: profile.tabs,

      namespace: "",

      host: localConfig.host,

      videoCallUrl: localConfig.videoChat,
      supportEmail: 'support@ask-cs.com',

      formats: {
        date: 'DD-MM-YYYY',
        time: 'HH:mm',
        datetime: 'DD-MM-YYYY HH:mm',
        datetimefull: 'DD-MM-YYYY HH:mm:ss'
      },

      roles: profile.roles,
      regularPunction: /([A-Za-z0-9-_,!@#$%^&*()\u9999])/g,

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

      //defaults: {
      //  settingsWebPaige: {
      //    user: {
      //      language: 'nl'
      //    },
      //    app: {
      //      widgets: {
      //        groups: {}
      //      }
      //    }
      //  }
      //},

      settings: {
        app: {
          agenda: {
            teams: ['teams'],//"none"|"teams"|"charts",
            members: false
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
  };

  function getLanguage()
  {
    var lang = profile.lang,
      currentHost = window.location.host,
      langs = ['nl', 'de', 'en'];

    langs.forEach(function (val)
    {
      if (currentHost.indexOf('.' + val) > -1)
      {
        lang = val;
      }
    });
    if(currentHost.indexOf('teamtelephone.ask-cs.nl') > -1)
	    lang = 'en';

    return lang;
  }
});

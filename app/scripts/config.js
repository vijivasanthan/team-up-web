define(
  {
    app: {
      version:  '@@version',
      released: '@@released',

      title: 'TeamUp',
      // version:  '0.2.0',
      lang:  'nl',

      fullscreen: true,

      // REMOVE
      demo_users: false,

      profile: {
        meta:      profile.meta,
        title:     profile.title,
        logos:     {
          login: 'profiles/' + profile.meta + '/img/login_logo.png',
          app: ''
        },
        background: 'profiles/' + profile.meta + '/img/login_bg.jpg', // jpg for smaller size,
        p2000:     profile.p2000,
        mobileApp: profile.mobileApp
      },

      statesall: {
        'com.ask-cs.State.Available':              {
          className: 'state-available',
          label:     'Beschikbaar',
          color:     '#4f824f',
          type:      'Beschikbaar'
        },
        'com.ask-cs.State.KNRM.BeschikbaarNoord':  {
          className: 'state-available-north',
          label:     'Beschikbaar voor Noord',
          color:     '#000',
          type:      'Beschikbaar'
        },
        'com.ask-cs.State.KNRM.BeschikbaarZuid':   {
          className: 'state-available-south',
          label:     'Beschikbaar voor Zuid',
          color:     '#e08a0c',
          type:      'Beschikbaar'
        },
        'com.ask-cs.State.Unavailable':            {
          className: 'state-unavailable',
          label:     'Niet Beschikbaar',
          color:     '#a93232',
          type:      'Niet Beschikbaar'
        },
        'com.ask-cs.State.KNRM.SchipperVanDienst': {
          className: 'state-schipper-service',
          label:     'Schipper van Dienst',
          color:     '#e0c100',
          type:      'Beschikbaar'
        },
        'com.ask-cs.State.Unreached':              {
          className: 'state-unreached',
          label:     'Niet Bereikt',
          color:     '#65619b',
          type:      'Niet Beschikbaar'
        }
      },

      host:      profile.host(),
      namespace: profile.ns(),

      formats: {
        date:         'dd-MM-yyyy',
        time:         'HH:mm',
        datetime:     'dd-MM-yyyy HH:mm',
        datetimefull: 'dd-MM-yyyy HH:mm'
      },

      roles: profile.roles,

      mfunctions: profile.mfunctions,

      stateIcons: profile.stateIcons,

      stateColors: profile.stateColors,

      noImgURL: profile.noImgURL,

      timeline: {
        options: {
          axisOnTop:        true,
          width:            '100%',
          height:           'auto',
          selectable:       true,
          editable:         true,
          style:            'box',
          groupsWidth:      '200px',
          eventMarginAxis:  0,
          showCustomTime:   true,
          groupsChangeable: false,
          showNavigation:   false,
          intervalMin: 1000 * 60 * 60 * 1
        },
        config:  {
          zoom:       '0.4',
          bar:        false,
          layouts:    profile.timeline.config.layouts,
          wishes:     false,
          legenda:    {},
          legendarer: false,
          states:     {},
          divisions:  profile.divisions,
          densities:  {
            less:  '#a0a0a0',
            even:  '#ba6a24',
            one:   '#415e6b',
            two:   '#3d5865',
            three: '#344c58',
            four:  '#2f4550',
            five:  '#2c424c',
            six:   '#253943',
            more:  '#486877'
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
          app:  {
            widgets: {
              groups: {}
            }
          }
        }
      },

      cookie: {
        expiry: 30,
        path:   '/'
      },

      init: function ()
      {
        var _this = this;

        angular.forEach(
          profile.states, function (state, index)
          {
            _this.timeline.config.states[state] = _this.statesall[state];
          });
      }


    },

    stateColors: {availalbe: "memberStateAvailalbe", busy: "memberStateBusy", offline: "memberStateOffline", none: "memberStateNone"}
  }
);
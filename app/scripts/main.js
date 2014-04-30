'use strict';

if (window.location.port == '8080')
  document.getElementsByTagName('html')[0].setAttribute('ng-app');

require.config (
  {
    paths: {
      date:               'removables/date',
      angular:            '../vendors/angular/angular.min',
      jquery:             '../vendors/jquery/dist/jquery.min',
      plugins:            'plugins',
      domReady:           '../vendors/requirejs-domready/domReady',
      bootstrap:          '../vendors/bootstrap-sass-official/vendor/assets/javascripts/bootstrap',
      'angular-resource': '../vendors/angular-resource/angular-resource.min',
      'angular-route':    '../vendors/angular-route/angular-route.min',
      'angular-strap':    '../vendors/angular-strap/dist/angular-strap.min',
      lawnchair:          '../vendors/lawnchair/src/Lawnchair',
      dom:                '../vendors/lawnchair/src/adapters/dom',
      moment:             '../vendors/momentjs/min/moment.min',
      timeline:           '../vendors/chap-links-library/js/src/timeline/timeline-min',
      treegrid:           '../vendors/chap-links-library/js/src/treegrid/treegrid-min',
      datepicker:         '../vendors/bootstrap-datepicker/js/bootstrap-datepicker',
      timepicker:         '../vendors/bootstrap-timepicker/js/bootstrap-timepicker.min'
    },
    shim: {
      date:               { deps: [],                       exports: 'date'           },
      plugins:            { deps: ['jquery'],               exports: 'plugins'        },
      angular:            { deps: ['jquery', 'date'],               exports: 'angular'        },
      'angular-resource': { deps: ['angular']                                         },
      'angular-route':    { deps: ['angular']                                         },
      'angular-strap':    { deps: ['angular'],              exports: 'angular-strap'  },
      bootstrap:          { deps: ['jquery'],               exports: 'bootstrap'      },
      lawnchair:          { deps: [],                       exports: 'lawnchair'      },
      dom:                { deps: ['lawnchair'],            exports: 'dom'            },
      momentjs:           { deps: [],                       exports: 'moment'         },
      timeline:           { deps: [],                       exports: 'timeline'       },
      treegrid:           { deps: [],                       exports: 'treegrid'       },
      datepicker:         { deps: ['jquery', 'bootstrap'],  exports: 'datepicker'     },
      timepicker:         { deps: ['jquery', 'bootstrap'],  exports: 'timepicker'     }
    }
  }
);

require (
  [
    'angular',
    'domReady',

    'date',
    'jquery',
    'plugins',

    'angular-resource',
    'angular-route',
    'angular-strap',

    'localization',
    'config',
    'app',
    'run',
    'routes',

    'services/storage',
    'services/session',

    'services/interceptor',
    'services/logger',
    'services/moment',
    'services/offline',
    // 'services/sessioner',
    'services/md5er',
    'services/store',


    'services/clients',
    'services/dater',
    'services/md5',
    'services/messages',
    'services/profile',
    'services/settings',
    'services/sloter',
    'services/strings',
    'services/teams',
    'services/user',

    'directives/widgets',

    'filters/avatars',

    'controllers/clients',
    'controllers/login',
    'controllers/logout',
    'controllers/manage',
    'controllers/messages',
    'controllers/planboard',
    'controllers/profile',
    'controllers/teams',
    'controllers/timeline',
    'controllers/timeline-navigation',
    'controllers/treegrid',

    'bootstrap',
    'lawnchair',
    'dom',
    'moment',
    'timeline',
    'treegrid',
    'datepicker',
    'timepicker'
  ],
  function (angular, domReady)
  {
    'use strict';

    domReady(function () { angular.bootstrap(document, ['TeamUp']) });
  }
);




/**
 * Installation profile
 */
var profile = {

  meta: 'teamup',

  title: 'TeamUp',

  host: function ()
  {
    // return ($.browser.msie) ? '/proxy/ns_knrmtest' : 'http://askpack.ask-cs.com/';
    // return ($.browser.msie) ? '/proxy/ns_knrmtest' : 'http://dev.ask-cs.com/';
    // return ($.browser.msie) ? '/proxy/ns_knrmtest' : 'http://192.168.128.205\\:9000/';
    return 'http://dev.ask-cs.com/';
  },

  ns: function ()
  {
    // return "teamup_michael";
    return "teamup-dev";
  },

  noImgURL : '/img/defaultAvatar.png',

  states: [
    'com.ask-cs.State.Available',
    'com.ask-cs.State.KNRM.BeschikbaarNoord',
    'com.ask-cs.State.KNRM.BeschikbaarZuid',
    'com.ask-cs.State.Unavailable',
    'com.ask-cs.State.KNRM.SchipperVanDienst',
    'com.ask-cs.State.Unreached'
  ],

  timeline: {
    config: {
      layouts: {
        groups:   true,
        members:  true
      }
    }
  },

  // TODO: Remove later on?!
  _divisions: [
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

  divisions: [],

  roles: [
    {
      id: "1",
      label: 'coordinator'
    },
    {
      id: "2",
      label: 'team_member'
    },
    {
      id: "3",
      label: 'client'
    }
  ],

  mfunctions: [
    {
      id: "1",
      label: 'Doctor'
    },
    {
      id: "2",
      label: 'Nurse'
    }
  ],

  stateIcons: [
    {
      name: "Availability",
      data_icon: "&#xe04d;",
      class_name: "icon-user-block"
    },
    {
      name: "Location",
      data_icon: "&#xe21a;",
      class_name: "icon-location4"
    },
    {
      name: "Emotion",
      data_icon: "&#xe0f2;",
      class_name: "icon-smiley"
    },
    {
      name: "Activity",
      data_icon: "&#xe4f2;",
      class_name: "icon-accessibility"
    },
    {
      name: "Reachability",
      data_icon: "&#xe169;",
      class_name: "icon-podcast2"
    }
  ],

  stateColors : {
    availalbe : "memberStateAvailalbe" ,
    busy : "memberStateBusy" ,
    offline : "memberStateOffline" ,
    none : "memberStateNone"
  },

  p2000: {
    status: true,
    url:    'http://knrm.myask.me/rpc/client/p2000.php',
    codes:  '1405545, 1405546, 1735749, 1735748'
  },

  mobileApp: {
    status:   true
  }
};
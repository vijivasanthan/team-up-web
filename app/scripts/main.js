'use strict';

if (window.location.port == '8080')
{
  document.getElementsByTagName('html')[0].setAttribute('ng-app');
}

localStorage.removeItem('TeamUp.periods');
localStorage.removeItem('TeamUp.periodsNext');

require.config(
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
      // 'angular-strap':    '../vendors/angular-strap/dist/angular-strap.min',
      'angular-strap':    'removables/angular-strap.min',
      'ui-bootstrap':     'removables/ui-bootstrap-custom', // TODO: Remove later
      lawnchair:          '../vendors/lawnchair/src/Lawnchair',
      dom:                '../vendors/lawnchair/src/adapters/dom',
      moment:             '../vendors/momentjs/min/moment.min',
      // timeline:           '../vendors/chap-links-library/js/src/timeline/timeline-min',
      timeline:           'removables/timeline',
      treegrid:           '../vendors/chap-links-library/js/src/treegrid/treegrid-min',
      // datepicker:         '../vendors/bootstrap-datepicker/js/bootstrap-datepicker',
      datepicker:         'removables/datepicker.min',
      // timepicker:         '../vendors/bootstrap-timepicker/js/bootstrap-timepicker.min'
      timepicker:         'removables/timepicker.min',
      md5:                '../vendors/web-lib-md5/md5.min'
    },
    shim:  {
      date:               { deps: [], exports: 'date' },
      plugins:            { deps: ['jquery'], exports: 'plugins' },
      angular:            { deps: ['jquery'], exports: 'angular' },
      'angular-resource': { deps: ['angular'] },
      'angular-route':    { deps: ['angular'] },
      'angular-strap':    { deps: ['angular'], exports: 'angular-strap' },
      'ui-bootstrap':     { deps: ['angular', 'bootstrap'], exports: 'ui-bootstrap' },
      bootstrap:          { deps: ['jquery'], exports: 'bootstrap' },
      lawnchair:          { deps: [], exports: 'lawnchair' },
      dom:                { deps: ['lawnchair'], exports: 'dom' },
      momentjs:           { deps: [], exports: 'moment' },
      timeline:           { deps: [], exports: 'timeline' },
      treegrid:           { deps: [], exports: 'treegrid' },
      datepicker:         { deps: ['jquery', 'bootstrap'], exports: 'datepicker' },
      timepicker:         { deps: ['jquery', 'bootstrap'], exports: 'timepicker' },
      md5:                { exports: 'md5'}
    }
  }
);

require(
  [
    'angular',
    'domReady',

    'date',
    'jquery',
    'plugins',

    'angular-resource',
    'angular-route',
    'angular-strap',
    'ui-bootstrap', // TODO: Remove later on

    'localization',
    'config',
    'app',
    'run',
    'routes',

    'services/teamup',
    'services/storage',
    'services/session',

    'services/interceptor',
    'services/logger',
    'services/moment',
    'services/offline',
    'services/md5er',
    'services/store',

    'services/clients',
    'services/dater',
    'services/sloter',
    'services/teams',

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
    'controllers/tasks',
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
    'timepicker',
    'md5'
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
    // return 'http://askpack.ask-cs.com/';
  },

  ns: function ()
  {
    return "teamup-dev";
    // return "teamup-demo";
  },

  noImgURL: '/images/defaultAvatar.png',

  states: [
    'com.ask-cs.State.Available',
    'com.ask-cs.State.KNRM.BeschikbaarNoord',
    'com.ask-cs.State.KNRM.BeschikbaarZuid',
    'com.ask-cs.State.Unavailable',
    'com.ask-cs.State.KNRM.SchipperVanDienst',
    'com.ask-cs.State.Unreached'
  ],

  timeline:  {
    config: {
      layouts: {
        groups:  true,
        members: true
      }
    }
  },

  // TODO: Remove later on?!
  divisions: [
    {
      id:    'all',
      label: 'All divisions'
    },
    {
      id:    'knrm.StateGroup.BeschikbaarNoord',
      label: 'Noord'
    },
    {
      id:    'knrm.StateGroup.BeschikbaarZuid',
      label: 'Zuid'
    }
  ],

  roles: [
    {
      id:    "1",
      label: 'coordinator'
    },
    {
      id:    "2",
      label: 'team_member'
    },
    {
      id:    "3",
      label: 'client'
    }
  ],

  mfunctions: [
    {
      id:    "1",
      label: 'Doctor'
    },
    {
      id:    "2",
      label: 'Nurse'
    }
  ],

  stateIcons: [
    {
      name:       "Availability",
      data_icon:  "&#xe04d;",
      class_name: "icon-user-block"
    },
    {
      name:       "Location",
      data_icon:  "&#xe21a;",
      class_name: "icon-location4"
    },
    {
      name:       "Emotion",
      data_icon:  "&#xe0f2;",
      class_name: "icon-smiley"
    },
    {
      name:       "Activity",
      data_icon:  "&#xe4f2;",
      class_name: "icon-accessibility"
    },
    {
      name:       "Reachability",
      data_icon:  "&#xe169;",
      class_name: "icon-podcast2"
    }
  ],

  stateColors: {
    availalbe: "memberStateAvailalbe",
    busy:      "memberStateBusy",
    offline:   "memberStateOffline",
    none:      "memberStateNone"
  }
};
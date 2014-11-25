'use strict';

if (window.location.port == '8080')
{
  document.getElementsByTagName('html')[0].setAttribute('ng-app');
}

require.config(
  {
    waitSeconds: 100,
    paths: {
      profile: 'profiles/dev/profile',
      date: 'removables/date',
      angular: '../vendors/angular/angular.min',
      jquery: '../vendors/jquery/dist/jquery.min',
      plugins: 'plugins',
      domReady: '../vendors/requirejs-domready/domReady',

      // bootstrap: '../vendors/bootstrap-sass-official/vendor/assets/javascripts/bootstrap',
      bootstrap: '../vendors/bootstrap/dist/js/bootstrap',

      'angular-resource': '../vendors/angular-resource/angular-resource.min',
      'angular-route': '../vendors/angular-route/angular-route.min',
      'angular-md5': '../vendors/angular-md5/angular-md5.min',

      'angular-strap':    '../vendors/angular-strap/dist/angular-strap.min',
      //'angular-strap': 'removables/angular-strap.min',
      'angular-strap-tpl':    '../vendors/angular-strap/dist/angular-strap.tpl.min',
      'ui-bootstrap': 'removables/ui-bootstrap-custom', // TODO: Remove later

      lawnchair: '../vendors/lawnchair/src/Lawnchair',
      dom: '../vendors/lawnchair/src/adapters/dom',
      // timeline:           '../vendors/chap-links-library/js/src/timeline/timeline-min',
      timeline: 'removables/timeline',

      // treegrid:           '../vendors/chap-links-library/js/src/treegrid/treegrid-min',
      treegrid: 'removables/treegrid',

      // datepicker:         '../vendors/bootstrap-datepicker/js/bootstrap-datepicker',
      //datepicker: 'removables/datepicker.min',

      // datepicker:         '../vendors/angular-ui-bootstrap/src/datepicker/datepicker',
      // datepicker:         '../vendors/jquery-ui/ui/jquery.ui.datepicker',
      // timepicker:         '../vendors/bootstrap-timepicker/js/bootstrap-timepicker.min'

      //timepicker: 'removables/timepicker.min',
      underscore: '../vendors/underscore/underscore',
      //md5: '../vendors/web-lib-md5/md5.min',
      store: '../vendors/web-lib-store/dist/store',
      offline: '../vendors/web-lib-offline/dist/offline',
      daterangepicker: '../vendors/bootstrap-daterangepicker/daterangepicker',
      moment: '../vendors/moment/moment',
      phone: '../vendors/web-lib-phonenumber/libphonenumber',
      //moment: '../vendors/momentjs/min/moment-with-langs.min',
      // interceptor: '../vendors/web-lib-interceptor/dist/interceptor',

      log: '../vendors/web-lib-log/dist/log',
      session: '../vendors/web-lib-session/dist/session',

      // vis: '../vendors/vis/dist/vis.min',
      // 'ng-vis': '../vendors/web-lib-vis/public/dist/ng-vis',

      'jquery-form': '../vendors/jquery-form/jquery.form',

      //'async':            '../vendors/requirejs-plugins/src/async',
      // 'angular-google-maps': '../vendors/angular-google-maps/dist/angular-google-maps.min',
      'lodash': '../vendors/lodash/dist/lodash.min',

      'jquery-ui':        '../vendors/jquery-ui/ui/jquery-ui',
      'ui-sortable':      '../vendors/angular-ui-sortable/sortable',
      'ui.bootstrap.pagination': '../vendors/angular-ui-bootstrap/src/pagination/pagination',
      'locale_nl': 'i18n/angular-locale_nl',

      // jszip: '../vendors/js-xlsx/jszip',
      // xlsx: '../vendors/js-xlsx/xlsx'
      'clj-fuzzy': '../vendors/clj-fuzzy/src-js/clj-fuzzy'
    },
    shim: {
      profile: {deps: ['jquery'], exports: 'profile' },
      config: {deps: ['profile'], exports: 'config' },
      date: { deps: [], exports: 'date' },
      plugins: { deps: ['jquery'], exports: 'plugins' },
      angular: { deps: ['jquery'], exports: 'angular' },
      'angular-resource': { deps: ['angular'] },
      'angular-route': { deps: ['angular'] },
      'angular-strap': { deps: ['angular'], exports: 'angular-strap' },
      'angular-strap-tpl': { deps: ['angular','angular-strap'] },
      'angular-md5': { deps: ['angular'] },
      'ui-bootstrap': { deps: ['angular', 'bootstrap'], exports: 'ui-bootstrap' },
      bootstrap: { deps: ['jquery'], exports: 'bootstrap' },
      lawnchair: { deps: [], exports: 'lawnchair' },
      dom: { deps: ['lawnchair'], exports: 'dom' },
      timeline: { deps: [], exports: 'timeline' },
      daterangepicker: { deps: ['jquery', 'moment'], exports: 'daterangepicker' },
      //moment: { deps: [], exports: 'moment' },
      treegrid: { deps: [], exports: 'treegrid' },
      //datepicker: { deps: ['jquery', 'bootstrap'], exports: 'datepicker' },
      //timepicker: { deps: ['jquery', 'bootstrap'], exports: 'timepicker' },
      //md5: { exports: 'md5'},
      underscore: { exports: 'underscore'},
      store: { deps: ['angular', 'underscore']},
      offline: { deps: ['angular'] },

      // interceptor: { deps: ['angular'] },

      log: { deps: ['angular'] },
      phone: { deps: ['angular'] },
      //_moment: { deps: ['angular', 'moment'] },
      session: { deps: ['angular'] },

      // vis: { exports: 'vis' },
      // 'ng-vis': { deps: ['angular', 'vis'], exports: 'ng-vis' },

      'jquery-form': { deps: ['jquery'], exports: 'jquery-form' },

      // 'angular-google-maps': { deps: ['angular'] },
      lodash: { deps: [], exports: 'lodash' },

      'jquery-ui':        { deps: ['jquery'], exports: 'jquery-ui'},
      // 'angular-dragdrop': { deps: ['jquery','jquery-ui'], exports: 'dragdrop'},
      'ui-sortable':      { deps: ['jquery','jquery-ui'], exports: 'ui-sortable' },

      'ui.bootstrap.pagination': { deps: ['angular'] },
      'locale_nl': { deps: ['angular'] }

      // jszip: { exports: 'jszip' },
      // xlsx: { deps: ['jszip'], exports: 'xlsx' }

    }
  }
);

// TODO: Look for ways to reduce the number of files loaded
require(
  [
    'angular',
    'domReady',
    'date',
    'jquery',
    'plugins',
    'angular-resource',
    'angular-route',
    'angular-md5',
    'angular-strap',
    'angular-strap-tpl',
    'ui-bootstrap', // TODO: Remove later on

    'locals',
    'profile',
    'config',
    'app',
    'run',
    'routes',
    'states',

    'services/browsers',
    'services/teamup',
    'services/clients',
    'services/dater', // TODO: Remove later on
    'services/md5',
    'services/sloter',
    'services/stats',
    'services/strings',
    'services/teams',
    'services/phone',
    'services/sloter',
    'services/md5',
    'services/storage',
    'services/stats',

    // 'services/googleGEO',

    'directives/widgets',
    'directives/date-range-picker',
    'directives/log-ranger',
    // 'directives/treegrid',

    'modals/task',
    'modals/slots',
    'modals/logs',
    'modals/agenda',
    'modals/slots',
    'modals/profile',

    'resources/ClientResource',
    'resources/TeamMessageResource',
    'resources/TeamResource',
    'resources/TaskResource',
    'resources/ClientGroupResource',

    'filters/avatars',
    'filters/all-filters',

    'controllers/clients',
    'controllers/login',
    'controllers/manage',
    'controllers/treegridCtrl', // TODO: Remove it later on
    'controllers/messages',
    'controllers/status',
    'controllers/planboard',
    'controllers/vis',
    'controllers/profile',
    'controllers/teams',
    'controllers/tasks',
    'controllers/tasks2',
    'controllers/timeline',
    'controllers/timeline-navigation',
    'controllers/agenda-timeline',
    'controllers/agenda-timeline-navigation',
    'controllers/treegrid',
    'controllers/support',
    'controllers/upload',
    'controllers/admin',
    'controllers/logs',
    'controllers/order',
    'controllers/agenda',

    'bootstrap',
    'lawnchair',
    'dom',
    'timeline',
    'daterangepicker',
    //'moment',
    'treegrid',
    //'datepicker',
    //'timepicker',
    //'md5',
    'underscore',
    'store',
    'offline',
    // 'interceptor',
    'log',
    'phone',
    //'_moment',
    'session',
    // 'vis',
    // 'ng-vis',
    'jquery-form',

    'lodash',
    // 'angular-google-maps',

    'jquery-ui',
    // 'angular-dragdrop',
    'ui-sortable',
    'locale_nl',

    // 'jszip',
    // 'xlsx'
    'clj-fuzzy',
  ],
  function (angular, domReady)
  {
    'use strict';

    domReady(function () { angular.bootstrap(document, ['TeamUp']) });
  }
);

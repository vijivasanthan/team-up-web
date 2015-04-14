'use strict';

if (window.location.port == '8080')
{
  document.getElementsByTagName('html')[0].setAttribute('ng-app');
}

localConfig.wantedProfile = localConfig.defaultProfile;
localConfig.urlHostName = window.location.host;

if (localConfig.urlHostName.indexOf('teamtelefoon') > -1)
  localConfig.wantedProfile = 'teamtelefoon';
else if(localConfig.urlHostName.indexOf('teamup') > -1)
  localConfig.wantedProfile = 'teamup';

require.config(
  {
    waitSeconds: 100,
    paths: {
      jquery: '../vendors/jquery/dist/jquery.min',
      date: 'removables/date',
      angular: '../vendors/angular/angular.min',
      plugins: 'plugins',
      domReady: '../vendors/requirejs-domready/domReady',

      // bootstrap: '../vendors/bootstrap-sass-official/vendor/assets/javascripts/bootstrap',
      bootstrap: '../vendors/bootstrap/dist/js/bootstrap',

      'angular-resource': '../vendors/angular-resource/angular-resource.min',
      'angular-route': '../vendors/angular-route/angular-route.min',
      'angular-cookie': '../vendors/angular-cookie/angular-cookie',
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
      config: 'configTeamUp',

      // datepicker:         '../vendors/bootstrap-datepicker/js/bootstrap-datepicker',
      // datepicker:         '../vendors/jquery-ui/ui/jquery.ui.datepicker',
      // timepicker:         '../vendors/bootstrap-timepicker/js/bootstrap-timepicker.min'

      //timepicker: 'removables/timepicker.min',
      //md5: '../vendors/web-lib-md5/md5.min',
      store: '../vendors/web-lib-store/dist/store',
      'lodash': '../vendors/lodash/lodash.min',
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
      'jquery-ui':        '../vendors/jquery-ui/ui/jquery-ui',
      //'ui-sortable':      '../vendors/angular-ui-sortable/sortable',
      'sortable': '../vendors/Sortable/Sortable',
      'ng-sortable': '../vendors/Sortable/ng-sortable',
      'ui.bootstrap.pagination': '../vendors/angular-ui-bootstrap/src/pagination/pagination',
      'locale_nl': 'i18n/angular-locale_nl',

      // jszip: '../vendors/js-xlsx/jszip',
      // xlsx: '../vendors/js-xlsx/xlsx'
      'clj-fuzzy': '../vendors/clj-fuzzy/src-js/clj-fuzzy',
      mask: 'removables/angular-ui-utils/modules/mask/mask'
    },
    shim: {
      profile: {deps: ['jquery'], exports: 'profile' },
      config: {deps: ['profile'], exports: 'config' },
      date: { deps: [], exports: 'Date' },
      plugins: { deps: ['jquery'], exports: 'jQuery.browser' },
      angular: { deps: ['jquery'], exports: 'angular' },
      'angular-resource': { deps: ['angular'], exports: 'angular' },
      'angular-route': { deps: ['angular'], exports: 'angular' },
      'angular-strap': { deps: ['angular'], exports: 'angular' },
      'angular-strap-tpl': { deps: ['angular','angular-strap'], exports: 'angular' },
      'angular-cookie': { deps: ['angular'], exports: 'angular' },
      'angular-md5': { deps: ['angular'], exports: 'angular' },
      'ui-bootstrap': { deps: ['angular', 'bootstrap'] },
      bootstrap: { deps: ['jquery'], exports: 'jQuery' },
      lawnchair: { deps: [], exports: 'Lawnchair' },
      dom: { deps: ['lawnchair'], exports: 'Lawnchair' },
      timeline: { deps: [], exports: 'links.Timeline' },
      daterangepicker: { deps: ['jquery', 'moment'], exports: 'daterangepicker' },
      //moment: { deps: [], exports: 'moment' },
      treegrid: { deps: [], exports: 'links.TreeGrid' },
      //datepicker: { deps: ['jquery', 'bootstrap'], exports: 'datepicker' },
      //timepicker: { deps: ['jquery', 'bootstrap'], exports: 'timepicker' },
      //md5: { exports: 'md5'},
      mask: { deps: ['angular'] },
      lodash: { exports: '_'},
      store: { deps: ['angular', 'lodash']},
      offline: { deps: ['angular'] },
      'clj-fuzzy': { deps: [], exports: 'clj_fuzzy'},

      // interceptor: { deps: ['angular'] },

      log: { deps: ['angular'] },
      phone: { deps: ['angular'] },
      //_moment: { deps: ['angular', 'moment'] },
      session: { deps: ['angular'] },

      // vis: { exports: 'vis' },
      // 'ng-vis': { deps: ['angular', 'vis'], exports: 'ng-vis' },

      // 'angular-google-maps': { deps: ['angular'] },

      'jquery-ui':        { deps: ['jquery'], exports: '$.Widget'},
      // 'angular-dragdrop': { deps: ['jquery','jquery-ui'], exports: 'dragdrop'},
      //'ui-sortable':      { deps: ['jquery','jquery-ui'], exports: 'ui-sortable' },

      'ui.bootstrap.pagination': { deps: ['angular'] },
      'locale_nl': { deps: ['angular'] }

      // jszip: { exports: 'jszip' },
      // xlsx: { deps: ['jszip'], exports: 'xlsx' }

    },
    config: {
      moment: {
        noGlobal: true
      }
    }
  }
);

var profile = null;

switch (localConfig.wantedProfile)
{
  case "teamup":
    profile = 'profiles/teamup/profileApp';
    break;
  case "teamtelefoon":
    profile = 'profiles/teamtelefoon/profileApp';
    break;
  case "decentrale-demo":
    profile = 'profiles/decentrale-demo/profileApp';
    break;
  default:
    profile = 'profiles/teamup/profileApp';
}

require.config({
    paths: {
      profile: profile
    }
});

// TODO: Look for ways to reduce the number of files loaded
require(
  [
    'angular',
    'domReady',
    'date',
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
    'services/sloter',
    'services/stats',
    'services/strings',
    'services/teams',
    'services/phone',
    'services/sloter',
    'services/md5',
    'services/storage',
    'services/stats',
    'services/pincode',
    'services/reports',
    'services/rejections',
    'services/currentSelection',
    'services/moment',
    'services/settings',

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
    'modals/permission',
    'modals/testModal',
    'modals/profile',
    'modals/report',

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
    'controllers/help',
    'controllers/upload',
    'controllers/admin',
    'controllers/logs',
    'controllers/order',
    'controllers/agenda',
    'controllers/exampleTest',

    'bootstrap',
    'lawnchair',
    'dom',
    'timeline',
    'daterangepicker',
    'treegrid',
    'mask',
    'store',
    'offline',
    'log',
    'phone',
    'session',
    // 'vis',
    // 'ng-vis',
    'jquery-form',

    'lodash',
    // 'angular-google-maps',

    'jquery-ui',
    // 'angular-dragdrop',
    //'ui-sortable',
    //'Sortable',
    'ng-sortable',
    'locale_nl',

    // 'jszip',
    // 'xlsx'
    'clj-fuzzy'
  ],
  function (angular, domReady)
  {
    'use strict';

    domReady(function () { angular.bootstrap(document, ['TeamUp']) });
  }
);

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
      spin: '../vendors/ladda/dist/spin.min',
      ladda: '../vendors/ladda/dist/ladda.min',
      bootstrap: '../vendors/bootstrap/dist/js/bootstrap',
      'angular-resource': '../vendors/angular-resource/angular-resource.min',
      'angular-route': '../vendors/angular-route/angular-route.min',
      'angular-animate': '../vendors/angular-animate/angular-animate.min',
      'angular-messages': '../vendors/angular-messages/angular-messages.min',
      'angular-cookie': '../vendors/angular-cookie/angular-cookie',
      'angular-md5': '../vendors/angular-md5/angular-md5.min',
      'angular-dynamic-locale': '../vendors/angular-dynamic-locale/tmhDynamicLocale.min',
      'angular-strap':    '../vendors/angular-strap/dist/angular-strap.min',
      'angular-strap-tpl':    '../vendors/angular-strap/dist/angular-strap.tpl.min',
      'angular-sortable-view': '../vendors/angular-sortable-view/src/angular-sortable-view',
      lawnchair: '../vendors/lawnchair/src/Lawnchair',
      dom: '../vendors/lawnchair/src/adapters/dom',
      timeline: 'removables/timeline',
      treegrid: 'removables/treegrid',
      config: 'configTeamUp',
      'lodash': '../vendors/lodash/lodash.min',
      offline: '../vendors/web-lib-offline/dist/offline',
      daterangepicker: '../vendors/bootstrap-daterangepicker/daterangepicker',
      moment: '../vendors/moment/min/moment-with-locales',
      'moment-timezone': '../vendors/moment-timezone/builds/moment-timezone-with-data-2010-2020.min',
      phone: '../vendors/web-lib-phonenumber/libphonenumber',
      log: '../vendors/web-lib-log/dist/log',
      session: '../vendors/web-lib-session/dist/session',
      'jquery-form': '../vendors/jquery-form/jquery.form',
      'locale': 'i18n/angular-locale_nl',
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
      'angular-animate': { deps: ['angular'], exports: 'angular' },
      'angular-messages': { deps: ['angular'], exports: 'angular' },
      'angular-strap': { deps: ['angular'], exports: 'angular' },
      'angular-strap-tpl': { deps: ['angular','angular-strap'], exports: 'angular' },
      'angular-cookie': { deps: ['angular'], exports: 'angular' },
      'angular-dynamic-locale': { deps: ['angular'], exports: 'angular' },
      'angular-sortable-view': { deps: ['angular'], exports: 'angular' },
      'angular-md5': { deps: ['angular'], exports: 'angular' },
      bootstrap: { deps: ['jquery'], exports: 'jQuery' },
      lawnchair: { deps: [], exports: 'Lawnchair' },
      'ladda': { deps: [],  exports: 'Ladda'},
      dom: { deps: ['lawnchair'], exports: 'Lawnchair' },
      timeline: { deps: [], exports: 'links.Timeline' },
      daterangepicker: { deps: ['jquery', 'moment'], exports: 'daterangepicker' },
      treegrid: { deps: [], exports: 'links.TreeGrid' },
      mask: { deps: ['angular'] },
      lodash: { exports: '_'},
      offline: { deps: ['angular'] },
      'clj-fuzzy': { deps: [], exports: 'clj_fuzzy'},
      log: { deps: ['angular'] },
      phone: { deps: ['angular'] },
      session: { deps: ['angular'] },
      'locale': { deps: ['angular'] }
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
    'angular-animate',
    'angular-md5',
    'angular-messages',
    'angular-strap',
    'angular-strap-tpl',
    'angular-dynamic-locale',

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
    'services/store',
    'services/login',
    'services/team',
    'services/member',
    'services/password',
    'services/taskCRUD',

    'directives/widgets',
    'directives/date-range-picker',
    'directives/log-ranger',
    'directives/ladda-button',

    'modals/task',
    'modals/slots',
    'modals/logs',
    'modals/agenda',
    'modals/slots',
    'modals/permission',
    'modals/testModal',
    'modals/profile',
    'modals/report',
    'modals/message',

    'resources/ClientResource',
    'resources/TeamMessageResource',
    'resources/TeamResource',
    'resources/TaskResource',
    'resources/ClientGroupResource',

    'filters/avatars',
    'filters/all-filters',

    'controllers/clients',
    'controllers/login/login',
    'controllers/manage/manage',
    'controllers/manage/treegridCtrl', // TODO: Remove it later on
    'controllers/chat',
    'controllers/team-telephone/status',
    'controllers/task/planboard/planboard',
    'controllers/old/vis',
    'controllers/profile',
    'controllers/old/teams',
    'controllers/old/tasks',
    'controllers/task/tasks2',
    'controllers/task/saveTask',
    'controllers/task/myTasks',
    'controllers/task/allTasks',
    'controllers/task/planboard/timeline',
    'controllers/task/planboard/timeline-navigation',
    'controllers/team-telephone/timeline/agenda-timeline',
    'controllers/team-telephone/timeline/agenda-timeline-navigation',
    'controllers/manage/treegrid',
    'controllers/help',
    'controllers/task/upload',
    'controllers/old/admin',
    'controllers/team-telephone/logs',
    'controllers/team-telephone/order',
    'controllers/team-telephone/timeline/agenda',
    'controllers/old/exampleTest',
    'controllers/team-telephone/phones',
    'controllers/video',
    'controllers/team-telephone/options',
    'controllers/team-telephone/scenario',
    'controllers/team/member',
    'controllers/team/newMember',
    'controllers/team/searchMember',
    'controllers/team/team',
    'controllers/login/password',

    'bootstrap',
    'lawnchair',
    'dom',
    'timeline',
    'daterangepicker',
    'treegrid',
    'mask',
    'offline',
    'log',
    'phone',
    'session',
    'jquery-form',
    'lodash',
    'angular-sortable-view',
    'locale',
    'clj-fuzzy',
    'ladda'
  ],
  function (angular, domReady)
  {
    'use strict';

    domReady(function () { angular.bootstrap(document, ['TeamUp']) });
  }
);

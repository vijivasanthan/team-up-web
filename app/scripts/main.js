'use strict';

if (window.location.port == '8080')
{
  document.getElementsByTagName('html')[0].setAttribute('ng-app');
}

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
      underscore:         '../vendors/underscore/underscore',
      md5:                '../vendors/web-lib-md5/md5.min',
      store:              '../vendors/web-lib-store/dist/store',
      offline:            '../vendors/web-lib-offline/dist/offline',
      interceptor:        '../vendors/web-lib-interceptor/dist/interceptor',
      log:                '../vendors/web-lib-log/dist/log',
      _moment:            '../vendors/web-lib-moment/dist/moment',
      session:            '../vendors/web-lib-session/dist/session',
      vis:                '../vendors/vis/dist/vis.min',
      'ng-vis':           '../vendors/web-lib-vis/public/dist/ng-vis'
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
      moment:             { deps: [], exports: 'moment' },
      timeline:           { deps: [], exports: 'timeline' },
      treegrid:           { deps: [], exports: 'treegrid' },
      datepicker:         { deps: ['jquery', 'bootstrap'], exports: 'datepicker' },
      timepicker:         { deps: ['jquery', 'bootstrap'], exports: 'timepicker' },
      md5:                { exports: 'md5'},
      underscore:         { exports: 'underscore'},
      store:              { deps: ['angular', 'underscore']},
      offline:            { deps: ['angular'] },
      interceptor:        { deps: ['angular'] },
      log:                { deps: ['angular'] },
      _moment:            { deps: ['angular', 'moment'] },
      session:            { deps: ['angular'] },
      vis:                { exports: 'vis' },
      'ng-vis':           { deps: ['angular', 'vis'], exports: 'ng-vis' }
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

    'locals',
    'config',
    'app',
    'run',
    'routes',
    'states',
    'services/browsers',

    'services/teamup',

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

    'controllers/vis',

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

    'md5',

    'underscore',

    'store',

    'offline',
    'interceptor',
    'log',
    '_moment',
    'session',
    'vis',
    'ng-vis'
  ],
  function (angular, domReady)
  {
    'use strict';

    domReady(function () { angular.bootstrap(document, ['TeamUp']) });
  }
);
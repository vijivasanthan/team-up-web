'use strict';

if (window.location.port == '8080')
  document.getElementsByTagName('html')[0].setAttribute('ng-app');

require.config (
  {
    paths: {
      angular:            '../vendors/angular/angular.min',
      jquery:             '../vendors/jquery/dist/jquery.min',
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
      angular:            { deps: ['jquery'],               exports: 'angular'        },
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
    'jquery',
    'angular-resource',
    'angular-route',
    'angular-strap',

    'config',
    'app',
    'routes',
    'run',

    'controllers/login',
    // 'controllers/partial1',
    // 'controllers/partial2',

    // 'directives/appVersion',

    'filters/avatars',

    // 'services/version',

    'services/interceptor',
    'services/logger',
    'services/moment',
    'services/offline',
    'services/session',
    'services/md5',
    'services/store',

    'bootstrap',
    'lawnchair',
    'dom',
    'moment',
    'timeline',
    'datepicker',
    'timepicker'
  ],
  function (angular, domReady)
  {
    'use strict';

    domReady(function () { angular.bootstrap(document, ['TeamUp']) });
  }
);
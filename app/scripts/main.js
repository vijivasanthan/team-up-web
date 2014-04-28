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
      lawnchair:          '../vendors/lawnchair/src/Lawnchair',
      dom:                '../vendors/lawnchair/src/adapters/dom'
    },
    shim: {
      angular:            { deps: ['jquery'], exports: 'angular' },
      'angular-resource': { deps: ['angular'] },
      'angular-route':    { deps: ['angular'] },
      bootstrap:          { deps: ['jquery'], exports: 'bootstrap' },
      lawnchair:          { exports: 'lawnchair' },
      dom:                { deps: ['lawnchair'], exports: 'dom' }
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

    'config',
    'app',
    'routes',
    'run',

    'controllers/home',
    'controllers/partial1',
    'controllers/partial2',

    'directives/appVersion',

    'filters/interpolate',

    'services/version',
    'services/session',
    'services/md5',
    'services/store',

    'bootstrap',
    'lawnchair',
    'dom'
  ],
  function (angular, domReady)
  {
    'use strict';

    domReady(function () { angular.bootstrap(document, ['MyApp']) });
  }
);
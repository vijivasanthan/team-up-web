module.exports = function (karma)
{
  'use strict';

  karma.set({
    frameworks: ['jasmine', 'requirejs'],
    files: [
      {pattern: 'app/vendors/jquery/dist/jquery.js', included: false },
      {pattern: 'app/vendors/angular/angular.js', included: false },
      {pattern: 'app/vendors/angular-mocks/angular-mocks.js', included: false },
      {pattern: 'app/vendors/bootstrap/dist/js/bootstrap.js', included: false},
      {pattern: 'app/vendors/angular-resource/angular-resource.min.js', included: false },
      {pattern: 'app/vendors/angular-route/angular-route.min.js', included: false },
      {pattern: 'app/vendors/angular-animate/angular-animate.min.js', included: false },
      {pattern: 'app/vendors/angular-md5/angular-md5.min.js', included: false },
      {pattern: 'app/vendors/angular-strap/dist/angular-strap.min.js', included: false },
      {pattern: 'app/vendors/angular-strap/dist/angular-strap.tpl.min.js', included: false },
      {pattern: 'app/vendors/angular-cookie/angular-cookie.js', included: false },
      {pattern: 'app/vendors/angular-dynamic-locale/tmhDynamicLocale.min.js', included: false },
      {pattern: 'app/vendors/angular-sortable-view/src/angular-sortable-view.js', included: false },
      {pattern: 'app/vendors/jquery-ui/ui/jquery-ui.js', included: false },
      {pattern: 'app/vendors/bootstrap-daterangepicker/daterangepicker.js', included: false },
      {pattern: 'app/vendors/moment/min/moment-with-locales.js', included: false },
      {pattern: 'app/vendors/moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js', included: false },
      {pattern: 'app/vendors/lawnchair/src/Lawnchair.js', included: false },
      {pattern: 'app/vendors/lawnchair/src/adapters/dom.js', included: false },
      {pattern: 'app/vendors/lodash/lodash.min.js', included: false },
      {pattern: 'app/vendors/angular-cookie/angular-cookie.js', included: false },
      {pattern: 'app/vendors/web-lib-session/dist/session.js', included: false },
      // {pattern: 'app/vendors/**/*.js',        included: false},
      {pattern: 'app/scripts/*.js',           included: false},
      {pattern: 'app/scripts/**/*.js',        included: false},
      {pattern: 'test/spec/controllers/*.js', included: false},
      {pattern: 'test/spec/services/*.js', included: false},
      //{pattern: 'test/spec/controllers/statusSpec.js', included: false},
      //{pattern: 'test/spec/controllers/exampleSpec.js', included: false},
      // {pattern: 'test/spec/directives/*.js',  included: false},
      // {pattern: 'test/spec/filters/*.js',     included: false},
      // {pattern: 'test/spec/services/*.js',    included: false},
      'test/spec/test-unit-main.js',
      'test/spec/testConfig.js'
    ],
    basePath: '',
    exclude: [
      'app/scripts/main.js',
      //'test/spec/controllers/statusSpec.js',
      'app/scripts/removables/**/*Spec.js'
    ],
    port: 8080,
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: karma.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    captureTimeout: 10000,
    singleRun: false
  });
};
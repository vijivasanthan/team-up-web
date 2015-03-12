module.exports = function (karma)
{
  'use strict';

  karma.set({
    frameworks: ['jasmine', 'requirejs'],
    files: [
      {pattern: 'app/vendors/jquery/dist/jquery.js', included: false },
      {pattern: 'app/vendors/angular/angular.js', included: false },
      {pattern: 'app/vendors/angular-mocks/angular-mocks.js', included: false },
      {pattern: 'app/vendors/angular-resource/angular-resource.min.js', included: false },
      {pattern: 'app/vendors/angular-route/angular-route.min.js', included: false },
      {pattern: 'app/vendors/angular-md5/angular-md5.min.js', included: false },
      {pattern: 'app/vendors/angular-strap/dist/angular-strap.min.js', included: false },
      {pattern: 'app/vendors/angular-strap/dist/angular-strap.tpl.min.js', included: false },
      {pattern: 'app/vendors/angular-cookie/angular-cookie.js', included: false },
      {pattern: 'app/vendors/jquery-ui/ui/jquery-ui.js', included: false },
      {pattern: 'app/vendors/bootstrap-daterangepicker/daterangepicker.js', included: false },
      {pattern: 'app/vendors/moment/moment.js', included: false },
      //{pattern: 'app/vendors/angular-ui-sortable/sortable.js', included: false },
      {pattern: 'app/vendors/Sortable/Sortable.js', included: false },
      {pattern: 'app/vendors/Sortable/ng-sortable.js', included: false },
      {pattern: 'app/vendors/angular-ui-bootstrap/src/pagination/pagination.js', included: false },
      {pattern: 'app/vendors/underscore/underscore.js', included: false },
      {pattern: 'app/vendors/angular-cookie/angular-cookie.js', included: false },
      // {pattern: 'app/vendors/**/*.js',        included: false},
      {pattern: 'app/scripts/*.js',           included: false},
      {pattern: 'app/scripts/**/*.js',        included: false},
      {pattern: 'test/spec/controllers/*.js', included: false},
      // {pattern: 'test/spec/directives/*.js',  included: false},
      // {pattern: 'test/spec/filters/*.js',     included: false},
      // {pattern: 'test/spec/services/*.js',    included: false},
      'test/spec/test-unit-main.js'
    ],
    basePath: '',
    exclude: [
      'app/scripts/main.js',
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
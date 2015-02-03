var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    // Removed "Spec" naming from files
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}


requirejs.config(
  {
    baseUrl: '/base/app/scripts',

    paths: {
      config: 'config',
      angular:      '../vendors/angular/angular',
      jquery:       '../vendors/jquery/dist/jquery',
      plugins: 'plugins',
      'angular-resource': '../vendors/angular-resource/angular-resource.min',
      'angular-route': '../vendors/angular-route/angular-route.min',
      'angular-md5': '../vendors/angular-md5/angular-md5.min',
      'angular-strap':    '../vendors/angular-strap/dist/angular-strap.min',
      'angular-strap-tpl':    '../vendors/angular-strap/dist/angular-strap.tpl.min',
      domReady:     '../vendors/requirejs-domready/domReady',
      'angular-mocks': '../vendors/angular-mocks/angular-mocks',
      mask: 'removables/angular-ui-utils/modules/mask/mask'
      // unitTest:     '../../test/spec'
    },

    shim: {
      localConfig: {deps: ['jquery'], exports: 'localConfig' },
      profile: {deps: ['jquery'], exports: 'profile' },
      config: {deps: ['profile', 'localConfig'], exports: 'config' },
      plugins: { deps: ['jquery'], exports: 'plugins' },
      'angular-resource': { deps: ['angular'] },
      'angular-route': { deps: ['angular'] },
      'angular-md5': { deps: ['angular'] },
      'angular-strap': { deps: ['angular'] },
      'angular-strap-tpl': { deps: ['angular','angular-strap'] },
      angular: {
        deps:    ['jquery'],
        exports: 'angular'
      },
      'angular-mocks': {
        deps: ['angular'],
        exports: 'angular.mock'
      },
      mask: { deps: ['angular'] }
    },

    deps: tests,

    callback: window.__karma__.start
  }
);

requirejs.config({
  paths: {
    localConfig: 'localConfig',
    profile: 'profiles/teamup/profile'
  }
});
/*jslint node: true */
'use strict';


/**
 * Main compiler for app
 */
module.exports = function (grunt)
{
  grunt.initConfig(
  {
    pkg: grunt.file.readJSON('package.json'),

    /**
     * concat
     */
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        files: {
          'war/src/app.js': [
            'war/js/localization.js',
            'war/js/webpaige.js',
            'war/js/config.js',
            'war/js/routes.js',
            'war/js/bootstrap.js',
            // modals
            // 'war/js/modals/user.js',
            // 'war/js/modals/dashboard.js',
            'war/js/modals/core.js',
            // 'war/js/modals/profile.js',
            // 'war/js/modals/settings.js',
            // directives
            'war/js/directives/directives.js',
            'war/libs/angular-strap/0.7.0/angular-strap.min.js',
            // services
            // 'war/js/services/timer.js',
            // 'war/js/services/session.js',
            // 'war/js/services/dater.js',
            // 'war/js/services/eventbus.js',
            // 'war/js/services/interceptor.js',
            // 'war/js/services/md5.js',
            'war/js/services/storage.js',
            'war/js/services/strings.js',
            'war/js/services/generators.js',
            // 'war/js/services/sloter.js',
            // 'war/js/services/stats.js',
            // 'war/js/services/offsetter.js',
            // filters
            'war/js/filters/filters.js',
            // controllers
            'war/js/controllers/login.js',
            'war/js/controllers/forgotpass.js',
            'war/js/controllers/register.js',
            // 'war/js/controllers/logout.js',
            // 'war/js/controllers/dashboard.js',
            'war/js/controllers/core.js',
            // 'war/js/controllers/profile.js',
            // 'war/js/controllers/settings.js',
            // 'war/js/controllers/help.js'
          ],
          'war/src/plugins.js': [
            'war/js/plugins/console.js',
            'war/js/plugins/browser.js',
            'war/js/plugins/os.js',
            'war/js/plugins/basket.js',
            'war/js/plugins/screenfull.js'
          ]
        }
      }
    },

    /**
     * minify concated sources
     */
    uglify: {
      options: {
        banner: '/*!\n * OneLine v0.1.0 (snapshot)\n * Ask Community Systems\n * Authors: Cengiz Ulusoy\n * <%= grunt.template.today("dd-mm-yyyy hh:mm") %>\n */\n'
      },
      dist: {
        files: {
          'war/dist/app.min.js':     'war/src/app.js',
          'war/dist/plugins.min.js': 'war/src/plugins.js'
        }
      }
    },

    /**
     * sass compiler
     */
    sass: {
      options: {
        trace: true,
        cacheLocation:  'sass/.sass-cache'
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'war/dist/bootstrap.css':   'sass/bootstrap.scss',
          'war/dist/responsive.css':  'sass/responsive.scss',
          'war/dist/app.css':         'sass/app.scss'
        }
      },
      dev: {
        options: {
          style: 'expanded' // nested (default), compact, compressed, or expanded
        },
        files: {
          'war/css/bootstrap.css':   'sass/bootstrap.scss',
          'war/css/responsive.css':  'sass/responsive.scss',
          'war/css/app.css':         'sass/app.scss'
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments:     true,
          collapseWhitespace: true
        },
        files: {
          'war/dist/views/login.html':        'war/js/views/login.html',
          'war/dist/views/forgotpass.html':   'war/js/views/forgotpass.html',
          'war/dist/views/register.html':     'war/js/views/register.html',
          // 'war/dist/views/logout.html':    'war/js/views/logout.html',
          // 'war/dist/views/dashboard.html': 'war/js/views/dashboard.html',
          'war/dist/views/core.html':         'war/js/views/core.html',
          // 'war/dist/views/profile.html':   'war/js/views/profile.html',
          // 'war/dist/views/settings.html':  'war/js/views/settings.html',
          // 'war/dist/views/help.html':      'war/js/views/help.html'
        }
      }
    },

    /**
     * watch for changes
     */
    watch: {
      js: {
        files: [
          'war/js/controllers/*.js',
          'war/js/directives/*.js',
          'war/js/filters/*.js',
          'war/js/modals/*.js',
          'war/js/plugins/*.js',
          'war/js/services/*.js',
          'war/js/*.js'
        ],
        tasks: ['concat', 'uglify']
      },
      css: {
        files: [
          'sass/**/*.scss'
        ],
        tasks: ['sass']
      },
      html: {
        files: [
          'war/js/views/**/*.html'
        ],
        tasks: ['htmlmin']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.registerTask('watchjs',   ['watch:js']);
  grunt.registerTask('watchcss',  ['watch:css']);
  grunt.registerTask('watchhtml', ['watch:html']);
  grunt.registerTask('html',      ['htmlmin']);
  grunt.registerTask('sasser',    ['sass']);
  grunt.registerTask('webpaige',  ['concat', 'uglify', 'sasser', 'htmlmin']);

};
(function() {
  'use strict';
  var LIVERELOAD_PORT, lrSnippet, markdown, mountFolder, semver;

  LIVERELOAD_PORT = 35729;

  lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
  });

  mountFolder = function(connect, dir) {
    return connect["static"](require('path').resolve(dir));
  };

  markdown = require('marked');

  semver = require('semver');

  module.exports = function(grunt) {
    var appConfig;
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    appConfig = {
      app: 'app',
      dist: 'dist'
    };
    try {
      appConfig.app = require('./bower.json').appPath || appConfig.app;
    } catch (_error) {}
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      paths: appConfig,
      gitinfo: {},
      jade: {
        index: {
          options: {
            pretty: true
          },
          files: {
            '.tmp/index.html': ['<%= paths.app %>/index.jade']
          }
        },
        versions: {
          options: {
            pretty: true
          },
          files: {
            '.tmp/versions.html': ['<%= paths.app %>/versions.jade']
          }
        },
        logout: {
          options: {
            pretty: true
          },
          files: {
            '.tmp/logout.html': ['<%= paths.app %>/logout.jade']
          }
        },
        views: {
          options: {
            pretty: true
          },
          files: [
            {
              expand: true,
              cwd: '<%= paths.app %>',
              dest: '.tmp',
              src: 'views/**/*.jade',
              ext: '.html'
            }
          ]
        }
      },
      validation: {
        options: [
          {
            charset: 'utf-8',
            doctype: 'HTML5',
            failHard: true,
            reset: true,
            relaxerror: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.', 'Element img is missing required attribute src.']
          }
        ],
        files: [
          {
            src: '_gh_pages/**/*.html'
          }
        ]
      },
      watch: {
        jade: {
          files: ['<%= paths.app %>/{,**/}*.jade'],
          tasks: ['jade']
        },
        coffee: {
          files: ['<%= paths.app %>/scripts/{,*/}*.coffee'],
          tasks: ['coffee:dist']
        },
        coffeeTest: {
          files: ['test/coffee/spec/{,*/}*.coffee', 'test/coffee/e2e/{,*/}*.coffee'],
          tasks: ['coffee:testUnit', 'coffee:testEnd']
        },
        compass: {
          files: ['<%= paths.app %>/styles/{,*/}{,*/}*.{scss,sass}'],
          tasks: ['compass:server']
        },
        livereload: {
          options: {
            livereload: LIVERELOAD_PORT
          },
          files: ['.tmp/{,*/}*.html', '{.tmp,<%= paths.app %>}/styles/{,*/}*.css', '{.tmp,<%= paths.app %>}/scripts/{,*/}*.js', '<%= paths.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}']
        }
      },
      connect: {
        options: {
          port: 4000,
          hostname: '0.0.0.0',
          //open: true
        },
        //server: {
        //  proxies: [
        //    {
        //      context: '/',
        //      host: '192.168.128.25',
        //      https: true
        //    }
        //  ]
        //},
        livereload: {
          options: {
            middleware: function(connect, options) {
              return [
                lrSnippet,
                mountFolder(connect, '.tmp'),
                mountFolder(connect, appConfig.app)
              ];
            }
          }
        },
        test: {
          options: {
            middleware: function(connect) {
              return [mountFolder(connect, '.tmp'), mountFolder(connect, 'test')];
            }
          }
        },
        dist: {
          options: {
            middleware: function(connect) {
              return [mountFolder(connect, appConfig.dist)];
            }
          }
        }
      },
      autoprefixer: {
        options: ["last 1 version"],
        dist: {
          files: [
            {
              expand: true,
              cwd: ".tmp/styles/",
              src: "{,*/}*.css",
              dest: ".tmp/styles/"
            }
          ]
        }
      },
      clean: {
        dist: {
          files: [
            {
              dot: true,
              src: ['.tmp', '<%= paths.dist %>/*', '!<%= paths.dist %>/vendors*', '!<%= paths.dist %>/.git*']
            }
          ]
        },
        server: '.tmp',
        rest: '<%= paths.dist %>/scripts/{,*/}*.coffee'
      },
      jshint: {
        options: {
          jshintrc: '.jshintrc'
        },
        all: ['Gruntfile.js', '<%= paths.app %>/scripts/{,*/}*.js']
      },
      coffeelint: {
        options: {
          no_trailing_whitespace: {
            level: 'error'
          }
        },
        app: ['<%= paths.app %>/scripts/{,*/}*.coffee'],
        tests: {
          files: {
            src: ['test/e2e/{,*/}*.coffee', 'test/spec/{,*/}*.coffee']
          }
        }
      },
      coffee: {
        options: {
          sourceMap: true,
          sourceRoot: ''
        },
        dist: {
          files: [
            {
              expand: true,
              cwd: '<%= paths.app %>/scripts',
              src: '{,*/}*.coffee',
              dest: '.tmp/scripts',
              ext: '.js'
            }
          ]
        },
        testUnit: {
          files: [
            {
              expand: true,
              cwd: 'test/coffee/spec',
              src: '{,*/}*.coffee',
              dest: 'test/tests/spec',
              ext: '.js'
            }
          ]
        },
        testEnd: {
          files: [
            {
              expand: true,
              cwd: 'test/coffee/e2e',
              src: '{,*/}*.coffee',
              dest: 'test/tests/e2e',
              ext: '.js'
            }
          ]
        }
      },
      compass: {
        options: {
          sassDir: '<%= paths.app %>/styles',
          cssDir: '.tmp/styles',
          generatedImagesDir: '.tmp/images/generated',
          imagesDir: '<%= paths.app %>/images',
          javascriptsDir: '<%= paths.app %>/scripts',
          fontsDir: '<%= paths.app %>/styles/fonts',
          importPath: '<%= paths.app %>/vendors',
          httpImagesPath: '/images',
          httpGeneratedImagesPath: '/images/generated',
          httpFontsPath: '/styles/fonts',
          relativeAssets: false,
          noLineComments: true
        },
        dist: {},
        server: {
          options: {
            debugInfo: false
          }
        }
      },
      rev: {
        dist: {
          files: {
            src: ['<%= paths.dist %>/scripts/localConfig.js', '<%= paths.dist %>/scripts/main.js', '<%= paths.dist %>/styles/{,*/}*.css', '<%= paths.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}', '<%= paths.dist %>/styles/fonts/*']
          }
        },
        js: {
          src: ['<%= paths.dist %>/scripts/configTeamUp.js', '<%= paths.dist %>/scripts/profiles/**/profileApp.js']
        }
      },
      useminPrepare: {
        html: '.tmp/index.html',
        options: {
          dest: '<%= paths.dist %>'
        }
      },
      usemin: {
        html: ['<%= paths.dist %>/{,*/}*.html'],
        css: ['<%= paths.dist %>/styles/{,*/}*.css'],
        js: ['<%= paths.dist %>/scripts/*.js', '<%= paths.dist %>/scripts/profiles/**/*.js'],
        options: {
          dirs: ['<%= paths.dist %>'],
          patterns: {
            js: [
              [
                /(configTeamUp)/, 'Replacing config', ((function(_this) {
                  return function(path) {
                    return path + '.js';
                  };
                })(this)), ((function(_this) {
                  return function(path) {
                    return path.slice(0, -3);
                  };
                })(this))
              ], [
                /(profiles\/teamtelefoon\/profileApp)/, 'Replacing profile', ((function(_this) {
                  return function(path) {
                    return path + '.js';
                  };
                })(this)), ((function(_this) {
                  return function(path) {
                    return path.slice(0, -3);
                  };
                })(this))
              ], [
                /(profiles\/teamup\/profileApp)/, 'Replacing profile', ((function(_this) {
                  return function(path) {
                    return path + '.js';
                  };
                })(this)), ((function(_this) {
                  return function(path) {
                    return path.slice(0, -3);
                  };
                })(this))
              ], [
                /(profiles\/decentrale-demo\/profileApp)/, 'Replacing profile', ((function(_this) {
                  return function(path) {
                    return path + '.js';
                  };
                })(this)), ((function(_this) {
                  return function(path) {
                    return path.slice(0, -3);
                  };
                })(this))
              ]
            ]
          }
        }
      },
      svgmin: {
        dist: {
          files: [
            {
              expand: true,
              cwd: "<%= paths.app %>/images",
              src: "{,*/}*.svg",
              dest: "<%= paths.dist %>/images"
            }
          ]
        }
      },
      imagemin: {
        dist: {
          files: [
            {
              expand: true,
              cwd: '<%= paths.app %>/images',
              src: '{,*/}*.{png,jpg,jpeg}',
              dest: '<%= paths.dist %>/images'
            }
          ]
        }
      },
      cssmin: {},
      htmlmin: {
        dist: {
          options: {},
          files: [
            {
              expand: true,
              cwd: '.tmp',
              src: ['*.html', 'views/**/*.html'],
              dest: '<%= paths.dist %>'
            }
          ]
        }
      },
      copy: {
        dist: {
          files: [
            {
              expand: true,
              dot: true,
              cwd: '<%= paths.app %>',
              dest: '<%= paths.dist %>',
              src: ['*.{ico,png,txt}', '.htaccess', 'vendors/**/*', 'downloads/*', 'images/{,*/}*.{gif,webp}', 'fonts/**/*']
            }, {
              expand: true,
              cwd: '.tmp/images',
              dest: '<%= paths.dist %>/images',
              src: ['generated/*']
            }, {
              expand: true,
              cwd: '<%= paths.app %>',
              dest: '.tmp',
              src: ["scripts/{,**/}*", "vendors/{,**/}*"]
            }
          ]
        },
        styles: {
          expand: true,
          cwd: "<%= paths.app %>/styles",
          dest: ".tmp/styles/",
          src: "{,*/}*.css"
        },
        rest: {
          expand: true,
          cwd: ".tmp/scripts",
          dest: "<%= paths.dist %>/scripts/",
          src: "{,*/}*"
        }
      },
      concurrent: {
        server: ['coffee:dist', 'compass:server', 'jade', 'copy:styles'],
        test: ['coffee:testUnit', 'coffee:testEnd', 'compass', 'copy:styles'],
        dist: ['coffee:dist', 'compass:dist', 'copy:styles', 'imagemin', 'svgmin', 'htmlmin']
      },
      karma: {
        unit: {
          configFile: 'karma.conf.js',
          singleRun: true
        },
        ci: {
          configFile: 'karma.conf.js',
          singleRun: true,
          reporters: ['junit', 'dots']
        }
      },
      ngAnnotate: {
        dist: {
          files: [
            {
              expand: true,
              cwd: '.tmp/scripts',
              src: ['{,**/}*.js', '!libs/{,**/}*'],
              dest: '.tmp/scripts'
            }
          ]
        }
      },
      requirejs: {
        compile: {
          options: {
            appDir: '.tmp/scripts/',
            baseUrl: '.',
            dir: '<%= paths.dist %>/scripts/',
            optimize: 'uglify',
            paths: {
              profile: 'empty:',
              config: 'empty:'
            },
            mainConfigFile: '.tmp/scripts/main.js',
            skipDirOptimize: true,
            modules: [
              {
                name: 'main'
              }
            ],
            logLevel: 0
          }
        }
      },
      changelog: {
        options: {
          dest: 'CHANGELOG.md',
          versionFile: 'package.json'
        }
      },
      release: {
        options: {
          commitMessage: '<%= version %>',
          tagName: 'v<%= version %>',
          tagMessage: 'tagging version <%= version %>',
          bump: false,
          file: 'package.json',
          add: true,
          commit: true,
          tag: true,
          push: true,
          pushTags: true,
          npm: false
        }
      },
      stage: {
        options: {
          files: ['CHANGELOG.md']
        }
      },
      replace: {
        dist: {
          options: {
            variables: {
              version: '<%= pkg.version %>',
              released: grunt.template.today('dd-mm-yyyy, hh:MM:ss TT'),
              versionInfo: {
                releaseNr: '<%= pkg.version %>',
                buildDate: grunt.template.today('dd-mm-yyyy, hh:MM:ss TT'),
                currentBranch: '<%= gitinfo.local.branch.current.name %>'
              }
            },
            prefix: '@@'
          },
          files: [
            {
              expand: true,
              flatten: true,
              src: ['<%= paths.dist %>/scripts/configTeamUp.js'],
              dest: '<%= paths.dist %>/scripts/'
            }
          ]
        }
      }
    });
    grunt.registerTask('bump', 'bump manifest version', function(type) {
      var config, options, setup;
      setup = function(file, type) {
        var newVersion, pkg;
        pkg = grunt.file.readJSON(file);
        newVersion = pkg.version = semver.inc(pkg.version, type || 'patch');
        return {
          file: file,
          pkg: pkg,
          newVersion: newVersion
        };
      };
      options = this.options({
        file: grunt.config('pkgFile') || 'package.json'
      });
      config = setup(options.file, type);
      grunt.file.write(config.file, JSON.stringify(config.pkg, null, '  ') + '\n');
      return grunt.log.ok('Version bumped to ' + config.newVersion);
    });
    grunt.registerTask('stage', 'git add files before running the release task', function() {
      var files;
      files = this.options().files;
      return grunt.util.spawn({
        cmd: 'git',
        args: ['add'].concat(files)
      }, grunt.task.current.async());
    });
    grunt.registerTask('serve', 'start a web server with extras', function(target) {
      if (target === 'dist') {
        return grunt.task.run(['build', 'connect:dist:keepalive']);
      }
      return grunt.task.run(['clean:server', 'concurrent:server', 'autoprefixer', 'connect:livereload', 'watch']);
    });

    grunt.registerTask('server', ['serve', 'replace']);
    grunt.registerTask('test', ['clean:server', 'concurrent:test', 'connect:test', 'karma']);
    grunt.registerTask('build', ['gitinfo', 'clean:dist', 'coffee:dist', 'coffee:testUnit', 'coffee:testEnd', 'compass:dist', 'jade', 'useminPrepare', 'imagemin', 'htmlmin', 'concat', 'copy:dist', 'copy:styles', 'ngAnnotate', 'copy:rest', 'cssmin', 'requirejs', 'replace', 'rev:js', 'usemin:js', 'rev:dist', 'usemin:html', 'usemin:css', 'clean:rest']);
    grunt.registerTask('patch', ['bump:patch', 'changelog', 'stage', 'release:patch', 'replace']);
    grunt.registerTask('minor', ['bump:minor', 'changelog', 'stage', 'release:minor', 'replace']);
    grunt.registerTask('major', ['bump:major', 'changelog', 'stage', 'release:major', 'replace']);
    return grunt.registerTask('default', ['jshint', 'test', 'build']);
  };

}).call(this);

//# sourceMappingURL=Gruntfile.js.map

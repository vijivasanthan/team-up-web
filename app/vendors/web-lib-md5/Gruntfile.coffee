'use strict'

module.exports = (grunt) ->
  grunt.initConfig

    uglify:
      options:
        banner: '/*!\n * MD5 parser\n * <%= grunt.template.today(\'dd-mm-yyyy hh:mm\') %>\n */\n'

      dist:
        files:
          'md5.min.js': 'md5.js'
        
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.registerTask 'default', ['uglify']

  return
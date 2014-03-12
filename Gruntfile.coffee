module.exports = (grunt) ->
  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    coffee:
      dist:
        src: ["src/*.js.coffee", "src/utils/*", "src/modules/*", "src/module_views/*"],
        dest: "build/js/<%= pkg.name %>.js",
    uglify:
      build:
        src: "build/js/<%= pkg.name %>.js"
        dest: "build/<%= pkg.name %>.min.js"

    yuidoc:
      compile:
        name: "<%= pkg.name %>"
        description: "<%= pkg.description %>"
        version: "<%= pkg.version %>"
        url: "<%= pkg.homepage %>"
        options:
          paths: "build/js/"
          outdir: "documentation/"

    qunit:
      all: ['spec/**/*.html']

  # Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-yuidoc')
  grunt.loadNpmTasks('grunt-contrib-qunit')

  # Default task(s).
  grunt.registerTask "default", [ "coffee", "uglify", "qunit", "yuidoc"]

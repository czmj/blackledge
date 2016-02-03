module.exports = function (grunt) {
  'use strict'
  // Reads package.json and dynamically loads all Grunt tasks
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies',
    pattern: ['assemble', 'grunt-*']
  })

  // Project build configuration
  grunt.initConfig({
    bowerrc: grunt.file.readJSON('.bowerrc'),
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> */ \n'
    },
    config: {
      gruntfile: 'Gruntfile.js',
      // Component settings
      bower: '<%= bowerrc.directory %>',
      // Src settings
      src: 'src',
      srcAssets: 'assets',
      srcFonts: 'fonts',
      srcImages: 'images',
      srcVideo: 'video',
      srcStyles: 'styles',
      srcScripts: 'scripts',
      srcModules: 'modules',
      srcPlugins: 'plugins',
      srcComponents: 'components',
      srcTemp: 'temp',
      mainSass: 'component-framework.scss',
      // Dist settings
      dist: 'dist',
      distFonts: 'fonts',
      distImages: 'images',
      distVideo: 'video',
      distScripts: '_scripts',
      distStyles: '_styles',
      distTemp: 'temp',
      mainCss: 'main.css',
      distDocs: 'docs',
      distJsDocs: 'jsdocs',
      // Project settings
      assembleExt: 'hbs'
    },

    // File watchers
    watch: {
      gruntfile: {
        files: [
          '<%= config.gruntfile %>'
        ],
        tasks: [
          'jshint:gruntfile'
        ]
      },
      html: {
        files: [
          '<%= config.src %>/{components,pages,layouts}/**/*.{<%= config.assembleExt %>,json}',
        ],
        tasks: [
          'build_html'
        ]
      },
      scripts: {
        files: [
          '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/**/**.js',
          '<%= config.src %>/<%= config.srcComponents %>/**/*.js'
        ],
        tasks: [
          'build_scripts'
        ]
      },
      styles: {
        files: [
          '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/**/*.scss',
          '<%= config.src %>/<%= config.srcComponents %>/**/*.scss'
        ],
        tasks: [
          'build_styles'
        ]
      }
    },

    // HTML tasks
    assemble: {
      options: {
        flatten: false,
        layout: false,
        partials: [
          '<%= config.src %>/{components,layouts}/**/*.<%= config.assembleExt %>'
        ],
        assets: '<%= config.dist %>',
        images: '<%= config.distImages %>',
        styles: '<%= config.distStyles %>',
        scripts: '<%= config.distScripts %>',
        temp: '<%= config.distTemp %>',
        mainCss: '<%= config.mainCss %>',
        data: [
          '<%= config.src %>/components/**/*.json',
          'package.json'
        ],
        timestamp: '<%= grunt.template.today("mmm dS yyyy, h:MMtt Z") %>',
        copyrightYear: '<%= grunt.template.today("yyyy") %>'
      },
      pages: {
        files: [{
          expand: true,
          cwd: '<%= config.src %>/pages/',
          src: ['**/*.<%= config.assembleExt %>'],
          dest: '<%= config.dist %>/',
          rename: function (dest, src) {
            var filename = src
            if (src.substring(0, 1) === '_') {
              filename = dest + src.substring(1)
            } else if (src.indexOf('/') !== -1) {
              var index = null
              var splitSrc = src.split('/')
              filename = dest
              for (index = 0; index < splitSrc.length; ++index) {
                filename = filename + splitSrc[index]
                if (src.indexOf('.<%= config.assembleExt %>')) {
                  filename = filename + '-'
                }
              }
            } else {
              filename = dest + src
            }
            return filename
          }
        }]
      }
    },

    // Script tasks
    concat: {
      jquery: {
        src: [
          '<%= config.bower %>/jquery/dist/jquery.js'
        ],
        dest: '<%= config.dist %>/<%= config.distScripts %>/jquery.js'
      },
      scripts: {
        src: [
          // Add 3rd party Bower components here using <%= config.bower %>/**/*.js
          '<%= config.bower %>/console-polyfill/index.js',
          '<%= config.bower %>/jquery-tiny-pubsub/dist/ba-tiny-pubsub.min.js',
          '<%= config.bower %>/picturefill/dist/picturefill.min.js',
          '<%= config.bower %>/conformity/dist/conformity.min.js',
          '<%= config.bower %>/jquery-smartresize/jquery.throttledresize.js',
          '<%= config.bower %>/OwlCarousel/src/js/owl.carousel.js',
          '<%= config.bower %>/OwlCarousel/src/js/owl.autoplay.js',
          '<%= config.bower %>/OwlCarousel/src/js/owl.navigation.js',
          '<%= config.bower %>/OwlCarousel/src/js/owl.lazyload.js',
          '<%= config.bower %>/fitvids/jquery.fitvids.js',
          // Our scripts
          '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/<%= config.srcPlugins %>/combine/*.js',
          '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/<%= config.srcModules %>/*.js',
          '<%= config.src %>/<%= config.srcComponents %>/**/*.js',
          '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/_init.js'
        ],
        dest: '<%= config.dist %>/<%= config.distScripts %>/scripts.js'
      },
      validation: {
        src: [
          '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/<%= config.srcPlugins %>/validation/*.js'
        ],
        dest: '<%= config.dist %>/<%= config.distScripts %>/validation.js'
      }
    }
  })

  // Build tasks.
  grunt.registerTask('build_html', [
    'assemble',
    'copy:assets'
  ])
  grunt.registerTask('build_scripts', [
    'concat:jquery',
    'concat:scripts',
    'concat:validation',
    'copy:scripts'
  ])
  grunt.registerTask('build_styles', [
    'sass',
    'autoprefixer',
    'px_to_rem',
    'combine_mq',
    'copy:assets'
  ])
  grunt.registerTask('build_dev', [
    'clean:html',
    'build_html',
    'clean:scripts',
    'build_scripts',
    'clean:styles',
    'build_styles',
    'copy:base'
  ])
  grunt.registerTask('build_docs', [
    'jsdoc'
  ])
  grunt.registerTask('build_production', [
    'build_dev',
    'cssmin',
    'uglify',
    'clean:production'
  ])
  // Default
  grunt.registerTask('default', [
    'clean:everything',
    'build_dev',
    'watch'
  ])
  // Local server
  grunt.registerTask('serve', [
    'clean:everything',
    'build_dev',
    'build_docs',
    'connect',
    'watch'
  ])
  // Production
  grunt.registerTask('deploy', [
    'build_production',
    'copy:deploy',
    'clean:deploy'
  ])
}

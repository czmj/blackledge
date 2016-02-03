/**
 * @file scripts.js - Scripts related Gulp tasks
 * @version 1.0.0
 * @author Daniel Furze <daniel@furzeface.com>
 */

import gulpif from 'gulp-if'

import standard from 'gulp-standard'
import concat from 'gulp-concat'
import uglify from 'gulp-uglify'
import rename from 'gulp-rename'

import jsdoc from 'gulp-jsdoc'

module.exports = function (gulp, config, argv) {
  gulp.task('scripts', () => {
    return gulp.src([
      config.paths.source.scripts + '/modules/**/*.js',
      config.paths.source.scripts + '/_init.js'
    ])
      .pipe(standard())
      .pipe(concat('scripts.js'))
      .pipe(gulpif(argv.prod, uglify()))
      .pipe(gulpif(argv.prod, rename({
        extname: '.min.js'
      })))
      .pipe(gulp.dest(config.paths.dist.scripts))
  })

  gulp.task('jsdocs', () => {
    return gulp.src([
      config.paths.source.scripts + '/modules/**/*.js',
      config.paths.source.scripts + '/_init.js'
    ])
      .pipe(jsdoc(config.paths.dist.docs.jsdocs))
  })
}

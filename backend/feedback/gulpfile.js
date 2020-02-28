const gulp = require('gulp')
const nodemon = require('gulp-nodemon')

gulp.task('start', () => {
  nodemon({
    script: './src/daemon.js'
  })
})

gulp.task('default', ['start'])

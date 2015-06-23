var fs = require('fs'),
    gulp = require('gulp'),
    jade = require('gulp-jade'),
    browserify = require('gulp-browserify'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sass   = require('gulp-sass');

gulp.task('templates', function() {
    return gulp.src(['src/templates/*.jade'])
               .pipe(jade({client: true, globals: ['$', 'window', 'bttv', 'Twitch']}))
               .pipe(footer(';module.exports=template;'))
               .pipe(gulp.dest('build/templates/'));
});

gulp.task('prepare', function() {
    return gulp.src(['src/**/*'])
               .pipe(gulp.dest('build/'));
})

gulp.task('sass', function () {
  gulp.src('./style/stylesheets/sass/**/*.sass')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./style/stylesheets'));
});

var jadeDefinition = fs.readFileSync('node_modules/jade/runtime.js').toString();
var license = fs.readFileSync('license.txt').toString();

gulp.task('scripts', ['prepare', 'templates', 'sass'], function() {
    gulp.src(['build/main.js'])
        .pipe(browserify())
        .pipe(concat('betterttv.js'))
        .pipe(header('(function(bttv) {'))
        .pipe(header(jadeDefinition))
        .pipe(header(license+'\n'))
        .pipe(footer("}(window.BetterTTV = window.BetterTTV || {}));"))
        .pipe(gulp.dest(__dirname));
});

gulp.task('watch', ['default'], function() {
    gulp.watch(['src/**/*', './style/stylesheets/sass/**/*.sass'], ['default']);
});

gulp.task('default', ['scripts']);
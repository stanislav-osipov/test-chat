var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var webserver = require('gulp-webserver');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');

var dirs = {
	src: './src',
	dest: './dest',
}

var path = {
  src: {
    js: {
      all: dirs.src + '/js/**/*.jsx',
      app: dirs.src + '/js/app.jsx',
    },
    html: {
      all: dirs.src + '/**/*.html',
    },
    scss: {
			all: dirs.src + '/style/**/*.scss',
      app: dirs.src + '/style/app.scss',
    }
  } ,
  dest: {
    root: dirs.dest,
    js: dirs.dest + '/js',
    css: dirs.dest + '/style',
    html: dirs.dest
  },  
}

gulp.task('html', function() {
  return gulp.src(path.src.html.all)
    .pipe(gulp.dest(path.dest.html))
})

gulp.task('html:watch', ['html'], function() {
  gulp.watch(path.src.html.all, ['html'])
})

gulp.task('webserver', function() {
  gulp.src(path.dest.root)
    .pipe(webserver({
      livereload: true,
      port:9090,
      directoryListing: {
        enable:true,
        path:path.dest.root,
      },
      open: true,
    }));
});

gulp.task('styles', function () {
  return gulp.src(path.src.scss.app)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.dest.css));
});

gulp.task('styles:watch', ['styles'], function() {
  gulp.watch(path.src.scss.all, ['styles']);
});

gulp.task('b-browserify', function () {
	return browserify({entries: path.src.js.app, extensions: ['.jsx'], debug: true})
		.transform(babelify.configure({
			presets: ["react"]
		}))
		.bundle()
		.on("error", function (err) { console.log("Error : " + err.message); })
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(path.dest.js));
});

gulp.task('b-watch', function() {
	gulp.watch(path.src.js.all, ['b-browserify']);
});


gulp.task('b-build', ['html', 'b-browserify', 'styles'])

gulp.task('b-serve', ['b-watch', 'styles:watch', 'html:watch', 'webserver'])

var config = {
    server: {
        baseDir: "./dest"
    },
    tunnel: true,
    host: 'localhost',
    port: 9090,
    logPrefix: "Frontend-dev"
};

var browserSync = require("browser-sync");
var reload = browserSync.reload;

gulp.task('webserverG', function () {
    browserSync(config);
});

var connect = require('gulp-connect');
gulp.task('webserverC', function () {
  connect.server({
    root: './dest',
    port: 9010,
    livereload: false
  });
});
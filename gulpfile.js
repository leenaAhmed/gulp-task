const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp");

var inject = require("gulp-inject");

gulp.task("index", function () {
  var target = gulp.src("./project/index.html");
  var sources = gulp.src(
    [".project/js/**/*.js", ".project/css/**/*.css ", ".project/image/*"],
    {
      read: false,
    }
  );

  return target.pipe(inject(sources)).pipe(gulp.dest("./dist"));
});
const htmlmin = require("gulp-htmlmin");
function copyHtml() {
  return src("project/*.html")
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest("dist"));
}

exports.html = copyHtml;

const concat = require("gulp-concat");
const terser = require("gulp-terser");

function jsMinify() {
  return src("project/js/**/*.js", { sourcemaps: true })
    .pipe(concat("all.min.js"))

    .pipe(terser())

    .pipe(dest("dist/assets/js", { sourcemaps: "." }));
}
exports.js = jsMinify;

var cleanCss = require("gulp-clean-css");
function cssMinify() {
  return src("project/css/**/*.css")
    .pipe(concat("style.min.css"))
    .pipe(cleanCss())
    .pipe(dest("dist/assets/css"));
}
exports.css = cssMinify;

const imagemin = require("gulp-imagemin");
function imgMinify() {
  return gulp
    .src("project/image/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/images"));
}
exports.img = imgMinify;

// const sass = require("gulp-sass")

// function sassMinify() {
//   return src(["project/sass/**/*.scss", "project/css/**/*.css"], {
//     sourcemaps: true,
//   })
//     .pipe(sass())
//     .pipe(concat("style.sass.min.css"))
//     .pipe(cleanCss())
//     .pipe(dest("dist/assets/css", { sourcemaps: "." }));
// }
// exports.sass = sassMinify;

var browserSync = require("browser-sync");
function serve(cb) {
  browserSync({
    server: {
      baseDir: "dist/",
    },
  });
  cb();
}

function reloadTask(done) {
  browserSync.reload();
  done();
}
//watch task
function watchTask() {
  watch("project/*.html", series(copyHtml, reloadTask));
  watch("project/js/**/*.js", series(jsMinify, reloadTask));
  watch(["project/css/**/*.css"], parallel(cssMinify, reloadTask));
}
exports.default = series(
  parallel(imgMinify, jsMinify, cssMinify /* , sassMinify */, copyHtml),
  serve,
  watchTask
);

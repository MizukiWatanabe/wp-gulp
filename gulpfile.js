// gulpの読み込み
const gulp = require('gulp');
// Sass読み込み
const sass = require('gulp-dart-sass');
// browser-syncの読み込み
const browserSync = require('browser-sync');
// エラー時に終了させないための機能
const plumber = require('gulp-plumber');
// エラー発生時のアラート出力
const notify = require('gulp-notify');

const srcPath = {
  css: './assets/scss/**/*.scss',
  php: './**/*.php',
};

const destPath = {
  css: './assets/css/',
};

// .scssのコンパイルタスク
const compSass = () => {
  return (
    gulp
      .src(srcPath.css, {
        sourcemaps: true,
      })
      .pipe(
        plumber({
          errorHandler: notify.onError('Error:<%= error.message %>'),
        })
      )
      .pipe(sass({ outputStyle: 'expanded' }))
      // 保存先のファイルの指定
      .pipe(gulp.dest(destPath.css), { sourcemaps: './' })
      .pipe(browserSync.stream())
      .pipe(
        notify({
          // メッセージの出力
          message: 'sass compiled',
          onLast: true,
        })
      )
  );
};

const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
};

const browserSyncOption = {
  proxy: 'http://meee.local/',
  open: 'true',
  watchOptions: {
    debounceDelay: 1000,
  },
  reloadOnRestart: true,
};

const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

const watchFiles = () => {
  gulp.watch(srcPath.css, gulp.series(compSass));
  gulp.watch(srcPath.php, gulp.series(browserSyncReload));
};

// seriesで順番に実行
exports.default = gulp.series(
  gulp.parallel(compSass),
  gulp.parallel(watchFiles, browserSyncFunc)
);

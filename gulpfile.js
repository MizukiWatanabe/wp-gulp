// gulpの読み込み
const gulp = require('gulp');
// Sass読み込み
const dartSass = require('gulp-dart-sass');
// browser-syncの読み込み
const browserSync = require('browser-sync');
// エラー時に終了させないための機能
const plumber = require('gulp-plumber');
// エラー発生時のアラート出力
const notify = require('gulp-notify');
// postcss autoprefixerを使うときに必要
// var postcss = require('gulp-postcss');
// // autoprefixer
// const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

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
          // plumberのエラー表示(notify)
          errorHandler: notify.onError('Error!!:<%= error.message %>'),
        })
      )
      // コンパイル時のスタイル設定
      .pipe(dartSass({ outputStyle: 'expanded' }))
      .pipe(
        postcss([
          autoprefixer({
            // ブラウザ指定はpackage.jsonに
            cascade: false,
            grid: true,
          }),
        ])
      )
      // 保存先のファイルの指定
      .pipe(gulp.dest(destPath.css), { sourcemaps: './' })
      .pipe(browserSync.stream())
    // .pipe(
    //   notify({
    //     // メッセージの出力
    //     message: 'compile!',
    //     onLast: true,
    //   })
    // )
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

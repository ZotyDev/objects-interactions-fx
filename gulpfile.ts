import { src, series, dest, parallel } from 'gulp';

const fs = require('fs');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const uglifycss = require('gulp-uglifycss');
const jsonMinify = require('gulp-json-minify');
const ts = require('gulp-typescript');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');

const sourceDir = './src';
const assetDir = './assets'
const scriptSource = sourceDir.concat('/scripts');
const styleSource = sourceDir.concat('/styles');
const hbsSource = sourceDir.concat('/templates');

const langSource = assetDir.concat('/lang');
const dataSource = assetDir.concat('/data');

const packageDir = './module';

function clean() {
  // Clean package dir
  if (fs.existsSync(packageDir)) {
    try {
      fs.rmSync(packageDir, { recursive: true, force: true });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return Promise.resolve('Successfully cleaned');
}

function sassBundle() {
  return src(styleSource.concat('/**/*.sass'))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(concat('style.min.css'))
    .pipe(uglifycss())
    .pipe(dest(packageDir));
}

function tsBundle() {
  return browserify({
    baseDir: scriptSource,
    debug: true,
    entries: ['src/scripts/module.ts'],
  })
    .plugin(tsify)
    .bundle()
    .pipe(source('module.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(dest(packageDir));
}

function langBundle() {
  return src(langSource.concat('/*.json'))
    .pipe(jsonMinify())
    .pipe(dest(packageDir));
}

function hbsBundle() {
  return src(hbsSource.concat('/**/*.hbs'))
    .pipe(rename({ dirname: '' }))
    .pipe(dest(packageDir));
}

function dataBundle() {
  return src(dataSource.concat('/**/*.json'))
    .pipe(jsonMinify())
    .pipe(rename({ dirname: '' }))
    .pipe(dest(packageDir));
}

function moduleJsonBundle() {
  return src('./module.json')
    .pipe(jsonMinify())
    .pipe(dest(packageDir));
}

function publish() {

}

const buildTask = process.env.NODE_ENV === 'production' ?
  series(
    parallel(
      sassBundle,
      tsBundle,
      langBundle,
      hbsBundle,
      dataBundle,
      moduleJsonBundle,
    ),
    publish,
  ) :
  series(
    clean,
    parallel(
      sassBundle,
      tsBundle,
      langBundle,
      hbsBundle,
      dataBundle,
      moduleJsonBundle,
    ),
  );

exports.build = buildTask;
exports.clean = clean;
exports.default = buildTask;

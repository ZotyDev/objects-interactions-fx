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
const scriptSource = sourceDir.concat('/scripts');
const styleSource = sourceDir.concat('/styles');
const langSource = sourceDir.concat('/lang');
const hbsSource = sourceDir.concat('/templates');
const dataSource = sourceDir.concat('/data');

const outDir = './out';
const scriptOut = outDir.concat('/scripts');
const styleOut = outDir.concat('/styles');

const packageDir = './module';

const tsProject = ts.createProject('tsconfig.json');

function clean() {
  // Clean out dir
  if (fs.existsSync(outDir)) {
    try {
      fs.rmSync(outDir, { recursive: true, force: true });
    } catch (error) {
      return Promise.reject(error);
    }
  }

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

function sassTranspile() {
  return src(styleSource.concat('/**/*.sass'))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(dest(styleOut));
}

function sassBundle() {
  return src(styleOut.concat('/**/*.css'))
    .pipe(concat('style.min.css'))
    .pipe(uglifycss())
    .pipe(dest(packageDir));
}

function tsBundle() {
  return browserify({
    baseDir: scriptSource,
    debug: true,
    entries: ["src/scripts/module.ts"],
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
  let moduleJsonTemplate = {
    id: "MODULE_ID",
    title: "MODULE_TITLE",
    description: "MODULE_DESCRIPTION",
    version: "MODULE_VERSION",
    authors: [
      {
        "name": "MODULE_AUTHOR_NAME",
        "email": "MODULE_AUTHOR_EMAIL",
        "url": "MODULE_AUTHOR_URL",
      },
    ],
    "languages": {

    }
  }
}

function publish() {

}

const buildTask = process.env.NODE_ENV === 'production' ?
  series(
    parallel(
      series(sassTranspile, sassBundle),
      tsBundle,
      langBundle,
      hbsBundle,
      dataBundle,
    ),
    publish,
  ) :
  series(
    clean,
    parallel(
      series(sassTranspile, sassBundle),
      tsBundle,
      langBundle,
      hbsBundle,
      dataBundle,
    ),
  );

exports.build = buildTask;
exports.clean = clean;
exports.default = buildTask;

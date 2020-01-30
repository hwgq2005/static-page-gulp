/**
 * @description 正式环境工程
 * @author Hwg
 * @date 2019/11/7
 */

const gulp = require('gulp');
const babel = require('gulp-babel');
const runSequence = require('run-sequence');
const minicss = require('gulp-mini-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const fileinclude = require('gulp-file-include');
const autoprefixer = require('gulp-autoprefixer');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const rename = require('gulp-rename');
const preprocess = require("gulp-preprocess");
const javascriptObfuscator = require('gulp-javascript-obfuscator');
const browserSync = require('browser-sync').create();

const {
    basePath,
    devPath,
    outBasePath,
    outPath
} = require('../config/config-path');

const ENV = process.env.NODE_ENV || 'development';

// 启动服务
gulp.task('connect', function () {
    browserSync.init({
        server: {
            baseDir: outBasePath,
            directory: true
        }
    }, function (err, bs) {
        console.log(bs.options.getIn(['urls', 'local']));
    });
});

// 编译html
const options = {
    // 清除HTML注释
    removeComments: true,
    // 压缩HTML
    collapseWhitespace: true,
    // 省略布尔属性的值 <input checked="true"/> ==> <input />
    collapseBooleanAttributes: true,
    // 删除所有空格作属性值 <input id="" /> ==> <input />
    removeEmptyAttributes: true,
    // 删除<script>的type="text/javascript"
    removeScriptTypeAttributes: true,
    // 删除<style>和<link>的type="text/css"
    removeStyleLinkTypeAttributes: true,
    // 压缩页面JS
    minifyJS: true,
    // 压缩页面CSS
    minifyCSS: true
};
gulp.task('html', function () {
    return gulp.src([devPath + '/rev/*.json', devPath + '/*.html'])
        .pipe(preprocess({
            context: {
                // 此处可接受来自调用命令的 NODE_ENV 参数，默认为 development 开发测试环境
                NODE_ENV: ENV
            }
        }))
        .pipe(revCollector({replaceReved: true}))
        .pipe(htmlmin(options))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {}
        }))
        .pipe(gulp.dest(outPath))
});

// 编译css
gulp.task("css", function () {
    return gulp.src([devPath + '/css/*.css'])
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true,
            remove: true
        }))
        .pipe(rev())
        .pipe(minicss())
        .pipe(gulp.dest(outPath + '/css'))
        .pipe(rev.manifest())
        .pipe(rename({
            suffix: '-css'
        }))
        .pipe(gulp.dest(devPath + '/rev'))
});


// 编译sass
gulp.task("sass", function () {
    return gulp.src([devPath + '/css/*.css', devPath + '/css/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true,
            remove: true
        }))
        .pipe(rev())
        .pipe(minicss())
        .pipe(gulp.dest(outPath + '/css'))
        .pipe(rev.manifest())
        .pipe(rename({
            suffix: '-css'
        }))
        .pipe(gulp.dest(devPath + '/rev'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


// 编译js
gulp.task('js', function () {
    return gulp.src([devPath + '/js/*.js'])
        .pipe(preprocess({
            context: {
                // 此处可接受来自调用命令的 NODE_ENV 参数，默认为 development 开发测试环境
                NODE_ENV: ENV
            }
        }))
        .pipe(babel())
        .pipe(uglify())
        .pipe(javascriptObfuscator())
        .pipe(rev())
        .pipe(gulp.dest(outPath + '/js'))
        .pipe(rev.manifest())
        .pipe(rename({
            suffix: '-js'
        }))
        .pipe(gulp.dest(devPath + '/rev'))
});

// 压缩图片
gulp.task('imagemin', function () {
    return gulp.src(devPath + '/images/**/*.*')
    // .pipe(imagemin())
        .pipe(gulp.dest(outPath + '/images'))
});

// 其他文件
gulp.task('others', function () {
    return gulp.src(devPath + '/others/**/*.*')
        .pipe(gulp.dest(outPath + '/others'))

});

// 正式构建
gulp.task('build', function () {
    runSequence('clean', 'copy', 'js', 'sass', 'others', 'imagemin', 'html', 'connect');
});

gulp.task('default', ['build']);

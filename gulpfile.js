/**
 * @description gulp构建工程
 * @author Hwg
 * @date 2019/10/22
 */
    // 备注
    // 执行命令如: gulp --env 'activity'、gulp --env 'shop/activity'
    // js/src.js：指定确切的文件名。
    // js/*.js：某个目录所有后缀名为js的文件。
    // js/**/*.js：某个目录及其所有子目录中的所有后缀名为js的文件。
    // !js/src.js：除了js/src.js以外的所有文件。
    // *.+(js|css)：匹配项目根目录下，所有后缀名为js或css的文件。

const gulp = require('gulp');
const babel = require('gulp-babel');
const connect = require('gulp-connect');
const runSequence = require('run-sequence');
const clean = require('gulp-clean');
const compass = require("gulp-compass");
const minicss = require('gulp-mini-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const fileinclude = require('gulp-file-include');
const autoprefixer = require('gulp-autoprefixer');
const watch = require('gulp-watch');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');

const {basePath, outBasePath, devPath, outPath} = require('./gulp-config');

// 启动服务
gulp.task('connect', function () {
    connect.server({
        root: outBasePath,
        livereload: true
    });
});

// 删除文件
gulp.task('clean', function () {
    return gulp.src([outPath], {
        read: false
    }).pipe(clean());
});

// 复制文件
gulp.task('copy', function () {
    return gulp.src([basePath + 'static/**'])
        .pipe(gulp.dest(outBasePath + 'static'));
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
    return gulp.src(devPath + '/*.html')
        .pipe(htmlmin(options))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {}
        }))
        .pipe(gulp.dest(outPath))
        .pipe(connect.reload())
        .pipe(notify({
            message: 'compress ok !'
        }));
});

// 压缩样式
gulp.task('minicss', function () {
    return gulp.src(devPath + '/css/*.css')
        .pipe(autoprefixer())
        .pipe(minicss())
        .pipe(gulp.dest(outPath + '/css'))
        .pipe(connect.reload())
});

// 编译sass
gulp.task("sass", function () {
    return gulp.src(devPath + '/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(outPath + '/css'))
        .pipe(connect.reload());
});

// sass + compass
gulp.task('compass-dist', function () {
    return gulp.src([devPath + '/css/*.scss'])
        .pipe(compass({
            comments: false,
            style: 'nested',
            css: outPath + '/css',
            sass: devPath + '/css',
            image: devPath + '/img'
        }))
        .pipe(autoprefixer())
        .pipe(minicss())
        .pipe(gulp.dest(outPath + '/css'))
        .pipe(connect.reload())
});


// 编译js
gulp.task('js', function () {
    return gulp.src([devPath + '/js/*.js'])
        .pipe(babel())
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        .pipe(uglify())
        .pipe(gulp.dest(outPath + '/js'))
        .pipe(connect.reload())
});

// 压缩图片
gulp.task('imagemin', function () {
    return gulp.src(devPath + '/img/**/*.*')
    // .pipe(imagemin())
        .pipe(gulp.dest(outPath + '/img'))
        .pipe(connect.reload())
});

// 字体文件
gulp.task('font', function () {
    return gulp.src(devPath + '/font/**/*.*')
        .pipe(gulp.dest(outPath + '/font'))
        .pipe(connect.reload())
});

// 监听文件
gulp.task('watch', function () {

    watch(devPath + '/*.html', function () {
        gulp.start('html');
    });
    watch([devPath + '/css/*.scss', devPath + '/css/*.css'], function () {
        gulp.start(['compass-dist', 'minicss']);
    });
    watch(devPath + '/img/**', function () {
        gulp.start('imagemin');
    });
    watch(devPath + '/font/**', function () {
        gulp.start('font');
    });
    watch(devPath + '/js/*.js', function () {
        gulp.start('js');
    });
    watch(basePath + '/static/**/*', function () {
        gulp.start('copy');
    });

});

// 正式构建
gulp.task('build', function () {
    runSequence('connect', 'clean', 'copy', 'js', 'compass-dist', 'minicss', 'imagemin', 'font', 'html', 'watch');
});

gulp.task('default', ['build']);

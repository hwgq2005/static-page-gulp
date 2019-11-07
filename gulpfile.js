/**
 * @description gulp构建工程
 * @author Hwg
 * @date 2019/10/22
 */

const gulp = require('gulp');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();

const {
    basePath,
    outBasePath,
    outPath
} = require('./config/gulp-config');

const ENV = process.env.NODE_ENV || 'development';

// 启动服务
gulp.task('connect', function () {
    browserSync.init({
        server: {
            baseDir: outBasePath
        }
    }, function (err, bs) {
        console.log(bs.options.getIn(['urls', 'local']));
    });
});

// 删除整个目录
gulp.task('clean', function () {
    return gulp.src([outPath], {
        read: false
    }).pipe(clean());
});

// 单独删除css目录
gulp.task('delcss', function () {
    return gulp.src([outPath + '/css'], {
        read: false
    }).pipe(clean());
});

// 单独删除js目录
gulp.task('deljs', function () {
    return gulp.src([outPath + '/js'], {
        read: false
    }).pipe(clean());
});

// 单独复制静态资源文件
gulp.task('copy', function () {
    return gulp.src([basePath + 'static/**'])
        .pipe(gulp.dest(outBasePath + 'static'));
});

// 判断是否正式环境
if (ENV == 'development') {
    require("./build/gulp-dev-conf");
} else {
    require("./build/gulp-build-conf");
}
/**
 * @description 测试环境工程
 * @author Hwg
 * @date 2019/11/12
 */

const gulp = require('gulp');
const babel = require('gulp-babel');
const runSequence = require('run-sequence');
const clean = require('gulp-clean');
const compass = require("gulp-compass");
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const preprocess = require("gulp-preprocess");
const notifier = require('node-notifier');
const watch = require('gulp-watch');

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

gulp.task('html', function () {
    return gulp.src([devPath + '**/*.html'])
        .pipe(preprocess({
            context: {
                // 此处可接受来自调用命令的 NODE_ENV 参数，默认为 development 开发测试环境
                NODE_ENV: ENV
            }
        }))
        .pipe(gulp.dest(outPath))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// 编译css
gulp.task("css", function () {
    return gulp.src([devPath + '**/css/*.css'])
        .pipe(autoprefixer())
        .pipe(gulp.dest(outPath))
        .pipe(browserSync.reload({
            stream: true
        }))
});


// 编译sass
gulp.task("sass", function () {
    return gulp.src([devPath + '**/css/*.scss', devPath + '**/css/*.css'])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(outPath))
        .pipe(browserSync.reload({
            stream: true
        }))
});


// sass + compass
// gulp.task('sass', function () {
//     return gulp.src([devPath + '**/css/*.scss'])
//         .pipe(compass({
//             css: devPath + '/css',
//             sass: devPath + '/css',
//             image: devPath + '/images'
//         }))
//         .on('error', function (error) {
//             notifier.notify(error);
//             console.log(error);
//             this.emit('end');
//         })
//         .pipe(browserSync.reload({
//             stream: true
//         }))
// });


// 编译js
gulp.task('js', function () {
    return gulp.src([devPath + '**/js/*.js'])
        .pipe(preprocess({
            context: {
                // 此处可接受来自调用命令的 NODE_ENV 参数，默认为 development 开发测试环境
                NODE_ENV: ENV
            }
        }))
        .pipe(babel())
        .pipe(gulp.dest(outPath))
        .pipe(browserSync.reload({
            stream: true
        }))

});

// 压缩图片
gulp.task('imagemin', function () {
    return gulp.src(devPath + '**/images/**/*.*')
    // .pipe(imagemin())
        .pipe(gulp.dest(outPath))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// 其他文件
gulp.task('others', function () {
    return gulp.src(devPath + '**/others/**/*.*')
        .pipe(gulp.dest(outPath))
        .pipe(browserSync.reload({
            stream: true
        }))
});


// 正式构建
gulp.task('build', function () {
    runSequence('clean', 'copy', 'js', 'sass', 'others', 'imagemin', 'html');
});

gulp.task('default', ['build']);
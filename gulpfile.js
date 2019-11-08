/**
 * @description gulp构建工程
 * @author Hwg
 * @date 2019/10/22
 */

const gulp = require('gulp');
const clean = require('gulp-clean');

const {
    devPath,
    basePath,
    outBasePath,
    outPath
} = require('./config/config-path');

const ENV = process.env.NODE_ENV || 'development';

// 删除整个监听目录
gulp.task('clean', function () {
    return gulp.src([outPath, devPath + '/rev', basePath + 'pages/rev'], {
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


// 获取参数
const argv = process.argv;
const dirPath = argv[3] || '';

// 判断是否正式环境
if (ENV == 'development') {
    require("./build/gulp-dev-conf");
} else {
    // 判断是否填写目录
    if (dirPath) {
        require("./build/gulp-build-conf");
    } else {
        require("./build/gulp-build-all-conf");
    }

}
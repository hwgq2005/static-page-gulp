/**
 * @description 开发环境工程
 * @author Hwg
 * @date 2019/11/7
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
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();
const processor = require("./plugins/processor");

const ENV = process.env.NODE_ENV || 'development';
const EnvConfig = require("../config/" + (ENV == "development" ? "dev" : "build") + '.env');

const {
    basePath,
    devPath,
    outBasePath,
    outPath
} = require('../config/config-path');


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
    return gulp.src([devPath + '/*.html'])
        .pipe(processor(EnvConfig))
        .pipe(gulp.dest(outPath))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// 编译css
gulp.task("css", function () {
    return gulp.src([devPath + '/css/*.css'])
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true,
            remove: true
        }))
        .pipe(gulp.dest(outPath + '/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
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
        .pipe(gulp.dest(outPath + '/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// 编译js
gulp.task('js', function () {
    return gulp.src([devPath + '/js/*.js'])
        .pipe(processor(EnvConfig))
        .pipe(babel())
        .pipe(gulp.dest(outPath + '/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// 复制图片
gulp.task('imagemin', function () {
    return gulp.src(devPath + '/images/**/*.*')
        .pipe(gulp.dest(outPath + '/images'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// 其他文件
gulp.task('others', function () {
    return gulp.src(devPath + '/others/**/*.*')
        .pipe(gulp.dest(outPath + '/others'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// 监听文件
gulp.task('watch', function () {
    watch(devPath + '/*.html', function () {
        gulp.start('html');
    });
    watch([devPath + '/css/*.scss', devPath + '/css/*.css'], function () {
        runSequence('sass', 'html');
    });
    watch(devPath + '/js/*.js', function () {
        runSequence('js', 'html');
    });
    watch(devPath + '/images/**', function () {
        gulp.start('imagemin');
    });
    watch(devPath + '/other/**', function () {
        gulp.start('others');
    });

    // 除了pages目录，其他目录修改的化回被复制过去
    watch([basePath + '**/*', '!./src/pages/**'], function () {
        gulp.start('copy');
    });

});

// 正式构建
gulp.task('build', function () {
    runSequence('clean', 'copy', 'js', 'sass', 'others', 'imagemin', 'html', 'watch', 'connect');
});

gulp.task('default', ['build']);

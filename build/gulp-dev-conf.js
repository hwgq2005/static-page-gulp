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
const compass = require("gulp-compass");
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();

// const sourcemaps = require('gulp-sourcemaps');
// const gulpif = require('gulp-if');
// const concat = require('gulp-concat');

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
            baseDir: outBasePath
        }
    }, function (err, bs) {
        console.log(bs.options.getIn(['urls', 'local']));
    });
});

gulp.task('html', function () {
    return gulp.src([devPath + '/*.html'])
        .pipe(gulp.dest(outPath))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(notify({
            message: '编译完成！'
        }));
});

// 编译css
gulp.task("css", function () {
    return gulp.src([devPath + '/css/*.css'])
        .pipe(autoprefixer())
        .pipe(gulp.dest(outPath + '/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(notify({
            message: '编译完成！'
        }));
});

// sass + compass
gulp.task('sass', function () {
    return gulp.src([devPath + '/css/*.scss'])
        .pipe(compass({
            css: devPath + '/css',
            sass: devPath + '/css',
            image: devPath + '/images'
        }))
        .on('error', function (error) {
            console.log(error);
            this.emit('end');
        })
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(notify({
            message: '编译完成！'
        }));
});


// 编译js
gulp.task('js', function () {
    return gulp.src([devPath + '/js/*.js'])
        .pipe(babel())
        .pipe(gulp.dest(outPath + '/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(notify({
            message: '编译完成！'
        }));
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
        runSequence('delcss', 'sass', 'css', 'html');
    });
    watch(devPath + '/js/*.js', function () {
        runSequence('deljs', 'js', 'html');
    });
    watch(devPath + '/images/**', function () {
        gulp.start('imagemin');
    });
    watch(devPath + '/other/**', function () {
        gulp.start('others');
    });
    watch(basePath + '/static/**/*', function () {
        gulp.start('copy');
    });
});

// 正式构建
gulp.task('build', function () {
    runSequence('clean', 'copy', 'js', 'sass', 'css', 'others', 'imagemin', 'html', 'watch','connect');
});

gulp.task('default', ['build']);
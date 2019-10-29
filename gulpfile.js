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
const browserSync = require('browser-sync').create();

const {basePath, outBasePath, devPath, outPath} = require('./gulp-config');

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

// 删除css目录
gulp.task('delcss', function () {
    return gulp.src([outPath + '/css'], {
        read: false
    }).pipe(clean());
});

// 删除js目录
gulp.task('deljs', function () {
    return gulp.src([outPath + '/js'], {
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
    return gulp.src([devPath + '/rev/*.json', devPath + '/*.html'])
        .pipe(revCollector({replaceReved: true}))
        .pipe(htmlmin(options))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {}
        }))

        .pipe(gulp.dest(outPath))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(notify({
            message: 'compress ok !'
        }));
});

// 编译sass
gulp.task("sass", function () {
    return gulp.src([devPath + '/css/*.scss', devPath + '/css/*.css'])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
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
        .pipe(notify({
            message: 'compress ok !'
        }));
});

// sass + compass
gulp.task('compass-dist', function () {
    return gulp.src([devPath + '/css/*.scss'])
        .pipe(compass({
            comments: false,
            style: 'nested',
            css: outPath + '/css',
            sass: devPath + '/css',
            image: devPath + '/images'
        }))
        .pipe(autoprefixer())
        .pipe(minicss())
        .pipe(gulp.dest(outPath + '/css'))
        .pipe(connect.reload())
        .pipe(notify({
            message: 'compress ok !'
        }));
});


// 编译js
gulp.task('js', function () {
    return gulp.src([devPath + '/js/*.js'])
        .pipe(babel())
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(outPath + '/js'))
        .pipe(rev.manifest())
        .pipe(rename({
            suffix: '-js'
        }))
        .pipe(gulp.dest(devPath + '/rev'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(notify({
            message: 'compress ok !'
        }));
});

// 压缩图片
gulp.task('imagemin', function () {
    return gulp.src(devPath + '/images/**/*.*')
    // .pipe(imagemin())
        .pipe(gulp.dest(outPath + '/images'))
        .pipe(connect.reload())
});

// 其他文件
gulp.task('others', function () {
    return gulp.src(devPath + '/others/**/*.*')
        .pipe(gulp.dest(outPath + '/others'))
        .pipe(connect.reload())
});

// 生成版本号清单
gulp.task('rev', function () {
    return gulp.src([devPath + '/js/**', devPath + '/css/**'])
        .pipe(rev.manifest())
        .pipe(gulp.dest(devPath + '/rev'))
});


// 监听文件
gulp.task('watch', function () {

    watch(devPath + '/*.html', function () {
        gulp.start('html');
    });
    watch([devPath + '/css/*.scss', devPath + '/css/*.css'], function () {
        runSequence('delcss', 'sass', 'html');
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
    runSequence('connect', 'clean', 'copy', 'js', 'sass', 'others', 'rev', 'html', 'watch');
});

gulp.task('default', ['build']);

var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var notifier = require('node-notifier');
var server = require('gulp-server-livereload');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

var notify = function (error) {
    let message = 'In: ';
    let title = 'Error: ';

    if (error.description) {
        title += error.description;
    } else if (error.message){
        title += error.message
    } else if(error.filename){
        let file = error.filename.split('/');
        message += file[file.length-1];
    }

    if (error.lineNumber) {
        message += '/nOn Line: ' + error.lineNumber;
    }

    notifier.notify({title: title, message: message});
}

// bundle settings

let bundler = watchify(browserify({
    entries: ['./src/app.jsx'],
    transform:[reactify],
    extensions: ['.jsx'],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
}));

//bundle tasks

function bundle(){
    return bundler.bundle()
    .on('error', notify)
    .pipe(source('main.js'))
    .pipe(gulp.dest('./'))
}

bundler.on('update', bundle);

//create bundle

gulp.task('build', function(){
    bundle()
});

//Compile the SASS files from main.scss

gulp.task('sass', function(){
    gulp.src('./sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
.pipe(gulp.dest('./'));
});

//live reload

gulp.task('serve', function(done){
    gulp.sec('')
    .pipe(server({
        livereload:{
            enable: true,
            filter: function(filePath, cb){
                if(/main.js/.test(filePath)){
                cb(true)
            }
        }
    },
    opne:true
}));
});

//checks for changes in sass files

gulp.task('watch', function (){
    gulp.watch('./sass/**/*.scss', ['sass']);
});

//run test in specified order

gulp.task('default', ['build', 'serve', 'sass', 'watch']);
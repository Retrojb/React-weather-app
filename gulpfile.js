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
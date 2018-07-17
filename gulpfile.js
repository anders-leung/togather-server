var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('default', function() {
    nodemon({
        script: './app',
        // this listens to changes in any of these files/routes and restarts the application
        watch: [ "./gulpfile.js", "./app.js", "routes/", "methods/" ],
        ext: 'js'
        // Below i'm using es6 arrow functions but you can remove the arrow and have it a normal .on('restart', function() { // then place your stuff in here }
    }).on('restart', () => {
        gulp.src('./server')
    });
});
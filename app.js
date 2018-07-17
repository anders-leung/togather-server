let express = require('express');
let bodyParser = require('body-parser');
let http = require('http');
let cors = require('cors');
let fs = require('fs');

// Init app
let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

// Init server
let server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Init routes
let init = (dir, done) => {
    let ignore = [ 'helpers' ];
    fs.readdir(dir, (err, list) => {
        if (err) return done(err);
        list.forEach(file => {
            if (ignore.includes(file)) return;
            file = file.replace(/\.js/g, '');
            let route = '/' + file;
            app.use(route, require('./routes/' + file));
        });
    });
};

init('./routes', err => {
    if (err) console.log('Error in init: ', err);
    
    app.use('/parse', function(err, res, result) {
        console.log('err: ', err)
        console.log('result: ', result)
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    
    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
    
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
});

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) return val;

    if (port >= 0) return port;

    return false;
}


function onError(error) {
    if (error.syscall !== 'listen') throw error;

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

// Init database
let admin = require('firebase-admin');
let serviceAccount = require('./private/firebase-togather.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

global.db = admin.firestore();
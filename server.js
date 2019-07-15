var express = require('express');
var app = express();
var passport = require('passport')
var session = require('express-session')
var bodyParser = require('body-parser')
var env = require('dotenv');
var cronjob = require('./app/cronjob');
var logger = require('morgan');
var FroalaEditor = require('wysiwyg-editor-node-sdk/lib/froalaEditor.js');
var socket = require('./app/socket');

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const configFileMapping = {
    'development': './env/.env.development',
    'production': './env/.env.production'
}
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

env.config({ path: configFileMapping[process.env.NODE_ENV] })
// var cors = require('cors');
//CORS middleware
// app.use(cors({
//     credentials: true,
//     origin: '*',
//     methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTION'],
//     allowedHeaders: ['Origin, X-Requested-With, Content-Type, Accept'],
//     optionsSuccessStatus: 204
//   }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.NODE_ENV === 'production' ? "*" : "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger('dev'));

// For Passport

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use('/', require('./app/router'))
app.get('/', function (req, res) {
    res.send('Welcome to Passport with Sequelize');
});
app.use('/test_socket', require('./app/socket').test_emit_socket);

app.use(express.static(__dirname + '/public')); //Serves resources from public folder

//Models
var models = require("./app/models");

//setting middleware
// require('./app/config/passport')(passport);

//Sync Database
models.sequelize.sync().then(function () {
    console.log('Nice! Database looks fine')
}).catch(function (err) {
    console.log(err, "Something went wrong with the Database Update!")
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
var server_host = process.env.YOUR_HOST || '127.0.0.1';
var server = (app).listen(server_port, function (err) {
    if (!err)
        console.log(`App listening at  http://${server_host}:${server_port}`);
    else console.log(err)
});

// var io = require('socket.io').listen(server);
// console.log(io)

socket.createSocketServer(server);
cronjob.cron_ckeck_token();
cronjob.cron_update_status_booking_finished();


module.exports = server;

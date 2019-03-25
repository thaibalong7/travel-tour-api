var express = require('express');
var app = express();
var passport = require('passport')
var session = require('express-session')
var bodyParser = require('body-parser')
var env = require('dotenv');
var cronjob = require('./app/cronjob');
var logger = require('morgan');
var FroalaEditor = require('wysiwyg-editor-node-sdk/lib/froalaEditor.js');
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
    res.header("Access-Control-Allow-Origin", process.env.NODE_ENV === 'production' ? "*" : "http://localhost:3000");
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
var server_host = process.env.YOUR_HOST || '0.0.0.0';
var server = app.listen(server_port, server_host, function (err) {
    if (!err)
        console.log(`App listening at port ${server_port}`);
    else console.log(err)
});

cronjob.cron_ckeck_token();


module.exports = server;

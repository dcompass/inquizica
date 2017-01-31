// Load Environment Variables
require('dotenv').config();

// Load server
var express = require('express');
var app = express();
var http = require('http').Server(app);

// Load database
var knex_db = require(__dirname + '/db/knex.js');

// Start logging
process.stdout.write('\u001B[2J\u001B[0;0f');
var logger = require(__dirname + '/middleware/logs.js');
logger.log('info', "Starting Logger...");
if (process.env.NODE_ENV != "test") {
  var morgan = require('morgan');
  app.use(morgan('dev'));
}

// Setup views & public resources.
var hbs = require('hbs');
app.set('view engine', 'hbs');
app.set('views', './views');
hbs.registerPartials(__dirname + '/views/partials');
app.use("/public", express.static(__dirname + '/public'));


// ==========================
// Auth & Session Libraries |
// ==========================

// Import Passport and strategies.
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var URLStrategy = require(__dirname + '/middleware/urlStrategy'); // TODO: Include this.

// Setup MySQL sessions and such.
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASS,
  database: process.env.DATABASE
});
connection.connect(function (err) { if (err) console.log(err) });
var sessionStore = new MySQLStore({}, connection);

// Local strategy for authentication.
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'passwd'
}, function (username, password, done) {
  // logger.log('info', username, password);
  knex_db('user').where({
    email: username
  }).then(function (data) {
    // logger.log('info', data);
    if (data.length == 0) {
      logger.log('error', 'No such user.');
    } else {
      return done(null, data[0]);
    }
  }).catch(function (err) {
    logger.log('error', "Bad Stuff");
  });
}));

// Executed when user is autheniticated. Defines user cookie.
passport.serializeUser(function (user, done) {
  var serialUser = {
    "id": user.id || user.User_id,
    "name": user.firstname || user.name,
    "type": user.type
  }
  done(null, serialUser);
});

// Receives whatever object was stored when serializing.
// Could use this ID number and look up more info about user if needed (server-side).
// Saved in req.user
passport.deserializeUser(function (user, done) {
  done(null, user);
});


// Start using auth.
app.use(session({
  name: "inquizica_session",
  secret: "blah",
  store: sessionStore,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// routes


// =============
// Controllers |
// =============

app.use('/api', require('./controllers/api'));
app.use('/', require('./controllers/views'));

// Internal server error route.
app.use(function(err, req, res, next) {
  console.error("~Error Handler~\n", err.stack);
  res.status(500).render("404");
  // res.status(500).send('500 - Error. Whoops, looks like something broke. Please excuse us for this, we are still in our beta phase :)');
  // next();
});

// Page not found route.
app.use(function (req, res, next) {
  res.status(404).render("404");
  // res.status(404).send("404 - Page Not Found. Sorry, this is probably our fault. Thanks for your patience while we are still in our beta phase :)");
  // next();
});


// ======================
// Startup and closeout |
// ======================

// Start listening, ready to go.
http.listen(process.env.PORT, function() {
  logger.log('info', 'Server Listening...');
});

// Cleanup function, for exiting gracefully.
process.on('SIGINT', function () {
  logger.log('info', "Shutting down...");
  connection.end();
  http.close();
  process.exit();
});

// Export express app for testing.
module.exports = app;

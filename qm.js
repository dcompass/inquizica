// Load Environment Variables
require('dotenv').config();

// Load server
var express = require('express');
var app = express();
var http = require('http').Server(app);

// Load database
var knex_db = require(__dirname + '/db/knex.js');
var cron = require('cron');

// Start logging
process.stdout.write('\u001B[2J\u001B[0;0f');
var logger = require(__dirname + '/middleware/logs.js');
logger.log('info', "Starting Logger...");
if (process.env.NODE_ENV != "test") {
  var morgan = require('morgan');
  app.use(morgan('dev'));
}

function addUser () {

}

function removeUser () {

}

function modfiyUser () {

}

function deleteUser () {

}

function checkQueue () {
  console.log('Checking Queue');
  // Get elapsed
  // ForEach elapsed:
  //   Get quiz id (user/course info)
  //   Assemble message/url
  //   Send
  //   Requeue
}

var QueueCheck = new cron.CronJob({
  cronTime: '* */1 * * * *',
  onTick: function () {
    checkQueue();
  },
  start: false,
  timeZone: 'America/New_York'
});

QueueCheck.start();
console.log(QueueCheck.running);







// Variables:
// Twilio ID, Token, Enabled
// Keeps track of users...
// User | Class | Next |

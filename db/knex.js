var environment = "test";
var config = require('./knexfile.js')[environment];

module.exports = require('knex')(config);

var knex = require('../knex.js');

function Courses() {
  return knex('course');
}

module.exports = {};

var knex = require('../knex.js');

function Questions() {
  return knex('question');
}

module.exports = {};

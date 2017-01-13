var knex = require('../knex.js');

function Quizzes() {
  return knex('quiz');
}

module.exports = {};

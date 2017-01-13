var knex = require('./knex.js');

function Users() {
  return knex('users');
}

function getUser(user_id) {
  return Users().select().where({
    id: user_id
  });
}

module.exports = {
  getUser: getUser
}

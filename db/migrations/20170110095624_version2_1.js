
exports.up = function(knex, Promise) {
  return Promise.all([

    // User

    knex.schema.createTable('user', function (table) {
      table.increments('id').primary();
      table.string('firstname');
      table.string('lastname');
      table.string('phone');
      table.string('email');
      table.string('password');
      table.string('affiliation');
      table.integer('type');
      table.timestamps();
    }),



    // Course

    knex.schema.createTable('course', function (table) {
      table.increments('id').primary();
      table.string('title');
      table.string('description');
      table.string('author');
      table.string('affiliation');
      table.timestamps();
    }),


    // Quiz

    knex.schema.createTable('quiz', function (table) {
      table.increments('id').primary();
      table.string('title');
      table.string('author');
      table.timestamps();
    }),


    // Question

    knex.schema.createTable('question', function (table) {
      table.increments('id').primary();
      table.string('author');
      table.integer('level');
      table.string('question');
      table.string('remediation');
      table.integer('correct');
      table.double('rating');
      table.timestamps();
    })



  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('user'),
    knex.schema.dropTable('course'),
    knex.schema.dropTable('quiz'),
    knex.schema.dropTable('question')
  ])
};

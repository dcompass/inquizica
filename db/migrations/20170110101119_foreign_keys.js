
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user_course', function (table) {
      table.integer('user_id').unsigned().references('id').inTable('user').onDelete('CASCADE');
      table.integer('course_id').unsigned().references('id').inTable('course').onDelete('CASCADE');
      table.primary(['user_id', 'course_id']);
      table.string('progression');
      table.timestamps();
    }),

    knex.schema.createTable('course_schedule', function (table) {
      table.integer('course_id').unsigned().references('id').inTable('course').onDelete('CASCADE');
      table.dateTime('when');
      table.primary(['course_id', 'when']);
      table.string('type');
      table.timestamps();
    }),

    knex.schema.createTable('course_quiz', function (table) {
      table.integer('course_id').unsigned().references('id').inTable('course').onDelete('CASCADE');
      table.integer('quiz_id').unsigned().references('id').inTable('quiz').onDelete('CASCADE');
      table.primary(['course_id', 'quiz_id']);
      table.integer('index');
      table.integer('queue_number');
      table.dateTime('when');
      table.timestamps();
    }),

    knex.schema.createTable('quiz_question', function (table) {
      table.integer('quiz_id').unsigned().references('id').inTable('quiz').onDelete('CASCADE');
      table.integer('question_id').unsigned().references('id').inTable('question').onDelete('CASCADE');
      table.primary(['quiz_id', 'question_id']);
      table.integer('index');
      table.timestamps();
    }),

    knex.schema.createTable('question_response', function (table) {
      table.increments('id').primary();
      table.integer('question_id').unsigned().references('id').inTable('question').onDelete('CASCADE');
      table.string('response');
      table.integer('correct');
      table.timestamps();
    }),

    knex.schema.createTable('course_codes', function (table) {
      table.integer('course_id').unsigned().references('id').inTable('course').onDelete('CASCADE');
      table.string('code');
      table.primary(['course_id', 'code']);
      table.timestamps();
    }),

    knex.schema.createTable('quiz_tokens', function (table) {
      table.string('token');
      table.integer('user_id').unsigned().references('id').inTable('user').onDelete('CASCADE');
      table.primary(['token', 'user_id']);
      table.string('name');
      table.string('type');
      table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('user_course'),
    knex.schema.dropTable('course_schedule'),
    knex.schema.dropTable('course_quiz'),
    knex.schema.dropTable('quiz_question'),
    knex.schema.dropTable('question_response'),
    knex.schema.dropTable('course_codes'),
    knex.schema.dropTable('quiz_tokens')
  ])
};


var moment = require('moment');
var this_time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
var next_time = moment(new Date()).add(1, 'day').format("YYYY-MM-DD HH:mm:ss");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('user_course').del(),
    knex('course_quiz').del(),
    knex('course_schedule').del(),
    knex('user').del(),
    knex('course').del(),
    knex('quiz').del()
  ]).then(function () {
    return Promise.all([
      knex('user').insert({
        id: 1,
        firstname: "Sean",
        lastname: "Lynch",
        phone: "610-675-4305",
        email: "seanjcrl@gmail.com",
        password: "password123",
        affiliation: "Inquizica",
        type: 1
      }),
      knex('user').insert({
        id: 2,
        firstname: "Shawn",
        lastname: "Kynch",
        phone: "123-456-7890",
        email: "sean@gmail.com",
        password: "wordpass123",
        affiliation: "Inquizica",
        type: 2
      }),
      knex('user').insert({
        id: 3,
        firstname: "Sheen",
        lastname: "Mynch",
        phone: "123-456-7890",
        email: "sheen@gmail.com",
        password: "admin",
        affiliation: "Inquizica",
        type: 3
      }),
      knex('course').insert({
        id: 1,
        title: "Biology 101",
        description: "Intro to biology, highschool.",
        author: "Dr. Miller",
        affiliation: "Inquizica"
      }),
      knex('course').insert({
        id: 2,
        title: "Computer Science 101",
        description: "Intro to comp sci, college.",
        author: "Sean",
        affiliation: "Inquizica"
      }),
      knex('quiz').insert({
        id: 1,
        title: "Quiz #1",
        author: "Sean"
      }),
      knex('quiz').insert({
        id: 2,
        title: "Quiz #2",
        author: "Shawn"
      }),
      knex('user_course').insert({
        user_id: 1,
        course_id: 1,
        progression: JSON.stringify([1, 0, 0 ,0])
      }),
      knex('user_course').insert({
        user_id: 1,
        course_id: 2,
        progression: JSON.stringify([1, 1, 0])
      }),
      knex('course_quiz').insert({
        course_id: 1,
        quiz_id: 1,
        index: 0,
        queue_number: 1,
        when: this_time
      }),
      knex('course_schedule').insert({
        course_id: 1,
        when: this_time,
        type: "start"
      }),
      knex('course_schedule').insert({
        course_id: 1,
        when: next_time,
        type: "end"
      })
    ])
  })
  // return knex('user').del()
  //   .then(function () {
  //     return knex('user').insert({
  //       id: 1,
  //       firstname: "Sean",
  //       lastname: "Lynch",
  //       phone: "610-675-4305",
  //       email: "seanjcrl@gmail.com",
  //       password: "password123",
  //       affiliation: "Inquizica",
  //       type: 3
  //     });
  //   });
};

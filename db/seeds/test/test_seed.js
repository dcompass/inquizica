
var moment = require('moment');
var this_time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
var next_time = moment(new Date()).add(1, 'day').format("YYYY-MM-DD HH:mm:ss");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('user_course').del(),
    knex('course_quiz').del(),
    knex('course_schedule').del(),
    knex('question_response').del(),
    knex('user').del(),
    knex('course').del(),
    knex('quiz').del(),
    knex('question').del()
  ]).then(function () {
    var data = [
      function () {
        return knex('user').insert({
        id: 1,
        firstname: "Sean",
        lastname: "Lynch",
        phone: "610-675-4305",
        email: "seanjcrl@gmail.com",
        password: "password123",
        affiliation: "Inquizica",
        type: 1
      })},
      function () {
        return knex('user').insert({
        id: 2,
        firstname: "Shawn",
        lastname: "Kynch",
        phone: "123-456-7890",
        email: "sean@gmail.com",
        password: "wordpass123",
        affiliation: "Inquizica",
        type: 2
      })},
      function () {
        return knex('user').insert({
        id: 3,
        firstname: "Sheen",
        lastname: "Mynch",
        phone: "123-456-7890",
        email: "sheen@gmail.com",
        password: "admin",
        affiliation: "Inquizica",
        type: 3
      })},
      function () {
        return knex('course').insert({
        id: 1,
        title: "Biology 101",
        description: "Intro to biology, highschool.",
        author: "Dr. Miller",
        affiliation: "Inquizica"
      })},
      function () {
        return knex('course').insert({
        id: 2,
        title: "Computer Science 101",
        description: "Intro to comp sci, college.",
        author: "Sean",
        affiliation: "Inquizica"
      })},
      function () {
        return knex('quiz').insert({
        id: 1,
        title: "Quiz #1",
        author: "Sean"
      })},
      function () {
        return knex('quiz').insert({
        id: 2,
        title: "Quiz #2",
        author: "Shawn"
      })},
      function () {
        return knex('question').insert({
        id: 1,
        author: "Sean",
        level: 3,
        question: "What is name?",
        remediation: "Doge",
        correct: 2,
        rating: 2.3
      })},
      function () {
        return knex('question').insert({
        id: 2,
        author: "Sean",
        level: 2,
        question: "What is color?",
        remediation: "Blu",
        correct: 3,
        rating: 5.3
      })},
      function () {
        return knex('question').insert({
        id: 3,
        author: "Sean",
        level: 1,
        question: "What is sky?",
        remediation: "cloud",
        correct: 1,
        rating: 1.2
      })},
      function () {
        return knex('quiz_question').insert({
        quiz_id: 1,
        question_id: 1,
        index: 0
      })},
      function () {
        return knex('quiz_question').insert({
        quiz_id: 1,
        question_id: 2,
        index: 1
      })},
      function () {
        return knex('quiz_question').insert({
        quiz_id: 2,
        question_id: 3,
        index: 0
      })},
      function () {
        return knex('user_course').insert({
        user_id: 1,
        course_id: 1,
        progression: JSON.stringify([1, 0, 0 ,0])
      })},
      function () {
        return knex('user_course').insert({
        user_id: 1,
        course_id: 2,
        progression: JSON.stringify([1, 1, 0])
      })},
      function () {
        return knex('course_quiz').insert({
        course_id: 1,
        quiz_id: 1,
        index: 0,
        queue_number: 1,
        when: this_time
      })},
      function () {
        return knex('course_schedule').insert({
        course_id: 1,
        when: this_time,
        type: "start"
      })},
      function () {
        return knex('course_schedule').insert({
        course_id: 1,
        when: next_time,
        type: "end"
      })},
      function () {
        return knex('question_response').insert({
          id: 1,
          question_id: 1,
          response: 1,
          correct: 1
      })},
      function () {
        return knex('question_response').insert({
          id: 2,
          question_id: 1,
          response: 2,
          correct: 1
      })},
      function () {
        return knex('question_response').insert({
          id: 3,
          question_id: 2,
          response: 1,
          correct: 4
      })}
    ];

    return data.reduce(function (curr, next) {
      return curr.then(next);
    }, Promise.resolve());

  })
};

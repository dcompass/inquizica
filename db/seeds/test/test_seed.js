
var moment = require('moment');
var this_time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
var next_time = moment(new Date()).add(1, 'day').format("YYYY-MM-DD HH:mm:ss");
var c_q_time_1 = moment(new Date()).add(1, 'hour').format("YYYY-MM-DD HH:mm:ss");
var c_q_time_2 = moment(new Date()).add(2, 'hour').format("YYYY-MM-DD HH:mm:ss");
var c_q_time_3 = moment(new Date()).add(3, 'hour').format("YYYY-MM-DD HH:mm:ss");
var c_q_time_4 = moment(new Date()).add(4, 'hour').format("YYYY-MM-DD HH:mm:ss");
var c_q_time_5 = moment(new Date()).add(5, 'hour').format("YYYY-MM-DD HH:mm:ss");


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
    knex('question').del(),
    knex('course_schedule').del()
  ]).then(function () {
    var data = [
      // Users
      function () {
        return knex('user').insert({
        id: 1,
        firstname: "Adam",
        lastname: "Test",
        phone: "1234567890",
        email: "adam@gmail.com",
        password: "password123",
        affiliation: "Inquizica",
        type: 1
      })},
      function () {
        return knex('user').insert({
        id: 2,
        firstname: "Betsy",
        lastname: "Test",
        phone: "1234567891",
        email: "betsy@gmail.com",
        password: "password123",
        affiliation: "Inquizica",
        type: 1
      })},
      function () {
        return knex('user').insert({
        id: 3,
        firstname: "Charlie",
        lastname: "Test",
        phone: "1234567892",
        email: "charlie@gmail.com",
        password: "password123",
        affiliation: "Inquizica",
        type: 1
      })},
      function () {
        return knex('user').insert({
        id: 4,
        firstname: "Diana",
        lastname: "Test",
        phone: "1234567893",
        email: "diana@gmail.com",
        password: "wordpass123",
        affiliation: "Inquizica",
        type: 2
      })},
      function () {
        return knex('user').insert({
        id: 5,
        firstname: "Elizabeth",
        lastname: "Test",
        phone: "1234567894",
        email: "elizabeth@gmail.com",
        password: "admin",
        affiliation: "Inquizica",
        type: 3
      })},
      // Courses
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
      // Quizzes
      function () {
        return knex('quiz').insert({
        id: 1,
        title: "Quiz #1",
        author: "Shawn"
      })},
      function () {
        return knex('quiz').insert({
        id: 2,
        title: "Quiz #2",
        author: "Shawn"
      })},
      function () {
        return knex('quiz').insert({
        id: 3,
        title: "Quiz #3",
        author: "Shawn"
      })},
      function () {
        return knex('quiz').insert({
        id: 4,
        title: "Quiz #4",
        author: "Shawn"
      })},
      function () {
        return knex('quiz').insert({
        id: 5,
        title: "Quiz #5",
        author: "Shawn"
      })},
      // Questions
      function () {
        return knex('question').insert({
        id: 1,
        author: "Sean",
        level: 3,
        question: "What are ants?",
        remediation: "Doge1",
        correct: 2,
        rating: 2.3
      })},
      function () {
        return knex('question').insert({
        id: 2,
        author: "Sean",
        level: 2,
        question: "What are dogs?",
        remediation: "doge2",
        correct: 3,
        rating: 5.3
      })},
      function () {
        return knex('question').insert({
        id: 3,
        author: "Sean",
        level: 1,
        question: "What are cats?",
        remediation: "doge3",
        correct: 1,
        rating: 1.2
      })},
      function () {
        return knex('question').insert({
        id: 4,
        author: "Sean",
        level: 1,
        question: "What are bunnies?",
        remediation: "doge4",
        correct: 1,
        rating: 1.2
      })},
      function () {
        return knex('question').insert({
        id: 5,
        author: "Sean",
        level: 1,
        question: "What are koalas?",
        remediation: "doge5",
        correct: 1,
        rating: 1.2
      })},
      function () {
        return knex('question').insert({
        id: 6,
        author: "Sean",
        level: 1,
        question: "What are rhinos?",
        remediation: "doge6",
        correct: 1,
        rating: 1.2
      })},
      function () {
        return knex('question').insert({
        id: 7,
        author: "Sean",
        level: 1,
        question: "What are monkeys?",
        remediation: "doge7",
        correct: 1,
        rating: 1.2
      })},
      function () {
        return knex('question').insert({
        id: 8,
        author: "Sean",
        level: 1,
        question: "What are snakes?",
        remediation: "doge8",
        correct: 1,
        rating: 1.2
      })},
      function () {
        return knex('question').insert({
        id: 9,
        author: "Sean",
        level: 1,
        question: "What are bears?",
        remediation: "doge9",
        correct: 1,
        rating: 1.2
      })},
      function () {
        return knex('question').insert({
        id: 10,
        author: "Sean",
        level: 1,
        question: "What are bees?",
        remediation: "doge10",
        correct: 1,
        rating: 1.2
      })},
      // Responses
      function () {
        return knex('question_response').insert({
          id: 1,
          question_id: 1,
          response: "one",
          correct: 1
      })},
      function () {
        return knex('question_response').insert({
          id: 2,
          question_id: 1,
          response: "two",
          correct: 1
      })},
      function () {
        return knex('question_response').insert({
          id: 3,
          question_id: 2,
          response: "three",
          correct: 3
      })},
      function () {
        return knex('question_response').insert({
          id: 4,
          question_id: 2,
          response: "four",
          correct: 3
      })},
      function () {
        return knex('question_response').insert({
          id: 5,
          question_id: 3,
          response: "five",
          correct: 5
      })},
      function () {
        return knex('question_response').insert({
          id: 6,
          question_id: 3,
          response: "six",
          correct: 5
      })},
      function () {
        return knex('question_response').insert({
          id: 7,
          question_id: 4,
          response: "seven",
          correct: 7
      })},
      function () {
        return knex('question_response').insert({
          id: 8,
          question_id: 4,
          response: "eight",
          correct: 7
      })},
      function () {
        return knex('question_response').insert({
          id: 9,
          question_id: 5,
          response: "nine",
          correct: 9
      })},
      function () {
        return knex('question_response').insert({
          id: 10,
          question_id: 5,
          response: "ten",
          correct: 9
      })},
      function () {
        return knex('question_response').insert({
          id: 11,
          question_id: 6,
          response: "eleven",
          correct: 11
      })},
      function () {
        return knex('question_response').insert({
          id: 12,
          question_id: 6,
          response: "twelve",
          correct: 11
      })},
      function () {
        return knex('question_response').insert({
          id: 13,
          question_id: 7,
          response: "thirteen",
          correct: 13
      })},
      function () {
        return knex('question_response').insert({
          id: 14,
          question_id: 7,
          response: "fourteen",
          correct: 13
      })},
      function () {
        return knex('question_response').insert({
          id: 15,
          question_id: 8,
          response: "fifteen",
          correct: 15
      })},
      function () {
        return knex('question_response').insert({
          id: 16,
          question_id: 8,
          response: "sixteen",
          correct: 15
      })},
      function () {
        return knex('question_response').insert({
          id: 17,
          question_id: 9,
          response: "seventeen",
          correct: 17
      })},
      function () {
        return knex('question_response').insert({
          id: 18,
          question_id: 9,
          response: "eightteen",
          correct: 17
      })},
      function () {
        return knex('question_response').insert({
          id: 19,
          question_id: 10,
          response: "nineteen",
          correct: 19
      })},
      function () {
        return knex('question_response').insert({
          id: 20,
          question_id: 10,
          response: "twenty",
          correct: 19
      })},
      // User_Course
      function () {
        return knex('user_course').insert({
        user_id: 1,
        course_id: 1,
        progression: JSON.stringify([1, 0, 0])
      })},
      function () {
        return knex('user_course').insert({
        user_id: 2,
        course_id: 1,
        progression: JSON.stringify([1, 1, 0])
      })},
      function () {
        return knex('user_course').insert({
        user_id: 3,
        course_id: 2,
        progression: JSON.stringify([0, 0])
      })},
      function () {
        return knex('user_course').insert({
        user_id: 1,
        course_id: 2,
        progression: JSON.stringify([1, 1])
      })},
      // Course_Quiz
      function () {
        return knex('course_quiz').insert({
        course_id: 1,
        quiz_id: 1,
        index: 0,
        queue_number: 1,
        when: c_q_time_1
      })},
      function () {
        return knex('course_quiz').insert({
        course_id: 1,
        quiz_id: 2,
        index: 1,
        queue_number: 1,
        when: c_q_time_2
      })},
      function () {
        return knex('course_quiz').insert({
        course_id: 1,
        quiz_id: 3,
        index: 2,
        queue_number: 1,
        when: c_q_time_3
      })},
      function () {
        return knex('course_quiz').insert({
        course_id: 2,
        quiz_id: 4,
        index: 0,
        queue_number: 1,
        when: c_q_time_4
      })},
      function () {
        return knex('course_quiz').insert({
        course_id: 2,
        quiz_id: 5,
        index: 1,
        queue_number: 1,
        when: c_q_time_5
      })},
      // Quiz_Questions
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
        return knex('quiz_question').insert({
        quiz_id: 2,
        question_id: 4,
        index: 1
      })},
      function () {
        return knex('quiz_question').insert({
        quiz_id: 3,
        question_id: 5,
        index: 0
      })},
      function () {
        return knex('quiz_question').insert({
        quiz_id: 3,
        question_id: 6,
        index: 1
      })},
      function () {
        return knex('quiz_question').insert({
        quiz_id: 4,
        question_id: 7,
        index: 0
      })},
      function () {
        return knex('quiz_question').insert({
        quiz_id: 4,
        question_id: 8,
        index: 1
      })},
      function () {
        return knex('quiz_question').insert({
        quiz_id: 5,
        question_id: 9,
        index: 0
      })},
      function () {
        return knex('quiz_question').insert({
        quiz_id: 5,
        question_id: 10,
        index: 1
      })},
      // Course_Schedule
      function () {
        return knex('course_schedule').insert({
        course_id: 1,
        when: c_q_time_1,
        type: "Class Begins"
      })},
      function () {
        return knex('course_schedule').insert({
        course_id: 1,
        when: c_q_time_2,
        type: "Quiz #1"
      })},
      function () {
        return knex('course_schedule').insert({
        course_id: 1,
        when: c_q_time_3,
        type: "Quiz #2"
      })},
      function () {
        return knex('course_schedule').insert({
        course_id: 1,
        when: c_q_time_4,
        type: "Quiz #3"
      })},
      function () {
        return knex('course_schedule').insert({
        course_id: 1,
        when: c_q_time_5,
        type: "Class Ends"
      })}

    ];

    return data.reduce(function (curr, next) {
      return curr.then(next);
    }, Promise.resolve());

  })
};

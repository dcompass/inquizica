var knex = require('../knex.js');

function Courses() {
  return knex('course');
}

// TODO: Reject bad user_objects.
function create(course_obj) {
  if (course_obj.hasOwnProperty('title')) {
    return Courses().insert(course_obj);
  } else {
    return Promise.reject("Could not create new course.");
  }
}

function read(course_id) {
  return Courses().select().where({
    id: course_id
  });
}

function destroy(course_id) {
  return Courses().where({
    id: course_id
  }).del();
}

function getQuizzes(course_id) {
  return knex('course_quiz').where({
    course_id: course_id
  });
}

function getSchedule(course_id) {
  return knex('course_schedule').where({
    course_id: course_id
  });
}

function getTopics(course_id) {
  return Promise.reject("Could not create new course.");
}

function addUser(course_id, user_id) {
  return Promise.reject("Could not create new course.");
}

function addQuiz(course_id, quiz_id) {
  return Promise.reject("Could not create new course.");
}



module.exports = {
  newCourse: create,
  getCourse: read,
  delCourse: destroy,
  getQuizzes: getQuizzes,
  getSchedule: getSchedule,
  getTopics: getTopics,
  addUser: addUser,
  addQuiz: addQuiz
};

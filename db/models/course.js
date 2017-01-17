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

function addUser(course_id, user_id, prog_arr) {
  return knex('user_course').insert({
    course_id: course_id,
    user_id: user_id,
    progression: JSON.stringify(prog_arr)
  });

  // console.log("HIHIHI");
  // return
  //   knex.raw("select exists(select 1 from COURSE where id = ?) as exists_check;", course_id)
  //   .then(function (resp) {
  //     if (resp[0][0].exists_check == 0) { console.log("!1"); return Promise.resolve(0); }
  //     else {
  //       knex.raw("select exists(select 1 from USER where id = ?) as exists_check;", user_id)
  //       .then(function (resp2) {
  //         if (resp2[0][0].exists_check == 0) { console.log("!2"); return Promise.resolve(1); }
  //         else {
  //           knex('course_quiz').where({course_id: course_id}).count('course_id')
  //           .then(function (resp3) {
  //             console.log(resp3);
  //             var arr = new Array(resp3.length);
  //             // Insert query.
  //           })
  //           .catch(function (err) { console.log("A", err); });
  //         }
  //       })
  //       .catch(function (err) { console.log("B", err); });
  //     }
  //   })
  //   .catch(function (err) { console.log("C", err); });
  // return Promise.reject("Could not create new course.");
}

function addQuiz(course_id, quiz_id, index, queue_number, date) {
  return knex('course_quiz').insert({
    course_id: course_id,
    quiz_id: quiz_id,
    index: index,
    queue_number: queue_number,
    when: date
  });
  // return Promise.reject("Could not create new course.");
}

function exists(course_id) {
  return knex.raw("select exists(select 1 from COURSE where id = ?) as exists_check;", course_id)
    .then(function (resp) {
      return resp[0][0].exists_check;
    });
  // return Courses().select(knex.raw('EXISTS(SELECT 1 FROM course WHERE id = ?)', course_id)).as("exists");
}



module.exports = {
  newCourse: create,
  getCourse: read,
  delCourse: destroy,
  getQuizzes: getQuizzes,
  getSchedule: getSchedule,
  getTopics: getTopics,
  addUser: addUser,
  addQuiz: addQuiz,
  exists: exists
};

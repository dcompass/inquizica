var knex = require('../knex.js');

function Users() {
  return knex('user');
}

// TODO: Reject bad user_objects.
function create(user_obj) {
  if (user_obj.hasOwnProperty('phone')) {
    return Users().insert(user_obj)
    .then(function (data) {
      return Users().select('id').where({phone: user_obj.phone})
      .then(function (user_id) {
        return Promise.resolve(user_id);
      }).catch(function (err) { return Promise.reject("1Could not create new user."); });
    }).catch(function (err) { return Promise.reject("2Could not create new user."); });
  } else { return Promise.reject("3Could not create new user."); }
}

function read(user_id) {
  return Users().select().where({
    id: user_id
  });
}

function update(user_id, user_data) {
  return Users().where({
    id: user_id
  }).update(user_data);
}

function destroy(user_id) {
  return Users().where({
    id: user_id
  }).del();
}

function getProgression(user_id, course_id) {
  return knex('user_course').select('progression').where({
    user_id: user_id,
    course_id: course_id
  });
}

function updateProgression(user_id, course_id, progression) {
  return knex('user_course').where({
    user_id: user_id,
    course_id: course_id
  }).update({
    progression: progression
  });
}

function getCourses(user_id) {
  return knex('user_course').select('*')
  .join('course', 'user_course.course_id', '=', 'course.id')
  .where({
    user_id: user_id
  });
}

function exists(user_id) {
  return knex.raw("select exists(select 1 from USER where id = ?) as exists_check;", user_id)
    .then(function (resp) {
      return resp[0][0].exists_check;
    });
}

function existsByPhone(user_phone) {
  return knex.raw("select exists(select 1 from USER where phone = ?) as exists_check", user_phone)
    .then(function (resp) {
      return resp[0][0].exists_check;
    });
}

module.exports = {
  getUser: read,
  newUser: create,
  updateUser: update,
  deleteUser: destroy,
  getProg: getProgression,
  updateProg: updateProgression,
  getCourses: getCourses,
  exists: exists,
  existsByPhone: existsByPhone
}

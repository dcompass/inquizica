var knex = require('../knex.js');

function Quizzes() {
  return knex('quiz');
}

function exists(quiz_id) {
  return knex.raw("select exists(select 1 from QUIZ where id = ?) as exists_check;", quiz_id)
    .then(function (resp) {
      return resp[0][0].exists_check;
    });
}

function getQuiz(quiz_id) {
  return Quizzes().where({
    id: quiz_id
  });
}

function create(quiz_obj) {
  if (quiz_obj.hasOwnProperty('title')) {
    return Quizzes().insert(quiz_obj);
  } else {
    return Promise.reject("Could not create new quiz.");
  }
}

function deleteQuiz(quiz_id) {
  return Quizzes().where({
    id: quiz_id
  }).del();
}

function getQuestions(quiz_id) {
  return knex('quiz_question').where({
    quiz_id: quiz_id
  });
}

function getRecords(question_ids) {
  return knex('question_response').whereIn('question_id', question_ids);
}

function addQuestion(quiz_id, question_id, index) {
  return knex('quiz_question').insert({
    quiz_id: quiz_id,
    question_id: question_id,
    index: index
  });
}



module.exports = {
  exists: exists,
  getQuiz: getQuiz,
  newQuiz: create,
  deleteQuiz: deleteQuiz,
  getQuestions: getQuestions,
  getRecords: getRecords,
  addQuestion: addQuestion
};
